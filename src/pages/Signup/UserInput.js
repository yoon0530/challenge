import React from 'react';
import styles from './UserInput.module.css';

const UserInput = ({
                       title,
                       placeholder,
                       info,
                       name,
                       phoneNumber,
                       handleInfo,
                       check,
                       type,
                   }) => {
    return (
        <>
            <div className={styles.UserInput}>
                <p className={styles.inputTitle}>
                    {title}
                    <span className={styles.fontRed}>*</span>
                </p>
                <input
                    name={name}
                    placeholder={placeholder}
                    className={styles.inputBox}
                    onChange={handleInfo}
                    type={type}
                />
            </div>
            <div className={styles.inputAdd}>{info}</div>
            {title === '비밀번호 확인' && (
                <div className={styles.inputAdd}>
                    {check ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                </div>
            )}
        </>
    );
};

export default UserInput;
