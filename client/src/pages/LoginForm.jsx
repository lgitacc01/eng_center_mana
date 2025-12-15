import React from 'react';
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Label } from "../components/ui/label.jsx";
import { Alert, AlertDescription } from "../components/ui/alert.jsx";
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig.js'; // <-- IMPORT CẤU HÌNH API THẬT
import { useAuth } from './AuthProvider.jsx';

export default function LoginForm() {
  const [username, setUsername] = useState(''); // Đổi từ 'email' thành 'username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Giữ nguyên 'error' để hiển thị lỗi
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading
  // const { login, isLoading } = useAuth(); // Loại bỏ useAuth
  const navigate = useNavigate();
  const { setUserAfterLogin } = useAuth();

  // Logic đăng nhập thật từ LoginPage.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Bắt đầu loading

    try {
      // Gọi API, backend sẽ trả về { accessToken, refreshToken, role, id }
      const response = await api.post('/auth/login', { username, password });

      // 1. LẤY DỮ LIỆU TỪ RESPONSE
      const { accessToken, refreshToken, role, id} = response.data;

      // (Kiểm tra xem backend trả về object user ở đâu, thường là response.data.user)
      const userData = response.data.user || {};

      // 2. LƯU VÀO LOCALSTORAGE
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', response.data.id); // Lưu user ID
      console.log("User ID:", response.data.id);
      // Lưu thêm thông tin hiển thị (dự phòng khi State chưa load kịp)
      // Nếu backend chưa trả về full_name, tạm thời lưu username
      localStorage.setItem('user_name', userData.full_name || userData.name || username);   
      localStorage.setItem('user_email', userData.email || 'email@example.com');
      localStorage.setItem('user_avatar', userData.avatar || '');

      // Nếu API login trả về thông tin user (full_name, email...) thì truyền vào đây.
      // Nếu không, ta truyền tạm ID và Role để AuthProvider xử lý hoặc Sidebar không bị lỗi.
      if (setUserAfterLogin) {
          setUserAfterLogin(response.data.user || {
              id: id,
              role: role,
              name: username, // Tạm thời dùng username nếu chưa có full_name
              // email: ... 
          });
      }

      // 3. ĐIỀU HƯỚNG DỰA TRÊN ROLE
      switch (role) {
        case 1:
          navigate('/admin/dashboard');
          break;
        case 2:
          navigate('/teacher/dashboard');
          break;
        case 3:
          navigate('/student/dashboard');
          break;
        default:
          navigate('/'); // Về trang chủ nếu role không xác định
      }

    } catch (err) {
      // Xử lý lỗi từ backend
      const errorMsg = err.response?.data?.msg || 'Đăng nhập thất bại.';
      setError(errorMsg);
      console.error('Lỗi khi đăng nhập:', err);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Loại bỏ hàm handleDemoLogin

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">DreamClass</h1>
          <p className="text-muted-foreground">Hệ thống quản lý lớp học tiếng Anh</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Nhập thông tin để truy cập hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập / Email</Label> {/* Cập nhật Label */}
                <Input
                  id="username" // Cập nhật ID
                  type="text" // Đổi type cho linh hoạt (hoặc giữ email)
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập hoặc email" // Cập nhật placeholder
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* LOẠI BỎ PHẦN ĐĂNG NHẬP DEMO */}
            {/*
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Hoặc thử demo:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                ... (Buttons demo)
              </div>
            </div>
            */}
          </CardContent>
        </Card>

        {/* Nút quay lại Landing Page  */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}