import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./QandAList.module.css";
import host from "../api";

const QandAList = () => {
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get(`${host}qna/`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setFaqs(response.data.qna);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className={styles.faqFormContainer}>
            <h2>자주 묻는 질문 (FAQ)</h2>
            <ul className={styles.faqList}>
                {faqs.map((faq) => (
                    <li key={faq.id} className={styles.faqItem}>
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QandAList;
