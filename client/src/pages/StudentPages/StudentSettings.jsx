import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from '../../components/ui/badge';
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import { Switch } from "../../components/ui/switch";

import { 
  User, 
  Bell, 
  Lock, 
  Palette,
  Globe,
  Shield,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Key,
  Music,
  Book,
  Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    birthday: '',
    address: '',
    nickname: '',
    favoriteSubject: '',
    hobby: '',
    avatar: ''
  });

  // State cho mật khẩu (Thêm mới)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- 1. LẤY DỮ LIỆU TỪ API KHI LOAD TRANG ---
  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await api.get(`/users/${userId}`);
        const data = res.data;
        
        // Cập nhật state từ dữ liệu thật
        setProfile({
          name: data.full_name || '',
          email: data.email || '',
          username: data.username || '',
          phone: data.phone || '', // SĐT học sinh
          // Các trường dưới đây nếu DB chưa có thì để trống hoặc cập nhật thêm vào Model
          birthday: data.birthday ? data.birthday.split('T')[0] : '', 
          address: data.address || '',
          nickname: data.nickname || '',
          favoriteSubject: data.favoriteSubject || '',
          hobby: data.hobby || '',
          avatar: data.avatar || ''
        });
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      }
    };

    fetchProfile();
  }, []);

  // --- 2. HÀM LƯU THÔNG TIN (GỌI API PUT) ---
  const handleSaveProfile = async () => {
    const userId = localStorage.getItem('userId');
    setLoading(true);
    try {
        // Gửi dữ liệu lên Server để cập nhật
        await api.put(`/users/${userId}`, {
            full_name: profile.name,
            phone: profile.phone,
            // Thêm các trường khác nếu Backend User Controller đã hỗ trợ update
            // address: profile.address, ...
        });
        
        // Cập nhật lại LocalStorage để Sidebar cũng đổi theo ngay lập tức
        localStorage.setItem('user_name', profile.name);
        localStorage.setItem('user_avatar', profile.avatar);
        
        // Reload trang để thấy thay đổi trên Sidebar (hoặc dùng Context để mượt hơn)
        window.location.reload(); 
        
        alert('Đã lưu thông tin cá nhân thành công!');
    } catch (error) {
        console.error(error);
        alert('Lỗi khi lưu thông tin');
    } finally {
        setLoading(false);
    }
  };

  // --- 3. ĐỔI MẬT KHẨU (LOGIC MỚI) ---
  const handlePasswordChange = async () => {
    // Validate
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

    const userId = localStorage.getItem('userId');
    setLoading(true);

    try {
      // Gọi API đổi mật khẩu (Dùng chung route với Teacher)
      await api.put(`/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications:'',
    assignmentReminders:'',
    gradeNotifications:'',
    classUpdates:'',
    achievementAlerts:'',
    weeklyReport:''
  });


  // App settings
  const [appSettings, setAppSettings] = useState({
    language: 'vi',
    theme: 'light',
    soundEffects:'',
    animations:'',
    autoSave:''
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile:'',
    showProgress:'',
    showBadges:'',
    allowMessages:''
  });

  const handleSaveNotifications = () => {
    toast.success('Đã cập nhật cài đặt thông báo! 🔔');
  };

  const handleSaveAppSettings = () => {
    toast.success('Đã cập nhật cài đặt ứng dụng! ⚙️');
  };

  const handleSavePrivacy = () => {
    toast.success('Đã cập nhật cài đặt riêng tư! 🔒');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cài đặt ⚙️</h2>
            <p className="text-purple-100">
              Tùy chỉnh thông tin và cài đặt cá nhân của {profile.name || 'bé'}
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="app">
            <Palette className="w-4 h-4 mr-2" />
            Ứng dụng
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Riêng tư
          </TabsTrigger>
        </TabsList>

        {/* Tab: Hồ sơ */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin của bé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    {profile.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Đổi ảnh đại diện
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG. Tối đa 2MB
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên đầy đủ</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Tên thân mật</Label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="nickname"
                      value={profile.nickname}
                      onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Ngày sinh</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="birthday"
                      type="date"
                      value={profile.birthday}
                      onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favoriteSubject">Môn học yêu thích</Label>
                  <div className="relative">
                    <Book className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="favoriteSubject"
                      value={profile.favoriteSubject}
                      onChange={(e) => setProfile({ ...profile, favoriteSubject: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hobby">Sở thích</Label>
                  <div className="relative">
                    <Music className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="hobby"
                      value={profile.hobby}
                      onChange={(e) => setProfile({ ...profile, hobby: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                {loading ? 'Đang lưu...' : 'Lưu thông tin'}
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Đổi mật khẩu
              </CardTitle>
              <CardDescription>
                Bảo mật tài khoản của bé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật khẩu hiện tại</Label>
                <Input 
                  type="password" 
                  placeholder="******" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu mới</Label>
                <Input 
                  type="password" 
                  placeholder="******" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Xác nhận mật khẩu mới</Label>
                <Input 
                  type="password" 
                  placeholder="******" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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
        </TabsContent>

        {/* Tab: Thông báo */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý các thông báo bé nhận được
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Thông báo qua Email</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo quan trọng qua email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Nhắc nhở bài tập</p>
                      <p className="text-sm text-muted-foreground">
                        Nhắc nhở khi có bài tập sắp đến hạn
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.assignmentReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, assignmentReminders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Thông báo điểm số</p>
                      <p className="text-sm text-muted-foreground">
                        Thông báo khi có điểm mới
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.gradeNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, gradeNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cập nhật lớp học</p>
                      <p className="text-sm text-muted-foreground">
                        Thông báo về lịch học và thay đổi
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.classUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, classUpdates: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Thông báo thành tích</p>
                      <p className="text-sm text-muted-foreground">
                        Thông báo khi đạt huy hiệu mới
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.achievementAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, achievementAlerts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Báo cáo hàng tuần</p>
                      <p className="text-sm text-muted-foreground">
                        Tổng kết tiến độ học tập mỗi tuần
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, weeklyReport: checked})
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                Lưu cài đặt thông báo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ứng dụng */}
        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt ứng dụng</CardTitle>
              <CardDescription>
                Tùy chỉnh trải nghiệm sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <select
                    id="language"
                    value={appSettings.language}
                    onChange={(e) => setAppSettings({ ...appSettings, language: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label htmlFor="theme">Giao diện</Label>
                <div className="relative">
                  <Palette className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <select
                    id="theme"
                    value={appSettings.theme}
                    onChange={(e) => setAppSettings({ ...appSettings, theme: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                  >
                    <option value="light">Sáng</option>
                    <option value="dark">Tối</option>
                    <option value="auto">Tự động</option>
                  </select>
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hiệu ứng âm thanh</p>
                      <p className="text-sm text-muted-foreground">
                        Bật âm thanh khi tương tác
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.soundEffects}
                    onCheckedChange={(checked) => 
                      setAppSettings({ ...appSettings, soundEffects: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hiệu ứng động</p>
                      <p className="text-sm text-muted-foreground">
                        Bật animation trong ứng dụng
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.animations}
                    onCheckedChange={(checked) => 
                      setAppSettings({ ...appSettings, animations: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tự động lưu</p>
                      <p className="text-sm text-muted-foreground">
                        Tự động lưu tiến độ học tập
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.autoSave}
                    onCheckedChange={(checked) => 
                      setAppSettings({ ...appSettings, autoSave: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveAppSettings} className="w-full">
                Lưu cài đặt ứng dụng
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Riêng tư */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt riêng tư</CardTitle>
              <CardDescription>
                Quản lý quyền riêng tư và bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hiện thông tin cá nhân</p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép bạn bè xem thông tin
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.showProfile}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, showProfile: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hiện tiến độ học tập</p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép xem điểm số và tiến độ
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.showProgress}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, showProgress: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Hiện huy hiệu</p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép xem các thành tích đạt được
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.showBadges}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, showBadges: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cho phép nhắn tin</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận tin nhắn từ giáo viên và bạn bè
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy({ ...privacy, allowMessages: checked })
                    }
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý về bảo mật</p>
                    <p>
                      Thông tin của bé được bảo vệ theo quy định của DreamClass. 
                      Phụ huynh có thể quản lý toàn bộ quyền riêng tư.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePrivacy} className="w-full">
                Lưu cài đặt riêng tư
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
