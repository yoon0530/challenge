import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import host from "../../api";

const EditChallenge = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.put(`${host}challenge/`, {
                ...data,
                challengeId: challengeId,
            }, {
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': token
                }
            });
            alert('도전이 성공적으로 수정되었습니다!');
            navigate('/challenge');
            console.log(challengeId);
        } catch (error) {
            console.error('도전 수정 중 오류 발생:', error);
            alert('도전 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-challenge-page">
            <h2 className="title">도전 수정</h2>
            <form onSubmit={handleSubmit} className="create-challenge-form">
                <label>
                    제목:
                    <input type="text" name="description" required />
                </label>
                <label>
                    참가비:
                    <input type="number" name="participationFee" required />
                </label>
                <label>
                    시작 날짜:
                    <input type="datetime-local" name="startDate" required />
                </label>
                <label>
                    종료 날짜:
                    <input type="datetime-local" name="endDate" required />
                </label>
                <label>
                    총 단계:
                    <input type="number" name="totalStep" required />
                </label>
                <label>
                    총 인원:
                    <input type="number" name="maxHead" required />
                </label>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "제출 중..." : "도전 수정"}</button>
            </form>
        </div>
    );
};

export default EditChallenge;
