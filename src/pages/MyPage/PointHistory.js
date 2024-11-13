import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PointHistory.css';
import host from "../../api";

const PointHistory = () => {
    const [points, setPoints] = useState([]);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${host}finance/bankhistory`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                setPoints(response.data.result);
            } catch (error) {
                console.error('데이터를 가져오는 데 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="point-history-container">
            <h2 className="point-history-title">전체 포인트 내역</h2>
            <table className="point-history-table">
                <thead>
                <tr>
                    <th>날짜</th>
                    <th>포인트</th>
                    <th>입출금</th>
                    <th>어디서 얻음?</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {points.map((point) => (
                    <tr key={point.id}>
                        <td>{new Date(point.updatedAt).toLocaleDateString()}</td>
                        <td className={point.amount < 0 ? 'negative' : 'positive'}>
                            {point.amount.toLocaleString()} 원
                        </td>
                        <td>{point.addOrOut === 0 ? "입금" : "출금"}</td>
                        <td>{point.transactionType === 0 ? "입금" : "챌린지"}</td>
                        <td>{point.status === 0 ? "대기 중" : "완료"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PointHistory;
