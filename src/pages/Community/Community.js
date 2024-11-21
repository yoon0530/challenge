import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Community.module.css';
import axios from 'axios';
import host from "../../api";

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const postsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${host}community/list/${currentPage}`);
                const mappedPosts = response.data.result.map(post => {
                    const date = new Date(post.createdAt);
                    const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;
                    return {
                        id: post.pid,
                        title: post.title,
                        author: post.nickName,
                        createdAt: formattedDate,
                        views: post.views,
                        votes: post.votes,
                    };
                });
                setPosts(mappedPosts);
                setTotalPages(response.data.totalPages || 0);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            }
        };
        fetchPosts();
    }, [currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={styles.boardContainer}>
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                }}
            >
                자유게시판
            </h1>
            <table className={styles.postTable}>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th className={styles.createdAt}>작성일</th>
                    <th className={styles.author}>작성자</th>
                </tr>
                </thead>
                <tbody>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <tr
                            key={post.id}
                            onClick={() => navigate(`/community/${post.id}`)}
                            className={styles.postRow}
                        >
                            <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                            <td>{post.title}</td>
                            <td className={styles.createdAt}>{post.createdAt}</td>
                            <td className={styles.author}>{post.author}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className={styles.noPostsMessage}>
                            현재 게시된 글이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {[...Array(totalPages).keys()].map(num => (
                    <button
                        key={num}
                        onClick={() => paginate(num + 1)}
                        className={currentPage === num + 1 ? styles.active : ''}
                    >
                        {num + 1}
                    </button>
                ))}
            </div>
            <button
                className={styles.writeButton}
                onClick={() => navigate('/write')}
            >
                글 작성
            </button>
        </div>
    );
};

export default Community;
