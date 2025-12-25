import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import { Progress } from "../../components/ui/progress";
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
  // Star, 
  TrendingUp,
  // Award,
  Target,
  Calendar,
  BookOpen,
  MessageSquare,
  // Lightbulb,
  // CheckCircle,
  // AlertCircle,
  Brain,
  Loader2
} from 'lucide-react';

export function StudentGrades() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    quizResults: [],
    progressData: [],
    subjectAverages: [],
    stats: { averageScore: 0, totalQuizzes: 0, completionRate: 0, streak: 0 }
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/api/grades/my-grades')
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const { quizResults, progressData, subjectAverages, stats } = data;

  // Tính toán phân bố điểm số từ dữ liệu thật
  const scoreDistribution = [
    { name: '9-10 điểm', value: quizResults.filter(q => q.score >= 9).length, color: '#22c55e' },
    { name: '8-9 điểm', value: quizResults.filter(q => q.score >= 8 && q.score < 9).length, color: '#3b82f6' },
    { name: '7-8 điểm', value: quizResults.filter(q => q.score >= 7 && q.score < 8).length, color: '#f59e0b' },
    { name: '< 7 điểm', value: quizResults.filter(q => q.score < 7).length, color: '#ef4444' }
  ].filter(item => item.value > 0); // Chỉ hiện phần nào có dữ liệu

  const getScoreBadge = (score) => {
    if (score >= 9) return { emoji: '🌟', text: 'Xuất sắc!', color: 'bg-green-100 text-green-800' };
    if (score >= 8) return { emoji: '🎉', text: 'Tốt!', color: 'bg-blue-100 text-blue-800' };
    if (score >= 6.5) return { emoji: '👍', text: 'Khá!', color: 'bg-yellow-100 text-yellow-800' };
    return { emoji: '💪', text: 'Cố gắng!', color: 'bg-orange-100 text-orange-800' };
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 6.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-600 w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      {/* Header with motivational message */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">Thành tích học tập</h2>
            <p className="text-yellow-100">
              Bạn đã hoàn thành {stats.totalQuizzes} bài tập với điểm trung bình {stats.averageScore}
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
              <p className="text-sm text-muted-foreground">Bài đã làm</p>
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

        <Card className="bg-purple-50/50 border-purple-100">
            <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-700">
                    {progressData.length > 0 ? progressData[progressData.length-1].score : 0}
                </div>
                <p className="text-xs text-purple-600">Điểm tháng này</p>
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
            {/* Biểu đồ điểm theo môn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Điểm trung bình theo môn</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={subjectAverages}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="subject" fontSize={12} />
                    <YAxis domain={[0, 10]} hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} label={{ position: 'top', fill: '#666', fontSize: 12 }} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Biểu đồ tròn phân bố điểm */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Phân bố điểm số</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Điểm mạnh và cần cải thiện
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
          </div> */}
        </TabsContent>

        {/* Tab: Danh sách bài quiz */}
        <TabsContent value="quizzes" className="space-y-4">
          {quizResults.length === 0 ? (
              <div className="text-center py-10 text-gray-500">Chưa có bài tập nào được hoàn thành.</div>
          ) : (
            quizResults.map((quiz) => {
            const badge = getScoreBadge(quiz.score);
            return (
              <Card key={quiz.id} className="hover:shadow-md transition-all border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{quiz.subject}</span>
                        <span>• {new Date(quiz.date).toLocaleDateString('vi-VN')}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}
                      </div>
                      <div className="text-xs text-muted-foreground">/ {quiz.maxScore} điểm</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge className={`${badge.color} border-0`}>
                      {badge.emoji} {badge.text}
                    </Badge>
                    <Badge variant="outline">
                       {quiz.correctAnswers}/{quiz.totalQuestions} câu đúng
                    </Badge>
                    <Badge variant="outline">
                       ⏱️ {quiz.timeSpent}
                    </Badge>
                  </div>

                  {/* Feedback AI */}
                  {quiz.aiFeedback && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3 items-start">
                        <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Nhận xét từ AI</p>
                            <p className="text-sm text-blue-800 leading-relaxed">{quiz.aiFeedback}</p>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
          )}
        </TabsContent>

        {/* Tab: Tiến độ */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Biểu đồ phát triển
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="month" padding={{ left: 30, right: 30 }}/>
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                  <p className="text-center text-gray-500 py-10">Chưa đủ dữ liệu để vẽ biểu đồ.</p>
              )}  
            </CardContent>
          </Card>

          {/* Mục tiêu
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
          </Card> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
