import React, { useState, useEffect } from 'react';
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
import MyPoint from "./pages/MyPage/MyPoint";
import Account from "./pages/MyPage/Account";
import EditChallenge from "./pages/Challenge/EditChallenge";
import AdminPage from "./pages/AdminPage/AdminPage";
import QandA from "./pages/AdminPage/QandA";
import Exchange from "./pages/AdminPage/Exchange";
import Capproval from "./pages/AdminPage/Capproval";
import AdminNav from "./pages/AdminPage/AdminNav";
import Recharge from "./pages/AdminPage/Recharge";
import AdminAuth from "./pages/AdminPage/AdminAuth";
import QandAlist from "./pages/QandAList";
import QandAListPrivate from "./pages/MyPage/QandAListPrivate";
import QandADetail from "./pages/MyPage/QandADetail";
import Reward from "./pages/AdminPage/Reward";
import RewardInfo from "./pages/AdminPage/RewardInfo";
import MyChallengeDetail from "./pages/Challenge/MyChallengeDetail";

function App() {
    const [userName, setUserName] = useState(() => JSON.parse(localStorage.getItem('user'))?.name || '');
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
    const [parsed, setParsed] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [challenges, setChallenges] = useState([]);

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
                    <Route path="/mychallenge/:challengeId" element={<MyChallengeDetail />} />
                    <Route path="/editchallenge/:challengeId" element={<EditChallenge />} />
                    <Route path="/create-challenge" element={<CreateChallengePage />} />
                    <Route path="/my-challenge" element={<MyChallenge />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="adminauth/:cAuthId" element={<AdminAuth/>} />
                    <Route path="reward" element={<Reward/>} />
                    <Route path="adminpage/rewardinfo/:id" element={<RewardInfo/>} />

                    <Route path="/adminpage" element={<PrivateRoute isLoggedIn={isLoggedIn}><AdminPage /></PrivateRoute>}>
                        <Route path="qanda" element={<QandA />} />
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
                        <Route path="qandalist" element={<QandAlist />}/>
                        <Route path="infoEdit" element={<InfoEdit />}/>
                        <Route path="helpcenter" element={<HelpCenter />} />
                        <Route path="qandalistprivate" element={<QandAListPrivate />} />
                        <Route path="qandadetail/:id" element={<QandADetail />} />
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
