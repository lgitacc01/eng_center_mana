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
import { Plus, Search, Edit, Trash2, Mail, Phone, Calendar, BookOpen, MoreVertical, Award, Lock, Unlock} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';



export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [classesList, setClassesList] = useState([]); // State lưu danh sách lớp để chọn

  // State cho Dialog Sửa
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    studentClass: '',
    grade: ''
  });

  // --- 1. LẤY DỮ LIỆU TỪ API ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get('/students'),
        api.get('/classes')
      ]);

      // Xử lý Classes cho Dropdown
      // Map về dạng { id, name }
      const classesData = classesRes.data.map(c => ({ id: c._id, name: c.name }));
      setClassesList(classesData);

      // Xử lý Students
      // Lưu ý: student.studentClass bây giờ là ID lớp
      // Bạn cần tìm tên lớp tương ứng trong classesData để hiển thị ra bảng
      const mappedStudents = studentsRes.data.map(s => {
        const foundClass = classesData.find(c => c.id === s.studentClass);
        return {
          id: s._id,
          full_name: s.full_name,
          username: s.username,
          email: s.email,
          phone: s.phone,
          avatar: s.avatar || `https://ui-avatars.com/api/?name=${s.full_name}&background=random`,
          status: s.status,
          parentName: s.parentName,
          parentPhone: s.parentPhone,
          classId: s.studentClass || "",// Lưu ID để xử lý logic
          className: foundClass ? foundClass.name : "Chưa xếp lớp",
          grade: s.grade,
          joinDate: s.createdAt,
          averageScore: s.averageScore || 0
        };
      });
      setStudents(mappedStudents);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. THÊM HỌC SINH MỚI ---
  const handleAddStudent = async () => {
    // Validate cơ bản
    if (!newStudent.full_name || !newStudent.username || !newStudent.password || !newStudent.email) {
      alert("Vui lòng điền các thông tin bắt buộc!");
      return;
    }

    try {
      await api.post('/students/create', newStudent);
      alert("Thêm học sinh thành công!");
      setIsAddDialogOpen(false);
      
      // Reset form
      setNewStudent({
        full_name: '', username: '', password: '', email: '', phone: '',
        parentName: '', parentPhone: '', studentClass: '', grade: ''
      });
      
      fetchData(); // Reload list
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Lỗi khi thêm học sinh");
    }
  };

  // --- 3. CHUẨN BỊ DỮ LIỆU ĐỂ SỬA ---
  const handleEditClick = (student) => {
    setEditingStudent({
      id: student.id,
      full_name: student.full_name,
      username: student.username,
      email: student.email,
      phone: student.phone,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      studentClass: student.classId, // Dùng ID lớp
      grade: student.grade
    });
    setIsEditDialogOpen(true);
  };

  // --- 4. CẬP NHẬT HỌC SINH (API PUT) ---
  const handleUpdateStudent = async () => {
    if (!editingStudent.full_name || !editingStudent.email) {
      alert("Tên và Email không được để trống!");
      return;
    }

    try {
      // Gọi API Update User chung (/users/:id)
      await api.put(`/users/${editingStudent.id}`, {
        full_name: editingStudent.full_name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        parentName: editingStudent.parentName,
        parentPhone: editingStudent.parentPhone,
        studentClass: editingStudent.studentClass,
        grade: editingStudent.grade,
        // Không gửi password/username để tránh lỗi hoặc đổi thông tin nhạy cảm
      });
      
      alert("Cập nhật thông tin thành công!");
      setIsEditDialogOpen(false);
      fetchData(); // Tải lại danh sách mới
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin");
    }
  };

  // --- 3. Vô hiệu hóa học sinh (Đang học / Tạm nghỉ) ---
  const handleDeleteStudent = async (id, currentStatus) => {
    // if(!window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) return;
    // try {
    //     await api.delete(`/students/${id}`);
    //     setStudents(students.filter(s => s.id !== id));
    // } catch (error) {
    //     alert("Lỗi khi xóa học sinh");
    // }
    const action = currentStatus === 'active' ? 'Khóa' : 'Mở khóa';
    if(!window.confirm(`Bạn có chắc chắn muốn ${action} học sinh này?`)) return;

    try {
        // Gọi API delete (đã sửa ở backend thành toggle status)
        const res = await api.delete(`/students/${id}`);
        
        // Cập nhật UI ngay lập tức
        setStudents(students.map(s => 
            s.id === id ? { ...s, status: res.data.status } : s
        ));
        alert(`${action} thành công!`);
    } catch (error) {
        alert("Lỗi khi thao tác");
    }
  };

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'graduated': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'inactive': return 'Tạm nghỉ';
      case 'graduated': return 'Tốt nghiệp';
      default: return '';
    }
  };

  const stats = [
    { label: 'Tổng số học sinh', value: students.length, color: 'text-blue-600' },
    { label: 'Đang học', value: students.filter(s => s.status === 'active').length, color: 'text-green-600' },
    { label: 'Tạm nghỉ', value: students.filter(s => s.status === 'inactive').length, color: 'text-orange-600' },
    { label: 'Điểm TB', value: (students.reduce((sum, s) => sum + s.averageScore, 0) / students.length).toFixed(1), color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Quản lý học sinh</h2>
          <p className="text-muted-foreground mt-1">
            Theo dõi và quản lý thông tin học sinh
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm học sinh
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm học sinh mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin học sinh và phụ huynh
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Họ và tên học sinh</Label>
                <Input
                  id="studentName"
                  placeholder="Nguyễn Văn A"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email học sinh</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder="student@dreamclass.vn"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Tên đăng nhập</Label>
                <Input
                  id="studentUsername"
                  type="username"
                  placeholder="student1"
                  value={newStudent.username}
                  onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Mật khẩu</Label>
                <Input
                  id="studentPassword"
                  type="password"
                  placeholder="123456"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentPhone">SĐT học sinh</Label>
                <Input
                  id="studentPhone"
                  placeholder="0901234567"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Cấp học</Label>
                <Select
                  value={newStudent.grade}
                  onValueChange={(value) => setNewStudent({ ...newStudent, grade: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cấp 1">Cấp 1</SelectItem>
                    <SelectItem value="Cấp 2">Cấp 2</SelectItem>
                    <SelectItem value="Cấp 3">Cấp 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Họ và tên phụ huynh</Label>
                <Input
                  id="parentName"
                  placeholder="Nguyễn Văn B"
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">SĐT phụ huynh</Label>
                <Input
                  id="parentPhone"
                  placeholder="0907654321"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="class">Lớp học</Label>
                <Select
                  value={newStudent.studentClass}
                  onValueChange={(value) => setNewStudent({ ...newStudent, studentClass: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesList.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddStudent}>
                Thêm học sinh
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* DIALOG CHỈNH SỬA (MỚI THÊM) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
            </DialogHeader>
            
            {editingStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Họ và tên HS</Label>
                  <Input value={editingStudent.full_name} onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email HS</Label>
                  <Input value={editingStudent.email} onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tên đăng nhập (Read-only)</Label>
                  <Input value={editingStudent.username} disabled className="bg-gray-100"/>
                </div>
                <div className="space-y-2">
                  <Label>SĐT học sinh</Label>
                  <Input value={editingStudent.phone} onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })} />
                </div>
                
                <div className="space-y-2">
                    <Label>Cấp học</Label>
                    <Select value={editingStudent.grade} onValueChange={(value) => setEditingStudent({ ...editingStudent, grade: value})}>
                    <SelectTrigger><SelectValue placeholder="Chọn cấp" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Cấp 1">Cấp 1 (Tiểu học)</SelectItem>
                        <SelectItem value="Cấp 2">Cấp 2 (THCS)</SelectItem>
                        <SelectItem value="Cấp 3">Cấp 3 (THPT)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                  <Label>Họ tên Phụ huynh</Label>
                  <Input value={editingStudent.parentName} onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>SĐT Phụ huynh</Label>
                  <Input value={editingStudent.parentPhone} onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Lớp học</Label>
                  <Select value={editingStudent.studentClass} onValueChange={(value) => setEditingStudent({ ...editingStudent, studentClass: value })}>
                    <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                    <SelectContent>
                        {classesList.map(cls => (<SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleUpdateStudent}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc phụ huynh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang học</SelectItem>
                <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                <SelectItem value="graduated">Tốt nghiệp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
          <CardDescription>Quản lý thông tin chi tiết từng học sinh</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh</TableHead>
                <TableHead>Phụ huynh</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Ngày vào</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{student.parentName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {student.parentPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary">{student.class}</Badge>
                      <p className="text-xs text-muted-foreground">{student.grade}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className={`w-4 h-4 ${student.averageScore >= 8 ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <span className="font-medium">{student.averageScore.toFixed(1)}/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {new Date(student.joinDate).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.status)}>
                      {getStatusLabel(student.status)}
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
                        <DropdownMenuItem onClick={() => handleEditClick(student)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className={student.status === 'active' ? "text-destructive-orange-600" : "text-destructive-green-600"} 
                          onClick={() => handleDeleteStudent(student.id, student.status)}
                        >
                          {student.status === 'active' ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
