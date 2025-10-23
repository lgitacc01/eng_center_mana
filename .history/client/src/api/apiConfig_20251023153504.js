import axios from 'axios';

// Tạo một instance Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // URL cơ sở của backend
  headers: {
    'Content-Type': 'application/json',
    // Bạn có thể thêm các headers mặc định khác ở đây
    // ví dụ: 'Authorization': 'Bearer ' + token
  }
});

export default apiClient;