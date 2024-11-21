import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CreateChallengePage.module.css';
import host from "../../api";

const CreateChallengePage = () => {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('auth-token');
    const [challengeData, setChallengeData] = useState({
        description: '',
        participationFee: '',
        startDate: '',
        endDate: '',
        totalStep: '',
        maxHead: '',
        userId: loggedInUser ? loggedInUser.userId : '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChallengeData(prevData => ({ ...prevData, [name]: value }));
    };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const formattedData = {
            ...challengeData,
            startDate: formatDateTime(challengeData.startDate),
            endDate: formatDateTime(challengeData.endDate),
        };

        try {
            const response = await axios.post(`${host}challenge/`, formattedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            alert('도전이 성공적으로 추가되었습니다!');
            navigate('/challenge');
        } catch (error) {
            console.error('도전 생성 중 오류 발생:', error);
            alert('도전 생성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.createChallengePage}>
            <h2 className={styles.title}>도전 생성</h2>
            <form onSubmit={handleSubmit} className={styles.r} >
                <label className={styles.formLabel}>
                    제목:
                    <input
                        type="text"
                        name="description"
                        value={challengeData.description}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <label className={styles.formLabel}>
                    참가비:
                    <input
                        type="number"
                        name="participationFee"
                        value={challengeData.participationFee}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <label className={styles.formLabel}>
                    시작 날짜:
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={challengeData.startDate}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <label className={styles.formLabel}>
                    종료 날짜:
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={challengeData.endDate}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <label className={styles.formLabel}>
                    총 단계:
                    <input
                        type="number"
                        name="totalStep"
                        value={challengeData.totalStep}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <label className={styles.formLabel}>
                    총 인원:
                    <input
                        type="number"
                        name="maxHead"
                        value={challengeData.maxHead}
                        onChange={handleChange}
                        className={styles.formInput}
                        required
                    />
                </label>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.formButton}
                >
                    {isSubmitting ? "제출 중..." : "도전 생성"}
                </button>
            </form>
        </div>
    );
};

export default CreateChallengePage;
