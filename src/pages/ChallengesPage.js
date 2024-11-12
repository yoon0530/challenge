import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ChallengesPage.css';
import host from "../api";

const ChallengesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [challengeList, setChallengeList] = useState([]);
    const token = localStorage.getItem('auth-token');

    const fetchChallenges = async () => {
        try {
            const response = await axios.get(`${host}challenge/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });

            if (Array.isArray(response.data.result)) {
                setChallengeList(response.data.result);
            } else {
                console.error("Fetched data is not an array:", response.data);
                setChallengeList([]);
            }
        } catch (error) {
            console.error("Error fetching challenges:", error);
            setChallengeList([]);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    useEffect(() => {
        // 새로운 도전이 추가되었을 때만 업데이트
        if (location.state?.newChallenge && !challengeList.some(challenge => challenge.id === location.state.newChallenge.id)) {
            setChallengeList(prevChallenges => [location.state.newChallenge, ...prevChallenges]);
        }

        // 삭제된 도전이 있을 때만 업데이트
        if (location.state?.deletedChallengeId) {
            setChallengeList(prevChallenges =>
                prevChallenges.filter(challenge => challenge.id !== location.state.deletedChallengeId)
            );
        }
    }, [location.state]);

    const handleCardClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const handleCreateChallenge = () => {
        navigate('/create-challenge');
    };

    return (
        <div className="challenges-page">
            <div className="challenge">
                <h1>도전 목록</h1>
                <button className="create-challenge-button" onClick={handleCreateChallenge}>
                    도전 생성
                </button>
            </div>
            <div className="challenges-grid">
                {challengeList.map(challenge => (
                    <div
                        key={challenge.challengeId}
                        className="challenge-card"
                        onClick={() => handleCardClick(challenge.challengeId)}
                        style={{cursor: 'pointer'}}
                    >
                        <div className="challenge-badge">
                            <span>{challenge.status ? "진행 중" : "모집 중"}</span>
                        </div>
                        <h3 className="challenge-title">{challenge.description || "도전 제목"}</h3>
                        <div className="challenge-dates">
                            진행 단계: {challenge.currentStep} / {challenge.totalStep}
                        </div>
                        <p className="challenge-description">
                            {challenge.description || "도전을 성공하고 보상금을 얻어보세요!"}
                        </p>
                        <div className="challenge-details">
                            <p>참여 인원: {challenge.userCount} / {challenge.maxHead}</p>
                        </div>
                        <div className="challenge-rewards">
                            <p>보증금</p>
                            <span>{challenge.reward ? `${challenge.reward.toLocaleString()}원` : "보증금 없음"}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengesPage;
