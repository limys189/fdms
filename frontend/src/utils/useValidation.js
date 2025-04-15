import { useState, useEffect } from 'react';
import { validate } from './validationUtils';     // 공통 유효성 검사 라이브러리

export const useValidation = (refs, externalSetError = null) => {
  const [internalError, setInternalError] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);

  const validateFields = (area, rules, values) => {
//    console.log('useValidation.js  ::  refs ', refs);
//    console.log('useValidation.js  ::  area ', area);
//    console.log('useValidation.js  ::  rules ', rules);
//    console.log('useValidation.js  ::  values ', values);
    const errors = validate(rules, values);
    if (errors && Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];
      const errorMessage = errors[firstError];

      // 내부 상태와 외부 상태 동시 업데이트
      setInternalError(errorMessage);
      if (externalSetError) externalSetError(errorMessage);
      setFocusTarget(area ? refs[area][firstError] : refs[firstError]);
//      console.log('useValidation.js  ::  false :: internalError ', errorMessage);
//      console.log('useValidation.js  ::  false :: focusTarget ', area ? refs[area][firstError] : refs[firstError]);
      return false;
    }

    // 검사 통과 시 오류 초기화
    setInternalError(null);
    if (externalSetError) externalSetError(null);
    return true;
  };

  // 포커스 이동
  useEffect(() => {
    if (focusTarget?.current) {
//      console.log('useValidation.js  ::  useEffect :: 포커스이동  :: ', focusTarget?.current);
      focusTarget.current.focus();
      setFocusTarget(null);
    }
  }, [focusTarget]);

  return {
    error: externalSetError ? null : internalError, // 외부 제어시 내부 error는 무시
    validateFields
  };
};
