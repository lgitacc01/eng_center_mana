import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiConfig";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Khi App tải lần đầu, kiểm tra localStorage để khôi phục phiên đăng nhập
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (token && userId && userId.length > 0) {
        try {
          // Gọi API lấy thông tin chi tiết user dựa trên ID đã lưu
          const response = await api.get(`/users/${userId}`);
          
          // Giả sử API trả về: { id, full_name, role_id, email, ... }
          // Map dữ liệu từ API sang cấu trúc state mà MainLayout cần
          const userData = {
            id: response.data.id,
            name: response.data.full_name, // MainLayout dùng .name
            email: response.data.email,
            role: response.data.role_id,   // MainLayout dùng .role (1, 2, 3)
            avatar: response.data.avatar || "https://github.com/shadcn.png" // Avatar mặc định nếu không có
          };
          
          setUser(userData);
        } catch (error) {
          console.error("Phiên đăng nhập hết hạn hoặc lỗi mạng:", error);
          // Nếu lỗi (token hết hạn), xóa localStorage
          localStorage.clear();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkLogin();
  }, []);

  // 2. Hàm Logout
  const logout = () => {
    localStorage.clear(); // Xóa toàn bộ token
    setUser(null);
    navigate("/login", { replace: true });
  };

  // 3. Hàm cập nhật User thủ công (Dùng cho LoginForm sau khi đăng nhập thành công)
  // LoginForm sẽ gọi hàm này để cập nhật state ngay lập tức mà không cần F5
  const setUserAfterLogin = (userDataFromLogin) => {
      // userDataFromLogin cần chứa: { id, full_name, role_id, ... }
      setUser({
        id: userDataFromLogin.id,
        name: userDataFromLogin.full_name,
        email: userDataFromLogin.email,
        role: userDataFromLogin.role_id,
        avatar: userDataFromLogin.avatar || "https://github.com/shadcn.png"
      });
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, setUserAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}