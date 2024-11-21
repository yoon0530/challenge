import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from '../../api';
import styles from './Reward.module.css';

const Reward = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchMoney = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${host}admin/reward`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                setPosts(response.data.result);
            } catch (error) {
                console.error("Error fetching challenges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoney();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/adminpage/rewardinfo/${id}`);
    };

    return (
        <div className={styles.boardContainer}>
            <h1 className={styles.title}>보상금 지급 대기</h1>
            {loading ? (
                <div className={styles.loading}>로딩 중...</div>
            ) : (
                <table className={styles.postTable}>
                    <thead>
                    <tr>
                        <th className={styles.num}>번호</th>
                        <th className={styles.ch}>챌린지</th>
                        <th className={styles.co}>확인</th>
                    </tr>
                    </thead>
                    <tbody>
                    {posts.map((post, index) => (
                        <tr key={post.id}>
                            <td>{index + 1}</td>
                            <td>{post.description}</td>
                            <td>
                                <button
                                    className={styles.button}
                                    onClick={() => handleCardClick(post.id)}
                                >
                                    확인
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Reward;
