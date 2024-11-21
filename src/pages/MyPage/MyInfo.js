import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MyInfo.module.css';
import host from "../../api";
import { useNavigate } from "react-router-dom";

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        cashStatus: 0,
        phoneNumber: '',
        imageDir: '',
        nickName: '',
        createdAt: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('auth-token');
        console.log("토큰 저장 확인:", token);

        if (!storedUser || !token) {
            alert('로그인 정보가 없습니다.');
            return;
        }

        const userId = storedUser.userId || storedUser;

        const fetchUserInfo = async () => {
            try {
                console.log("userId:", userId);
                const response = await axios.get(`${host}auth/getuser/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                });
                setUserInfo(response.data.result[0]);
            } catch (error) {
                console.error('Error fetching user info:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleEditClick = () => {
        navigate('/mypage/infoedit');
    };

    return (
        <div className={styles.myInfo}>
            <h2>내 정보</h2>
            <div className={styles.userInfo}>
                <img
                    src={userInfo.imageDir || 'default-image-path.jpg'}
                    alt="프로필 이미지"
                    width={100}
                    height={100}
                />
                <p><strong>이메일:</strong> {userInfo.email}</p>
                <p><strong>잔여 금액:</strong> {userInfo.cashStatus}</p>
                <p><strong>전화번호:</strong> {userInfo.phoneNumber}</p>
                <p><strong>계정 생성일:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}</p>
            </div>
            <button className={styles.editButton} onClick={handleEditClick}>
                내 정보 수정
            </button>
        </div>
    );
};

export default MyInfo;
