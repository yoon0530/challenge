import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './InfoEdit.module.css';
import host from "../../api";

const InfoEdit = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    rpassword: '',
    nickName: '',
    imageDir: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // 이미지 미리보기 업데이트
      };
      reader.readAsDataURL(file);

      setUserInfo((prevState) => ({
        ...prevState,
        image: file // 파일 객체를 저장
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo.password !== userInfo.rpassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const formData = new FormData();

      formData.append('email', userInfo.email);
      formData.append('password', userInfo.password);
      formData.append('phoneNumber', userInfo.phoneNumber);
      formData.append('nickName', userInfo.nickName);
      formData.append('image', userInfo.image);

      await axios.put(`${host}auth/modifyuser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': token
        }
      });

      alert('정보가 수정되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('Error updating user info:', error.response ? error.response.data : error.message);
      alert('정보 수정에 실패했습니다.');
    }
  };

  return (
      <div className={styles.infoEditContainer}>
        <h2>정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.profileImageContainer}>
            <label htmlFor="image-upload">
              {previewImage ? (
                  <img src={previewImage} alt="Profile" className={styles.profileImage} />
              ) : userInfo.image ? (
                  <img src={URL.createObjectURL(userInfo.image)} alt="Profile" className={styles.profileImage} />
              ) : (
                  <div className={`${styles.profilePlaceholder} ${styles.profileImage}`}></div>
              )}
            </label>
            <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nickName">닉네임</label>
            <input
                type="text"
                id="nickName"
                name="nickName"
                value={userInfo.nickName}
                onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
                type="password"
                id="password"
                name="password"
                value={userInfo.password}
                onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="rpassword">비밀번호 확인</label>
            <input
                type="password"
                id="rpassword"
                name="rpassword"
                value={userInfo.rpassword}
                onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">전화번호</label>
            <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleInputChange}
                placeholder="010-1234-1234"
                pattern="\d{3}-\d{3,4}-\d{4}"
            />
          </div>
          <button type="submit" className={styles.submitButton}>정보 수정</button>
        </form>
      </div>
  );
};

export default InfoEdit;
