import React, { useState } from 'react';
import axios from 'axios';
import styles from './PointExchange.module.css';
import host from "../../api";

const Account = () => {
    const [account, setAccount] = useState({
            bank: '',
        myaccount: '',
        });
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('auth-token');

    const handleAccountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAccount((prevAccount) => ({ ...prevAccount, myaccount: value }));
        }
    };

    const handleBankChange = (e) => {
        setAccount((prevAccount) => ({
            ...prevAccount,
            bank: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${host}finance/`, {
                bankName: account.bank,
                accountNumber: account.myaccount,
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            setMessage('등록이 완료되었습니다.')
        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
            setMessage('오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>계좌 등록</h2>
            {message && <p className={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        나의 계좌:
                        <select
                            value={account.bank}
                            onChange={handleBankChange}
                            className={styles.select}
                            required
                        >
                            <option value="">은행 선택</option>
                            <option value="카카오뱅크">카카오뱅크</option>
                            <option value="토스">토스</option>
                            <option value="기타">기타</option>
                        </select>
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        계좌번호:
                        <input
                            type="text"
                            value={account.myaccount}
                            onChange={handleAccountChange}
                            placeholder="계좌번호 입력"
                            required
                            className={styles.input}
                        />
                    </label>
                </div>
                <p className={styles.note}>* 예금주가 동일해야 합니다.</p>
                <button type="submit" className={styles.button}>신청</button>
            </form>
        </div>
    );
};

export default Account;
