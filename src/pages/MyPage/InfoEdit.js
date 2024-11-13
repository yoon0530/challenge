import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InfoEdit.css';
import host from "../../api";

const InfoEdit = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    rpassword: '',
    nickName: '',
    image: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (userInfo.password !== userInfo.rpassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');

      await axios.put(`${host}auth/modifyuser`, {
        email: userInfo.email,
        password: userInfo.password,
        phoneNumber: userInfo.phoneNumber,
        nickName: userInfo.nickName,
        imageDir: userInfo.image
      }, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });

      alert('정보가 수정되었습니다.');
      navigate('/mypage'); // 정보 수정 완료 후 마이페이지로 이동
    } catch (error) {
      console.error('Error updating user info:', error.response ? error.response.data : error.message);
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
      <div className="info-edit-container">
        <h2>정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="profile-image-container">
            <label htmlFor="image-upload">
              {userInfo.image ? (
                  <img src={userInfo.image} alt="Profile" className="profile-image" />
              ) : (
                  <div className="profile-placeholder profile-image"></div>
              )}
            </label>
            <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={(e) => setUserInfo({...userInfo, image: e.target.value})}
                style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickName">닉네임</label>
            <input type="text" id="nickName" name="nickName" value={userInfo.nickName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" value={userInfo.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="pw" name="password" value={userInfo.password} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="rpassword">비밀번호 확인</label>
            <input type="password" id="rpw" name="rpassword" value={userInfo.rpassword} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">전화번호</label>
            <input
                type="tel"
                pattern="\d{3}-\d{3,4}-\d{4}"
                id="phoneNumber"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
                placeholder="010-1234-1234"
            />
          </div>

          <button type="submit">정보 수정</button>
        </form>
      </div>
  );
};

export default InfoEdit;
