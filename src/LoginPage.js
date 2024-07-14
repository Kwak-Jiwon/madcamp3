// src/LoginPage.js
import React from 'react';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const { setIsLoggedIn } = useAuth();

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: '300px',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2>로그인</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <input type="text" placeholder="행성등록번호" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="이름" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="비밀번호" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#0f0f0f', color: '#0df', cursor: 'pointer' }}>노동 시작</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;