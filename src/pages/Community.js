import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './Community.css';
import axios from 'axios';
import host from "../api";

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
                const mappedPosts = response.data.result.map(post => ({
                    id: post.pid,
                    title: post.title,
                    author: post.nickName,
                    createdAt: post.createdAt,
                    views: post.views,
                    votes: post.votes,
                }));
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
        <div className="board-container">
            <h1>자유게시판</h1>
            <table className="post-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th className="author">작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <tr 
                                key={post.id}
                                    onClick={() => navigate(`/community/${post.id}`)}
                                className="post-row"
                            >
                                <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                                <td>{post.title}</td>
                                <td className="author">{post.author}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-posts-message">현재 게시된 글이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(totalPages).keys()].map(num => (
                    <button 
                        key={num} 
                        onClick={() => paginate(num + 1)} 
                        className={currentPage === num + 1 ? 'active' : ''}
                    >
                        {num + 1}
                    </button>
                ))}
            </div>
            <button className="write-button" onClick={() => navigate('/write')}>글 작성</button>
        </div>
    );
};

export default Community;
