/*
🧩 사용 예시

입력	포커스 아웃 시 자동 포맷된 값
20250416	2025-04-16
20250416112233	2025-04-16 11:22:33
*/

import React, { useEffect, useState } from 'react';

function formatDate(value) {
  if ( value === '' || value == null || value == undefined ) {
    return '';
  }

  if (/^\d{8}$/.test(value)) {
    const yyyy = value.slice(0, 4);
    const mm = value.slice(4, 6);
    const dd = value.slice(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  } else if (/^\d{14}$/.test(value)) {
    const yyyy = value.slice(0, 4);
    const mm = value.slice(4, 6);
    const dd = value.slice(6, 8);
    const hh = value.slice(8, 10);
    const mi = value.slice(10, 12);
    const ss = value.slice(12, 14);
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }
  return value;
}

function unformatDate(value) {
  return value ? value.replace(/[^\d]/g, '') : '';
}

export function SmartDateInput({ value, onChange }) {
  const [innerValue, setInnerValue] = useState(formatDate(value));

  useEffect(() => {
    setInnerValue(formatDate(value));
  }, [value]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    setInnerValue(rawValue);
    onChange(unformatDate(rawValue));
  };

  const handleFocus = () => {
    setInnerValue(unformatDate(innerValue));
  };

  const handleBlur = () => {
    setInnerValue(formatDate(unformatDate(innerValue)));
  };

  return (
    <input
      type="text"
      value={innerValue}
      onChange={handleInputChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="form-input"
      disabled
    />
  );
}
export default SmartDateInput;
