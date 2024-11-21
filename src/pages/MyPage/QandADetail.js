import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import host from "../../api";
import styles from "./QandADetail.module.css";

const QandADetail = () => {
    const { id } = useParams();
    const [question1, setQuestion1] = useState(null);
    const [question2, setQuestion2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        const fetchQuestionDetail = async () => {
            try {
                const response = await axios.get(`${host}ticket/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                setQuestion1(response.data.result1[0]);
                setQuestion2(response.data.result2[0]);
                setLoading(false);
            } catch (error) {
                console.error("질문 상세 데이터를 가져오는 데 실패했습니다:", error);
                setError("데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchQuestionDetail();
    }, [id]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!question1) {
        return <p>질문 데이터를 찾을 수 없습니다.</p>;
    }

    return (
        <div className={styles.questionDetailContainer}>
            <h2 className={styles.questionTitle}>문의 내용</h2>
            <div className={styles.questionDetail}>
                <p className={styles.questionType}>
                    문의 종류: {getTypeLabel(question1.type)}
                </p>
                <p
                    className={`${styles.questionStatus} ${
                        question1.resStatus === 1 ? styles.completed : ""
                    }`}
                >
                    답변 여부: {question1.resStatus === 1 ? "답변 완료" : "답변 대기"}
                </p>
                <div className={styles.questionContent}>
                    <h3>{question1.title || "제목 없음"}</h3>
                    <p>{question1.content}</p>
                </div>
                {question2.content ? (
                    <div className={styles.adminAnswer}>
                        <h3>운영자의 답변</h3>
                        <p>{question2.content}</p>
                    </div>
                ) : (
                    <p className={styles.noAnswerMessage}>
                        운영자의 답변이 아직 등록되지 않았습니다.
                    </p>
                )}
            </div>
        </div>
    );
};

// 문의 종류를 텍스트로 변환하는 헬퍼 함수
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

export default QandADetail;
