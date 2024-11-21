import React, { useState } from "react";
import axios from "axios";
import styles from "./HelpCenter.module.css";
import host from "../api";

const HelpCenter = () => {
    const [inquiryType, setInquiryType] = useState(0); // 기본값 0 (챌린지 관련)
    const [title, setTitle] = useState(""); // 제목
    const [content, setContent] = useState(""); // 내용
    const [isPublic, setIsPublic] = useState(0); // 0(공개) 기본값
    const token = localStorage.getItem("auth-token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            await axios.post(
                `${host}ticket/`,
                {
                    type: inquiryType, // 숫자로 매핑된 문의 종류 값 전송
                    title,
                    content,
                    isPrivate: isPublic, // 0(공개) 또는 1(비공개) 값 전송
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );

            alert("문의가 성공적으로 제출되었습니다.");
            // 초기화
            setInquiryType(0);
            setTitle("");
            setContent("");
            setIsPublic(0);
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            alert("문의 제출에 실패했습니다.");
        }
    };

    return (
        <div className={styles.inquiryFormContainer}>
            <h2>1대1 문의 게시판</h2>
            <form onSubmit={handleSubmit} className={styles.inquiryForm}>
                {/* 문의 종류 선택 */}
                <div className={styles.formGroup}>
                    <label htmlFor="inquiryType">문의 종류:</label>
                    <select
                        id="inquiryType"
                        value={inquiryType}
                        onChange={(e) => setInquiryType(Number(e.target.value))} // 값을 숫자로 변환
                        required
                    >
                        <option value={0}>챌린지 관련</option>
                        <option value={1}>포인트 관련</option>
                        <option value={2}>기타 관련</option>
                    </select>
                </div>

                {/* 제목 */}
                <div className={styles.formGroup}>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>

                {/* 내용 */}
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                    ></textarea>
                </div>

                {/* 공개/비공개 선택 */}
                <div className={styles.formGroup}>
                    <label>공개 설정:</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                value={0}
                                checked={isPublic === 0}
                                onChange={() => setIsPublic(0)}
                            />
                            공개
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={1}
                                checked={isPublic === 1}
                                onChange={() => setIsPublic(1)}
                            />
                            비공개
                        </label>
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    문의하기
                </button>
            </form>
        </div>
    );
};

export default HelpCenter;
