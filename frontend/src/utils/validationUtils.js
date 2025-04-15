/**
 * 필수 항목 체크
 * @param {string} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

/**
 * 최소 길이 체크 (문자 단위)
 * @param {string} value
 * @param {number} minLength
 * @returns {boolean}
 */
export const checkMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * 최소 바이트 길이 체크 (UTF-8 기준)
 * @param {string} value
 * @param {number} minBytes
 * @returns {boolean}
 */
export const checkMinByteLength = (value, minBytes) => {
  if (!value) return false;
  let byteLength = 0;
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    byteLength += (charCode > 128) ? 3 : 1;
  }
  return byteLength >= minBytes;
};

/**
 * 바이트 길이 체크 (UTF-8 기준)
 * @param {string} value
 * @param {number} maxBytes
 * @returns {boolean}
 */
export const checkByteLength = (value, maxBytes) => {
  if (!value) return true;
  let byteLength = 0;
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    byteLength += (charCode > 128) ? 3 : 1;
  }
  return byteLength <= maxBytes;
};

/**
 * 한글 전용 체크
 * @param {string} value
 * @returns {boolean}
 */
export const isKorean = (value) => {
  if (!value) return true;
  return /^[가-힣\s]+$/.test(value);
};

/**
 * 영문 대문자 + 숫자 체크
 * @param {string} value
 * @returns {boolean}
 */
export const isUpperCaseAlphanumeric = (value) => {
  if (!value) return true;
  return /^[a-zA-Z0-9_]+$/.test(value);
};

/**
 * 단일 날짜 유효성 체크 (yyyy-mm-dd)
 * @param {string} date
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  if (!date) return true;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year &&
         d.getMonth() === month - 1 &&
         d.getDate() === day;
};

/**
 * 날짜 범위 체크
 * @param {string} startDate
 * @param {string} endDate
 * @returns {boolean}
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  if (!isValidDate(startDate)) return false;
  if (!isValidDate(endDate)) return false;

  return new Date(startDate) <= new Date(endDate);
};

/**
 * 전화번호 유효성 체크
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return true;
  return /^(0[2-9][0-9]?)-?([1-9][0-9]{2,3})-?([0-9]{4})$/.test(phone);
};

/**
 * 통합 유효성 검사
 * @param {object} rules
 * @param {object} values
 * @returns {object} errors
 */
export const validate = (rules, values) => {
  const errors = {};

  Object.keys(rules).forEach(key => {
    const value = values[key];
    const rule = rules[key];

    if (rule.required && !isRequired(value)) {
      errors[key] = rule.requiredMessage || '필수 입력 항목입니다';
      return;
    }

    if (value) {
      // 최소 길이 체크
      if (rule.minLength && !checkMinLength(value, rule.minLength)) {
        errors[key] = rule.minLengthMessage || `최소 ${rule.minLength}자 이상 입력해야 합니다`;
      }
      // 최소 바이트 길이 체크
      else if (rule.minBytes && !checkMinByteLength(value, rule.minBytes)) {
        errors[key] = rule.minBytesMessage || `최소 ${rule.minBytes}바이트 이상 입력해야 합니다`;
      }
      if (rule.maxBytes && !checkByteLength(value, rule.maxBytes)) {
        errors[key] = `최대 ${rule.maxBytes}바이트까지 입력 가능합니다`;
      }
      else if (rule.koreanOnly && !isKorean(value)) {
        errors[key] = '한글만 입력 가능합니다';
      }
      else if (rule.upperCaseOnly && !isUpperCaseAlphanumeric(value)) {
        errors[key] = '영문 대문자와 숫자만 입력 가능합니다';
      }
      else if (rule.date && !isValidDate(value)) {
        errors[key] = '유효한 날짜 형식이 아닙니다 (yyyy-mm-dd)';
      }
      else if (rule.phone && !isValidPhone(value)) {
        errors[key] = '유효한 전화번호 형식이 아닙니다';
      }
    }
  });

  // 날짜 범위 체크 (특수 규칙)
  if (rules.startDate?.dateRange && rules.endDate?.dateRange) {
    if (!isValidDateRange(values.startDate, values.endDate)) {
      errors.dateRange = '종료일은 시작일 이후여야 합니다';
    }
  }

  return errors;
};
