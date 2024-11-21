import React, { useState, useEffect } from "react";
import axios from "axios";
import host from "../../api";
import styles from "./QandA.module.css";

const QandA = () => {
    const [questions, setQuestions] = useState([]);
    const token = localStorage.getItem("auth-token");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${host}admin/ticket`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                setQuestions(response.data.result);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [token]);

    const handleAnswerSubmit = async (questionId, ticketId, newAnswer) => {
        try {
            await axios.post(
                `${host}admin/ticket`,
                {
                    ticketId: questionId,
                    content: newAnswer,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );

            setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                    q.id === questionId ? { ...q, answer: newAnswer } : q
                )
            );
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };

    return (
        <div className={styles.adminSection}>
            <h2>질문답변 리스트</h2>
            <ul>
                {questions.map((question) => (
                    <li key={question.id}>
                        <div>
                            <p>
                                <strong>질문:</strong> {question.title}
                            </p>
                            {question.answer ? (
                                <div>
                                    <p>
                                        <strong>답변:</strong> {question.answer}
                                    </p>
                                </div>
                            ) : (
                                <AnswerForm
                                    questionId={question.id}
                                    ticketId={question.ticketId}
                                    onSubmit={handleAnswerSubmit}
                                />
                            )}
                        </div>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AnswerForm = ({ questionId, ticketId, onSubmit }) => {
    const [answer, setAnswer] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim()) {
            onSubmit(questionId, ticketId, answer);
            setAnswer("");
        } else {
            alert("답변을 입력하세요.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
                className={styles.input}
            />
            <button type="submit" className={styles.button}>
                등록
            </button>
        </form>
    );
};

export default QandA;
