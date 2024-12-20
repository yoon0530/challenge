import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import personIcon from '../assets/person.png';
import styles from './UserMenu.module.css';
import host from "../api";

function UserMenu({ isLoggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const userId = storedUser?.userId || null;
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        if (userId && token) {
            const fetchLogo = async () => {
                try {
                    const response = await axios.get(`${host}auth/getuser/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': token
                        }
                    });
                    setLogoUrl(response.data.result[0]);
                } catch (error) {
                    console.error('로고를 가져오는 데 실패했습니다:', error);
                }
            };

            fetchLogo();
        }
    }, [userId, token]);

    const handleButtonClick = useCallback((e) => {
        e.stopPropagation();
        setIsOpen((nextIsOpen) => !nextIsOpen);
    }, []);

    const handleLogout = () => {
        onLogout(); // 상위 컴포넌트에서 받은 로그아웃 핸들러 호출
        setIsOpen(false); // 메뉴 닫기
        navigate('/'); // 로그아웃 후 메인 페이지로 이동
    };

    const handleMenuItemClick = () => {
        setIsOpen(false); // 메뉴 닫기
    };

    return (
        <div className={styles.userMenu}>
            <button className={styles.iconButton} onClick={handleButtonClick}>
                <img
                    src={logoUrl?.imageDir || personIcon} // 로고가 없으면 기본 아이콘 사용
                    alt="유저 메뉴"
                    className={styles.userMenuImage}
                />
            </button>
            {isOpen && (
                <ul className={styles.popup}>
                    {/* 로그인 상태에 따라 조건부 렌더링 */}
                    {!isLoggedIn ? (
                        <>
                            <Link to="/signup" onClick={handleMenuItemClick}>
                                <li>회원가입</li>
                            </Link>
                            <Link to="/login" onClick={handleMenuItemClick}>
                                <li>로그인</li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/my-challenge" onClick={handleMenuItemClick}>
                                <li>나의 도전</li>
                            </Link>
                            <Link to="/mypage" onClick={handleMenuItemClick}>
                                <li>마이페이지</li>
                            </Link>
                            <li onClick={handleLogout}>로그아웃</li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

export default UserMenu;
