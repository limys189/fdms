import React, { useState, useEffect } from "react";

/*
✅ 소수점 자리수 지정
✅ 백분율 표시 여부 (%)
✅ 자동 단위 붙이기 (예: 만, 억)
✅ 최대/최소값 제한
>> Prop	설명
value            : 외부 상태로 제어 가능 (controlled)
onChange(number) : 값 변경 시 호출
decimalScale     : 소수점 자리수 (default: 2)
usePercent       : % 표시 여부
useUnit          : 단위 표시 (만, 억) 여부
min, max         : 값 제한 범위
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
*/

const formatWithUnit = (value, useUnit = false) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "";

  if (!useUnit) return num.toLocaleString();

  if (num >= 1_0000_0000) return (num / 1_0000_0000).toFixed(2) + "억";
  if (num >= 1_0000) return (num / 1_0000).toFixed(2) + "만";
  return num.toLocaleString();
};

const formatDisplay = (value, decimalScale = 2, usePercent = false, useUnit = false) => {
  if (!value && value !== 0) return "";
  const num = parseFloat(value);
  if (isNaN(num)) return "";

  const fixed = num.toFixed(decimalScale);
  let display = useUnit
    ? formatWithUnit(fixed, true)
    : Number(fixed).toLocaleString(undefined, {
        minimumFractionDigits: decimalScale,
        maximumFractionDigits: decimalScale,
      });

  return usePercent ? display + "%" : display;
};

const SmartNumberInput = ({
  value,
  onChange,
  decimalScale = 2,
  usePercent = false,
  useUnit = false,
  min = null,
  max = null,
  /*label = "숫자 입력",*/
  ...props
}) => {
  const [rawValue, setRawValue] = useState(value?.toString() || "");
  const [displayValue, setDisplayValue] = useState("");

  const [focused, setFocused] = useState(false);
  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalScale}}$`);

  // ⚡ 외부 value 변경 시 동기화
  useEffect(() => {
    if (!focused) {
      setRawValue(value?.toString() || "");
      setDisplayValue(formatDisplay(value, decimalScale, usePercent, useUnit));
    }
  }, [value, focused, decimalScale, usePercent, useUnit]);

  const handleChange = (e) => {
    const input = e.target.value.replace(/[^\d.]/g, "");
    if (regex.test(input)) {
      if (input === "") {
        setRawValue("");
        setDisplayValue("");
        onChange?.(null); // 외부에 null 전달
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
      onChange?.(num); // 외부로 변경 알림
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setDisplayValue(rawValue);
  };

  const handleBlur = () => {
    setFocused(false);
    setDisplayValue(formatDisplay(rawValue, decimalScale, usePercent, useUnit));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
};

export default SmartNumberInput;
