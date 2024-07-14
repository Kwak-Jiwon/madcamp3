// React와 필요한 훅(createContext, useState, useContext)을 불러옵니다.
import React, { createContext, useState, useContext } from 'react';

// AuthContext를 생성합니다. 이를 통해 인증 상태를 전역적으로 관리할 수 있습니다.
const AuthContext = createContext();

// AuthProvider 컴포넌트를 정의합니다. 이 컴포넌트는 자식 컴포넌트에게 인증 상태를 제공하기 위해 사용됩니다.
export const AuthProvider = ({ children }) => {
  // isLoggedIn 상태와 이를 업데이트할 setIsLoggedIn 함수를 useState 훅을 사용하여 정의합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // AuthContext.Provider를 사용하여 자식 컴포넌트들에게 isLoggedIn과 setIsLoggedIn을 제공합니다.
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅을 정의합니다. 이 훅을 사용하면 AuthContext의 값을 쉽게 사용할 수 있습니다.
export const useAuth = () => useContext(AuthContext);
