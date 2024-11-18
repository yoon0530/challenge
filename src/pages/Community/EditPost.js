import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './WritePost.css';
import host from "../../api";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const token = localStorage.getItem('auth-token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && content) {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                await axios.put(`${host}community/`, {
                    ...data,
                    id: id,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                alert("글이 성공적으로 수정되었습니다.");
                navigate('/community');
            } catch (error) {
                console.error("Error posting data:", error);
            }
        } else {  // 제목과 내용이 없을 경우 경고 메시지 출력
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    return (
        <div className="write-post-container">
            <h2>글 수정</h2>
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
                <button type="submit">작성 완료</button>
            </form>
        </div>
    );
};

export default EditPost;
