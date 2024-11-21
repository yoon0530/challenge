import React, { useState } from "react";
import axios from "axios";
import styles from "./QandApost.module.css";
import host from "../../api";

const QandApost = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim() || !answer.trim()) {
            alert("질문과 대답을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post(
                `${host}qna/`,
                {
                    question: question,
                    answer: answer,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("질문과 대답이 성공적으로 전송되었습니다!");
            setQuestion("");
            setAnswer("");
        } catch (error) {
            console.error("Error sending question and answer:", error);
            alert("질문과 대답 전송에 실패했습니다.");
        }
    };

    return (
        <div className={styles.questionFormContainer}>
            <h2 className={styles.heading}>질문과 대답 작성</h2>
            <form onSubmit={handleSubmit} className={styles.questionForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="question" className={styles.label}>질문:</label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="질문을 입력하세요"
                        className={styles.textarea}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="answer" className={styles.label}>대답:</label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="대답을 입력하세요"
                        className={styles.textarea}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    전송
                </button>
            </form>
        </div>
    );
};

export default QandApost;
