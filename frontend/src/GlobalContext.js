import React, { createContext, useMemo, useCallback } from 'react';
import useUserSession    from 'libs/userSession';               // 사용자 세션정보
import { callPostApi }   from "services/apiService";            // REST-API 서비스 호출
import { useValidation } from 'utils/useValidation';            // 유효성 검사 커스텀 훅
import StatusPopup       from 'components/StatusPopup';         // 로딩 및 에러 표시 팝업
import { confirmX }      from "components/WindowsConfirm";      // confirm 다이얼로그 라이브러리
import { themeQuartz }   from 'ag-grid-community';              // 그리드 테마
import { formatByType }  from 'utils/formatters';               // 포맷타입
import SmartNumberInput  from 'libs/SmartNumberInput';          // 금액, 백분율 input 라이브러리
import SmartDateInput    from 'libs/SmartDateInput';            // 날짜, 일시 input 라이브러리



export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  // 사용자 세션정보
  const {
      userInfo,
      isLoading,
      error,
      login,
      logout,
      validateSession,
      hasPermission,
      isAuthenticated
    } = useUserSession();

  // 그리드 테마 설정
  const agGridTheme = useMemo(() => {
    return themeQuartz.withParams({
       browserColorScheme: "light",
       headerHeight: 32,
       rowHeight: 32,
       headerFontSize: 14,
       fontSize: 14,
       spacing: 4,
     });
  }, []);


  // 로그인 핸들러
  const handleLogin = useCallback(async () => {
    try {
      await login({ username: 'MIG', password: '1234' });
      console.log('로그인 성공!');
    } catch (err) {
      console.error('로그인 실패:', err);
    }
  }, [login]);


  // 그리드 콤보 공통코드 셋팅
  const setGridComboVal = (codeDataObj, strComCd) => {
    let tmpCode = [];
    (codeDataObj.find(item => item[strComCd])?.[strComCd] || []).forEach((result)=>{
      var temp = {
        id: result.SML_CD,
        name: result.SML_NM,
      };
      tmpCode.push(temp);
    });
    return tmpCode;
  };


  return (
    <GlobalContext.Provider value={{
      agGridTheme,              // 그리드 테마

      userInfo,                 // 사용자 세션 정보
      isLoading,
      error,
      login,
      logout,
      validateSession,
      hasPermission,
      isAuthenticated,          // 로그인 여부
      handleLogin,              // 로그인 핸들러

      callPostApi,              // REST-API 서비스 호출
      useValidation,            // 유효성 검사 커스텀 훅
      StatusPopup,              // 로딩 및 에러 표시 팝업
      confirmX,                 // confirm 다이얼로그 라이브러리

      setGridComboVal,          // 그리드 콤보 공통코드 셋팅
      formatByType,             // 포맷타입

      SmartNumberInput,         // 금액, 백분율 input 라이브러리
      SmartDateInput,           // 날짜, 일시 display 라이브러리

    }}>
      {children}
    </GlobalContext.Provider>
  );
};
