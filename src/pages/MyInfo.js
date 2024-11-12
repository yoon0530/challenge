import React, { useEffect, useState } from 'react';
import axios from 'axios';
import host from "../api";
import './MyInfo.css';
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
            //navigate('/login');
            return;
        }

        const userId = storedUser.userId || storedUser; // userId가 없으면 storedUser 자체가 ID일 가능성

        const fetchUserInfo = async () => {
            try {
                console.log("userId:", userId); // userId 출력 확인
                const response = await axios.get(`${host}auth/getuser/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                });
                setUserInfo(response.data.result[0]); // result 배열의 첫 번째 객체 설정
            } catch (error) {
                console.error('Error fetching user info:', error.response ? error.response.data : error.message);
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    // "내 정보 수정" 버튼 클릭 시 호출될 함수
    const handleEditClick = () => {
        navigate('/mypage/infoedit'); // '/infoedit' 경로로 이동
    };

    return (
        <div className="my-info">
            <h2>내 정보</h2>
            <div className="user-info">
                <img src={userInfo.imageDir || 'default-image-path.jpg'} alt="프로필 이미지" width={100} height={100} />
                <p><strong>이메일:</strong> {userInfo.email}</p>
                <p><strong>잔여 금액:</strong> {userInfo.cashStatus}</p>
                <p><strong>전화번호:</strong> {userInfo.phoneNumber}</p>
                <p><strong>계정 생성일:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="edit-button" onClick={handleEditClick}>내 정보 수정</button>
        </div>
    );
};

export default MyInfo;
