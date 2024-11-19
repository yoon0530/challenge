import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WritePost.css';
import host from "../../api";
import styles from "../MyPage/PointRecharge.module.css";

const WritePost = ({ userName }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rank, setRank] = useState();
    const [type, setType] = useState();
    const [image, setImage] = useState(null); // 사진 상태 추가
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // 파일 선택 시 상태 업데이트
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && content) {
            const formData = new FormData(); // FormData 생성
            formData.append('title', title);
            formData.append('content', content);
            formData.append('rank', rank);
            formData.append('type', type);
            if (image) {
                formData.append('image', image);
            }

            try {
                await axios.post(`${host}community/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'auth-token': token,
                    },
                });
                navigate('/community');
            } catch (error) {
                console.error("Error posting data:", error);
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    return (
        <div className="write-post-container">
            <h2>글 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>사진 첨부</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className={styles.select}
                >
                    <option value="">계좌 선택</option>
                    <option value="0">이거 골라</option>
                </select>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.select}
                >
                    <option value="">계좌 선택</option>
                    <option value="1">이거 골라</option>
                </select>
                <button type="submit">작성 완료</button>
            </form>
        </div>
    );
};

export default WritePost;
