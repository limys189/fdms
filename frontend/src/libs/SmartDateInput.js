/*
>> Prop	설명
value            : 외부 상태로 제어 가능 (controlled)
onChange(string) : 값 변경 시 호출
...props         : 모든 기본 input 속성 사용 가능


🧩 사용 예시
입력	포커스 아웃 시 자동 포맷된 값
20250416	2025-04-16
20250416112233	2025-04-16 11:22:33
*/

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

function formatDate(value) {
  if ( value === '' || value == null || value === undefined ) {
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

const SmartDateInput = forwardRef(
  (
    {
      value = 0,
      onChange,
      onEnter, // 포커스 자동 이동을 위한 콜백
      ...props
    },
    ref
  ) => {
    const inputRef = useRef();
    const [rawValue, setRawValue] = useState(value?.toString() || "");
    const [displayValue, setDisplayValue] = useState("");
    const [focused, setFocused] = useState(false);
    const regex = new RegExp('[-:T\\s]', 'g');

    // 외부에서 ref로 접근 가능하게 expose
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      get value() {
        return formatDate(rawValue);
      },
    }));

    useEffect(() => {
      if (!focused) {
        setRawValue(value?.toString() || "");
        setDisplayValue(formatDate(unformatDate(value)));
      }
    }, [value, focused]);

    const handleChange = (e) => {
      const input = e.target.value.replace(/[^\d]/g, "");
      if (regex.test(input)) {
        if (input === "") {
          setRawValue("");
          setDisplayValue("");
          onChange?.(null);
          return;
        }

        setRawValue(input);
        setDisplayValue(input);
        onChange?.(input);
      }
     };

    const handleFocus = () => {
      setFocused(true);
      setDisplayValue(unformatDate(rawValue));
    };

    const handleBlur = () => {
      setFocused(false);

      if (rawValue === "" || rawValue == null || rawValue === undefined) {
        setRawValue("");
        setDisplayValue(formatDate(unformatDate("")));
        onChange?.("");
      } else {
        setDisplayValue(formatDate(unformatDate(rawValue)));
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onEnter?.(); // 포커스 이동
      }
    };

    return (
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

export default SmartDateInput;
