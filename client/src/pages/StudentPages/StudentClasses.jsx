import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock,
  MapPin,
  Star,
  Trophy,
  Target,
  GraduationCap,
  FileText,
  ChevronRight
} from 'lucide-react';

export function StudentClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Gọi API /classes (Backend tự lọc lớp của học sinh này)
        const res = await api.get('/classes');

        // Lấy ngày hiện tại
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const mappedData = res.data.map(c => {
          // -- LOGIC TÍNH TRẠNG THÁI --
            let computedStatus = 'pending';
            const startDate = new Date(c.startDate);
            const endDate = new Date(c.endDate);
            
            if (c.status === 'inactive') {
                computedStatus = 'inactive';
            } else if (today < startDate) {
                computedStatus = 'pending';
            } else if (today > endDate) {
                computedStatus = 'completed';
            } else {
                computedStatus = 'active';
            }
            // ---------------------------
            return {
              id: c._id,
              name: c.name,
              code: c.code,
              level: c.level,
              // Lấy tên giáo viên đầu tiên (hoặc chuỗi tên)
              teacherName: c.teacher_ids && c.teacher_ids.length > 0 
                ? c.teacher_ids[0].full_name 
                : "Chưa phân công",
              teacherAvatar: "", // Có thể update backend trả về avatar sau         
              schedule: c.schedule, // Chuỗi: "Thứ 2-4-6..."
              room: c.room,             
              studentsCount: c.students ? c.students.length : 0,
              maxStudents: c.maxStudents || 20,       
              // Giả lập tiến độ (Vì chưa có module điểm danh/bài học thực tế)
              progress: 0, 
              totalLessons: 24,
              completedLessons: 0,      
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang học</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Sắp mở</Badge>;
      case 'completed': return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Hoàn thành</Badge>;
      case 'inactive': return <Badge variant="destructive">Đã dừng</Badge>;
      default: return <Badge variant="outline">Khác</Badge>;
    }
  };

  // MOCK DATA CHO PHẦN "ĐỘNG VIÊN" (Giữ lại UI cho đẹp)
  const achievements = [
    { title: "Chuyên cần", desc: "Tham gia đầy đủ 5 buổi học liên tiếp" },
    { title: "Tích cực", desc: "Hoàn thành bài tập về nhà đúng hạn" }
  ]; 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Lớp học của tôi 📚</h2>
            <p className="text-blue-100">
              Bạn đang tham gia {classes.length} lớp học
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{classes.length}</div>
              <p className="text-sm text-muted-foreground">Lớp đang học</p>
            </div>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{subjects.length}</div>
              <p className="text-sm text-muted-foreground">Môn học</p>
            </div>
          </CardContent>
        </Card> */}
        
        {/* <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {classes.reduce((acc, c) => acc + c.completedLessons, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Buổi học hoàn thành</p>
            </div>
          </CardContent>
        </Card> */}
      </div> 

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 ">
          <TabsTrigger value="all">Lớp học</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích</TabsTrigger>
        </TabsList>

        {/* Tab: Lớp học */}
        <TabsContent value="all" className="space-y-4">
          {loading ? (
                <div className="text-center py-12 text-gray-500">Đang tải lớp học...</div>
            ) : classes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium">Bạn chưa tham gia lớp học nào</h3>
                    <p className="text-muted-foreground">Vui lòng liên hệ quản trị viên để được xếp lớp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        {classItem.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                        Mã lớp: {classItem.code} • {classItem.level}
                        </CardDescription>
                      </div>
                    {getStatusBadge(classItem.status)}
                    </div>
                    </CardHeader>
              
                    <CardContent className="space-y-4">
                      {/* Teacher Info */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={classItem.teacherAvatar} />
                        <AvatarFallback className="bg-blue-200 text-blue-700">
                          {classItem.teacherName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{classItem.teacherName}</p>
                        <p className="text-sm text-muted-foreground">Giáo viên phụ trách</p>
                      </div>
                    </div>

                    {/* Class Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate" title={classItem.schedule}>{classItem.schedule || "Chưa có lịch"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{classItem.room || "P.TBA"}</span>
                      </div>
                  
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs">
                          {classItem.startDate ? new Date(classItem.startDate).toLocaleDateString('vi-VN') : '...'} 
                          {' - '} 
                          {classItem.endDate ? new Date(classItem.endDate).toLocaleDateString('vi-VN') : '...'}
                        </span>
                      </div>
                  
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{classItem.room}</span>
                      </div>
                  
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{classItem.studentsCount} học sinh</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Tiến độ khóa học</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>

                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Xem chi tiết lớp học
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Achievement */}
        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                  Động viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                  {achievements.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
