// libs/userSession.js
import { useState, useEffect } from 'react';

const useUserSession = () => {
  // 세션 상태 초기화
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로그인 처리
  const login = (credentials) => {
    setIsLoading(true);
    try {
      // 실제로는 API 호출이 들어가는 부분
      const mockUserData = {
        USR_ID: credentials?.username || 'AAA',
        USR_NM: '홍길동',
        USER_AUTH: '99', // 99:시스템관리자
        CO_CD: '0000000000',
        ACCESS_TOKEN: 'mock-access-token',
        REFRESH_TOKEN: 'mock-refresh-token',
        loginTime: new Date().toISOString()
      };

      setUserInfo(mockUserData);
      sessionStorage.setItem('userSession', JSON.stringify(mockUserData));
      setError(null);
      return mockUserData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const logout = () => {
    sessionStorage.removeItem('userSession');
    setUserInfo(null);
  };

  // 세션 유효성 검사
  const validateSession = () => {
    if (!userInfo) return false;

    // 토큰 유효기간 체크 (예시)
    const now = new Date();
    const loginTime = new Date(userInfo.loginTime);
    const sessionDuration = 2 * 60 * 60 * 1000; // 2시간

    return now - loginTime < sessionDuration;
  };

  // 권한 체크
  const hasPermission = (requiredAuth) => {
    if (!userInfo) return false;
    return userInfo.USER_AUTH >= requiredAuth;
  };

  // 초기 세션 로드 (컴포넌트 마운트 시)
  useEffect(() => {
    const loadSession = () => {
      try {
        const savedSession = sessionStorage.getItem('userSession');
        if (savedSession) {
          setUserInfo(JSON.parse(savedSession));
        }
      } catch (err) {
        console.error('세션 로드 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  return {
    userInfo,
    isLoading,
    error,
    login,
    logout,
    validateSession,
    hasPermission,
    isAuthenticated: !!userInfo && validateSession()
  };
};

export default useUserSession;
