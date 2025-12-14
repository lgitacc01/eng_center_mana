import React, {useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  TrendingUp,
  Calendar,
  Clock,
  Star,
  AlertCircle,
  DollarSign,
  CreditCard
} from 'lucide-react';

export default function TeacherDashboard() {
  const stats = [
    {
      title: 'Tổng số học sinh',
      value: '124',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Lớp học hoạt động',
      value: '8',
      change: '+2',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: 'Bài tập đã chấm',
      value: '45',
      change: '+23',
      icon: ClipboardCheck,
      color: 'text-purple-600'
    },
    {
      title: 'Điểm TB học sinh',
      value: '8.5/10',
      change: '+0.5',
      icon: Star,
      color: 'text-orange-600'
    }
  ];

  const upcomingClasses = [
    {
    id: 1,
    name: 'Lớp A1 - Morning',
    time: '8:00 - 9:30',
    students: 25,
    room: 'Phòng 101',
    status: 'upcoming'
  },
  {
    id: 2,
    name: 'Lớp B2 - Afternoon',
    time: '14:00 - 15:30',
    students: 30,
    room: 'Phòng 102',
    status: 'upcoming'
  },
  {
    id: 3,
    name: 'Lớp C1 - Evening',
    time: '18:00 - 19:30',
    students: 22,
    room: 'Phòng 103',
    status: 'in-progress'
  }
  ];

  const recentSubmissions = [
    {
    id: 1,
    student: 'Nguyễn Minh An',
    assignment: 'Unit 5: Grammar Exercise',
    submittedAt: '2 giờ trước',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    student: 'Trần Thị Bình',
    assignment: 'Speaking Practice 3',
    submittedAt: '4 giờ trước',
    status: 'graded',
    score: 9.0,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    student: 'Lê Văn Cường',
    assignment: 'Vocabulary Quiz 2',
    submittedAt: '6 giờ trước',
    status: 'graded',
    score: 7.5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  }
  ];

  const topStudents = [
    {
      id: 1,
      student: 'Trần Bảo Châu',
      class: 'Lớp A1',
      score: 9.5,
      improvement: '+0.8',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      student: 'Nguyễn Minh An',
      class: 'Lớp B2',
      score: 9.2,
      improvement: '+0.5',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      student: 'Lê Hoàng Nam',
      class: 'Lớp A1',
      score: 9.0,
      improvement: '+0.6',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lịch học hôm nay
            </CardTitle>
            <CardDescription>
              Các lớp học sắp tới và đang diễn ra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{classItem.name}</h4>
                    <Badge variant={classItem.status === 'in-progress' ? 'default' : 'secondary'}>
                      {classItem.status === 'in-progress' ? 'Đang học' : 'Sắp tới'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {classItem.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {classItem.students} học sinh
                    </span>
                    <span>{classItem.room}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Xem chi tiết
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Bài tập mới nộp
            </CardTitle>
            <CardDescription>
              Các bài tập cần chấm điểm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={submission.avatar} />
                  <AvatarFallback>{submission.student.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{submission.student}</p>
                  <p className="text-sm text-muted-foreground truncate">{submission.assignment}</p>
                  <p className="text-xs text-muted-foreground">{submission.submittedAt}</p>
                </div>
                <div className="text-right">
                  {submission.status === 'pending' ? (
                    <Badge variant="outline" className="text-orange-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Chờ chấm
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{submission.score}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Xem tất cả bài nộp
            </Button>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Học sinh xuất sắc
            </CardTitle>
            <CardDescription>
              Top học sinh có điểm cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStudents.map((student, index) => (
              <div key={student.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {index + 1}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>{student.student.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{student.student}</p>
                  <p className="text-sm text-muted-foreground truncate">{student.class}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {student.score}
                  </div>
                  <p className="text-xs text-green-600">{student.improvement}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Xem tất cả học sinh
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>
            Các tác vụ thường dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Button className="h-auto p-4 flex flex-col gap-2">
              <BookOpen className="w-6 h-6" />
              Tạo lớp học mới
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <ClipboardCheck className="w-6 h-6" />
              Tạo bài tập
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              Thêm học sinh
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <DollarSign className="w-6 h-6" />
              Tạo hóa đơn
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              Xem báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}