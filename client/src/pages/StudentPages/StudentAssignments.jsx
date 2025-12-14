import React, {useState, useEffect, useRef} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Star,
  Circle,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  PlayCircle,
  Upload,
  FileText,
  Trophy,
  Brain,
  Lightbulb,
  Sparkles,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // --- STATE LÀM BÀI QUIZ ---
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null); // Bài tập đang làm
  const [quizQuestions, setQuizQuestions] = useState([]); // Danh sách câu hỏi của bài đang làm
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Lưu đáp án: { questionId: "A" }
  
  // --- STATE KẾT QUẢ & TIMER ---
  const [quizResult, setQuizResult] = useState(null); // Kết quả trả về từ Backend sau khi nộp
  const [timeLeft, setTimeLeft] = useState(0); // Thời gian còn lại (giây)
  const timerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE NỘP BÀI TỰ LUẬN (Upload) ---
  // const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  // const [submissionText, setSubmissionText] = useState('');

  // 1. LẤY DANH SÁCH BÀI TẬP
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Gọi API lấy bài tập (Backend cần lọc bài tập của lớp học viên này)
      const res = await api.get('/assignments'); 
      console.log("🔥 Dữ liệu API trả về:", res.data.assignments);
      if (res.data.success) {
        setAssignments(res.data.assignments);
      }
    } catch (error) {
      console.error("Lỗi tải bài tập:", error);
      toast.error("Không thể tải danh sách bài tập.");
    } finally {
      setLoading(false);
    }
  };

  // 2. BẮT ĐẦU LÀM BÀI (START QUIZ)
  const startQuiz = async (assignment) => {
    try {
      // Gọi API lấy chi tiết bài tập (để lấy danh sách câu hỏi)
      // Lưu ý: Backend endpoint getAssignmentById với role student sẽ KHÔNG trả về correctAnswer
      const res = await api.get(`/assignments/${assignment._id}`);
      
      if (res.data.success) {
        const fullAssignment = res.data.assignment;
        setCurrentAssignment(fullAssignment);
        setQuizQuestions(fullAssignment.questions || []);
        
        // Reset trạng thái
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuizResult(null);
        setIsQuizDialogOpen(true);

        // Cài đặt thời gian (phút -> giây)
        if (fullAssignment.timeLimit && fullAssignment.timeLimit > 0) {
          setTimeLeft(fullAssignment.timeLimit * 60);
        } else {
          setTimeLeft(null); // Không giới hạn
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải nội dung bài tập.");
    }
  };

  // 3. XỬ LÝ TIMER (ĐẾM NGƯỢC)
  // Effect 1: Chỉ phụ trách việc đếm ngược thời gian
  useEffect(() => {
    // Chỉ chạy timer khi Dialog mở, chưa nộp bài và bài có giới hạn thời gian (timeLimit > 0)
    // Lưu ý: ta check currentAssignment?.timeLimit thay vì check timeLeft để tránh phụ thuộc vào biến thay đổi liên tục
    if (isQuizDialogOpen && !quizResult && currentAssignment?.timeLimit) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          // Nếu về 0 hoặc thấp hơn thì giữ nguyên 0, logic nộp bài sẽ do Effect 2 xử lý
          if (prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizDialogOpen, quizResult, currentAssignment]);

  // Effect 2: Chỉ phụ trách việc Tự Động Nộp khi hết giờ
  useEffect(() => {
    if (timeLeft === 0 && isQuizDialogOpen && !quizResult && currentAssignment?.timeLimit) {
      // Dọn dẹp interval ngay lập tức để tránh leak
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Gọi hàm nộp bài
      handleAutoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]); // Chỉ chạy khi thời gian thay đổi

  const formatTime = (seconds) => {
    if (seconds === null) return "Không giới hạn";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAutoSubmit = () => {
    toast.warning("Đã hết thời gian làm bài! Hệ thống đang tự động nộp.");
    submitQuiz();
  };

  // 4. CHỌN ĐÁP ÁN
  const handleAnswerSelect = (questionId, value) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // 5. NỘP BÀI (GỌI API CHẤM ĐIỂM)
  const submitQuiz = async () => {
    if (!currentAssignment) return;
    setIsSubmitting(true);

    try {
      // Chuẩn bị dữ liệu gửi về Backend
      const answersPayload = quizQuestions.map(q => ({
        questionId: q.id, // ID câu hỏi
        answer: userAnswers[q.id] || "" // Đáp án học viên chọn
      }));

      // Tính thời gian đã làm (Tổng - Còn lại)
      const timeSpent = currentAssignment.timeLimit 
        ? (currentAssignment.timeLimit * 60 - timeLeft) 
        : 0; 

      const payload = {
        assignmentId: currentAssignment._id,
        answers: answersPayload,
        timeSpent: timeSpent
      };

      // Gọi API nộp bài
      const res = await api.post('/submissions', payload);

      if (res.data.success) {
        const result = res.data.submission; // Backend trả về kết quả chấm
        setQuizResult(result); // Lưu kết quả để hiển thị màn hình điểm
        toast.success("Nộp bài thành công!");
        
        // Refresh lại danh sách bên ngoài để cập nhật trạng thái
        fetchAssignments();
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi nộp bài. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800'; 
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành';
      case 'overdue': return 'Quá hạn';
      default: return 'Đang mở';
    }
  };

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //         case "completed":
  //     return <CheckCircle className="w-4 h-4 text-green-500" />;
  //   case "overdue":
  //     return <AlertTriangle className="w-4 h-4 text-red-500" />;
  //   default:
  //     return <Circle className="w-4 h-4 text-gray-400" />;
  //   }
  // };

  const getTypeColor = (type) => {
    switch (type) {
      case 'grammar': return 'bg-blue-100 text-blue-800';
      case 'vocabulary': return 'bg-purple-100 text-purple-800';
      // case 'speaking': return 'bg-orange-100 text-orange-800';
      case 'reading': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // const getTypeText = (type) => {
  //   switch (type) {
  //     case 'grammar': return '📚 Ngữ pháp';
  //     case 'vocabulary': return '📝 Từ vựng';
  //     // case 'speaking': return '🎤 Nói';
  //     case 'reading': return '📖 Đọc';
  //     default: return '📋 Khác';
  //   }
  // };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return "Không thời hạn";
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return 'Đã quá hạn';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Còn ${days} ngày`;
    return `Còn ${hours} giờ`;
  };

  const filteredAssignments = assignments.filter(() => {
    if (activeTab === 'all') return true;
    // Logic filter cơ bản: Nếu tab là 'completed' thì hiện bài đã làm
    // Lưu ý: Backend cần trả về field 'isSubmitted' hoặc status tương ứng để filter chuẩn hơn
    return true;
  });

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bài tập của bạn</h2>
          <p className="text-muted-foreground">Danh sách bài tập và tiến độ học tập</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="todo">Cần làm</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {assignment.class_id?.name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusText(assignment.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getTypeColor(assignment.type)}>
                       {assignment.type === 'reading' ? '📖 Đọc hiểu' : '📚 Bài tập'}
                    </Badge>
                    <Badge variant="outline"><Clock className="w-3 h-3 mr-1"/> {assignment.timeLimit ? assignment.timeLimit + ' phút' : 'Không giới hạn'}</Badge>
                    <Badge variant="outline"><Star className="w-3 h-3 mr-1"/> {assignment.totalPoints} điểm</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Hạn nộp: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('vi-VN') : 'Không'}</span>
                    </div>
                    <span className={`font-medium ${isOverdue(assignment.dueDate) ? 'text-red-600' : 'text-green-600'}`}>
                      {getTimeRemaining(assignment.dueDate)}
                    </span>
                </div>

                <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => startQuiz(assignment)}
                >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Làm bài ngay
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* --- DIALOG LÀM BÀI --- */}
      <Dialog open={isQuizDialogOpen} onOpenChange={(open) => {
         if (!open && !quizResult) {
            if (window.confirm("Bạn đang làm bài. Thoát ra sẽ mất kết quả. Bạn chắc chắn chứ?")) {
                setIsQuizDialogOpen(false);
            }
         } else {
            setIsQuizDialogOpen(open);
         }
      }}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center mr-6">
                <div>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                    <Brain className="w-6 h-6 text-purple-600" />
                    {currentAssignment?.title}
                    </DialogTitle>
                </div>
                {!quizResult && timeLeft !== null && (
                    <div className={`text-xl font-bold font-mono px-3 py-1 rounded border ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>
          </DialogHeader>

          {/* TRẠNG THÁI 1: ĐANG LÀM BÀI */}
          {!quizResult && currentAssignment ? (
            <div className="flex flex-col h-full">
                {/* Progress bar */}
                <div className="mb-4">
                     <div className="flex justify-between text-sm mb-1">
                        <span>Câu {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                        <span>Đã chọn: {Object.keys(userAnswers).length} câu</span>
                    </div>
                    <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} className="h-2" />
                </div>

                {/* Bố cục chia 2 cột nếu là bài Reading */}
                <div className={`grid gap-6 ${currentAssignment.reading_passage ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                    
                    {/* Cột Trái: Bài đọc (Chỉ hiện nếu có reading_passage) */}
                    {currentAssignment.reading_passage && (
                        <div className="p-4 bg-slate-50 border rounded-lg h-fit max-h-[60vh] overflow-y-auto shadow-inner">
                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 sticky top-0 bg-slate-50 pb-2 border-b">
                                <BookOpen className="w-5 h-5 text-purple-600"/> Reading Passage
                            </h4>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify font-serif text-lg">
                                {currentAssignment.reading_passage}
                            </p>
                        </div>
                    )}

                    {/* Cột Phải: Câu hỏi */}
                    <div className="flex flex-col">
                        <div className="p-5 bg-white border rounded-xl shadow-sm min-h-[300px]">
                            <h3 className="text-lg font-medium mb-6 leading-relaxed">
                                <span className="font-bold text-purple-600 mr-2 bg-purple-50 px-2 py-1 rounded">
                                    Câu {currentQuestionIndex + 1}
                                </span>
                                {quizQuestions[currentQuestionIndex]?.question}
                            </h3>

                            <RadioGroup 
                                value={userAnswers[quizQuestions[currentQuestionIndex]?.id] || ""}
                                onValueChange={(val) => handleAnswerSelect(quizQuestions[currentQuestionIndex]?.id, val)}
                                className="space-y-3"
                            >
                                {quizQuestions[currentQuestionIndex]?.options.map((opt, idx) => (
                                    <div key={idx} 
                                        onClick={() => handleAnswerSelect(quizQuestions[currentQuestionIndex]?._id, opt)}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                        userAnswers[quizQuestions[currentQuestionIndex]?._id] === opt 
                                        ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' 
                                        : 'bg-white hover:bg-gray-50 hover:border-gray-300'
                                    }`}>
                                        <RadioGroupItem value={opt} id={`opt-${idx}`} />
                                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer text-base font-normal">
                                            {opt}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Điều hướng */}
                        <div className="flex justify-between mt-6">
                            <Button 
                                variant="outline"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                Quay lại
                            </Button>

                            {currentQuestionIndex < quizQuestions.length - 1 ? (
                                <Button 
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                                >
                                    Câu tiếp theo
                                </Button>
                            ) : (
                                <Button 
                                    className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                                    onClick={submitQuiz}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2"/> Nộp bài</>}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          ) : null}

          {/* TRẠNG THÁI 2: ĐÃ CÓ KẾT QUẢ */}
          {quizResult && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="text-center p-8 bg-gradient-to-b from-yellow-50 to-white rounded-xl border-2 border-yellow-200 shadow-sm">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết quả bài làm</h2>
                    <div className="text-5xl font-black text-purple-600 mb-2">
                        {quizResult.score} <span className="text-2xl text-gray-400 font-normal">/ {currentAssignment.totalPoints}</span>
                    </div>
                    <p className="text-muted-foreground">
                        Bạn đã hoàn thành bài tập này!
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setIsQuizDialogOpen(false)}>Đóng</Button>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}