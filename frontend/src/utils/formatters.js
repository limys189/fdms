// utils/formatters.js

/**
 * 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 * @param {string} value - 예: '20250411'
 * @returns {string} 예: '2025-04-11'
 */
export const formatDateString = (value) => {
  if (!value || value.length !== 8) return '';
  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);
  return `${year}-${month}-${day}`;
};

// 날짜: yyyy-MM-dd
export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

// 일시: yyyy-MM-dd HH:mm:ss
export const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString('sv-SE').replace('T', ' '); // "sv-SE" → ISO-like 포맷
};

/**
 * 금액 포맷 함수
 * @param {number} value - 포맷할 값
 * @param {Object} options - 옵션 객체
 * @param {number} [options.minimumFractionDigits=0]
 * @param {number} [options.maximumFractionDigits=2]
 * @param {string} [options.locale='ko-KR']
 * @param {string} [options.currencySymbol=''] - 통화 기호 (예: '₩', '$', '€')
 * @param {boolean} [options.symbolAfter=false] - 기호를 숫자 뒤에 붙일지 여부


 예)
 formatCurrency(123456.789); // "123,457"
 formatCurrency(123456.789, { minimumFractionDigits: 2 }); // "123,456.79"
 formatCurrency(123456.789, { currencySymbol: '₩' }); // "₩123,457"
 formatCurrency(123456.789, { currencySymbol: '$', symbolAfter: true }); // "123,457$"
 */
export const formatCurrency = (
  value,
  {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    locale = 'ko-KR',
    currencySymbol = '',
    symbolAfter = false,
  } = {}
) => {
  if (value === null || value === undefined || isNaN(value)) return '';
  const number = Number(value).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
  return currencySymbol
    ? symbolAfter
      ? `${number}${currencySymbol}`
      : `${currencySymbol}${number}`
    : number;
};

/**
 * 백분율 포맷 함수
 * @param {number} value - 포맷할 값 (예: 0.1234 또는 12.34)
 * @param {Object} options - 옵션 객체
 * @param {boolean} [options.multiply=true] - 100 곱할지 여부 (true: 0.123 → 12.3%)
 * @param {boolean} [options.includeSymbol=true] - % 기호 붙일지 여부
 * @param {number} [options.fractionDigits=2] - 소수점 자리 수


 예)
 formatPercent(0.1234); // "12.34%"
 formatPercent(0.1234, { fractionDigits: 1 }); // "12.3%"
 formatPercent(12.3456, { multiply: false, includeSymbol: false }); // "12.35"
 */
export const formatPercent = (
  value,
  { multiply = true, includeSymbol = true, fractionDigits = 2 } = {}
) => {
  if (value === null || value === undefined || isNaN(value)) return '';
  const numeric = multiply ? value * 100 : value;
  const fixed = numeric.toFixed(fractionDigits);
  return includeSymbol ? `${fixed}%` : fixed;
};

// 기간(기한) 포맷 (예: 12일)
export const formatPer = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '';
  return `${value}일`;
};

export const formatByType = (value, type, options = {}) => {
  switch (type) {
    case 'dateStr': return formatDateString(value);
    case 'date': return formatDate(value);
    case 'datetime': return formatDateTime(value);
    case 'currency': return formatCurrency(value, options);
    case 'percent': return formatPercent(value, options);
    case 'per': return formatPer(value);
    default: return value ?? '';
  }
};
