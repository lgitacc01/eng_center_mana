import axios from 'axios';

// Tạo một instance Axios
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL cơ sở của backend
  headers: {
    'Content-Type': 'application/json',
    // Bạn có thể thêm các headers mặc định khác ở đây
    // ví dụ: 'Authorization': 'Bearer ' + token
  }
});

export default api;