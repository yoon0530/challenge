import React, { useState, useEffect } from "react";
import axios from "axios";
import host from "../../api";

const QandA = () => {
    const [questions, setQuestions] = useState([]);
    const token = localStorage.getItem("auth-token");

    // 질문 데이터를 백엔드에서 가져오기
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${host}admin/ticket`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                setQuestions(response.data.result); // 질문 데이터 설정
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [token]);

    // 답변 등록 처리
    const handleAnswerSubmit = async (questionId, ticketId, newAnswer) => {
        try {
            await axios.post(
                `${host}admin/ticket`, {
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

            // 로컬 상태 업데이트
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
        <div className="admin-section">
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
                                    ticketId={question.ticketId} // ticketId 전달
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

// 답변 입력 폼 컴포넌트
const AnswerForm = ({ questionId, ticketId, onSubmit }) => {
    const [answer, setAnswer] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim()) {
            onSubmit(questionId, ticketId, answer); // 부모 컴포넌트로 데이터 전달
            setAnswer(""); // 입력 필드 초기화
        } else {
            alert("답변을 입력하세요.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
            />
            <button type="submit">등록</button>
        </form>
    );
};

export default QandA;
