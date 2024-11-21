import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QandAListPrivate.module.css";
import host from "../../api";
import { useNavigate } from "react-router-dom";

const QandAListPrivate = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${host}ticket/list/`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                const results = Array.isArray(response.data.result)
                    ? response.data.result
                    : [];
                setQuestions(results);
                setLoading(false);
            } catch (error) {
                console.error("질문 데이터를 가져오는 데 실패했습니다:", error);
                setError("데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleAskQuestion = () => {
        navigate("/mypage/helpcenter");
    };

    const handleQuestionClick = (id) => {
        navigate(`/mypage/qandadetail/${id}`);
    };

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (questions.length === 0) {
        return (
            <div className={styles.questionsContainer}>
                <div className={styles.questionsHeader}>
                    <h2>문의 목록</h2>
                    <button
                        className={styles.askQuestionButton}
                        onClick={handleAskQuestion}
                    >
                        질문하기
                    </button>
                </div>
                <p>문의가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={styles.questionsContainer}>
            <div className={styles.questionsHeader}>
                <h2>문의 목록</h2>
                <button
                    className={styles.askQuestionButton}
                    onClick={handleAskQuestion}
                >
                    질문하기
                </button>
            </div>
            {questions.map((question) => (
                <div
                    key={question.id}
                    className={styles.questionBox}
                    onClick={() => handleQuestionClick(question.id)}
                >
                    <div className={styles.questionTitle}>
                        <span>{question.title || "제목 없음"}</span>
                    </div>
                    <div className={styles.questionInfo}>
                        <div className={styles.questionType}>
                            문의 종류: {getTypeLabel(question.type)}
                        </div>
                        <div
                            className={`${styles.questionStatus} ${
                                question.resStatus === 1
                                    ? styles.completed
                                    : styles.pending
                            }`}
                        >
                            답변 여부: {question.resStatus === 1 ? "답변 완료" : "답변 대기"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const getTypeLabel = (type) => {
    switch (type) {
        case 0:
            return "챌린지 관련";
        case 1:
            return "포인트 관련";
        case 2:
            return "기타";
        default:
            return "기타";
    }
};

export default QandAListPrivate;
