import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './Capproval.css';
import host from "../../api";
import axios from "axios";

const ChallengeApproval = () => {
    const [challengeList, setChallengeList] = useState([]);
    const token = localStorage.getItem('auth-token');
    const navigate = useNavigate(); // navigate 함수 가져오기

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${host}admin/challengeauth/list`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                const mappedChallenge = response.data.result.map(challenge => {
                    const date = new Date(challenge.createdAt);
                    const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;
                    return {
                        id: challenge.id,
                        contents: challenge.contents,
                        description: challenge.description,
                        nickname: challenge.nickname,
                        createdAt: formattedDate,
                    };
                });
                setChallengeList(mappedChallenge);
            } catch (error) {
                console.error("도전 목록을 가져오는 중 오류 발생:", error);
            }
        };
        fetchChallenge();
    }, [token]);

    // 카드 클릭 시 상세 페이지로 이동
    const handleCardClick = (cAuthId) => {
        navigate(`/adminauth/${cAuthId}`); // 상세 페이지로 이동
    };

    return (
        <div className="admin-section">
            <h2>도전 목록</h2>
            <div className="courses-grid">
                {challengeList.map((challenge) => (
                    <div
                        key={challenge.id}
                        className="course-card"
                        onClick={() => handleCardClick(challenge.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="course-badge">
                            <span>{challenge.nickname}</span>
                        </div>
                        <h3 className="course-title">{challenge.description || '도전 제목 없음'}</h3>
                        <div className="course-dates">
                            <p>작성일: {challenge.createdAt}</p>
                        </div>
                        <p className="course-description">{challenge.contents}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengeApproval;
