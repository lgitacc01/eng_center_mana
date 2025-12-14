import React, {useState} from 'react';
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
  LineChart,
  Line,
} from "recharts";
import {
  GraduationCap,
  Plus,
  Star,
  TrendingUp,
  FileText,
  Download,
  Edit2,
  Award,
} from "lucide-react";

// Mock data
const mockGrades = [
  {
    studentId: "HS001",
    studentName: "Nguyễn Minh An",
    className: "Lớp 1A",
    avatar: "👦",
    grades: {
      listening: [8.5, 9.0, 8.8, 9.2],
      speaking: [7.8, 8.2, 8.5, 8.8],
      reading: [9.0, 8.8, 9.2, 9.5],
      writing: [7.5, 8.0, 8.3, 8.5],
    },
    average: 8.7,
    attendance: 95,
    assignments: 10,
    completedAssignments: 9,
  },
  {
    studentId: "HS002",
    studentName: "Trần Thị Bình",
    className: "Lớp 1A",
    avatar: "👧",
    grades: {
      listening: [9.0, 9.2, 8.8, 9.0],
      speaking: [8.8, 9.0, 9.2, 9.5],
      reading: [8.5, 8.8, 9.0, 9.2],
      writing: [8.2, 8.5, 8.8, 9.0],
    },
    average: 9.0,
    attendance: 98,
    assignments: 10,
    completedAssignments: 10,
  },
  {
    studentId: "HS003",
    studentName: "Lê Văn Cường",
    className: "Lớp 2B",
    avatar: "👦",
    grades: {
      listening: [7.8, 8.0, 8.2, 8.5],
      speaking: [7.5, 7.8, 8.0, 8.2],
      reading: [8.2, 8.5, 8.8, 9.0],
      writing: [7.0, 7.5, 7.8, 8.0],
    },
    average: 8.1,
    attendance: 90,
    assignments: 9,
    completedAssignments: 8,
  },
];

const skillNames = {
  listening: "Nghe",
  speaking: "Nói", 
  reading: "Đọc",
  writing: "Viết",
};

const chartData = [
  { month: "T1", average: 8.2 },
  { month: "T2", average: 8.4 },
  { month: "T3", average: 8.6 },
  { month: "T4", average: 8.7 },
];

