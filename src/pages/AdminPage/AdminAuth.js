import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminAuth.css";
import host from "../../api";
import { useParams } from "react-router-dom";

const AdminAuth = () => {
    const [item, setItem] = useState(null); // 초기 상태를 null로 설정
    const token = localStorage.getItem("auth-token");
    const { cAuthId } = useParams(); // URL 매개변수에서 cAuthId 가져오기

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`${host}admin/challengeauth/${cAuthId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });

                // 데이터가 존재하면 설정, 없으면 null로 설정
                if (response.data && response.data.result) {
                    setItem(response.data.result);
                } else {
                    setItem(null);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setItem(null); // 에러 발생 시 null로 설정
            }
        };

        fetchItem();
    }, [cAuthId, token]);

    // 승인 처리
    const handleApprove = async (id) => {
        try {
            await axios.put(
                `${host}admin/challengeauth`,
                {
                    challengeAuthId: id,
                    isAccepted: 1,
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

    // 거절 처리
    const handleReject = async (id) => {
        try {
            await axios.put(
                `${host}admin/challengeauth`,
                {
                    challengeAuthId: id,
                    isAccepted: 2,
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

    // item이 null이면 로딩 메시지 표시
    if (!item) {
        return <p>데이터를 불러오는 중이거나 항목이 없습니다.</p>;
    }

    return (
        <div className="admin-auth-page">
            <h2>관리자 인증 관리</h2>
            <div className="admin-auth-item">
                <h3>{item.description || "설명 없음"}</h3>
                <p><strong>내용:</strong> {item.contents || "내용 없음"}</p>
                <p><strong>작성 날짜:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "날짜 없음"}</p>
                <p><strong>사용자 이름:</strong> {item.nickname || "닉네임 없음"}</p>
                <div className="button-group">
                    <button onClick={() => handleApprove(item.id)} className="approve-button">
                        승인
                    </button>
                    <button onClick={() => handleReject(item.id)} className="reject-button">
                        거절
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
