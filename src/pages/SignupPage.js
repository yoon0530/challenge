import React, { Fragment, useState } from 'react';
import UserInput from './Signup/UserInput';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_LIST, AGREE_LIST } from './Signup/SignupData';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios from 'axios';
import styles from './SignupPage.module.css';
import host from '../api';

const SignupPage = () => {
    const navigate = useNavigate();
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        password: '',
        passwordCheck: '',
        nickName: '',
        phoneNumber: '',
        image: '',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isClick, setIsClick] = useState([]);

    const handleInfo = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setSignupInfo((prevState) => ({
                ...prevState,
                image: file,
            }));
        }
    };

    const isPasswordCorrect = signupInfo.password === signupInfo.passwordCheck;

    const signupClick = async (e) => {
        e.preventDefault();
        if (!isPasswordCorrect) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('email', signupInfo.email);
            formData.append('password', signupInfo.password);
            formData.append('phoneNumber', signupInfo.phoneNumber);
            formData.append('nickName', signupInfo.nickName);
            if (signupInfo.image) {
                formData.append('image', signupInfo.image);
            }

            const response = await axios.post(`${host}auth/signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('회원가입 되었습니다!');
                navigate('/login');
            } else {
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const makeButtonCheck = (id) => {
        if (isClick.includes(id)) {
            setIsClick(isClick.filter((i) => i !== id));
            return;
        }
        setIsClick([...isClick, id]);
    };

    const isAllChecked = AGREE_LIST.length === isClick.length;
    const handleAllCheck = () => {
        isAllChecked ? setIsClick([]) : setIsClick(AGREE_LIST.map((item) => item.id));
    };

    return (
        <form className={styles.signup}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2 className={styles.mainTitle}>회원가입</h2>
                    <div className={styles.subTitle}>
                        <h3 className={styles.fontBold}>기본정보</h3>
                        <p className={styles.fontRight}>
                            <span className={styles.fontRed}>*</span> 필수입력사항
                        </p>
                    </div>
                </div>
                <div className={styles.inputTable}>
                    {SIGNUP_LIST.map(({ id, title, placeholder, info, name, type }) => (
                        <UserInput
                            key={id}
                            title={title}
                            placeholder={placeholder}
                            info={info}
                            name={name}
                            handleInfo={handleInfo}
                            check={isPasswordCorrect}
                            type={type}
                        />
                    ))}
                    <div className={styles.profileImageContainer}>
                        <label htmlFor="image-upload">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className={styles.profileImage} />
                            ) : (
                                <div className={styles.profilePlaceholder}></div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
                <div className={styles.agreement}>
                    <div className={styles.agreementTitle}>
                        이용약관 동의<span className={styles.agreementTitleRed}>*</span>
                    </div>
                    <div className={styles.agreementList}>
                        <div className={styles.agreementListInfoBox}>
                            <AiOutlineCheckCircle
                                className={isAllChecked ? styles.checkButton : styles.disabled}
                                onClick={handleAllCheck}
                            />
                            <span className={styles.agreeList}>전체 동의합니다</span>
                        </div>
                        {AGREE_LIST.map((list) => (
                            <Fragment key={list.id}>
                                <div className={styles.agreementListInfoBox}>
                                    <AiOutlineCheckCircle
                                        className={isClick.includes(list.id) ? styles.checkButton : styles.disabled}
                                        onClick={() => makeButtonCheck(list.id)}
                                    />
                                    <span className={styles.agreeList}>{list.title}</span>
                                </div>
                                <p className={styles.agreeDetail}>{list.info}</p>
                            </Fragment>
                        ))}
                        <div className={styles.agreeDetails}>
                            본인은 만 14세 이상이며, 이용약관, 개인정보 수집 및 이용을 확인하였으며, 동의합니다.
                        </div>
                    </div>
                </div>
                <button className={styles.inputButton} onClick={signupClick}>
                    가입하기
                </button>
            </div>
        </form>
    );
};

export default SignupPage;
