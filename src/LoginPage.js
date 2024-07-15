import React from 'react';
import { useAuth } from './AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input type="text" placeholder="행성등록번호" />
          <input type="text" placeholder="이름" />
          <input type="password" placeholder="비밀번호" />
          <button type="submit">노동 시작</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
