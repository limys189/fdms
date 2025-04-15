import axios from "axios";
import { encrypt, decrypt } from "../utils/encryptionUtil";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
//const API_URL = "/api";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

/*
// 요청 인터셉터 - 토큰 추가 및 데이터 암호화
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // POST 요청일 경우 데이터 암호화
    if (config.method === "post" && config.data) {
      if (config.url !== "/auth/login" && config.url !== "/auth/register") {
        const encryptedData = encrypt(config.data.data);
        config.data.data = encryptedData;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 데이터 복호화
apiClient.interceptors.response.use(
  (response) => {
    // 로그인/회원가입 응답이 아닌 경우 데이터 복호화
    if (response.config.url !== "/auth/login" && response.config.url !== "/auth/register") {
      if (response.data && response.data.data) {
        const decryptedData = decrypt(response.data.data);
        try {
          response.data.data = JSON.parse(decryptedData);
        } catch (e) {
          response.data.data = decryptedData;
        }
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/




/*
// 공통 API 호출 함수
export const executeQuery = async (queryId, params) => {
  try {
    const response = await apiClient.post("/common/execute", {
      queryId,
      data: JSON.stringify(params)
    });
    return response.data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
};
*/

// REST-API POST 호출
export const callPostApi = async (params) => {
  try {
    const response = await apiClient.post("/common/execute", JSON.stringify(params));
//    const response = await axios.post(`${API_URL}/common/execute`, params);
//    console.log('결과 :::', response);
    return response.data.data || response.data; // 백엔드 응답 구조에 따라 조정
  } catch (error) {
    console.error('서비스 호출 시 오류 발생하였습니다. :: ', error);
    throw error; // 상위 컴포넌트에서 처리할 수 있도록 에러 전파
  }
};

// 인증 관련 API
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post("/auth/login", { username, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (userData) => {
    return await apiClient.post("/auth/register", userData);
  }
};
