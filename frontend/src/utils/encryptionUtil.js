import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
const SECRET_IV = process.env.REACT_APP_ENCRYPTION_IV;

// 키와 IV를 바이트 배열로 변환
const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
const iv = CryptoJS.enc.Utf8.parse(SECRET_IV);

export const encrypt = (data) => {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
};

export const decrypt = (encryptedData) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
