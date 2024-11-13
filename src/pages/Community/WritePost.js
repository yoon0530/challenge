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
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && content) {
            try {
                await axios.post(`${host}community/`, {
                    title: title,
                    content: content,
                    rank: rank,
                    type: type
                },{
                    headers: {
                        'Content-Type': 'application/json',
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
