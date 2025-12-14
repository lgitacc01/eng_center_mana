// import React, {useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, GraduationCap, BookOpen, TrendingUp, DollarSign, Calendar, Award, AlertCircle } from 'lucide-react';
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Tổng số giáo viên',
      value: '12',
      change: '+2 tháng này',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Tổng số học sinh',
      value: '98',
      change: '+15 tháng này',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Tổng số lớp học',
      value: '8',
      change: '+1 tháng này',
      trend: 'up',
      icon:  BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Điểm TB hệ thống',
      value: '8.2/10',
      change: '+0.3 điểm tháng này',
      trend: 'up',
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'student', message: 'Học sinh mới "Nguyễn Minh An" đã được thêm vào lớp A1', time: '5 phút trước' },
    { id: 2, type: 'teacher', message: 'Cô Lan đã tạo bài tập mới cho lớp B2', time: '30 phút trước' },
    { id: 3, type: 'payment', message: 'Thanh toán học phí từ phụ huynh Trần Văn A', time: '1 giờ trước' },
    { id: 4, type: 'class', message: 'Lớp C1 đã hoàn thành buổi học hôm nay', time: '2 giờ trước' },
    { id: 5, type: 'achievement', message: '5 học sinh đạt điểm A trong bài kiểm tra tuần này', time: '3 giờ trước' },
  ];

  const classPerformance = [
    { name: 'Lớp A1', students: 15, avgScore: 8.5, attendance: 95 },
    { name: 'Lớp A2', students: 18, avgScore: 8.2, attendance: 92 },
    { name: 'Lớp B1', students: 20, avgScore: 7.8, attendance: 88 },
    { name: 'Lớp B2', students: 17, avgScore: 8.8, attendance: 97 },
    { name: 'Lớp C1', students: 19, avgScore: 7.5, attendance: 85 },
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Họp phụ huynh lớp A1', date: '28/10/2025', time: '18:00' },
    { id: 2, title: 'Kiểm tra định kỳ giữa khóa', date: '30/10/2025', time: '14:00' },
    { id: 3, title: 'Sinh nhật học sinh tháng 10', date: '31/10/2025', time: '16:00' },
    { id: 4, title: 'Đào tạo giáo viên', date: '05/11/2025', time: '09:00' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold">Chào mừng, Admin!</h2>
        <p className="text-muted-foreground mt-1">
          Tổng quan về hoạt động của trung tâm DreamClass
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hiệu suất lớp học</CardTitle>
            <CardDescription>Theo dõi điểm số và tỷ lệ tham dự</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classPerformance.map((cls, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.students} học sinh</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Award className="w-3 h-3 mr-1" />
                          {cls.avgScore}/10
                        </Badge>
                        <Badge variant="outline">{cls.attendance}%</Badge>
                      </div>
                    </div>
                  </div>
                  <Progress value={cls.attendance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện sắp tới</CardTitle>
            <CardDescription>Lịch trình quan trọng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Cập nhật mới nhất từ hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'student' ? 'bg-green-500' :
                  activity.type === 'teacher' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-orange-500' :
                  activity.type === 'achievement' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Thêm giáo viên</p>
              <p className="text-sm text-muted-foreground">Tạo tài khoản mới</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Thêm học sinh</p>
              <p className="text-sm text-muted-foreground">Đăng ký học viên mới</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Tạo lớp học</p>
              <p className="text-sm text-muted-foreground">Mở lớp học mới</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
