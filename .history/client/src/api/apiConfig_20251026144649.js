// File: services/apiConfig.js

import axios from 'axios';

// 1. TẠO INSTANCE AXIOS
const api = axios.create({
  // URL gốc của backend (KHÔNG CÓ /api)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // 👈 ĐÃ SỬA
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. INTERCEPTOR GỬI REQUEST (Gắn accessToken)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. INTERCEPTOR NHẬN RESPONSE (Xử lý khi accessToken hết hạn)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi 401 và chưa thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // GỌI API /auth/refresh
        // Lưu ý: Đường dẫn này phải khớp với cách bạn gọi login,
        // ví dụ: nếu bạn login bằng '/auth/login' thì refresh là '/auth/refresh'
        const rs = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { // 👈 ĐÃ SỬA
          token: refreshToken,
        });

        // Lấy accessToken mới
        const { accessToken: newAccessToken } = rs.data;

        // Lưu token mới
        localStorage.setItem('accessToken', newAccessToken);

        // Cập nhật header và gọi lại request gốc
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);

      } catch (_error) {
        // NẾU REFRESH TOKEN HẾT HẠN
        console.error("Refresh token không hợp lệ hoặc đã hết hạn.");
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        
        // Đẩy về trang login (giả sử trang login của bạn là /login)
        window.location.href = '/login'; 
        
        return Promise.reject(_error);
      }
    }

    // Trả về các lỗi khác
    return Promise.reject(error);
  }
);

// 4. EXPORT INSTANCE
export default api;