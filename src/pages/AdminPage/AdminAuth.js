import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminAuth.module.css";
import host from "../../api";
import { useParams } from "react-router-dom";

const AdminAuth = () => {
    const [item, setItem] = useState(null);
    const token = localStorage.getItem("auth-token");
    const { cAuthId } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${host}admin/challengeauth/${cAuthId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });

                if (response.data && response.data.result) {
                    setItem(response.data.result);
                } else {
                    setItem(null);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setItem(null);
            }
        };

        fetchItem();
    }, [cAuthId, token]);

    const handleApprove = async (id) => {
        try {
            await axios.put(
                `${host}admin/challengeauth`,
                {
                    challengeAuthId: id,
                    isAccept: 1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );
            alert("승인되었습니다.");
        } catch (error) {
            console.error("Error approving item:", error);
            alert("승인 처리 중 오류가 발생했습니다.");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(
                `${host}admin/challengeauth`,
                {
                    challengeAuthId: id,
                    isAccept: 2,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                }
            );
            alert("거절되었습니다.");
        } catch (error) {
            console.error("Error rejecting item:", error);
            alert("거절 처리 중 오류가 발생했습니다.");
        }
    };

    if (!item) {
        return <p>데이터를 불러오는 중이거나 항목이 없습니다.</p>;
    }

    return (
        <div className={styles.adminAuthPage}>
            <h2>관리자 인증 관리</h2>
            <div className={styles.adminAuthItem}>
                <h3>{item.description || "설명 없음"}</h3>
                <p>
                    <strong>내용:</strong> {item.contents || "내용 없음"}
                </p>
                <p>
                    <strong>작성 날짜:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "날짜 없음"}
                </p>
                <p>
                    <strong>사용자 이름:</strong> {item.nickname || "닉네임 없음"}
                </p>
                <div className={styles.buttonGroup}>
                    <button onClick={() => handleApprove(item.id)} className={styles.approveButton}>
                        승인
                    </button>
                    <button onClick={() => handleReject(item.id)} className={styles.rejectButton}>
                        거절
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
