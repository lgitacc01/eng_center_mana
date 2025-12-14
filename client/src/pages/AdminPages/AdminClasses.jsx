import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Search, Edit, Trash2, Users, Calendar, Clock, BookOpen, MoreVertical, Eye, RotateCcw } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Progress } from '../../components/ui/progress';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/table';



export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]); // State lưu danh sách giáo viên để chọn
  const [setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State Xem chi tiết
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null); // Lưu thông tin lớp đang xem

  // STATE SỬA LỚP
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  
  const [newClass, setNewClass] = useState({
    name: '',
    code: '',
    teacher_id: '',
    level: '',
    schedule: '',
    room: '',
    maxStudents: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // 1. FETCH DATA (LỚP & GIÁO VIÊN)
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API để tiết kiệm thời gian
      const [classesRes, teachersRes] = await Promise.all([
        api.get('/classes'),
        api.get('/teachers')
      ]);

      const today = new Date();
      today.setHours(0,0,0,0);

      const mappedClasses = classesRes.data.map(c => {
        // Xử lý hiển thị tên giáo viên từ mảng teacher_ids
        let teacherDisplay = "Chưa phân công";
        // Lấy ID giáo viên chính để dùng cho việc edit (ưu tiên lấy người đầu tiên trong mảng)
        let mainTeacherId = "";

        if (c.teacher_ids && c.teacher_ids.length > 0) {
            teacherDisplay = c.teacher_ids.map(t => t.full_name).join(', ');
            mainTeacherId = c.teacher_ids[0]._id; // Lấy ID của GV đầu tiên
        } else if (c.teacher_id) { 
            // Fallback cho dữ liệu cũ
            teacherDisplay = c.teacher_id.full_name;
            mainTeacherId = c.teacher_id._id;
        }

        // --- LOGIC TÍNH TRẠNG THÁI ---
        let displayStatus = 'pending';
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);

        if (c.status === 'inactive') {
            displayStatus = 'inactive'; // Nếu admin đã hủy -> Luôn là Hủy
        } else {
            // Nếu chưa hủy -> Tự động tính theo ngày
            if (today < start) displayStatus = 'upcoming'; // Sắp mở
            else if (today > end) displayStatus = 'completed'; // Đã xong
            else displayStatus = 'ongoing'; // Đang học
        }
        // -----------------------------

        return {
            id: c._id,
            name: c.name,
            code: c.code,
            teacherName: teacherDisplay,
            currentTeacherId: mainTeacherId, // 👇 Lưu ID để bind vào Select khi sửa
            level: c.level,
            studentsCount: c.students ? c.students.length : 0,
            maxStudents: c.maxStudents || 0,
            schedule: c.schedule,
            room: c.room,
            description: c.description,
            status: displayStatus,
            startDate: c.startDate,
            endDate: c.endDate,
            // Giữ lại raw data nếu cần
            teacher_ids: c.teacher_ids
        };
      });
      setClasses(mappedClasses);
      setTeachers(teachersRes.data);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. TẠO LỚP MỚI
  const handleCreateClass = async () => {
    // Validate cơ bản
    if (!newClass.name || !newClass.code) {
      alert("Vui lòng nhập Tên lớp và Mã lớp!");
      return;
    }

    const maxStudentsInt = parseInt(newClass.maxStudents);
    const safeMaxStudents = isNaN(maxStudentsInt) ? 20 : maxStudentsInt;

    try {
      await api.post('/classes/create', {
        ...newClass,
        teacher_ids: newClass.teacher_id ? [newClass.teacher_id] : [],
        maxStudents: safeMaxStudents // Convert sang số
      });
      
      alert("Tạo lớp học thành công!");
      setIsDialogOpen(false);
      
      // Reset form
      setNewClass({
        name: '', code: '', teacher_id: '', level: '', schedule: '', 
        room: '', maxStudents: '', description: '', startDate: '', endDate: ''
      });
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Lỗi khi tạo lớp");
    }
  };

  // CHUẨN BỊ SỬA 
  const handleEditClick = (cls) => {
    setEditingClass({
        id: cls.id,
        name: cls.name,
        code: cls.code,
        teacher_id: cls.currentTeacherId || "", // Bind ID giáo viên
        level: cls.level,
        schedule: cls.schedule,
        room: cls.room,
        maxStudents: cls.maxStudents,
        description: cls.description,
        // Format ngày tháng về yyyy-MM-dd để input[type=date] hiểu
        startDate: cls.startDate ? cls.startDate.split('T')[0] : '',
        endDate: cls.endDate ? cls.endDate.split('T')[0] : ''
    });
    setIsEditDialogOpen(true);
  };

  // 3. CẬP NHẬT LỚP
  const handleUpdateClass = async () => {
    if (!editingClass.name || !editingClass.code) {
        alert("Tên và Mã lớp không được để trống!");
        return;
    }

    try {
        await api.put(`/classes/${editingClass.id}`, {
            name: editingClass.name,
            code: editingClass.code,
            level: editingClass.level,
            schedule: editingClass.schedule,
            room: editingClass.room,
            maxStudents: parseInt(editingClass.maxStudents) || 20,
            description: editingClass.description,
            startDate: editingClass.startDate,
            endDate: editingClass.endDate,
            // Cập nhật mảng giáo viên
            teacher_ids: editingClass.teacher_id ? [editingClass.teacher_id] : []
        });
        
        alert("Cập nhật lớp học thành công!");
        setIsEditDialogOpen(false);
        fetchData();
    } catch (error) {
        console.error(error);
        alert("Lỗi khi cập nhật lớp học");
    }
  };

  // 4. Dừng lớp
  const handleDeleteClass = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn DỪNG HOẠT ĐỘNG lớp này?")) return;
    try {
      await api.delete(`/classes/${id}`);
      setClasses(classes.map(c => c.id === id ? { ...c, status: 'inactive' } : c ));
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thao tác");
    }
  };

  // 5. KHÔI PHỤC / MỞ LẠI LỚP
  const handleReactivateClass = async (cls) => {
    if(!confirm(`Bạn muốn MỞ LẠI lớp học "${cls.name}"?`)) return;

    // Tính toán trạng thái dựa trên ngày hiện tại
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(cls.startDate);
    const end = new Date(cls.endDate);

    let newStatus = 'ongoing'; // Mặc định là đang học
    if (today < start) newStatus = 'upcoming'; // Chưa đến ngày bắt đầu -> Sắp mở
    else if (today > end) newStatus = 'completed'; // Đã qua ngày kết thúc -> Đã xong

    try {
        // Gọi API update (tái sử dụng endpoint updateClass)
        await api.put(`/classes/${cls.id}`, { 
            status: newStatus 
        });

        // Cập nhật UI ngay lập tức
        setClasses(classes.map(c => 
            c.id === cls.id ? { ...c, status: newStatus } : c
        ));
        
        alert(`Đã mở lại lớp học với trạng thái: ${newStatus === 'upcoming' ? 'Sắp mở' : 'Đang học'}`);
    } catch (error) {
        console.error(error);
        alert("Lỗi khi mở lại lớp học");
    }
  };

  // Xem chi tiết lớp học
  const handleViewDetail = async (id) => {
    try {
        const res = await api.get(`/classes/${id}`);
        setSelectedClass(res.data); // Lưu dữ liệu lớp (kèm danh sách học sinh) vào state
        setIsDetailOpen(true); // Mở Dialog
    } catch (error) {
        console.error(error);
        alert("Không thể tải thông tin lớp học");
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'default';
      case 'upcoming': return 'secondary';
      case 'completed': return 'outline';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ongoing': return 'Đang học';
      case 'upcoming': return 'Sắp mở';
      case 'completed': return 'Đã kết thúc';
      case 'inactive': return 'Đã hủy';
      default: return '';
    }
  };

  const stats = [
    { label: 'Tổng số lớp', value: classes.length, color: 'bg-blue-500' },
    { label: 'Đang học', value: classes.filter(c => c.status === 'ongoing').length, color: 'bg-green-500' },
    { label: 'Sắp mở', value: classes.filter(c => c.status === 'upcoming').length, color: 'bg-orange-500' },
    { label: 'Tổng học sinh', value: classes.reduce((sum, c) => sum + c.studentsCount, 0), color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Quản lý lớp học</h2>
          <p className="text-muted-foreground mt-1">
            Tổ chức và theo dõi các lớp học
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo lớp học mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin lớp học và phân công giáo viên
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Tên lớp học *</Label>
                <Input
                  id="className"
                  placeholder="VD: Lớp IELTS Foundation K15"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mã lớp (Unique) *</Label>
                <Input
                  value={newClass.code}
                  onChange={(e) => setNewClass({...newClass, code: e.target.value})}
                  placeholder="VD: IELTS-F-15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Giáo viên phụ trách</Label>
                <Select
                  value={newClass.teacher_id}
                  onValueChange={(value) => setNewClass({ ...newClass, teacher_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giáo viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t._id} value={t._id}>{t.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Trình độ</Label>
                <Select
                  value={newClass.level}
                  onValueChange={(value) => setNewClass({ ...newClass, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule">Lịch học</Label>
                <Input
                  id="schedule"
                  placeholder="Thứ 2-4-6 (19:30 - 21:00)"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Phòng học</Label>
                <Input
                  id="room"
                  placeholder="P.102"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newClass.startDate}
                  onChange={(e) => setNewClass({ ...newClass, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newClass.endDate}
                  onChange={(e) => setNewClass({ ...newClass, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Sĩ số tối đa</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  placeholder="15"
                  value={newClass.maxStudents}
                  onChange={(e) => setNewClass({ ...newClass, maxStudents: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Thông tin thêm về lớp học..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateClass}>
                Tạo lớp học
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG CHỈNH SỬA (MỚI) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Chỉnh sửa lớp học</DialogTitle></DialogHeader>
            {editingClass && (
                <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2"><Label>Tên lớp học *</Label><Input value={editingClass.name} onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Mã lớp *</Label><Input value={editingClass.code} onChange={(e) => setEditingClass({...editingClass, code: e.target.value})} /></div>
                <div className="space-y-2"><Label>Giáo viên</Label>
                    <Select value={editingClass.teacher_id} onValueChange={(v) => setEditingClass({ ...editingClass, teacher_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Chọn giáo viên" /></SelectTrigger>
                    <SelectContent>{teachers.map(t => <SelectItem key={t._id} value={t._id}>{t.full_name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2"><Label>Trình độ</Label>
                    <Select value={editingClass.level} onValueChange={(v) => setEditingClass({ ...editingClass, level: v })}>
                      <SelectTrigger><SelectValue placeholder="Chọn trình độ" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="IELTS">IELTS</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2"><Label>Lịch học</Label><Input value={editingClass.schedule} onChange={(e) => setEditingClass({ ...editingClass, schedule: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phòng</Label><Input value={editingClass.room} onChange={(e) => setEditingClass({ ...editingClass, room: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ngày bắt đầu</Label><Input type="date" value={editingClass.startDate} onChange={(e) => setEditingClass({ ...editingClass, startDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ngày kết thúc</Label><Input type="date" value={editingClass.endDate} onChange={(e) => setEditingClass({ ...editingClass, endDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>Sĩ số tối đa</Label><Input type="number" value={editingClass.maxStudents} onChange={(e) => setEditingClass({ ...editingClass, maxStudents: e.target.value })} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Mô tả</Label><Textarea value={editingClass.description} onChange={(e) => setEditingClass({...editingClass, description: e.target.value})} /></div>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleUpdateClass}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DIALOG CHI TIẾT LỚP HỌC */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="min-w-5xl w-full overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Chi tiết lớp học: {selectedClass?.name}</DialogTitle>
              <DialogDescription>Mã lớp: {selectedClass?.code} | Sĩ số: {selectedClass?.students?.length}/{selectedClass?.maxStudents}</DialogDescription>
            </DialogHeader>
        
            {selectedClass && (
              <div className="space-y-6">
                {/* Thông tin Giáo viên */}
                <div>
                    <h4 className="text-sm font-semibold mb-2">Giáo viên phụ trách</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedClass.teacher_ids?.length > 0 ? selectedClass.teacher_ids.map(t => (
                            <Badge key={t._id} variant="outline" className="flex gap-2 py-1">
                                <Users className="w-3 h-3"/> {t.full_name}
                            </Badge>
                        )) 
                       : (
                        /* Fallback cho teacher_id (đơn) nếu dữ liệu cũ */
                        selectedClass.teacher_id ? (
                          <Badge variant="outline" className="flex gap-2 py-1">
                            <Users className="w-3 h-3"/> {selectedClass.teacher_id.full_name}
                          </Badge>
                        ) : ( 
                          <span className="text-sm text-muted-foreground">Chưa phân công</span>
                        )
                      )}
                    </div>
                </div>

                {/* Danh sách Học sinh */}
                <div>
                    <h4 className="text-sm font-semibold mb-2">Danh sách học sinh ({selectedClass.students?.length})</h4>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Họ tên</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>SĐT</TableHead>
                                    <TableHead>Phụ huynh</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedClass.students?.length > 0 ? selectedClass.students.map(st => (
                                    <TableRow key={st._id}>
                                        <TableCell className="font-medium">{st.full_name}</TableCell>
                                        <TableCell>{st.email}</TableCell>
                                        <TableCell>{st.phone}</TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                <p>{st.parentName}</p>
                                                <p className="text-muted-foreground">{st.parentPhone}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            Lớp chưa có học sinh nào.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        )}
    </DialogContent>
</Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm lớp học theo tên hoặc giáo viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary">{cls.level}</Badge>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(cls)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>

                    {cls.status === 'inactive' ? (
                      <DropdownMenuItem className="text-green-600 font-medium" onClick={() => handleReactivateClass(cls)}>
                        <RotateCcw className="w-4 h-4 mr-2" /> 
                        Mở lại lớp học
                       </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClass(cls.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Dừng hoạt động
                      </DropdownMenuItem>
                    )}  
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Giáo viên: {cls.teacherName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{cls.room}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(cls.startDate).toLocaleDateString('vi-VN')} - {new Date(cls.endDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Đã gộp hai span lại thành một dòng duy nhất */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium">Sĩ số: {cls.studentsCount}/{cls.maxStudents}</span>
                </div>
              {/* Progress bar giữ nguyên, thêm Math.min để tránh lỗi 100% nếu sĩ số quá tải */}
                <Progress value={Math.min((cls.studentsCount / (cls.maxStudents || 1)) * 100, 100)} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={getStatusColor(cls.status)}>
                  {getStatusLabel(cls.status)}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => handleViewDetail(cls.id)}>
                  <Eye className="w-4 h-4 mr-2" /> Xem chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
