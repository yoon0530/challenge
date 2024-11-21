import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PostDetail.module.css';
import host from "../../api";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState({
        nickName: '',
        pid: '',
        title: '',
        content: '',
        votes: 0,
        views: '',
        createdAt: '',
        updatedAt: '',
        imageUrl: '',
    });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${host}community/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setPost(response.data.result[0]);
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`${host}comment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const mappedComments = response.data.result.map(res => ({
                    commentId: res.commentId,
                    nickName: res.nickName,
                    content: res.content,
                    createdAt: res.createdAt,
                    votes: res.votes,
                    userId: res.userId,
                }));
                setComments(mappedComments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handlePostLike = async () => {
        try {
            const response = await axios.put(
                `${host}community/vote`,
                { postId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                }
        );
            if (response.status === 200) {
                // 최신 추천 수를 다시 가져오기
                const updatedPost = await axios.get(`${host}community/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setPost(prevPost => ({
                    ...prevPost,
                    votes: updatedPost.data.result[0].votes,
                }));
            }
        } catch (error) {
            console.error("Error liking post:", error);
            alert("추천에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const response = await axios.put(
                `${host}comment/vote`,
                { commentId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                }
        );
            if (response.status === 200) {
                // 최신 댓글 추천 수 업데이트
                const updatedComments = await axios.get(`${host}comment/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const mappedComments = updatedComments.data.result.map(res => ({
                    commentId: res.commentId,
                    nickName: res.nickName,
                    content: res.content,
                    createdAt: res.createdAt,
                    votes: res.votes,
                    userId: res.userId,
                }));
                setComments(mappedComments);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return alert("댓글 내용을 입력해주세요.");

        try {
            const response = await axios.post(`${host}comment/`,
                {
                    content: newComment,
                    postId: id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                }
        );

            setComments([ ...comments, response.data ]);
            setNewComment('');
            window.location.reload();
        } catch (error) {
            alert("댓글 추가에 실패했습니다.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${host}comment/${commentId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                            'auth-token': token,
                    }
                });
                setComments(comments.filter(comment => comment.commentId !== commentId));
                alert("댓글이 삭제되었습니다.");
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("댓글 삭제에 실패했습니다.");
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${host}community/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                            'auth-token': token,
                    }
                });
                alert("글이 삭제되었습니다.");
                navigate('/community');
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("글 삭제에 실패했습니다.");
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!post.title) return <p>Loading...</p>;

    return (
        <div className={styles.postDetailContainer}>
            <div className={styles.postHeader}>
                <div className={styles.postHeaderRow}>
                    <span className={styles.pp}>제목</span>
                    <span className={styles.postTitle}>{post.title}</span>
                </div>
                <div className={styles.postHeaderRow}>
                    <span className={styles.pp}>작성자</span>
                    <span className={styles.postNickName}>{post.nickName}</span>
                </div>
                <div className={styles.postHeaderRow}>
                    <span className={styles.pp}>작성일</span>
                    <span className={styles.postDate}>{post.createdAt}</span>
                </div>
            </div>

            <div className={styles.postLikeContainer}>
                <button onClick={handlePostLike} className={styles.likePostButton}>
                    추천 ({post.votes})
                </button>
            </div>

            <div className={styles.postContent}>
                {post.imageDir && post.imageDir !== "0" && (
                    <img src={post.imageDir} alt="Post" className={styles.postImage}/>
                )}
                <p>{post.content}</p>
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDelete}>삭제</button>
            </div>

            <div className={styles.commentSection}>
                <h3>댓글 {comments.length}개</h3>
                <div className={styles.commentInputContainer}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글 입력하기"
                        className={styles.commentInput}
                    />
                    <button onClick={handleAddComment} className={styles.addCommentButton}>
                        댓글 추가
                    </button>
                </div>
            </div>

            <ul className={styles.commentList}>
                {comments.map((comment) => (
                    <li key={comment.commentId} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                            <div className={styles.commentInfo}>
                                <span className={styles.commentNickName}>{comment.nickName}</span>
                                <span className={styles.commentDate}>{comment.createdAt}</span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.commentBody}>
                                <p className={styles.commentContent}>{comment.content}</p>
                            </div>
                            <div className={styles.commentActions}>
                                <button
                                    className={styles.likeButton}
                                    onClick={() => handleCommentLike(comment.commentId)}
                                >
                                    추천 ({comment.votes})
                                </button>
                                {storedUser === comment.userId && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                        className={styles.deleteCommentButton}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <button onClick={handleBack} className={styles.backButton}>목록</button>
        </div>

    );
};

export default PostDetail;