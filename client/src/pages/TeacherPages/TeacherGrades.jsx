import React, {useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  GraduationCap,
  Download,
  Edit2,
  Award,
  Loader2
} from "lucide-react";
const skillNames = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng"
};

export default function TeacherGrades() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách lớp khi component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Gọi API (Đảm bảo đường dẫn đúng với server.js của bạn, có thể là /classes hoặc /api/classes)
        const res = await api.get('/classes'); 

        if (Array.isArray(res.data) && res.data.length > 0) {
          setClasses(res.data);
          setSelectedClass(res.data[0]._id); // Chọn lớp đầu tiên
        } else if (res.data.success && res.data.classes) {
          setClasses(res.data.classes);
          if (res.data.classes.length > 0) setSelectedClass(res.data.classes[0]._id);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách lớp:", err);
      }
    };
    fetchClasses();
  }, []);

  // 2. Lấy bảng điểm khi selectedClass thay đổi
  useEffect(() => {
    if (!selectedClass) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/grades/class/${selectedClass}`);
        if (res.data.success) {
          setStudentGrades(res.data.report);
        }
      } catch (err) {
        console.error("Lỗi tải bảng điểm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [selectedClass]);

  // Helper: Tính điểm trung bình kỹ năng cho biểu đồ
  const calculateSkillAverage = () => {
    if (studentGrades.length === 0) return [];
    
    return Object.keys(skillNames).map(skill => {
      let total = 0;
      let count = 0;
      studentGrades.forEach(student => {
        const grades = student.grades[skill] || [];
        if (grades.length > 0) {
          // Lấy điểm trung bình của kỹ năng đó của từng HS
          const avgSkill = grades.reduce((a, b) => a + b, 0) / grades.length;
          total += avgSkill;
          count++;
        }
      });
      return {
        skill: skillNames[skill],
        average: count > 0 ? parseFloat((total / count).toFixed(1)) : 0
      };
    }).filter(item => item.average > 0); // Chỉ hiện kỹ năng nào có điểm
  };

  const getGradeColor = (score) => {
    if (score >= 9.0) return "text-green-600 bg-green-50";
    if (score >= 8.0) return "text-blue-600 bg-blue-50";
    if (score >= 7.0) return "text-yellow-600 bg-yellow-50";
    if (score >= 5.0) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 9.0) return "Xuất sắc";
    if (score >= 8.0) return "Giỏi";
    if (score >= 6.5) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
  };

  // Tính toán thống kê tổng quan
  const classAverage = studentGrades.length > 0
    ? (studentGrades.reduce((sum, s) => sum + s.average, 0) / studentGrades.length).toFixed(1)
    : 0;
  
  const excellentCount = studentGrades.filter(s => s.average >= 9.0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Quản lý điểm số
          </h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi và đánh giá kết quả học tập của lớp
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Lớp học:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" /></div>
      ) : (        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="students">Danh sách học sinh</TabsTrigger>
            <TabsTrigger value="reports">Biểu đồ phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng học sinh</p>
                      <p className="text-xl font-semibold">{studentGrades.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Xuất sắc</p>
                      <p className="text-2xl font-bold">{excellentCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Students */}
              <Card>
                <CardHeader>
                    <CardTitle>Học sinh tiêu biểu</CardTitle>
                    <CardDescription>Top 3 học sinh có điểm trung bình cao nhất</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...studentGrades].sort((a,b) => b.average - a.average).slice(0, 3).map((student, idx) => (
                         <div key={student.studentId} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="w-8 h-8 flex justify-center items-center rounded-full">#{idx + 1}</Badge>
                                <div>
                                    <p className="font-bold">{student.studentName}</p>
                                    <p className="text-xs text-muted-foreground">{student.studentId}</p>
                                </div>
                            </div>
                            <div className={`text-lg font-bold ${getGradeColor(student.average)} px-3 py-1 rounded`}>
                                {student.average}
                            </div>
                         </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bảng điểm chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Học sinh</TableHead>
                        <TableHead>Đã nộp</TableHead>
                        <TableHead>Điểm TB</TableHead>
                        <TableHead>Xếp loại</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentGrades.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {/* Dùng component Avatar để hiển thị ảnh */}
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.studentName} />
                                <AvatarFallback>
                                  {student.studentName ? student.studentName.charAt(0).toUpperCase() : "H"}
                                </AvatarFallback>
                              </Avatar>      
                              <span>{student.studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.completedAssignments} bài</TableCell>
                          <TableCell>
                            <span className={`font-bold px-2 py-1 rounded ${getGradeColor(student.average)}`}>
                              {student.average}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getPerformanceLabel(student.average)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phân bố xếp loại */}
                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố xếp loại</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Xuất sắc (9-10)", min: 9, color: "bg-green-500" },
                        { label: "Giỏi (8-8.9)", min: 8, max: 8.9, color: "bg-blue-500" },
                        { label: "Khá (6.5-7.9)", min: 6.5, max: 7.9, color: "bg-yellow-500" },
                        { label: "Trung bình (5-6.4)", min: 5, max: 6.4, color: "bg-orange-500" },
                        { label: "Yếu (<5)", min: 0, max: 4.9, color: "bg-red-500" },
                      ].map((item) => {
                        const count = studentGrades.filter(s => 
                          s.average >= item.min && (item.max ? s.average <= item.max : true)
                        ).length;
                        return (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.label}</span>
                              <span className="font-medium">{count} HS</span>
                            </div>
                            <Progress value={(count / studentGrades.length) * 100} className={`h-2 ${item.color.replace('bg-', 'text-')}`} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Phân tích kỹ năng */}
                <Card>
                  <CardHeader>
                    <CardTitle>Điểm TB theo kỹ năng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={calculateSkillAverage()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="average" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}