import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyChallenge.css';

const MyChallenges = () => {
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyChallenges = async () => {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (!loggedInUser) {
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                // 전체 도전 목록 가져오기
                const response = await axios.get('http://localhost:5000/challenge');
                // 신청한 도전만 필터링
                const enrolledChallenges = response.data.filter(challenge =>
                    challenge.enrolledUsers && challenge.enrolledUsers.includes(loggedInUser.id)
                );
                setMyChallenges(enrolledChallenges);
            } catch (error) {
                console.error("Error fetching enrolled challenges:", error);
                alert("신청한 도전을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyChallenges();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="my-challenges">
            <h2>내가 신청한 도전</h2>
            {myChallenges.length === 0 ? (
                <p>신청한 도전이 없습니다.</p>
            ) : (
                <ul>
                    {myChallenges.map(challenge => (
                        <li key={challenge.id}>
                            <Link to={`/challenge/${challenge.id}`}>
                                <h3>{challenge.title}</h3>
                                <p>{challenge.description}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyChallenges;
