import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import host from "../../api";
import styles from "./RewardInfo.module.css";

const RewardInfo = () => {
    const [challengeData, setChallengeData] = useState(null); // 챌린지 데이터
    const token = localStorage.getItem("auth-token");
    const { id } = useParams();

    const fetchChallengeData = async () => {
        try {
            const response = await axios.get(`${host}admin/reward/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });
            setChallengeData(response.data.result[0]);
        } catch (error) {
            console.error("Error fetching challenge data:", error);
        }
    };

    const postChallengeData = async () => {
        try {
            await axios.post(
                `${host}admin/reward`,
                { challengeId: id, isAccept: 1 },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    }
                }
            );
            alert("지급 요청이 완료되었습니다!");
        } catch (error) {
            console.error("Error posting challenge data:", error);
        }
    };

    useEffect(() => {
        fetchChallengeData();
    }, [id]);

    return (
        <div className={styles["minfo-container"]}>
            {/* 챌린지 정보 */}
            <div className={styles["challenge-info"]}>
                <h2>챌린지 정보</h2>
                {challengeData ? (
                    <>
                        <p>설명: {challengeData.challengeInfo}</p>
                        <p>총보상금: {challengeData.reward}</p>
                        <p>인당 지급액: {challengeData.reward_per_user}</p>
                    </>
                ) : (
                    <p>로딩 중...</p>
                )}
            </div>

            {/* 등록 명단 */}
            <div className={styles["participants-container"]}>
                <h3>성공자 명단</h3>
                {challengeData && challengeData.userList.length > 0 ? (
                    <ul>
                        {challengeData.userList.map((user, index) => (
                            <li key={index}>{index + 1}. {user}</li>
                        ))}
                    </ul>
                ) : (
                    <p>성공자가 없습니다.</p>
                )}
            </div>

            {/* 버튼 */}
            <div className={styles["button-container"]}>
                <button onClick={postChallengeData} className={styles["pay-button"]}>
                    지급
                </button>
            </div>
        </div>
    );
};

export default RewardInfo;
