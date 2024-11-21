import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Review.module.css";
import host from "../api";

const Review = ({ challengeId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const token = localStorage.getItem("auth-token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // 리뷰 목록 가져오기
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${host}review/list/${challengeId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                const mappedReviews = response.data.result.map((res) => ({
                    id: res.id,
                    nickName: res.nickName,
                    content: res.content,
                    createdAt: res.createdAt,
                    userId: res.userId,
                }));
                setReviews(mappedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [challengeId, token]);

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    // 리뷰 추가
    const handleAddReview = async () => {
        if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");

        try {
            const response = await axios.post(
                `${host}review/`,
                { challengeId, content: newReview },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );

            setReviews((prev) => [...prev, response.data]);
            setNewReview(""); // 입력창 초기화
            alert("리뷰가 작성되었습니다.");
        } catch (error) {
            console.error("Error adding review:", error);
            alert("리뷰 추가에 실패했습니다.");
        }
    };

    // 리뷰 삭제
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${host}review/${reviewId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });

            setReviews((prev) => prev.filter((review) => review.id !== reviewId));
            alert("리뷰가 삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("리뷰 삭제에 실패했습니다.");
        }
    };

    // 리뷰 수정
    const handleUpdateReview = async (reviewId) => {
        const updatedContent = prompt("수정할 내용을 입력하세요:");
        if (!updatedContent?.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        try {
            await axios.put(
                `${host}review/`,
                { content: updatedContent, reviewId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );

            setReviews((prev) =>
                prev.map((review) =>
                    review.id === reviewId ? { ...review, content: updatedContent } : review
                )
            );
            alert("리뷰가 수정되었습니다.");
        } catch (error) {
            console.error("Error updating review:", error);
            alert("리뷰 수정에 실패했습니다.");
        }
    };

    return (
        <div className={styles.reviewContainer}>
            <h2>후기</h2>

            {/* 리뷰 작성 섹션 */}
            <div className={styles.reviewForm}>
                <textarea
                    placeholder="리뷰를 작성하세요..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                />
                <button onClick={handleAddReview}>작성</button>
            </div>

            {/* 리뷰 리스트 */}
            <ul className={styles.reviewList}>
                {reviews.map((review) => (
                    <li key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewInfo}>
                            <span className={styles.reviewNickname}>
                                <strong>{review.nickName}</strong>
                            </span>
                            <span className={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                        </div>
                        <p className={styles.reviewContent}>{review.content}</p>

                        {/* 로그인한 사용자의 리뷰에만 수정/삭제 버튼 표시 */}
                        {storedUser === review.userId && (
                            <div className={styles.reviewActions}>
                                <button onClick={() => handleUpdateReview(review.id)}>수정</button>
                                <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Review;
