import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, 
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, 
  useSidebar // <--- 1. Import thêm hook này
} from "../components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { 
  BookOpen, Users, GraduationCap, ClipboardList, BarChart3, Settings, 
  LogOut, Home, FileText, Trophy, Calendar, ShieldCheck, FolderOpen,
} from 'lucide-react';

// --- COMPONENT CHÍNH (VỎ BỌC) ---
export function MainLayout() {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
}

// --- COMPONENT NỘI DUNG (NƠI XỬ LÝ LOGIC) ---
function MainLayoutContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. Lấy hàm setOpenMobile từ hook useSidebar
  const { isMobile, setOpenMobile } = useSidebar(); 

  const isActive = (path) => location.pathname.startsWith(path);

  // 3. Hàm xử lý chuyển trang & đóng menu mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false); // Đóng menu nếu đang ở mobile
    }
  };

  // --- CÁC MENU ITEMS GIỮ NGUYÊN ---
  const adminMenuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home, path: '/admin/dashboard'},
    { id: 'teachers', label: 'Giáo viên', icon: Users, path: '/admin/teachers'},
    { id: 'students', label: 'Học sinh', icon: GraduationCap, path: '/admin/students'},
    { id: 'classes', label: 'Lớp học', icon: BookOpen, path: '/admin/classes'},
    { id: 'materials', label: 'Kiểm duyệt', icon: FolderOpen, path: '/admin/materials'},
    { id: 'reports', label: 'Báo cáo', icon: FileText, path: '/admin/reports'},
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/admin/settings'},
  ];

  const teacherMenuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home, path: '/teacher/dashboard' },
    { id: 'classes', label: 'Lớp học', icon: BookOpen, path: '/teacher/classes' },
    // { id: 'students', label: 'Học sinh', icon: GraduationCap, path: '/teacher/students' },
    { id: 'assignments', label: 'Bài tập', icon: ClipboardList, path: '/teacher/assignments' },
    { id: 'materials', label: 'Tài liệu', icon: FolderOpen, path: '/teacher/materials' },
    { id: 'grades', label: 'Điểm số', icon: BarChart3, path: '/teacher/grades' },
    { id: 'schedule', label: 'Lịch học', icon: Calendar, path: '/teacher/schedule' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/teacher/settings' },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home, path: '/student/dashboard' },
    { id: 'my-classes', label: 'Lớp của tôi', icon: BookOpen, path: '/student/classes' },
    { id: 'assignments', label: 'Bài tập', icon: ClipboardList, path: '/student/assignments' },
    { id: 'materials', label: 'Tài liệu', icon: FolderOpen, path: '/student/materials' },
    { id: 'grades', label: 'Điểm số', icon: Trophy, path: '/student/grades' },
    { id: 'schedule', label: 'Lịch học', icon: Calendar, path: '/student/schedule' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/student/settings' },
  ];

  const role = user?.role ? Number(user.role) : Number(localStorage.getItem('role'));

  const menuItems = 
    (role === 1) ? adminMenuItems :
    (role === 2) ? teacherMenuItems :
    (role === 3) ? studentMenuItems :
    [];

  const getRoleLabel = () => {
    if (role === 1) return 'Quản trị viên';
    if (role === 2) return 'Giáo viên';
    if (role === 3) return 'Học sinh';
    return '';
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center`}>         
                <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">DreamClass</h2>
              <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.path)} // 4. Sử dụng hàm mới
                  isActive={isActive(item.path)}
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar || localStorage.getItem('user_avatar')} />
              <AvatarFallback>
                {(user?.full_name || user?.name || localStorage.getItem('user_name') || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.full_name || user?.name || localStorage.getItem('user_name') || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || localStorage.getItem('user_email')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 flex flex-col min-h-screen bg-gray-50 transition-all duration-300 ease-in-out relative z-0">
        <header className="border-b bg-background sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3 h-16">
            <SidebarTrigger className="-ml-2 md:hidden" /> 
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" /> 
            <h1 className="font-semibold text-lg text-gray-800">
              {menuItems.find(item => isActive(item.path))?.label || 'DreamClass'}
            </h1>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </>
  );
}