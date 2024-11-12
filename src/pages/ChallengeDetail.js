// ChallengeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChallengeDetail.css';
import host from "../api";

const ChallengeDetail = () => {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(""); // 상태를 저장할 state 추가
    const navigate = useNavigate();
    const [isAuthor, setIsAuthor] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${host}challenge/${challengeId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                setChallenge(response.data);

                if (storedUser) {
                    setIsAuthor(response.data.authorId === storedUser.id);
                    setIsEnrolled(response.data.enrolledUsers?.includes(storedUser.id) || false);
                }
            } catch (error) {
                console.error("Error fetching challenge details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [challengeId]);

    const handleDelete = async () => {
        if (window.confirm("정말로 이 도전을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${host}challenge/`);
                alert("도전이 삭제되었습니다.");
                navigate('/challenge', { state: { deletedChallengeId: challengeId } });
            } catch (error) {
                console.error("Error deleting challenge:", error);
                alert("도전 삭제에 실패했습니다.");
            }
        }
    };

    const handleEnroll = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            await axios.patch(`http://localhost:5000/challenge/`, {
                enrolledUsers: [...(challenge.enrolledUsers || []), loggedInUser.id]
            });
            alert("도전에 성공적으로 신청되었습니다.");
            setIsEnrolled(true);
        } catch (error) {
            console.error("Error enrolling in challenge:", error);
            alert("도전 신청에 실패했습니다.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!challenge) return <p>해당 강의를 찾을 수 없습니다.</p>;

    return (
        <div className="challenge-detail">
            <h2>{challenge.title}</h2>
            <p><strong> 유형:</strong> {challenge.type}</p>
            <p><strong>진행률:</strong> {challenge.progress}</p>
            <p><strong>기간:</strong> {challenge.startDate} - {challenge.endDate}</p>
            <p><strong>카테고리:</strong> {challenge.category}</p>
            <p><strong>설명:</strong> {challenge.description}</p>
            <p><strong>현재 상태:</strong></p> {/* 상태 표시 */}
            {isAuthor && (
                <button onClick={handleDelete} className="delete-button">삭제</button>
            )}
            <button
                onClick={handleEnroll}
                className="enroll-button"
                disabled={isEnrolled || status !== "대기 중"} // 대기 중이 아닐 때 비활성화
            >
                {isEnrolled ? "신청 완료" : (status === "대기 중" ? "신청" : "신청 불가")}
            </button>
        </div>
    );
};

export default ChallengeDetail;
