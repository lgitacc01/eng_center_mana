import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Target,
  Clock,
  FileText,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export default function AdminReports() {
  const [dateRange, setDateRange] = useState('month');
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data - Thống kê tổng quan
  const overviewStats = [
    {
      title: 'Tổng học sinh',
      value: '98',
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Tỷ lệ tham dự TB',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Điểm TB hệ thống',
      value: '8.2/10',
      change: '+0.3',
      trend: 'up',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Bài tập hoàn thành',
      value: '87%',
      change: '-3%',
      trend: 'down',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Mock data - Biểu đồ tăng trưởng học sinh
  const studentGrowthData = [
    { month: 'T7', students: 65, newStudents: 8 },
    { month: 'T8', students: 73, newStudents: 12 },
    { month: 'T9', students: 85, newStudents: 15 },
    { month: 'T10', students: 92, newStudents: 10 },
    { month: 'T11', students: 98, newStudents: 8 }
  ];

  // Mock data - Điểm trung bình theo lớp
  const classScoresData = [
    { class: 'A1', score: 8.5, students: 15 },
    { class: 'A2', score: 8.2, students: 12 },
    { class: 'B1', score: 7.8, students: 14 },
    { class: 'B2', score: 8.8, students: 13 },
    { class: 'C1', score: 7.5, students: 11 },
    { class: 'C2', score: 8.0, students: 10 }
  ];

  // Mock data - Tỷ lệ tham dự
  const attendanceData = [
    { name: 'Tuần 1', attendance: 95 },
    { name: 'Tuần 2', attendance: 92 },
    { name: 'Tuần 3', attendance: 94 },
    { name: 'Tuần 4', attendance: 91 },
    { name: 'Tuần 5', attendance: 93 }
  ];

  // Mock data - Phân bố cấp độ
  const levelDistributionData = [
    { name: 'Beginner', value: 42, color: '#3b82f6' },
    { name: 'Intermediate', value: 38, color: '#8b5cf6' },
    { name: 'Advanced', value: 18, color: '#f59e0b' }
  ];

  // Mock data - Hiệu suất giáo viên
  const teacherPerformanceData = [
    { 
      name: 'Cô Linh', 
      classes: 3, 
      students: 42, 
      avgScore: 8.5, 
      attendance: 95,
      satisfaction: 4.8
    },
    { 
      name: 'Thầy Nam', 
      classes: 2, 
      students: 28, 
      avgScore: 8.2, 
      attendance: 92,
      satisfaction: 4.6
    },
    { 
      name: 'Cô Mai', 
      classes: 2, 
      students: 28, 
      avgScore: 7.8, 
      attendance: 88,
      satisfaction: 4.5
    }
  ];

  // Mock data - Hoàn thành bài tập
  const assignmentCompletionData = [
    { week: 'Tuần 1', completed: 92, pending: 8, late: 3 },
    { week: 'Tuần 2', completed: 88, pending: 10, late: 5 },
    { week: 'Tuần 3', completed: 90, pending: 7, late: 4 },
    { week: 'Tuần 4', completed: 87, pending: 11, late: 6 }
  ];

  const handleExportReport = () => {
    alert('Xuất báo cáo thành công! File đã được tải về.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Báo cáo & Thống kê</h2>
          <p className="text-muted-foreground mt-1">
            Phân tích dữ liệu và hiệu suất trung tâm
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Reports */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="students">Học sinh</TabsTrigger>
          <TabsTrigger value="teachers">Giáo viên</TabsTrigger>
          <TabsTrigger value="academic">Học tập</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng học sinh</CardTitle>
                <CardDescription>Số lượng học sinh theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={studentGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="students" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      name="Tổng HS"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newStudents" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="#10b981" 
                      name="HS mới"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố cấp độ</CardTitle>
                <CardDescription>Tỷ lệ học sinh theo trình độ</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={levelDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {levelDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng tham dự</CardTitle>
              <CardDescription>Tỷ lệ tham dự lớp học theo tuần</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Tỷ lệ tham dự (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          {/* Class Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Điểm trung bình theo lớp</CardTitle>
              <CardDescription>So sánh kết quả học tập giữa các lớp</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={classScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8b5cf6" name="Điểm TB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <CardTitle>Học sinh xuất sắc</CardTitle>
              <CardDescription>Top 10 học sinh có điểm cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'Trần Bảo Châu', class: 'A1', score: 9.5 },
                  { rank: 2, name: 'Nguyễn Minh An', class: 'A1', score: 9.2 },
                  { rank: 3, name: 'Lê Hoàng Nam', class: 'B2', score: 9.0 },
                  { rank: 4, name: 'Phạm Thu Trang', class: 'C1', score: 8.9 },
                  { rank: 5, name: 'Vũ Hải Đăng', class: 'B1', score: 8.8 }
                ].map((student) => (
                  <div key={student.rank} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        student.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        student.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {student.rank}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Lớp {student.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{student.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất giáo viên</CardTitle>
              <CardDescription>Đánh giá hoạt động giảng dạy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherPerformanceData.map((teacher, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.classes} lớp • {teacher.students} học sinh
                        </p>
                      </div>
                      <Badge variant="secondary">
                        ⭐ {teacher.satisfaction}/5.0
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Điểm TB</p>
                        <p className="font-bold text-purple-600">{teacher.avgScore}/10</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tham dự</p>
                        <p className="font-bold text-green-600">{teacher.attendance}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          {/* Assignment Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Tình hình hoàn thành bài tập</CardTitle>
              <CardDescription>Theo dõi tiến độ làm bài tập</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assignmentCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Hoàn thành" stackId="a" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Đang làm" stackId="a" />
                  <Bar dataKey="late" fill="#ef4444" name="Trễ hạn" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động học tập gần đây</CardTitle>
              <CardDescription>Cập nhật mới nhất từ hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    type: 'assignment', 
                    message: 'Lớp A1 đã hoàn thành bài tập "Grammar Practice 5"',
                    time: '10 phút trước',
                    stats: '15/15 học sinh'
                  },
                  { 
                    type: 'test', 
                    message: 'Kiểm tra giữa kỳ lớp B2 - Điểm TB: 8.8/10',
                    time: '1 giờ trước',
                    stats: 'Xuất sắc'
                  },
                  { 
                    type: 'achievement', 
                    message: '5 học sinh đạt điểm A trong tuần này',
                    time: '2 giờ trước',
                    stats: 'Tăng 20%'
                  },
                  { 
                    type: 'attendance', 
                    message: 'Tỷ lệ tham dự tuần này đạt 94%',
                    time: '1 ngày trước',
                    stats: 'Cao hơn TB'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'assignment' ? 'bg-blue-500' :
                      activity.type === 'test' ? 'bg-purple-500' :
                      activity.type === 'achievement' ? 'bg-green-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        <span className="text-xs">•</span>
                        <Badge variant="outline" className="text-xs">{activity.stats}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Học sinh hoạt động</p>
                <p className="text-2xl font-bold">94/98</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giờ dạy tuần này</p>
                <p className="text-2xl font-bold">124h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bài tập được giao</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
