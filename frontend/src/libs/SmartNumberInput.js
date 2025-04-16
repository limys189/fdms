/*
✅ 소수점 자리수 지정
✅ 백분율 표시 여부 (%)
✅ 자동 단위 붙이기 (예: 만, 억)
✅ 최대/최소값 제한
>> Prop	설명
value            : 외부 상태로 제어 가능 (controlled)
onChange(number) : 값 변경 시 호출
decimalScale     : 소수점 자리수 (default: 2)
allowDecimal     : 소수 허용 여부 (default: true)
usePercent       : % 표시 여부
useUnit          : 단위 표시 (만, 억) 여부
min, max         : 최소/최대값 제한 범위
prefix           : 숫자 앞에 붙일 문자열 예)
suffix           : 숫자 뒤에 붙일 문자열
...props         : 모든 기본 input 속성 사용 가능


예)
<SmartNumberInput decimalScale={2} />                       // 금액 (소수점 2자리)
<SmartNumberInput decimalScale={0} min={0} max={100000} />  // 정수 금액
<SmartNumberInput decimalScale={1} usePercent={true} />     // 백분율 (%)
<SmartNumberInput decimalScale={2} useUnit={true} />        // 자동 단위 (만, 억)
<SmartNumberInput
  value={amount}
  onChange={(val) => setAmount(val)}
  decimalScale={2}
  useUnit={true}
  placeholder="금액을 입력하세요"
/>
<SmartNumberInput
  value={val1}
  onChange={setVal1}
  decimalScale={2}
  onEnter={() => input2Ref.current?.focus()}
/>
<SmartNumberInput
  value={val2}
  onChange={setVal2}
  decimalScale={2}
  ref={input2Ref}
/>
*/

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

const formatWithUnit = (value, useUnit = false) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "";

  if (!useUnit) return num.toLocaleString();

  if (num >= 1_0000_0000) return (num / 1_0000_0000).toFixed(2) + "억";
  if (num >= 1_0000) return (num / 1_0000).toFixed(2) + "만";
  return num.toLocaleString();
};

const formatDisplay = (value, decimalScale = 2, usePercent = false, useUnit = false, allowDecimal = true, prefix = '', suffix = '') => {
  if (!value && value !== 0) return "";
  const num = parseFloat(value);
  if (isNaN(num)) return "";

  const fixed = num.toFixed(decimalScale);
  let display = useUnit
    ? formatWithUnit(fixed, true)
    : (prefix?prefix:'') + Number(fixed).toLocaleString(undefined, {
        minimumFractionDigits: allowDecimal ? decimalScale : 0,
        maximumFractionDigits: allowDecimal ? decimalScale : 0,
      }) + (suffix?suffix:'');

  return usePercent ? display + "%" : display;
};

const SmartNumberInput = forwardRef(
  (
    {
      value = 0,
      onChange,
      decimalScale = 2,
      allowDecimal = true,
      usePercent = false,
      useUnit = false,
      min = null,
      max = null,
      prefix = '',
      suffix = '',
      onEnter, // 포커스 자동 이동을 위한 콜백
      ...props
    },
    ref
  ) => {
    const inputRef = useRef();
    const [rawValue, setRawValue] = useState(value?.toString() || "");
    const [displayValue, setDisplayValue] = useState("");
    const [focused, setFocused] = useState(false);
    const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalScale}}$`);

    // 외부에서 ref로 접근 가능하게 expose
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      get value() {
        return parseFloat(rawValue);
      },
    }));

    useEffect(() => {
      if (!focused) {
        setRawValue(value?.toString() || "");
        setDisplayValue(formatDisplay(value, decimalScale, usePercent, useUnit, allowDecimal, prefix, suffix));
      }
    }, [value, focused, decimalScale, usePercent, useUnit]);

    const handleChange = (e) => {
      const input = e.target.value.replace(/[^\d.]/g, "");
      if (regex.test(input)) {
        if (input === "") {
          setRawValue("");
          setDisplayValue("");
          onChange?.(null);
          return;
        }

        const num = parseFloat(input);
        if (
          (min !== null && num < min) ||
          (max !== null && num > max)
        ) {
          return;
        }

        setRawValue(input);
        setDisplayValue(input);
        onChange?.(num);
      }
    };

    const handleFocus = () => {
      setFocused(true);
      setDisplayValue(rawValue);
    };

    const handleBlur = () => {
      setFocused(false);

      if (rawValue === "" || rawValue == null || rawValue == undefined) {
        setRawValue("0");
        setDisplayValue(formatDisplay(0, decimalScale, usePercent, useUnit, allowDecimal, prefix, suffix));
        onChange?.(0);
      } else {
        setDisplayValue(formatDisplay(rawValue, decimalScale, usePercent, useUnit, allowDecimal, prefix, suffix));
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onEnter?.(); // 포커스 이동
      }
    };

    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal" // 모바일 키패드 유도
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="form-input"
        style={{ textAlign: 'right' }}
        {...props}
      />
    );
  }
);

export default SmartNumberInput;
