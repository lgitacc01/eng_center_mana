import React, {useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  XCircle,
  Award,
  Target
} from 'lucide-react';

export default function StudentDashboard() {
  const studentProgress = {
    currentLevel: 'B1',
    nextLevel: 'B2',
    progress: '65%',
    totalPoints: 1120,
    streak: 7
  }  

  const upcomingClasses = [
    {
      id: 1,
      name: 'Grammar Focus',
      teacher: 'Cô Linh',
      time: '14:00 - 15:30',
      date: 'Hôm nay',
      room: 'Phòng 101',
      status: 'upcoming'
    },
    {
      id: 2,
      name: 'Speaking Practice',
      teacher: 'Thầy Nam',
      time: '16:00 - 17:30',
      date: 'Mai',
      room: 'Phòng 102',
      status: 'scheduled'
    }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Unit 5: Past Simple Tense',
      dueDate: 'Hôm nay 18:00',
      status: 'pending',
      type: 'grammar',
      points: 100,
      difficulty: 'Dễ'
    },
    {
      id: 2,
      title: 'Vocabulary Quiz - Animals',
      dueDate: 'Mai 20:00',
      status: 'not-started',
      type: 'vocabulary',
      points: 100,
      difficulty: 'Trung bình'
    },
    {
      id: 3,
      title: 'Speaking Exercise 3',
      dueDate: '2 ngày nữa',
      status: 'completed',
      type: 'speaking',
      points: 100 ,
      score: 8.5,
      difficulty: 'Khó'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Grammar Master',
      description: 'Hoàn thành 10 bài tập ngữ pháp',
      icon: '📚',
      earnedAt: '2 ngày trước'
    },
    {
      id: 2,
      title: 'Speaking Star',
      description: 'Đạt điểm 9+ trong bài nói',
      icon: '🎤',
      earnedAt: '1 tuần trước'
    },
    {
      id: 3,
      title: 'Perfect Attendance',
      description: '7 ngày học liên tiếp',
      icon: '📅',
      earnedAt: 'Hôm nay'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600';
      case 'completed': return 'text-green-600';
      case 'overdue': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500"/>;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "not-started":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Chào Bé An! 👋</h2>
            <p className="text-blue-100">Hôm nay bé đã sẵn sàng học tiếng Anh chưa?</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{studentProgress.currentLevel}</div>
              <p className="text-sm text-muted-foreground mb-3">Trình độ hiện tại</p>
              <Progress value={studentProgress.progress} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {studentProgress.progress}% đến {studentProgress.nextLevel}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{studentProgress.totalPoints}</div>
              <p className="text-sm text-muted-foreground mb-3">Tổng điểm</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm">Hạng Bạc</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{studentProgress.streak}</div>
              <p className="text-sm text-muted-foreground mb-3">Ngày học liên tiếp</p>
              <div className="flex items-center justify-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Siêu tuyệt! 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lịch học sắp tới
            </CardTitle>
            <CardDescription>
              Các buổi học tiếp theo của bé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{classItem.name}</h4>
                  <Badge variant={classItem.status === 'upcoming' ? 'default' : 'secondary'}>
                    {classItem.date}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="text-xs">
                        {classItem.teacher.charAt(classItem.teacher.length - 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{classItem.teacher}</span>
                  </div>
                  <div>{classItem.room}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Bài tập của bé
            </CardTitle>
            <CardDescription>
              Các bài tập cần hoàn thành
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {assignment.type === 'grammar' ? '📚 Ngữ pháp' : 
                         assignment.type === 'vocabulary' ? '📝 Từ vựng' : '🎤 Nói'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {assignment.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    {assignment.status === 'completed' && assignment.score && (
                      <span className="text-sm font-medium">{assignment.score}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Hạn: {assignment.dueDate}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {assignment.points} điểm
                  </span>
                </div>
                {assignment.status !== 'completed' && (
                  <Button size="sm" className="w-full mt-2">
                    {assignment.status === 'pending' ? 'Tiếp tục làm' : 'Bắt đầu'}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Thành tích gần đây
          </CardTitle>
          <CardDescription>
            Những huy hiệu bé vừa đạt được
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="p-4 border rounded-lg text-center bg-gradient-to-b from-yellow-50 to-orange-50">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-medium mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {achievement.earnedAt}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}