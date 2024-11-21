import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './WritePost.module.css';
import host from "../../api";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null); // 이미지 상태 추가
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${host}community/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                const post = response.data.result[0];
                setTitle(post.title);
                setContent(post.content);
            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };

        fetchPost();
    }, [id, token]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // 파일 선택 시 상태 업데이트
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && content) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('id', id);
            if (image) {
                formData.append('image', image); // 이미지 추가
            }

            try {
                await axios.put(`${host}community/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // FormData 전송 헤더 설정
                        'auth-token': token,
                    },
                });
                alert("글이 성공적으로 수정되었습니다.");
                navigate('/community');
            } catch (error) {
                console.error("Error updating post:", error);
                alert("글 수정에 실패했습니다.");
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    return (
        <div className={styles.editPostContainer}>
            <h2 className={styles.title}>글 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.formTextarea}
                        required
                    />
                </div>
                <div className={styles.formField}>
                    <label className={styles.formLabel}>사진 첨부</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.formInput}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    작성 완료
                </button>
            </form>
        </div>
    );
};

export default EditPost;
