// src/LoginPage.js
import React,{useState} from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
//const { setIsLoggedIn } = useAuth();   이거 관련 다른 함수들 다 변경해야됨!!!!!!!!!!!!
const LoginPage = () => {
  const { login } = useAuth();
  const [userid, setUserid] = useState('');
  const [userpassword, setUserpassword] = useState('');
  const [error, setError] = useState('');


  // const handleLogin = (event) => {
  //   event.preventDefault();
  //   setIsLoggedIn(true);
  // };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://43.200.215.241:2000/login', { userid, userpassword });
      if (response.data.status === 'success') {
        login(response.data.userid); // 로그인 성공 시 사용자 ID를 설정합니다.
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
     // setError('An error occurred during login.');
    }
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
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <input type="text" placeholder="행성등록번호" value={userid} onChange={(e)=>setUserid(e.target.value)} style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="이름" style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <input type="password" placeholder="비밀번호" value={userpassword}
            onChange={(e) => setUserpassword(e.target.value)} style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#0f0f0f', color: '#0df', cursor: 'pointer' }}>노동 시작</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;