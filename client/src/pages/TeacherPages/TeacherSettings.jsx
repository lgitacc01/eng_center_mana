import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
// import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Settings,
  User,
  Bell,
  Shield,
  // Eye,
  Upload,
  Save,
  Trash2,
  Key,
  Mail,
  // Phone,
  Clock,
  BookOpen,
  Palette,
  Volume2,
  // Moon,
  // Sun,
} from "lucide-react";

export default function TeacherSettings() {
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    specialization: "",
    bio: "",   
    department: "",
    avatar: "",
    joinDate: "",
    classCount: 0,
    studentCount: 0
  });

  // --- 1. LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        // Gọi song song 2 API: Thông tin cá nhân & Danh sách lớp
        const [userRes, classRes] = await Promise.all([
            api.get(`/users/${userId}`),
            api.get('/classes') // Backend đã tự lọc lớp của GV này
        ]);

        const userData = userRes.data;
        const classesData = classRes.data;

        // Tính toán số học sinh
        // Cộng tổng số lượng học sinh (students.length) của tất cả các lớp
        const totalStudents = classesData.reduce((sum, cls) => {
            return sum + (cls.students ? cls.students.length : 0);
        }, 0);
        
        setProfile({
          name: userData.full_name || '',
          email: userData.email || '',
          username: userData.username || '',
          phone: userData.phone || '',
          specialization: userData.specialization || '',
          avatar: userData.avatar || '',
          // Các trường chưa có trong DB thì để trống hoặc giữ mock nếu muốn
          bio: userData.bio || "Giáo viên tiếng Anh với 5 năm kinh nghiệm giảng dạy, IELTS = 8.5", 
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : "N/A",
          classCount: classesData.length,
          studentCount: totalStudents
        });
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. LƯU THÔNG TIN (GỌI API) ---
  const handleProfileSave = async () => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    try {
      await api.put(`/users/${userId}`, {
        full_name: profile.name,
        phone: profile.phone,
        specialization: profile.specialization,
        bio: profile.bio,
      });
      
      // Cập nhật LocalStorage để Sidebar đổi tên/avatar ngay lập tức
      localStorage.setItem('user_name', profile.name);
      localStorage.setItem('user_avatar', profile.avatar);
      
      alert("Cập nhật thông tin thành công!");
      window.location.reload(); // Reload để thấy thay đổi
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  const [notifications, setNotifications] = useState({
    emailNotifications:'',
    pushNotifications:'',
    classReminders:'',
    gradeUpdates: '',
    assignmentDeadlines: '',
    parentMessages: '',
    systemUpdates: '',
  });

  const [preferences, setPreferences] = useState({
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "dd/mm/yyyy",
    theme: "light",
    soundEnabled: '',
    autoSave: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // --- HÀM XỬ LÝ ĐỔI MẬT KHẨU (SỬA LẠI) ---
  const handlePasswordChange = async () => {
    // 1. Validate cơ bản ở Frontend
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    // 2. Gọi API
    const userId = localStorage.getItem('userId');
    setLoading(true);

    try {
      await api.put(`/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      alert("Đổi mật khẩu thành công!");
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(error);
      // Hiển thị thông báo lỗi từ Backend (ví dụ: Mật khẩu cũ sai)
      alert(error.response?.data?.msg || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = () => {
    toast.success("Cài đặt thông báo đã được lưu!");
  };

  const handlePreferencesSave = () => {
    toast.success("Tùy chọn đã được cập nhật!");
  };

  const handleDeleteAccount = () => {
    toast.success("Yêu cầu xóa tài khoản đã được gửi đến quản trị viên!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin cá nhân và tùy chọn ứng dụng
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân và hồ sơ giảng viên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                    {profile.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Tải ảnh lên
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG hoặc PNG, tối đa 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chuyên môn</Label>
                  <Input 
                    value={profile.specialization} 
                    onChange={(e) => setProfile({...profile, specialization: e.target.value})} 
                    placeholder="VD: Grammar, IELTS, TOEIC..." 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Giới thiệu bản thân</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Mô tả ngắn về kinh nghiệm..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Thông tin giảng dạy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-600 mb-2">📚</div>
                  <p className="text-sm text-muted-foreground">Số lớp đang dạy</p>
                  <p className="text-xl font-semibold">{profile.classCount} lớp</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl text-green-600 mb-2">👥</div>
                  <p className="text-sm text-muted-foreground">Tổng học sinh</p>
                  <p className="text-xl font-semibold">{profile.studentCount} học sinh</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl text-purple-600 mb-2">📅</div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="text-xl font-semibold">{profile.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Chọn loại thông báo muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông báo chung</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>Thông báo qua email</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo quan trọng qua email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        <span>Thông báo đẩy</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo trực tiếp trên ứng dụng
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, pushNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Class Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông báo lớp học</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span>Nhắc nhở lịch dạy</span>
                      <p className="text-sm text-muted-foreground">
                        Nhắc nhở trước 30 phút mỗi buổi học
                      </p>
                    </div>
                    <Switch
                      checked={notifications.classReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, classReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span>Cập nhật điểm số</span>
                      <p className="text-sm text-muted-foreground">
                        Thông báo khi có điểm số mới
                      </p>
                    </div>
                    <Switch
                      checked={notifications.gradeUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, gradeUpdates: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span>Hạn nộp bài tập</span>
                      <p className="text-sm text-muted-foreground">
                        Nhắc nhở khi gần hết hạn nộp bài
                      </p>
                    </div>
                    <Switch
                      checked={notifications.assignmentDeadlines}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, assignmentDeadlines: checked})
                      }
                    />
                  </div>

                  {/* <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span>Tin nhắn từ phụ huynh</span>
                      <p className="text-sm text-muted-foreground">
                        Thông báo khi có tin nhắn mới từ phụ huynh
                      </p>
                    </div>
                    <Switch
                      checked={notifications.parentMessages}
                      onCheckedChange={(checked) =>
                        setNotifications({...notifications, parentMessages: checked })
                      }
                    />
                  </div> */}
                </div>
              </div>

              <Separator />

              {/* System Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Thông báo hệ thống</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span>Cập nhật hệ thống</span>
                    <p className="text-sm text-muted-foreground">
                      Thông báo về tính năng và cập nhật mới
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({...notifications, systemUpdates: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tùy chọn giao diện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ngôn ngữ</Label>
                  <Select value={preferences.language} onValueChange={(value) => 
                    setPreferences({...preferences, language: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Múi giờ</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => 
                    setPreferences({...preferences, timezone: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Bangkok (UTC+7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Định dạng ngày</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => 
                    setPreferences({...preferences, dateFormat: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Chủ đề giao diện</Label>
                  <Select value={preferences.theme} onValueChange={(value) => 
                    setPreferences({...preferences, theme: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="auto">Tự động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tùy chọn khác</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <span>Âm thanh thông báo</span>
                    </div>
                    <Switch
                      checked={preferences.soundEnabled}
                      onCheckedChange={(checked) =>
                        setPreferences({...preferences, soundEnabled: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4 text-muted-foreground" />
                      <span>Tự động lưu</span>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) =>
                        setPreferences({...preferences, autoSave: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePreferencesSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu tùy chọn
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Đổi mật khẩu
              </CardTitle>
              <CardDescription>
                Cập nhật mật khẩu để bảo vệ tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="space-y-2">
                <Label>Xác nhận mật khẩu mới</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handlePasswordChange} className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Bảo mật tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Xác thực 2 lớp</p>
                      <p className="text-sm text-muted-foreground">Đã kích hoạt</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Đăng nhập cuối</p>
                      <p className="text-sm text-muted-foreground">Hôm nay, 14:30</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Xóa tài khoản
              </CardTitle>
              <CardDescription>
                Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">⚠️ Cảnh báo</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Tất cả dữ liệu lớp học sẽ bị xóa</li>
                    <li>• Không thể khôi phục sau khi xóa</li>
                    <li>• Cần liên hệ quản trị viên để xử lý</li>
                  </ul>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Yêu cầu xóa tài khoản
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa tài khoản</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.
                        Yêu cầu sẽ được gửi đến quản trị viên để xử lý.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Gửi yêu cầu
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>      
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}