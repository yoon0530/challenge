import React, {Navigate, useEffect, useState} from 'react';
import PointHistory from "./PointHistory";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import host from "../../api";
import './MyPoint.css'

const MyPoint = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const [accountData, setAccountData] = useState({});
    useEffect(() => {

        const fetchAccount = async () => {
            try {
                const response = await axios.get(`${host}finance/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                setAccountData(response.data.result[0]);
            } catch (error) {
                console.error("Error getting account data:", error);
            }
        }
        fetchAccount();
    }, []);

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${host}finance/${accountData.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            alert("계좌가 삭제되었습니다.");
            setAccountData(null);
        } catch (error) {
            console.error("Error deleting account data:", error);
            alert("계좌 삭제에 실패했습니다.")
        }
    }

    return (
        <div className="point-history-container">
            <div className="button-group">
                <button onClick={()=>navigate('/mypage/pointexchange')} className="exchange-button">포인트 환전</button>
                <button onClick={()=>navigate('/mypage/pointrecharge')} className="charge-button">포인트 충전</button>
                <button onClick={()=>navigate('/mypage/account')} className="register-account-button">계좌번호 등록</button>
                {accountData ? (
                    <>
                        <p>내 계좌: {accountData.bankName} {accountData.accountNumber}</p>
                        <button onClick={handleDeleteAccount}>계좌 삭제</button>
                    </>
                ) : (
                    <p>등록된 계좌가 없습니다.</p>
                )}
            </div>
            <hr className="divider-line" />
            <PointHistory/>
        </div>
    );
};

export default MyPoint;
