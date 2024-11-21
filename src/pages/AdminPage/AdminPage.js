import React, { useState } from 'react';
import styles from './AdminPage.module.css'; // CSS 모듈로 변경
import QandA from './QandA'; // 질문답변 컴포넌트
import Exchange from './Exchange'; // 환전 관리 컴포넌트
import Capproval from './Capproval';
import Recharge from "./Recharge";
import AdminAuth from "./AdminAuth";
import QandApost from "./QandApost";
import Reward from "./Reward"; // 챌린지 관리 컴포넌트

const AdminPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('qanda'); // 기본 메뉴: 질문답변

    // 각 메뉴에 해당하는 콘텐츠 컴포넌트
    const renderContent = () => {
        switch (selectedMenu) {
            case 'qandapost':
                return <QandApost />; // 자주 묻는 질문
            case 'qanda':
                return <QandA />; // 질문답변 콘텐츠
            case 'recharge':
                return <Recharge />;
            case 'exchange':
                return <Exchange />; // 환전 관리 콘텐츠
            case 'capproval':
                return <Capproval />; // 챌린지 인증 콘텐츠
            case 'reward':
                return <Reward />;

            default:
                return <div>메뉴를 선택하세요</div>;
        }
    };

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.ad}>Admin DashBoard</h1>
            <div className={styles.adminSidebar}>
                <ul>
                    <li onClick={() => setSelectedMenu('qandapost')}>자주 묻는 질문</li>
                    <li onClick={() => setSelectedMenu('qanda')}>질문답변</li>
                    <li onClick={() => setSelectedMenu('recharge')}>포인트 추가</li>
                    <li onClick={() => setSelectedMenu('exchange')}>환전</li>
                    <li onClick={() => setSelectedMenu('capproval')}>챌린지</li>
                    <li onClick={() => setSelectedMenu('reward')}>보상지급</li>
                </ul>
            </div>
            <div className={styles.adminContent}>
                {renderContent()} {/* 선택된 메뉴에 따라 콘텐츠 표시 */}
            </div>
        </div>
    );
};

export default AdminPage;