export default function TeacherGrades() {
  const [selectedClass, setSelectedClass] = useState("all");
  // const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredGrades = selectedClass === "all" 
    ? mockGrades 
    : mockGrades.filter(student => student.className === selectedClass);

  // const handleAddGrade = () => {
  //   // Handle adding new grade
  //   setIsAddGradeOpen(false);
  //   setNewGrade({ skill: "", score: "", note: "" });
  // };

  const getGradeColor = (score) => {
    if (score >= 9.0) return "text-green-600 bg-green-50";
    if (score >= 8.0) return "text-blue-600 bg-blue-50";
    if (score >= 7.0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getPerformanceLabel = (score) => {
    if (score >= 9.0) return "Xuất sắc";
    if (score >= 8.0) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 6.0) return "Trung bình";
    return "Yếu";
  };

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
            Theo dõi và đánh giá kết quả học tập của học sinh
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
          {/* <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Thêm điểm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm điểm mới</DialogTitle>
                <DialogDescription>
                  Nhập điểm số cho học sinh
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Kỹ năng</Label>
                  <Select value={newGrade.skill} onValueChange={(value) => 
                    setNewGrade({...newGrade, skill})
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn kỹ năng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="listening">Nghe</SelectItem>
                      <SelectItem value="speaking">Nói</SelectItem>
                      <SelectItem value="reading">Đọc</SelectItem>
                      <SelectItem value="writing">Viết</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Điểm số</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={newGrade.score}
                    onChange={(e) => setNewGrade({...newGrade, score: e.target.value})}
                    placeholder="Nhập điểm (0-10)"
                  />
                </div>
                <div>
                  <Label>Ghi chú</Label>
                  <Input
                    value={newGrade.note}
                    onChange={(e) => setNewGrade({...newGrade, note: e.target.value})}
                    placeholder="Ghi chú về bài kiểm tra (tùy chọn)"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddGrade} className="bg-purple-600 hover:bg-purple-700">
                    Thêm điểm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Lớp học:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="Lớp 1A">Lớp 1A</SelectItem>
                <SelectItem value="Lớp 2B">Lớp 2B</SelectItem>
                <SelectItem value="Lớp 3C">Lớp 3C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="students">Danh sách học sinh</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo & Thống kê</TabsTrigger>
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
                    <p className="text-xl font-semibold">{filteredGrades.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm TB</p>
                    <p className="text-xl font-semibold">
                      {(filteredGrades.reduce((sum, s) => sum + s.average, 0) / filteredGrades.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Xuất sắc</p>
                    <p className="text-xl font-semibold">
                      {filteredGrades.filter(s => s.average >= 9.0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tiến bộ</p>
                    <p className="text-xl font-semibold">+0.3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Điểm số gần đây</CardTitle>
              <CardDescription>
                Những điểm số được cập nhật trong tuần này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGrades.slice(0, 3).map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{student.avatar}</div>
                      <div>
                        <p className="font-medium">{student.studentName}</p>
                        <p className="text-sm text-muted-foreground">{student.className}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Điểm TB</p>
                        <p className={`text-lg font-semibold px-2 py-1 rounded ${getGradeColor(student.average)}`}>
                          {student.average}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {getPerformanceLabel(student.average)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảng điểm học sinh</CardTitle>
              <CardDescription>
                Chi tiết điểm số theo từng kỹ năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Nghe</TableHead>
                    <TableHead>Nói</TableHead>
                    <TableHead>Đọc</TableHead>
                    <TableHead>Viết</TableHead>
                    <TableHead>Điểm TB</TableHead>
                    <TableHead>Xếp loại</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{student.avatar}</span>
                          <span className="font-medium">{student.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${getGradeColor(student.grades.listening[student.grades.listening.length - 1])}`}>
                          {student.grades.listening[student.grades.listening.length - 1]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${getGradeColor(student.grades.speaking[student.grades.speaking.length - 1])}`}>
                          {student.grades.speaking[student.grades.speaking.length - 1]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${getGradeColor(student.grades.reading[student.grades.reading.length - 1])}`}>
                          {student.grades.reading[student.grades.reading.length - 1]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded ${getGradeColor(student.grades.writing[student.grades.writing.length - 1])}`}>
                          {student.grades.writing[student.grades.writing.length - 1]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold px-2 py-1 rounded ${getGradeColor(student.average)}`}>
                          {student.average}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getPerformanceLabel(student.average)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Edit2 className="w-4 h-4" />
                        </Button>
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
            {/* Grade Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng điểm số</CardTitle>
                <CardDescription>
                  Điểm trung bình theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố xếp loại</CardTitle>
                <CardDescription>
                  Số lượng học sinh theo từng mức
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Xuất sắc (9.0-10)", count: filteredGrades.filter(s => s.average >= 9.0).length, color: "bg-green-500" },
                    { label: "Giỏi (8.0-8.9)", count: filteredGrades.filter(s => s.average >= 8.0 && s.average < 9.0).length, color: "bg-blue-500" },
                    { label: "Khá (7.0-7.9)", count: filteredGrades.filter(s => s.average >= 7.0 && s.average < 8.0).length, color: "bg-yellow-500" },
                    { label: "Trung bình (6.0-6.9)", count: filteredGrades.filter(s => s.average >= 6.0 && s.average < 7.0).length, color: "bg-orange-500" },
                    { label: "Yếu (<6.0)", count: filteredGrades.filter(s => s.average < 6.0).length, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{item.label}</span>
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                        <Progress 
                          value={(item.count / filteredGrades.length) * 100} 
                          className="h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Phân tích kỹ năng</CardTitle>
              <CardDescription>
                Điểm trung bình theo từng kỹ năng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.keys(skillNames).map(skill => ({
                  skill,
                  average: (filteredGrades.reduce((sum, student) => 
                    sum + student.grades[skill][student.grades[skill].length - 1], 0
                  ) / filteredGrades.length).toFixed(1)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8b5cf6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}