import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Review.css';
import host from "../api";

const Review = ({ challengeAuthId }) => {
    const [reviews, setReviews] = useState([]);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${host}review/list/${challengeAuthId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                setReviews(response.data.result);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [challengeAuthId, token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <div className="review-container">
            <h2>후기</h2>
            <ul className="review-list">
                {reviews.map((review) => (
                    <li key={review.id} className="review-item">
                        <div className="review-info">
                            <span className="review-nickname"><strong>{review.nickName}</strong></span>
                            <span className="review-date">{formatDate(review.createdAt)}</span>
                        </div>
                        <p className="review-content">{review.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Review;
