import React, { useState, useEffect } from 'react';
import './Capproval.css';
import host from "../../api";
import axios from "axios";

const ChallengeApproval = () => {
    const [challengeList, setChallengeList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseUsers, setCourseUsers] = useState([]);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${host}admin/challengeauth`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                const mappedChallenge = response.data.result.map(challenge => {
                    const date = new Date(challenge.createdAt);
                    const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;
                    return {
                        id: challenge.pid,
                        contents: challenge.contents,
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

    // 특정 도전의 사용자 목록 가져오기
    const fetchCourseUsers = async (courseId) => {
        try {
            const response = await axios.get(`${host}admin/challengeauth/${courseId}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            setCourseUsers(response.data.users);
        } catch (error) {
            console.error("사용자 목록을 가져오는 중 오류 발생:", error);
        }
    };

    // 카드 클릭 시 사용자 목록 표시
    const handleCardClick = (courseId) => {
        const selected = challengeList.find((course) => course.id === courseId);
        setSelectedCourse(selected);
        fetchCourseUsers(courseId); // 사용자 목록 불러오기
    };

    // 사용자의 단계 승인 처리
    const handleApproveStep = async (userId, step) => {
        try {
            await axios.post(
                `${host}admin/users/${userId}/steps/${step.step}/approve`,
                { status: 'complete' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                }
            );
            alert(`사용자 ${userId}의 ${step.step}단계 인증이 승인되었습니다.`);
            // 승인 후 사용자 목록 다시 불러오기
            fetchCourseUsers(selectedCourse.id);
        } catch (error) {
            console.error('승인 요청 중 오류 발생:', error);
        }
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
                        <h3 className="course-title">{challenge.contents || '도전 제목 없음'}</h3>
                        <div className="course-dates">
                            <p>작성일: {challenge.createdAt}</p>
                        </div>
                        <p className="course-description">도전!</p>
                    </div>
                ))}
            </div>

            {/* 도전 선택 시 사용자 목록 및 승인/거부 기능 표시 */}
            {selectedCourse && (
                <div className="course-users">
                    <h3>{selectedCourse.contents} - 사용자 목록</h3>
                    <ul>
                        {courseUsers.map((user) => (
                            <li key={user.id}>
                                <p>{user.name}</p>
                                <div>
                                    {user.progress.map((step) => (
                                        <div key={step.step}>
                                            <p>
                                                단계 {step.step}: {step.status}
                                            </p>
                                            {step.status === 'pending' && (
                                                <button onClick={() => handleApproveStep(user.id, step)}>
                                                    {step.step}단계 승인
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChallengeApproval;
