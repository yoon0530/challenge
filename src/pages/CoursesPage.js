import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CoursesPage.css';
import host from "../api";

const CoursesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [courseList, setCourseList] = useState([]);
    const token = localStorage.getItem('auth-token');

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${host}challenge/list`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });

            if (Array.isArray(response.data.result)) {
                setCourseList(response.data.result);
            } else {
                console.error("Fetched data is not an array:", response.data);
                setCourseList([]);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setCourseList([]);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        // 새로운 도전이 추가되었을 때만 업데이트
        if (location.state?.newCourse && !courseList.some(course => course.id === location.state.newCourse.id)) {
            setCourseList(prevCourses => [location.state.newCourse, ...prevCourses]);
        }

        // 삭제된 도전이 있을 때만 업데이트
        if (location.state?.deletedCourseId) {
            setCourseList(prevCourses =>
                prevCourses.filter(course => course.id !== location.state.deletedCourseId)
            );
        }
    }, [location.state]);

    const handleCardClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const handleCreateChallenge = () => {
        navigate('/create-course');
    };

    return (
        <div className="courses-page">
            <div className="course">
                <h1>도전 목록</h1>
                <button className="create-challenge-button" onClick={handleCreateChallenge}>
                    도전 생성
                </button>
            </div>
            <div className="courses-grid">
                {courseList.map(challenge => (
                    <div
                        key={challenge.challengeId}
                        className="course-card"
                        onClick={() => handleCardClick(challenge.challengeId)}
                        style={{cursor: 'pointer'}}
                    >
                        <div className="course-badge">
                            <span>{challenge.status ? "진행 중" : "모집 중"}</span>
                        </div>
                        <h3 className="course-title">{challenge.description || "도전 제목"}</h3>
                        <div className="course-dates">
                            진행 단계: {challenge.currentStep} / {challenge.totalStep}
                        </div>
                        <p className="course-description">
                            {challenge.description || "도전을 성공하고 보상금을 얻어보세요!"}
                        </p>
                        <div className="course-details">
                            <p>참여 인원: {challenge.userCount} / {challenge.maxHead}</p>
                        </div>
                        <div className="course-rewards">
                            <p>보증금</p>
                            <span>{challenge.reward ? `${challenge.reward.toLocaleString()}원` : "보증금 없음"}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesPage;
