import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Users, 
  // Plus, 
  Calendar, 
  // Clock, 
  MapPin, 
  // Edit,
  // Trash2,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // --- LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Gọi API /classes (Backend sẽ tự lọc lớp của GV này)
        const res = await api.get('/classes');

        // Lấy ngày hiện tại (để so sánh)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const mappedData = res.data.map(c => {
          // -- LOGIC TÍNH TRẠNG THÁI DỰA TRÊN NGÀY --
            let computedStatus = 'pending';
            const startDate = new Date(c.startDate);
            const endDate = new Date(c.endDate);
            
            // 1. Nếu Admin đã "Dừng hoạt động" -> Luôn là inactive
            if (c.status === 'inactive') {
                computedStatus = 'inactive';
            } 
            // 2. Nếu chưa đến ngày bắt đầu -> Sắp mở
            else if (today < startDate) {
                computedStatus = 'pending';
            } 
            // 3. Nếu đã qua ngày kết thúc -> Đã hoàn thành
            else if (today > endDate) {
                computedStatus = 'completed';
            } 
            // 4. Còn lại -> Đang học
            else {
                computedStatus = 'active';
            }
            // ------------------------------------------
          return {  
            id: c._id,
            name: c.name,
            code: c.code,
            level: c.level,
            // Xử lý danh sách giáo viên (để hiển thị đồng nghiệp cùng dạy nếu có)
            teachers: c.teacher_ids ? c.teacher_ids.map(t => t.full_name).join(', ') : "Chưa phân công",
            studentsCount: c.students ? c.students.length : 0,
            maxStudents: c.maxStudents || 0,       
            schedule: c.schedule,
            room: c.room,
            description: c.description,
            status: computedStatus,
            startDate: c.startDate,
            endDate: c.endDate
          };
        });

        setClasses(mappedData);
      } catch (error) {
        console.error("Lỗi tải lớp học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleViewStudents = (classId) => {
    // Chuyển sang trang /teacher/students
    // state: { selectedClassId: classId } dùng để truyền dữ liệu ngầm
    navigate('/teacher/classes/students', { state: { selectedClassId: classId } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang học';
      case 'pending': return 'Sắp mở';
      case 'completed': return 'Hoàn thành';
      case 'inactive': return 'Đã dừng';
      default: return 'Chưa xác định';
    }
  };

  // const handleCreateClass = () => {
  //   const id = Math.max(...classes.map(c => c.id)) + 1;
  //   const classData = {
  //     id,
  //     ...newClass,
  //     students,
  //     maxStudents: parseInt(newClass.maxStudents),
  //     teacher: 'Cô Linh',
  //     status: 'pending',
  //     startDate: new Date().toISOString().split('T')[0],
  //     endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  //   };
    
  //   setClasses([...classes, classData]);
  //   setNewClass({
  //     name: '',
  //     level: '',
  //     maxStudents: '',
  //     schedule: '',
  //     room: '',
  //     description: ''
  //   });
  //   setIsDialogOpen(false);
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý lớp học</h2>
          <p className="text-muted-foreground">Tổng cử và quản lý các lớp học của bạn</p>
        </div>
        
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tạo lớp mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo lớp học mới
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className">Tên lớp học</Label>
                <Input
                  id="className"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  placeholder="VD: Lớp A1 - Morning"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Trình độ</Label>
                <Select value={newClass.level} onValueChange={(value) => setNewClass({...newClass, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Sơ cấp</SelectItem>
                    <SelectItem value="A2">A2 - Sơ cấp cao</SelectItem>
                    <SelectItem value="B1">B1 - Trung cấp</SelectItem>
                    <SelectItem value="B2">B2 - Trung cấp cao</SelectItem>
                    <SelectItem value="C1">C1 - Nâng cao</SelectItem>
                    <SelectItem value="C2">C2 - Thành thạo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Số học sinh tối đa</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={newClass.maxStudents}
                    onChange={(e) => setNewClass({...newClass, maxStudents: e.target.value})}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Phòng học</Label>
                  <Input
                    id="room"
                    value={newClass.room}
                    onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                    placeholder="Phòng 101"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule">Lịch học</Label>
                <Input
                  id="schedule"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                  placeholder="Thứ 2, 4, 6 - 8:00-9:30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Mô tả về lớp học..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateClass}>
                  Tạo lớp học
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải dữ liệu lớp học...</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium">Bạn chưa được phân công lớp nào</h3>
            <p className="text-muted-foreground">Vui lòng liên hệ Quản trị viên để được xếp lớp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {cls.name}
                  </CardTitle>
                  <CardDescription>{cls.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(cls.status)}>
                  {getStatusText(cls.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Trình độ {cls.level}</span>
                </div>
                <Badge variant="outline">
                  {cls.studentsCount}/{cls.maxStudents}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{cls.schedule || "Chưa có lịch"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{cls.room || "Chưa xếp phòng"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{cls.studentsCount} học sinh</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {/* <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button> */}
                {/* <Button variant="outline" size="sm" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Xem học sinh
                </Button> */}
                {/* <Button variant="outline" className="flex-1">
                  Vào lớp học
                </Button> */}

                {/* 👇 4. GẮN SỰ KIỆN VÀO NÚT NÀY */}
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => handleViewStudents(cls.id)}
                >
                  <Users className="w-4 h-4 mr-2"/> Xem HS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}