import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export default function TeacherStudents() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [students, setStudents] = useState([]);
  const [classesList, setClassesList] = useState([]); // Danh sách lớp để lọc
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState(location.state?.selectedClassId || 'all');

  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // --- 1. FETCH DATA TỪ API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy song song danh sách học sinh và danh sách lớp
        const [studentsRes, classesRes] = await Promise.all([
          api.get('/students'), 
          api.get('/classes')
        ]);

        // Map danh sách lớp (ID, Name) để dùng cho Dropdown và tra cứu tên
        const classesData = classesRes.data.map(c => ({ 
          id: c._id, 
          name: c.name,
          startDate: c.startDate,
          classStatus: c.status
        }));
        setClassesList(classesData);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Map danh sách học sinh
        const mappedStudents = studentsRes.data.map(s => {
            // Tìm tên lớp dựa trên ID lớp của học sinh
            const foundClass = classesData.find(c => c.id === s.studentClass);

            let displayStatus = s.status;

            if (foundClass && s.status === 'active') {
                const startDate = new Date(foundClass.startDate);
                
                // Nếu lớp bị hủy -> Học sinh hiển thị "Lớp đã hủy"
                if (foundClass.classStatus === 'inactive') {
                    displayStatus = 'class_inactive';
                }
                // Nếu chưa đến ngày học -> Học sinh hiển thị "Chờ lớp mở"
                else if (today < startDate) {
                    displayStatus = 'waiting';
                }
            }
            // ----------------------------------------
            
            return {
                id: s._id,
                name: s.full_name,
                email: s.email,
                phone: s.phone,
                
                // Logic lớp học
                classId: s.studentClass, // ID lớp (dùng để lọc)
                className: foundClass ? foundClass.name : "Chưa xếp lớp", // Tên lớp (dùng để hiển thị)
                
                level: s.grade || 'N/A',
                joinDate: s.createdAt,
                status: displayStatus,
                avatar: s.avatar || '',
                attendance: 90, // Mock tạm vì chưa có API điểm danh
                avgScore: s.averageScore || 0,
                parent: s.parentName,
                parentPhone: s.parentPhone
            };
        });

        setStudents(mappedStudents);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClass === 'all' || student.classId === filterClass;

    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'class_inactive': return 'bg-gray-100 text-gray-800 line-through';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'waiting': return 'Chờ lớp mở';
      case 'inactive': return 'Tạm nghỉ';
      case 'pending': return 'Chờ xử lý';
      case 'class_inactive': return 'Lớp đã hủy';
      default: return 'Chưa xác định';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/teacher/classes')}>
            <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Danh sách học sinh</h2>
          <p className="text-muted-foreground">{filterClass !== 'all' 
                ? `Đang xem danh sách lớp: ${classesList.find(c => c.id === filterClass)?.name || '...'}`
                : "Quản lý toàn bộ học sinh"
             }</p>
        </div>
        
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Thêm học sinh
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm học sinh mới</DialogTitle>
              <DialogDescription>
                Điền thông tin học sinh và phụ huynh
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Tên học sinh</Label>
                <Input
                  id="studentName"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="student@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentPhone">Số điện thoại</Label>
                <Input
                  id="studentPhone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="0123456789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentClass">Lớp học</Label>
                <Select value={newStudent.class} onValueChange={(value) => setNewStudent({...newStudent, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp học" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentName">Tên phụ huynh</Label>
                <Input
                  id="parentName"
                  value={newStudent.parent}
                  onChange={(e) => setNewStudent({...newStudent, parent: e.target.value})}
                  placeholder="Nguyễn Văn B"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentPhone">SĐT phụ huynh</Label>
                <Input
                  id="parentPhone"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                  placeholder="0987654321"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddStudent}>
                  Thêm học sinh
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classesList.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang học</SelectItem>
                <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Table> */}
            {loading ? (
             <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
          ) : filteredStudents.length === 0 ? (
             <div className="text-center py-8 text-gray-500">Không tìm thấy học sinh nào.</div>
          ) : (
          <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>Học sinh</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Điểm danh</TableHead>
                <TableHead>Phụ huynh</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.className}</p>
                      <Badge variant="outline" className="text-xs">
                        {student.level}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.status)}>
                      {getStatusText(student.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${student.avgScore >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                      {student.avgScore.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={student.attendance >= 80 ? 'text-green-600' : 'text-red-600'}>
                      {student.attendance}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{student.parent}</p>
                      <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem> */}
                        {/* <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Gửi email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}