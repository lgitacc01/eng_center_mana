import React, {useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Trophy, 
  Star, 
  TrendingUp,
  Award,
  Target,
  Calendar,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Brain
} from 'lucide-react';

export function StudentGrades() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - Điểm quiz
  const quizResults = [
    {
      id: 1,
      title: 'Unit 5: Past Simple Tense',
      subject: 'Ngữ pháp',
      date: '2024-10-28',
      score: 8.5,
      maxScore:'',
      totalQuestions:'',
      correctAnswers:'',
      timeSpent: '25 phút',
      difficulty: 'Dễ',
      aiFeedback: 'Bé làm rất tốt! Đặc biệt xuất sắc ở phần chia động từ. Cần ôn thêm về dạng phủ định.',
      aiSuggestions: [
        'Ôn lại phần câu phủ định với "didn\'t"',
        'Làm thêm bài tập về trạng từ chỉ thời gian',
        'Đọc truyện tiếng Anh để làm quen với thì quá khứ'
      ],
      topicScores: [
        'Câu khẳng định',
        'Câu phủ định',
        'Câu nghi vấn',
        'Trạng từ',
      ],
    },  
    {
      id: 2,
      title: 'Vocabulary Quiz - Animals',
      subject: 'Từ vựng',
      date: '2024-10-26',
      score: 9.0,
      maxScore:'',
      totalQuestions:'',
      correctAnswers:'',
      timeSpent: '20 phút',
      difficulty: 'Trung bình',
      aiFeedback: 'Tuyệt vời! Bé nhớ từ rất tốt và biết cách sử dụng từ đúng ngữ cảnh.',
      aiSuggestions: [
        'Học thêm từ vựng về động vật hoang dã',
        'Luyện phát âm với các từ khó',
        'Tạo câu chuyện với các từ vừa học'
      ],
      topicScores: [
        'Động vật nhà',
        'Động vật hoang dã',
        'Côn trùng',
        'Chim',
      ]
    }, 
    {
      id: 3,
      title: 'Reading Comprehension - My Family',
      subject: 'Đọc hiểu',
      date: '2024-10-24',
      score: 7.5,
      maxScore:'',
      totalQuestions:"",
      correctAnswers:'',
      timeSpent: '30 phút',
      difficulty: 'Trung bình',
      aiFeedback: 'Bé đọc hiểu tốt nhưng cần chú ý đến các từ nối trong câu để hiểu ý chính.',
      aiSuggestions: [
        'Đọc thêm các đoạn văn ngắn về gia đình',
        'Học từ vựng về mối quan hệ gia đình',
        'Luyện tìm ý chính của đoạn văn'
      ],
      topicScores: [
        'Chi tiết',
        'Ý chính',
        'Suy luận',
        'Từ vựng',
      ],
    },
    {
      id:4,
      title: 'Listening Test - Daily Routines',
      subject: 'Nghe',
      date: '2024-10-22',
      score: 8.0,
      maxScore:'',
      totalQuestions:'',
      correctAnswers:'',
      timeSpent: '35 phút',
      difficulty: 'Khó',
      aiFeedback: 'Bé nghe khá tốt! Cần luyện nghe các từ phát âm nhanh hơn.',
      aiSuggestions: [
        'Nghe podcast tiếng Anh cho trẻ em',
        'Luyện nghe và lặp lại câu',
        'Xem phim hoạt hình tiếng Anh có phụ đề'
      ],
      topicScores: [
        'Chi tiết',
        'Ý chính',
        'Phát âm',
        'Từ vựng'
      ]
    }
  ]   

  // Biểu đồ tiến độ theo thời gian
  const progressData = [
    { month: 'T8', score: 7.2 },
    { month: 'T9', score: 7.8 },
    { month: 'T10', score: 8.3 },
    { month: 'T11', score: 8.3 }
  ];

  // Điểm trung bình theo môn
  const subjectAverages = [
    { subject: 'Ngữ pháp', score: 8.5, total:''},
    { subject: 'Từ vựng', score: 9.0, total:''},
    { subject: 'Đọc hiểu', score: 7.5, total:''},
    { subject: 'Nghe', score: 8.0, total:''},
    { subject: 'Nói', score: 8.2, total:''}
    ];    

  // Phân bố điểm
  const scoreDistribution = [
    { name: '9-10 điểm', value:'', color: '#22c55e' },
    { name: '8-9 điểm', value:'', color: '#3b82f6' },
    { name: '7-8 điểm', value:'', color: '#f59e0b' },
    { name: '<7 điểm', value:'', color: '#ef4444' }
  ];

  // Thống kê tổng quan
  const stats = {
    averageScore: 8.25,
    totalQuizzes:'',
    completionRate:'',
    currentRank:'',
    totalStudents:'',
    streak:'',
    badges:''
  }  

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-800 border-green-200';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Khó': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 9) return { emoji: '🌟', text: 'Xuất sắc!', color: 'bg-green-100 text-green-800' };
    if (score >= 8) return { emoji: '🎉', text: 'Tốt!', color: 'bg-blue-100 text-blue-800' };
    if (score >= 7) return { emoji: '👍', text: 'Khá!', color: 'bg-yellow-100 text-yellow-800' };
    return { emoji: '💪', text: 'Cố gắng!', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <div className="space-y-6">
      {/* Header with motivational message */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Điểm số của bé 🏆</h2>
            <p className="text-yellow-100">
              Điểm trung bình: {stats.averageScore}/10 - Hạng {stats.currentRank}/{stats.totalStudents} trong lớp
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.averageScore}</div>
            <div className="text-sm text-yellow-100">Điểm TB</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</div>
              <p className="text-sm text-muted-foreground">Bài quiz</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
              <p className="text-sm text-muted-foreground">Ngày liên tiếp</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.badges}</div>
              <p className="text-sm text-muted-foreground">Huy hiệu</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="quizzes">Bài quiz</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
        </TabsList>

        {/* Tab: Tổng quan */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Biểu đồ điểm trung bình theo môn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Điểm theo môn học
                </CardTitle>
                <CardDescription>
                  Điểm trung bình của bé ở từng môn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Phân bố điểm */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Phân bố điểm số
                </CardTitle>
                <CardDescription>
                  Tỷ lệ các mức điểm của bé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Điểm mạnh và cần cải thiện */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Điểm mạnh 💪
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>Từ vựng</span>
                  <Badge className="bg-green-600">9.0/10</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>Ngữ pháp</span>
                  <Badge className="bg-green-600">8.5/10</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>Nói</span>
                  <Badge className="bg-green-600">8.2/10</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  Cần cải thiện 📚
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span>Đọc hiểu</span>
                  <Badge className="bg-orange-600">7.5/10</Badge>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Gợi ý AI:</strong> Đọc thêm truyện tiếng Anh ngắn mỗi ngày để cải thiện kỹ năng đọc hiểu.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Danh sách bài quiz */}
        <TabsContent value="quizzes" className="space-y-4">
          {quizResults.map((quiz) => {
            const badge = getScoreBadge(quiz.score);
            return (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {quiz.subject} • {new Date(quiz.date).toLocaleDateString('vi-VN')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}
                      </div>
                      <div className="text-sm text-muted-foreground">/{quiz.maxScore}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={badge.color}>
                      {badge.emoji} {badge.text}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {quiz.correctAnswers}/{quiz.totalQuestions} câu đúng
                    </Badge>
                    <Badge variant="outline">
                      ⏱️ {quiz.timeSpent}
                    </Badge>
                  </div>

                  {/* Topic Scores */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Điểm theo chủ đề
                    </h4>
                    {Object.entries(quiz.topicScores).map(([topic, score]) => (
                      <div key={topic} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{topic}</span>
                          <span className="font-medium">{score}/10</span>
                        </div>
                        <Progress value={score * 10} className="h-2" />
                      </div>
                    ))}
                  </div>

                  {/* AI Feedback */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="flex items-center gap-2 font-medium text-blue-800 mb-2">
                      <Brain className="w-4 h-4" />
                      Nhận xét từ AI
                    </h5>
                    <p className="text-sm text-blue-700">{quiz.aiFeedback}</p>
                  </div>

                  {/* AI Suggestions */}
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 className="flex items-center gap-2 font-medium text-purple-800 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      Gợi ý học tập từ AI
                    </h5>
                    <ul className="space-y-1">
                      {quiz.aiSuggestions.map((suggestion, idx) => (
                        <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Xem chi tiết & làm lại
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Tab: Tiến độ */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tiến độ theo thời gian
              </CardTitle>
              <CardDescription>
                Điểm trung bình của bé qua các tháng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: "Điểm TB"}}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">
                    Tiến bộ rõ rệt! Bé đã cải thiện +1.1 điểm trong 3 tháng qua 🎉
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mục tiêu */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Star className="w-5 h-5" />
                Mục tiêu tiếp theo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Đạt điểm 9+ trong 3 bài quiz liên tiếp</span>
                  <Badge variant="outline">2/3</Badge>
                </div>
                <Progress value={66} className="h-2" />
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Hoàn thành 20 bài quiz</span>
                  <Badge variant="outline">18/20</Badge>
                </div>
                <Progress value={90} className="h-2" />
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Học 15 ngày liên tiếp</span>
                  <Badge variant="outline">12/15</Badge>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
