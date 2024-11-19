import React, { useState } from 'react';
import './AdminPage.css';
import QandA from './QandA'; // 질문답변 컴포넌트
import AdminPoint from './AdminPoint'; // 포인트 관리 컴포넌트
import Exchange from './Exchange'; // 환전 관리 컴포넌트
import Capproval from './Capproval';
import Recharge from "./Recharge";
import AdminAuth from "./AdminAuth"; // 챌린지 관리 컴포넌트


const AdminPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('qanda'); // 기본 메뉴: 질문답변

    // 각 메뉴에 해당하는 콘텐츠 컴포넌트
    const renderContent = () => {
        switch (selectedMenu) {
            case 'qanda':
                return <QandA />; // 질문답변 콘텐츠
            case 'adminpoint':
                return <AdminPoint />; // 포인트 관리 콘텐츠
            case 'recharge':
                return <Recharge />;
            case 'exchange':
                return <Exchange />; // 환전 관리 콘텐츠
            case 'capproval':
                return <Capproval />; // 챌린지 인증 콘텐츠
            default:
                return <div>메뉴를 선택하세요</div>;
        }
    };

    return (
        <div className="admin-container">
            <h1 className="ad">Admin DashBoard</h1>
            <div className="admin-sidebar">
                <ul>
                    <li onClick={() => setSelectedMenu('qanda')}>질문답변</li>
                    <li onClick={() => setSelectedMenu('adminpoint')}>포인트</li>
                    <li onClick={() => setSelectedMenu('recharge')}>포인트 추가</li>
                    <li onClick={() => setSelectedMenu('exchange')}>환전</li>
                    <li onClick={() => setSelectedMenu('capproval')}>챌린지</li>
                </ul>
            </div>
            <div className="admin-content">
                {renderContent()} {/* 선택된 메뉴에 따라 콘텐츠 표시 */}
            </div>
        </div>
    );
};

export default AdminPage;