import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './MyChallengeDetail.module.css';
import host from "../../api";

const MyChallengeDetail = () => {
    const { challengeId } = useParams();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [isAuthor, setIsAuthor] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showCertificationForm, setShowCertificationForm] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [content, setContent] = useState("");
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('auth-token');

    const [challenge, setChallenge] = useState({
        id: '',
        userId: '',
        views: '',
        votes: '',
        createdAt: '',
        description: '',
        endDate: '',
        maxHead: '',
        participationFee: '',
        startDate: '',
        totalStep: '',
        currentStep: '',
    });

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${host}challenge/${challengeId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                setChallenge(response.data.result[0]);

                if (storedUser === response.data.result[0].userId) {
                    setIsAuthor(true);
                }
            } catch (error) {
                console.error("Error fetching challenge details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [challengeId]);

    const handleCertificationSubmit = async (e) => {
        e.preventDefault();

        if (!photo || !content) {
            alert("사진과 내용을 모두 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('challengeId', challengeId);
        formData.append('Image', photo);
        formData.append('contents', content);
        formData.append('stepsId', challenge.currentStep);

        try {
            await axios.post(`${host}challenge/auth`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'auth-token': token,
                }
            });
            alert("인증이 성공적으로 제출되었습니다.");
            setShowCertificationForm(false);
        } catch (error) {
            console.error("Error submitting certification:", error);
            alert("인증 제출에 실패했습니다.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!challenge) return <p>해당 도전을 찾을 수 없습니다.</p>;

    return (
        <div className={styles.challengeDetail}>
            <h2 className={styles.title}>{challenge.description}</h2>
            <p className={styles.text}><strong className={styles.textStrong}>참가비:</strong> {challenge.participationFee}</p>
            <p className={styles.text}><strong className={styles.textStrong}>참여 인원:</strong> {challenge.maxHead}</p>
            <p className={styles.text}><strong className={styles.textStrong}>진행 상태:</strong> {status}</p>
            <p className={styles.text}><strong className={styles.textStrong}>도전 기간:</strong> {challenge.startDate} - {challenge.endDate}</p>
            <p className={styles.text}><strong className={styles.textStrong}>현재 단계:</strong> {challenge.currentStep}</p>
            <button onClick={() => setShowCertificationForm(!showCertificationForm)} className={styles.enrollButton}>
                인증하기
            </button>

            {showCertificationForm && (
                <div className={styles.certificationForm}>
                    <h3 className={styles.certificationFormTitle}>인증하기</h3>
                    <form onSubmit={handleCertificationSubmit}>
                        <div>
                            <label htmlFor="photo" className={styles.certificationFormLabel}>사진 업로드:</label>
                            <input
                                type="file"
                                id="photo"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                className={styles.certificationFormInput}
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className={styles.certificationFormLabel}>내용 입력:</label>
                            <textarea
                                id="content"
                                rows="4"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="인증 내용을 입력하세요."
                                className={styles.certificationFormTextarea}
                            />
                        </div>
                        <button type="submit" className={styles.certificationFormButton}>제출하기</button>
                        <button
                            type="button"
                            onClick={() => setShowCertificationForm(false)}
                            className={styles.certificationFormCancelButton}
                        >
                            취소
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MyChallengeDetail;
