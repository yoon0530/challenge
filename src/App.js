import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import MyPage from "./pages/MyPage/MyPage";
import PointHistory from "./pages/MyPage/PointHistory";
import PointExchange from "./pages/MyPage/PointExchange";
import PointRecharge from "./pages/MyPage/PointRecharge";
import PrivateRoute from "./components/PrivateRoute";
import Community from "./pages/Community/Community";
import PostDetail from "./pages/Community/PostDetail";
import WritePost from "./pages/Community/WritePost";
import EditPost from "./pages/Community/EditPost";
import ChallengesPage from "./pages/Challenge/ChallengesPage";
import ChallengeDetail from "./pages/Challenge/ChallengeDetail";
import CreateChallengePage from "./pages/Challenge/CreateChallengePage";
import MyChallenge from "./pages/Challenge/MyChallenge";
import CompletedChallenges from "./pages/Challenge/CompletedChallenges";
import InfoEdit from "./pages/MyPage/InfoEdit";
import HelpCenter from "./pages/HelpCenter";
import HelpPost from "./pages/HelpPost";
import Review from "./pages/Review";
import MyInfo from "./pages/MyPage/MyInfo";
import host from "./api";
import MyPoint from "./pages/MyPage/MyPoint";
import Account from "./pages/MyPage/Account";
import EditChallenge from "./pages/Challenge/EditChallenge";
import AdminPage from "./pages/AdminPage/AdminPage";
import QandA from "./pages/AdminPage/QandA";
import AdminPoint from "./pages/AdminPage/AdminPoint";
import Exchange from "./pages/AdminPage/Exchange";
import Capproval from "./pages/AdminPage/Capproval";
import AdminNav from "./pages/AdminPage/AdminNav";
import Recharge from "./pages/AdminPage/Recharge";

function App() {
    const [userName, setUserName] = useState(() => JSON.parse(localStorage.getItem('user'))?.name || '');
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
    const [parsed, setParsed] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(`${host}challenge/list`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setChallenges(response.data);
            } catch (error) {
                console.error("Error fetching challenges data:", error);
            }
        };

        fetchChallenges();
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setUserName(user.name);
        setParsed(user);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(user));
    };

    const handleLogout = (showAlert = true) => {
        setIsLoggedIn(false);
        setUserName('');
        setParsed(null);
        localStorage.clear();
        if (showAlert) {
            alert("로그아웃되었습니다.");
        }
    };

    return (
        <BrowserRouter>
            <Nav className={styles.nav} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <div className={styles.body}>
                <Routes>
                    <Route path="/" element={<><HomePage /><Footer className={styles.footer} /></>} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/signup" element={<><SignupPage /><Footer className={styles.footer} /></>} />
                    <Route path="/challenge" element={<ChallengesPage challenges={challenges} />} />
                    <Route path="/challenge/:challengeId" element={<ChallengeDetail />} />
                    <Route path="/editchallenge/:challengeId" element={<EditChallenge />} />
                    <Route path="/create-challenge" element={<CreateChallengePage />} />
                    <Route path="/my-challenge" element={<MyChallenge />} />
                    <Route path="/review" element={<Review />} />

                    <Route path="/adminpage" element={<PrivateRoute isLoggedIn={isLoggedIn}><AdminPage /></PrivateRoute>}>
                        <Route path="qanda" element={<QandA />} />
                        <Route path="adminpoint" element={<AdminPoint />}/>
                        <Route path="exchange" element={<Exchange />}/>
                        <Route path="recharge" element={<Recharge />}/>
                        <Route path="capproval" element={<Capproval/>} />
                        <Route path="adminnav" element={<AdminNav/>}/>
                    </Route>

                    {/* 보호된 라우트 설정 */}
                    <Route path="/community" element={<PrivateRoute isLoggedIn={isLoggedIn}><Community /></PrivateRoute>} />
                    <Route path="/write" element={<PrivateRoute isLoggedIn={isLoggedIn}><WritePost userName={userName} /></PrivateRoute>} />
                    <Route path="/community/:id" element={<PrivateRoute isLoggedIn={isLoggedIn}><PostDetail userName={userName} /></PrivateRoute>} />
                    <Route path="/edit/:id" element={<PrivateRoute isLoggedIn={isLoggedIn}><EditPost /></PrivateRoute>} />
                   
                    {/* 마이페이지와 관련된 보호된 경로 */}
                    <Route path="/mypage" element={<PrivateRoute isLoggedIn={isLoggedIn}><MyPage parsed={parsed} onLogout={() => handleLogout(false)} /></PrivateRoute>}>
                        <Route path="mypoint" element={<MyPoint />} />
                        <Route path="pointhistory" element={<PointHistory />} />
                        <Route path="pointexchange" element={<PointExchange />} />
                        <Route path="pointrecharge" element={<PointRecharge />} />
                        <Route path="account" element={<Account />} />
                        <Route path="myinfo" element={<MyInfo />} />
                        <Route path="infoEdit" element={<InfoEdit />}/>
                        <Route path="helpCenter" element={<HelpCenter />} />
                        <Route path="helpPost" element={<HelpPost />} />
                    </Route>

                    {/* 종료된 도전 페이지 라우트 추가 */}
                    <Route path="/completedchallenges" element={<PrivateRoute isLoggedIn={isLoggedIn}><CompletedChallenges /></PrivateRoute>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
