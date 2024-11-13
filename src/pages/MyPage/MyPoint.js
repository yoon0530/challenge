import React, { Navigate } from 'react';
import PointHistory from "./PointHistory";
import {useNavigate} from "react-router-dom";

const MyPoint = () => {

    const navigate = useNavigate();
    return (
        <div className="point-history-container">
            <div className="button-group">
                <button onClick={()=>navigate('/mypage/pointexchange')} className="exchange-button">포인트 환전</button>
                <button onClick={()=>navigate('/mypage/pointrecharge')} className="charge-button">포인트 충전</button>
                <button onClick={()=>navigate('/mypage/account')} className="register-account-button">계좌번호 등록</button>
            </div>
            <hr className="divider-line" />
            <PointHistory/>
        </div>
    );
};

export default MyPoint;
