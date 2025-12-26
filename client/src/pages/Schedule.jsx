import React, {useState, useEffect } from 'react';
import api from '../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  PlayCircle,
  Hourglass
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

export default function Schedule({ userRole }) {
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week, 1 = next week, -1 = last week
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Dialog chi tiet
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // 1. HÀM PHÂN TÍCH CHUỖI LỊCH
  const parseClassesToSchedule = (classes) => {
    const items = [];

    // Lấy ngày hôm nay để tính trạng thái 
    const today = new Date();
    today.setHours(0,0,0,0);
    
    classes.forEach(cls => {
      let computedStatus = 'pending';
        if (cls.status === 'inactive') {
            computedStatus = 'inactive';
        } else if (cls.startDate && cls.endDate) {
            const start = new Date(cls.startDate);
            const end = new Date(cls.endDate);
            if (today < start) computedStatus = 'upcoming'; // Sắp mở
            else if (today > end) computedStatus = 'completed'; // Đã xong
            else computedStatus = 'active'; // Đang học
        } else {
            computedStatus = cls.status || 'pending';
        }
        // ------------------------------------------

        const fullScheduleStr = cls.schedule ? cls.schedule.toLowerCase() : "";
        
        // 1. Tìm và lấy ra giờ học trước
        const timeMatch = fullScheduleStr.match(/\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/);
        const time = timeMatch ? timeMatch[0] : "Chưa có giờ";

        // 2. Xóa giờ học khỏi chuỗi để tránh nhận diện nhầm thứ
        // Ví dụ: "16:30" có số 3, nếu không xóa sẽ bị nhận là Thứ 3
        const scheduleOnlyDays = fullScheduleStr.replace(time, ""); 

        // 3. Tính toán giờ bắt đầu (để sắp xếp)
        // Lấy "16" từ "16:30"
        let startHour = 0;
        if (time !== "Chưa có giờ") {
            const startStr = time.split(':')[0]; // Lấy phần giờ đầu tiên
            startHour = parseInt(startStr);
        }
        // Logic map thứ (keyword -> key của UI cũ)
        const daysMap = [
            { key: 'monday', check: ['2', 'hai'] },
            { key: 'tuesday', check: ['3', 'ba'] },
            { key: 'wednesday', check: ['4', 'tư', 'bốn'] },
            { key: 'thursday', check: ['5', 'năm'] },
            { key: 'friday', check: ['6', 'sáu'] },
            { key: 'saturday', check: ['7', 'bảy'] },
            { key: 'sunday', check: ['cn', 'chủ nhật'] },
        ];

        daysMap.forEach(dayObj => {
            // Kiểm tra xem chuỗi lịch có chứa thứ này không
            const hasDay = dayObj.check.some(k => scheduleOnlyDays.includes(k));
            
            if (hasDay) {
                items.push({
                    id: cls._id + dayObj.key, // Tạo ID unique
                    realClassId: cls._id,
                    className: cls.name,
                    teacher: cls.teacher_ids && cls.teacher_ids.length > 0 ? cls.teacher_ids[0].full_name : "Chưa phân công",
                    time: time,
                    startHour: startHour, // Dùng để sort
                    room: cls.room || 'Online',
                    day: dayObj.key, // Key quan trọng để xếp cột (monday, tuesday...)
                    type: 'regular',
                    topic: cls.description || '',
                    students: cls.students ? cls.students.length : 0,
                    startDate: cls.startDate,
                    endDate: cls.endDate,
                    status: computedStatus
                });
            }
        });
    });
    return items;
  };

  // --- 2. LẤY DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API lấy lớp (Backend đã tự lọc lớp của user này)
        const res = await api.get('/classes');
        // Parse dữ liệu thành format của Schedule UI
        const parsedData = parseClassesToSchedule(res.data);
        setScheduleData(parsedData);
      } catch (error) {
        console.error("Lỗi tải lịch:", error);
        toast.error("Không thể tải lịch học");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. XỬ LÝ LOGIC NGÀY THÁNG 
  const getWeekRange = () => {
    const today = new Date();
    const monday = new Date(today);
    const day = today.getDay(); 
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (currentWeek * 7);
    monday.setDate(diff);
    monday.setHours(0,0,0,0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);
    
    
    return {
      start: monday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      end: sunday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      startDateObj: monday
    };
  };

  const weekRange = getWeekRange();

  // Tạo danh sách 7 ngày dựa trên tuần hiện tại
  const days = [
    { key: 'monday', label: 'Thứ 2' },
    { key: 'tuesday', label: 'Thứ 3' },
    { key: 'wednesday', label: 'Thứ 4' },
    { key: 'thursday', label: 'Thứ 5' },
    { key: 'friday', label: 'Thứ 6' },
    { key: 'saturday', label: 'Thứ 7' },
    { key: 'sunday', label: 'CN' }
  ].map((d, index) => {
      const date = new Date(weekRange.startDateObj);
      date.setDate(weekRange.startDateObj.getDate() + index);
      return {
          ...d,
          dateStr: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          fullDate: date // Dùng để so sánh start/end date khóa học
      };
  });

  // 4. LỌC VÀ SẮP XẾP LỊCH
  const getClassesForDay = (dayObj) => {
    const currentDayTime = dayObj.fullDate.setHours(0,0,0,0);

    const classes = scheduleData.filter(item => {
        // Check thứ
        if (item.day !== dayObj.key) return false;

        if (item.status === 'inactive') return false;

        // 2. Kiểm tra ngày bắt đầu / kết thúc của lớp học
        if (item.startDate && item.endDate) {
            const start = new Date(item.startDate).setHours(0,0,0,0);
            const end = new Date(item.endDate).setHours(23,59,59,999);
            if (currentDayTime < start || currentDayTime > end) return false;
        }
        return true;
    });

    return classes.sort((a, b) => a.startHour - b.startHour);
  };

  const handleOpenDialog = (item) => {
    setSelectedClass(item);
    setIsDialogOpen(true);
  };

  // Lấy danh sách các lớp duy nhất (dựa trên realClassId)
  const uniqueClasses = Object.values(
    scheduleData.reduce((acc, item) => {
        if (!acc[item.realClassId]) acc[item.realClassId] = item;
        return acc;
    }, {})
  );

  const activeClassesCount = uniqueClasses.filter(c => c.status === 'active').length;
  const upcomingClassesCount = uniqueClasses.filter(c => c.status === 'upcoming' || c.status === 'pending').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lịch học</h2>
          <p className="text-muted-foreground">
            {userRole === 'teacher' ? 'Lịch giảng dạy các lớp được phân công' : 'Lịch học các lớp bạn tham gia'}
          </p>
        </div>

        {/* Nút thêm lịch cá nhân (Giữ lại nếu muốn Teacher note thêm) */}        
        {userRole === 'teacher' && (
        //   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        //     <DialogTrigger asChild>
        //       <Button className="flex items-center gap-2" onClick={() => handleOpenDialog()}>
        //         <Plus className="w-4 h-4" />
        //         Thêm lịch học
        //       </Button>
        //     </DialogTrigger>
        //     <DialogContent className="sm:max-w-[500px]">
        //       <DialogHeader>
        //         <DialogTitle>
        //           {editingSchedule ? 'Chỉnh sửa lịch học' : 'Thêm lịch học mới'}
        //         </DialogTitle>
        //         <DialogDescription>
        //           {editingSchedule ? 'Cập nhật thông tin lịch học' : 'Điền thông tin để tạo lịch học mới'}
        //         </DialogDescription>
        //       </DialogHeader>
              
        //       <div className="grid gap-4 py-4">
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="className" className="text-right">
        //             Tên lớp *
        //           </Label>
        //           <div className="col-span-3">
        //             <Input
        //               id="className"
        //               value={formData.className}
        //               onChange={(e) => handleInputChange('className', e.target.value)}
        //               placeholder="VD: Lớp A1 - Morning"
        //             />
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="day" className="text-right">
        //             Ngày trong tuần *
        //           </Label>
        //           <div className="col-span-3">
        //             <Select value={formData.day} onValueChange={(value) => handleInputChange('day', value)}>
        //               <SelectTrigger>
        //                 <SelectValue />
        //               </SelectTrigger>
        //               <SelectContent>
        //                 <SelectItem value="monday">Thứ 2</SelectItem>
        //                 <SelectItem value="tuesday">Thứ 3</SelectItem>
        //                 <SelectItem value="wednesday">Thứ 4</SelectItem>
        //                 <SelectItem value="thursday">Thứ 5</SelectItem>
        //                 <SelectItem value="friday">Thứ 6</SelectItem>
        //                 <SelectItem value="saturday">Thứ 7</SelectItem>
        //                 <SelectItem value="sunday">Chủ nhật</SelectItem>
        //               </SelectContent>
        //             </Select>
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label className="text-right">
        //             Thời gian *
        //           </Label>
        //           <div className="col-span-3 flex items-center gap-2">
        //             <Input
        //               type="time"
        //               value={formData.startTime}
        //               onChange={(e) => handleInputChange('startTime', e.target.value)}
        //               className="flex-1"
        //             />
        //             <span>-</span>
        //             <Input
        //               type="time"
        //               value={formData.endTime}
        //               onChange={(e) => handleInputChange('endTime', e.target.value)}
        //               className="flex-1"
        //             />
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="room" className="text-right">
        //             Phòng học *
        //           </Label>
        //           <div className="col-span-3">
        //             <Input
        //               id="room"
        //               value={formData.room}
        //               onChange={(e) => handleInputChange('room', e.target.value)}
        //               placeholder="VD: Phòng 101"
        //             />
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="students" className="text-right">
        //             Số học sinh
        //           </Label>
        //           <div className="col-span-3">
        //             <Input
        //               id="students"
        //               type="number"
        //               min="1"
        //               max="30"
        //               value={formData.students}
        //               onChange={(e) => handleInputChange('students', e.target.value)}
        //               placeholder="VD: 15"
        //             />
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="type" className="text-right">
        //             Loại lịch học
        //           </Label>
        //           <div className="col-span-3">
        //             <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value )}>
        //               <SelectTrigger>
        //                 <SelectValue />
        //               </SelectTrigger>
        //               <SelectContent>
        //                 <SelectItem value="regular">Lịch thường</SelectItem>
        //                 <SelectItem value="makeup">Học bù</SelectItem>
        //                 <SelectItem value="extra">Học thêm</SelectItem>
        //               </SelectContent>
        //             </Select>
        //           </div>
        //         </div>
                
        //         <div className="grid grid-cols-4 items-center gap-4">
        //           <Label htmlFor="topic" className="text-right">
        //             Chủ đề *
        //           </Label>
        //           <div className="col-span-3">
        //             <Textarea
        //               id="topic"
        //               value={formData.topic}
        //               onChange={(e) => handleInputChange('topic', e.target.value)}
        //               placeholder="VD: Unit 5: Past Simple"
        //               rows={2}
        //             />
        //           </div>
        //         </div>
        //       </div>
              
        //       <DialogFooter>
        //         <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
        //           Hủy
        //         </Button>
        //         <Button onClick={handleSaveSchedule}>
        //           {editingSchedule ? 'Cập nhật' : 'Thêm mới'}
        //         </Button>
        //       </DialogFooter>
        //     </DialogContent>
        //   </Dialog>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.info("Tính năng thêm lịch cá nhân đang phát triển")}>
                <Plus className="w-4 h-4" /> Thêm ghi chú
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tuần {weekRange.start} - {weekRange.end}
              </CardTitle>
              <CardDescription>
                {currentWeek === 0 ? 'Tuần hiện tại' : 
                 currentWeek > 0 ? `${currentWeek} tuần tới` : 
                 `${Math.abs(currentWeek)} tuần trước`}
              </CardDescription>
            </div>  
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(0)}
                disabled={currentWeek === 0}
              >
                Hôm nay
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
             <div className="text-center py-12 text-muted-foreground">Đang tải lịch học...</div>
          ) : (         
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {days.map((day) => {
              const dayClasses = getClassesForDay(day);
              const isToday = new Date().toDateString() === day.fullDate.toDateString();
              
              return (
                <div 
                  key={day.key} 
                  className={`border rounded-lg p-3 min-h-[240px]${
                    isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50/50'
                  }`}
                >
                  <div className="text-center mb-3">
                    <h4 className={`font-medium ${isToday ? 'text-blue-700' : ''}`}>{day.label}</h4>
                    <p className={`text-sm ${isToday ? 'text-blue-600' : 'text-muted-foreground'}`}>{day.dateStr}</p>
                    <div className="h-6 mt-1 flex items-center justify-center">
                      {isToday && (
                        <Badge variant="default" className="text-xs mt-1">
                          Hôm nay
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayClasses.map((classItem) => (
                      <div 
                        key={classItem.id}
                        onClick={() => handleOpenDialog(classItem)}
                        className="relative p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow group min-h-[100px] cursor-pointer"
                      >                       
                        <div className="space-y-2">
                          {/* Header with class name and type badge */}
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-medium text-sm leading-tight flex-1 min-w-0">
                              {classItem.className}
                            </h5>
                          </div>
                          
                          {/* Time and room info */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{classItem.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{classItem.room}</span>
                            </div>
                            
                            {userRole === 'teacher' ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                <span>{classItem.students} HS</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Avatar className="w-3 h-3 flex-shrink-0">
                                  <AvatarFallback className="text-[8px]">GV</AvatarFallback>
                                </Avatar>
                                <span className="truncate">{classItem.teacher}</span>
                              </div>
                            )}

                            
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayClasses.length === 0 && (
                      <div className="text-center text-xs text-muted-foreground py-4 italic">
                        Trống
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {activeClassesCount}
              </div>
              <p className="text-sm text-muted-foreground">
                {userRole === 'teacher' ? 'Lớp đang dạy' : 'Lớp đang học'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {upcomingClassesCount}
              </div>
              <p className="text-sm text-muted-foreground">
                Lớp sắp mở
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Xem chi tiết (Đơn giản hóa) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedClass?.className}</DialogTitle>
                <DialogDescription>Chi tiết lịch học</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span className="font-medium">{selectedClass?.time}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Phòng học:</span>
                    <span className="font-medium">{selectedClass?.room}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Giáo viên:</span>
                    <span className="font-medium">{selectedClass?.teacher}</span>
                </div>
                {selectedClass?.topic && (
                    <div>
                        <span className="text-muted-foreground block mb-1">Ghi chú/Chủ đề:</span>
                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedClass.topic}</p>
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>
      </div>
  );
}