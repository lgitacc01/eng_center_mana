import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar, BookOpen, MoreVertical, Lock, Unlock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // State Dialog Sửa (Mới thêm)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    specialization: ''
  });

  // --- 1. HÀM LẤY DỮ LIỆU THẬT ---
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Gọi API: http://localhost:5000/teachers
      const res = await api.get('/teachers'); 
      // Mapping dữ liệu từ Backend (Mongoose _id, full_name, createdAt)
      const mappedData = res.data.map(t => ({
        id: t._id, // Lấy ID của MongoDB
        full_name: t.full_name,
        username: t.username,
        email: t.email,
        phone: t.phone,
        avatar: t.avatar || `https://ui-avatars.com/api/?name=${t.full_name}&background=random`,
        status: t.status,
        classes: t.classes || [], // Đảm bảo là mảng rỗng nếu chưa có
        students: t.students || 0,
        joinDate: t.createdAt, // Lấy từ timestamps
        specialization: t.specialization
      }));
      setTeachers(mappedData);
    } catch (error) {
      console.error("Lỗi tải danh sách GV:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(); // Load dữ liệu khi component mount
  }, []);

  // --- 2. HÀM THÊM GIÁO VIÊN (API CALL) ---
  const handleAddTeacher = async () => {
    if (!newTeacher.full_name || !newTeacher.username || !newTeacher.password || !newTeacher.email) {
      alert("Vui lòng điền các trường bắt buộc!");
      return;
    }

    try {
      // Gọi API: http://localhost:5000/teachers/create
      await api.post('/teachers/create', newTeacher);
      
      alert("Thêm giáo viên thành công!");
      setIsAddDialogOpen(false);
      
      // Reset form
      setNewTeacher({ full_name: '', username: '', password: '', email: '', phone: '', specialization: '' });
      
      // Reload danh sách
      fetchTeachers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Lỗi khi thêm giáo viên");
    }
  };

  // --- 3. PREPARE EDIT (Mới thêm) ---
  const handleEditClick = (teacher) => {
    setEditingTeacher({
      id: teacher.id,
      full_name: teacher.full_name,
      username: teacher.username,
      email: teacher.email,
      phone: teacher.phone,
      specialization: teacher.specialization
    });
    setIsEditDialogOpen(true);
  };

  // --- 4. UPDATE TEACHER (Mới thêm) ---
  const handleUpdateTeacher = async () => {
    if (!editingTeacher.full_name || !editingTeacher.email) {
      alert("Tên và Email không được để trống!");
      return;
    }

    try {
      // Gọi API PUT /users/:id (dùng chung endpoint update user)
      await api.put(`/users/${editingTeacher.id}`, {
        full_name: editingTeacher.full_name,
        email: editingTeacher.email,
        phone: editingTeacher.phone,
        specialization: editingTeacher.specialization
        // Không gửi password/username để tránh đổi thông tin đăng nhập
      });
      
      alert("Cập nhật thông tin thành công!");
      setIsEditDialogOpen(false);
      fetchTeachers(); // Tải lại danh sách mới
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin");
    }
  };

  // --- 5. HÀM XÓA GIÁO VIÊN (API CALL) ---
  const handleDeleteTeacher = async (id, currentStatus) => {
    // if(!window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) return;
    // try {
    //   await api.delete(`/teachers/${id}`); // Gọi API DELETE
    //   setTeachers(teachers.filter(t => t.id !== id)); // Cập nhật UI
    // } catch (error) {
    //   alert("Lỗi khi xóa giáo viên");
    // }
    const action = currentStatus === 'active' ? 'Khóa' : 'Mở khóa';
    if(!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) return;
    
    try {
      // Gọi API delete cũ (nhưng giờ backend nó làm nhiệm vụ toggle)
      const res = await api.delete(`/teachers/${id}`); 
      
      // Cập nhật UI cục bộ
      setTeachers(teachers.map(t => 
        t.id === id ? { ...t, status: res.data.status } : t
      ));
      
      alert(`${action} tài khoản thành công!`);
    } catch (error) {
      alert(error.response?.data?.msg || "Lỗi thao tác");
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Quản lý giáo viên</h2>
          <p className="text-muted-foreground mt-1">
            Tổng số: {teachers.length} giáo viên
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm giáo viên
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm giáo viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin giáo viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Họ và tên</Label>
                <Input
                  id="full_name"
                  placeholder="Nguyễn Văn A"
                  value={newTeacher.full_name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="teacher1"
                  value={newTeacher.username}
                  onChange={(e) => setNewTeacher({ ...newTeacher, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Mật khẩu</Label>
                <Input
                  id="password"
                  placeholder="123@"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@dreamclass.vn"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="0901234567"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Chuyên môn</Label>
                <Select
                  value={newTeacher.specialization}
                  onValueChange={(value) => setNewTeacher({ ...newTeacher, specialization: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên môn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grammar & Speaking">Grammar & Speaking</SelectItem>
                    <SelectItem value="Reading & Writing">Reading & Writing</SelectItem>
                    <SelectItem value="Listening & Pronunciation">Listening & Pronunciation</SelectItem>
                    <SelectItem value="All Skills">All Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddTeacher}>
                Thêm giáo viên
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG CHỈNH SỬA (MỚI THÊM) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin giáo viên</DialogTitle>
            </DialogHeader>
            {editingTeacher && (
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Họ và tên</Label><Input value={editingTeacher.full_name} onChange={(e) => setEditingTeacher({ ...editingTeacher, full_name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={editingTeacher.email} onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Tên đăng nhập (Read-only)</Label><Input value={editingTeacher.username} disabled className="bg-gray-100" /></div>
                <div className="space-y-2"><Label>Số điện thoại</Label><Input value={editingTeacher.phone} onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })} /></div>
                <div className="space-y-2">
                    <Label>Chuyên môn</Label>
                    <Select value={editingTeacher.specialization} onValueChange={(value) => setEditingTeacher({ ...editingTeacher, specialization: value})}>
                    <SelectTrigger><SelectValue placeholder="Chọn chuyên môn" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Grammar & Speaking">Grammar & Speaking</SelectItem>
                        <SelectItem value="Reading & Writing">Reading & Writing</SelectItem>
                        <SelectItem value="Listening & Pronunciation">Listening & Pronunciation</SelectItem>
                        <SelectItem value="All Skills">All Skills</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
              </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleUpdateTeacher}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm giáo viên theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách giáo viên</CardTitle>
          <CardDescription>Quản lý thông tin và phân công giảng dạy</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải danh sách giáo viên...</div>
          ) : (
            <>
              <div className="hidden xl:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Giáo viên</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Chuyên môn</TableHead>
                    <TableHead>Lớp học</TableHead>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Ngày vào</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                          <AvatarImage src={teacher.avatar} />
                          <AvatarFallback>{teacher.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher.full_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {teacher.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.specialization}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{teacher.classes?.length || 0} lớp</span>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.students} HS</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(teacher.joinDate).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                        {teacher.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(teacher)}>
                          < Edit className="w-4 h-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={teacher.status === 'active' ? "text-destructive-orange-600" : "text-destructive-green-600"} 
                            onClick={() => handleDeleteTeacher(teacher.id, teacher.status)}
                          >
                            {teacher.status === 'active' ? (
                              <><Lock className="w-4 h-4 mr-2" /> Khóa tài khoản</>
                              ) : (
                              <><Unlock className="w-4 h-4 mr-2" /> Mở khóa</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 2. HIỂN THỊ DẠNG THẺ CARD (Chỉ hiện trên màn hình nhỏ: dưới md) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback>{teacher.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{teacher.full_name}</p>
                      <p className="text-xs text-muted-foreground">@{teacher.username}</p>
                    </div>
                  </div>
                  <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                    {teacher.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                  </Badge>
                </div>
            
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="mr-2">{teacher.specialization}</Badge>
                    <span className="text-muted-foreground text-xs">{teacher.classes?.length || 0} lớp • {teacher.students || 0} HS</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t mt-2">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Edit className="w-4 h-4 mr-2" /> Sửa
                  </Button>
                  <Button 
                    variant={teacher.status === 'active' ? "destructive" : "default"}
                    size="sm" 
                    className={teacher.status !== 'active' ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => handleDeleteTeacher(teacher.id, teacher.status)}
                  >
                    {teacher.status === 'active' ? (
                          <><Lock className="w-4 h-4 mr-2" /> Khóa</>
                        ) : (
                          <><Unlock className="w-4 h-4 mr-2" /> Mở khóa</>
                        )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
