import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import host from "../../api";

const EditChallenge = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const [editData, setEditData] = useState({
        description: '',
        participationFee: '',
        startDate: '',
        endDate: '',
        totalStep: '',
        maxHead: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevData => ({ ...prevData, [name]: value }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        console.log(challengeId);
        try {
            const response = await axios.put(`${host}challenge/`,{
                description : editData.description,
                participationFee: editData.participationFee,
                startDate: editData. startDate,
                endDate:editData.endDate,
                totalStep:editData.totalStep,
                maxHead: editData.maxHead,
                challengeId: challengeId,
            },{
                headers:{
                    'Content-type':'application/json',
                    'auth-token': token
                }
            });
            alert('도전이 성공적으로 수정되었습니다!');
            navigate('/challenge');
        } catch (error) {
            console.error('도전 수정 중 오류 발생:', error);
            alert('도전 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-challenge-page">
            <h2 className="title">도전 수정</h2>
            <form onSubmit={handleSubmit} className="create-challenge-form">
                <label>
                    제목:
                    <input type="text" name="description" value={editData.description} onChange={handleChange} required />
                </label>
                <label>
                    참가비:
                    <input type="number" name="participationFee" value={editData.participationFee} onChange={handleChange} required />
                </label>
                <label>
                    시작 날짜:
                    <input type="datetime-local" name="startDate" value={editData.startDate} onChange={handleChange} required />
                </label>
                <label>
                    종료 날짜:
                    <input type="datetime-local" name="endDate" value={editData.endDate} onChange={handleChange} required />
                </label>
                <label>
                    총 단계:
                    <input type="number" name="totalStep" value={editData.totalStep} onChange={handleChange} required />
                </label>
                <label>
                    총 인원:
                    <input type="number" name="maxHead" value={editData.maxHead} onChange={handleChange} required/>
                </label>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "제출 중..." : "도전 생성"}</button>

            </form>
        </div>
    );
};

export default EditChallenge;