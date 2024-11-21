import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MyChallenge.module.css';
import host from "../../api";

const MyChallenges = () => {
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchMyChallenges = async () => {
            try {
                const response = await axios.get(`${host}challenge/user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                setMyChallenges(response.data.result);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching enrolled challenges:", error);
                alert("신청한 도전을 불러오는 데 실패했습니다.");
            }
        };
        fetchMyChallenges();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.myChallenges}>
            <h2 className={styles.title}>내가 신청한 도전</h2>
            {myChallenges.length === 0 ? (
                <p>신청한 도전이 없습니다.</p>
            ) : (
                <ul className={styles.list}>
                    {myChallenges.map(challenge => (
                        <li key={challenge.id} className={styles.listItem}>
                            <Link to={`/mychallenge/${challenge.challengeId}`} className={styles.link}>
                                <h3 className={styles.itemTitle}>{challenge.description}</h3>
                                <p className={styles.itemDescription}>상태: {challenge.status}</p>
                                <p className={styles.itemDescription}>
                                    진행 단계: {challenge.currentStep} / {challenge.totalStep}
                                </p>
                                <p className={styles.itemDescription}>
                                    참여 인원: {challenge.userCount} / {challenge.maxHead}
                                </p>
                                <p className={styles.itemDescription}>
                                    예상 보상: {challenge.rewardAssume}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyChallenges;
