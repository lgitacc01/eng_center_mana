// CreateAssignment.jsx
import React, {useState} from 'react';
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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "sonner";
import {
  Plus,
  Brain,
  Sparkles,
  Save,
  HelpCircle,
  Trash2,
  Copy,
  Edit,
  Loader2,
  BookOpen
} from "lucide-react";

export default function CreateAssignment({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  classesList = [],
  isEditing = false
}) {
  // currentStep: 0..3
  const [currentStep, setCurrentStep] = useState(0);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCount, setAiCount] = useState(5);

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    className: "",
    type: "",
    reading_passage: "",
    dueDate: "",
    dueTime: "",
    totalPoints: "",
    timeLimit: "",
    attempts: 1,
    randomizeQuestions: false,
    showResults: false,
    allowLateSubmission: false,
    questions: [],
    instructions: "",
    materials: "",
    ...initialData
  });

  // 2. THÊM USEEFFECT ĐỂ RESET FORM KHI initialData THAY ĐỔI
  React.useEffect(() => {
      if (isOpen) {
        setCurrentStep(0);
          if (isEditing && initialData) {
              // Format lại ngày giờ từ ISO string nếu cần
              // Ví dụ: tách 2025-12-15T14:30 thành ngày và giờ riêng
              let formattedDate = "";
              let formattedTime = "";
              if(initialData.dueDate) {
                  const dateObj = new Date(initialData.dueDate);
                  formattedDate = dateObj.toISOString().split('T')[0];
                  // Lấy giờ phút HH:MM
                  formattedTime = dateObj.toTimeString().slice(0, 5);
              }

              setAssignment({
                  ...initialData,
                  dueDate: formattedDate,
                  dueTime: formattedTime,
                  class_id: initialData.class_id?._id || initialData.class_id, // Xử lý nếu class_id là object hay string
                  questions: initialData.questions || []
              });
          } else {
              // Reset về rỗng nếu là Tạo mới
              setAssignment({
                  title: "",
                  description: "",
                  className: "",
                  type: "", 
                  reading_passage: "",
                  dueDate: "",
                  dueTime: "",
                  totalPoints: "",
                  timeLimit: "",
                  attempts: 1,
                  randomizeQuestions: false,
                  showResults: false,
                  allowLateSubmission: false,
                  questions: [],
                  instructions: "",
                  materials: "",
              });
          }
      }
  }, [isOpen, initialData, isEditing]);

  const [currentQuestion, setCurrentQuestion] = useState({
    id: "",
    type: "multiple_choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    difficulty: "medium",
    explanation: "",
  });

  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);

  // assignment types (kept as meaningful labels — bạn có thể thay đổi / lấy từ backend)
  const assignmentTypes = [
    { value: "grammar", label: "Ngữ pháp" },
    { value: "vocabulary", label: "Từ vựng" },
    { value: "speaking", label: "Nói" },
    { value: "reading", label: "Đọc" },
    { value: "writing", label: "Viết" },
    { value: "listening", label: "Nghe" },
    { value: "mixed", label: "Tổng hợp" },
  ];

  const questionTypes = [
    { value: "multiple_choice", label: "Trắc nghiệm", icon: "🔘" },
    { value: "true_false", label: "Đúng/Sai", icon: "✅" },
    { value: "fill_blank", label: "Điền chỗ trống", icon: "📝" },
    { value: "short_answer", label: "Trả lời ngắn", icon: "💬" },
    { value: "essay", label: "Tự luận", icon: "📄" },
    { value: "listening", label: "Nghe", icon: "👂" },
    { value: "speaking", label: "Nói", icon: "🎤" },
  ];

  // Steps: 0..3
  const steps = [
    { id: 0, title: "Thông tin cơ bản", icon: "📋" },
    { id: 1, title: "Cài đặt chi tiết", icon: "⚙️" },
    { id: 2, title: "Câu hỏi", icon: "❓" },
    { id: 3, title: "Xem trước", icon: "👁️" },
  ];

  // ----- Question operations (sửa lỗi setAssignment dùng biến đúng) -----
  const addQuestion = () => {
    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
    };

    if (isEditingQuestion && editingQuestionIndex >= 0) {
      const updatedQuestions = [...assignment.questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setAssignment({ ...assignment, questions: updatedQuestions });
      setIsEditingQuestion(false);
      setEditingQuestionIndex(-1);
    } else {
      setAssignment({
        ...assignment,
        questions: [...assignment.questions, newQuestion],
      });
    }

    // Reset form
    setCurrentQuestion({
      id: "",
      type: "multiple_choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
      difficulty: "medium",
      explanation: "",
    });
    setShowQuestionDialog(false);
    toast.success(isEditingQuestion ? "Câu hỏi đã được cập nhật!" : "Đã thêm câu hỏi mới!");
  };

  const editQuestion = (index) => {
    const q = assignment.questions[index];
    if (!q) return;
    setCurrentQuestion(q);
    setIsEditingQuestion(true);
    setEditingQuestionIndex(index);
    setShowQuestionDialog(true);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = assignment.questions.filter((_, i) => i !== index);
    setAssignment({ ...assignment, questions: updatedQuestions });
    toast.success("Đã xóa câu hỏi!");
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...(assignment.questions[index] || {}) };
    if (!questionToDuplicate.id) return;
    questionToDuplicate.id = Date.now().toString();
    questionToDuplicate.question = (questionToDuplicate.question || "") + " (Copy)";

    const updatedQuestions = [...assignment.questions];
    updatedQuestions.splice(index + 1, 0, questionToDuplicate);
    setAssignment({ ...assignment, questions: updatedQuestions });
    toast.success("Đã sao chép câu hỏi!");
  };

  // --- HÀM GỌI AI (giữ lại chức năng, gọi backend thật của bạn) ---
  const handleGenerateAI = async () => {
    // 1. Kiểm tra đầu vào
    if (!aiContent.trim()) {
      toast.error("Vui lòng nhập nội dung nguồn!");
      return;
    }

    setAiLoading(true); // Bắt đầu quay
    try {

      const countRequest = (assignment.type === 'writing' || assignment.type === 'speaking') 
                         ? 1 
                         : (Number(aiCount) || 5);
      // 2. Gọi API
      const res = await api.post('/ai/generate-quiz', {
        content: aiContent,
        number: countRequest,
        type: assignment.type // Quan trọng: Gửi loại bài để BE xử lý
      });

      console.log("AI Response:", res.data); // Log để kiểm tra data trả về

      const responseData = res.data?.data;
      
      // 3. Khởi tạo biến mặc định là mảng rỗng để tránh lỗi undefined
      let newQuestionsRaw = [];
      let newPassage = "";

      // Logic phân loại dữ liệu an toàn
      if (responseData) {
        // Ưu tiên check bài Reading trước
        if (responseData.passage || (responseData.questions && !Array.isArray(responseData))) {
          newPassage = responseData.passage || "";
          newQuestionsRaw = responseData.questions || [];
        } 
        // Nếu là mảng trực tiếp
        else if (Array.isArray(responseData)) {
          newQuestionsRaw = responseData;
        } 
        // Fallback cho trường hợp object { questions: [...] }
        else if (responseData.questions && Array.isArray(responseData.questions)) {
          newQuestionsRaw = responseData.questions;
        }
      }

      // Đảm bảo newQuestionsRaw luôn là mảng
      if (!Array.isArray(newQuestionsRaw)) {
        console.warn("Dữ liệu câu hỏi không phải là mảng:", newQuestionsRaw);
        newQuestionsRaw = []; // Reset về rỗng để không crash
      }

      // 4. Map dữ liệu & Fix lỗi đáp án A/B/C
      const newQuestions = newQuestionsRaw.map((q, index) => {
        let finalCorrectAnswer = q.correctAnswer;

        if (Array.isArray(finalCorrectAnswer)) {
            finalCorrectAnswer = finalCorrectAnswer.join('\n\n'); // Gộp các dòng lại, cách nhau bởi xuống dòng
        }
        
        // Tự động chuyển đổi đáp án A, B, C... thành nội dung text
        if (q.correctAnswer && q.correctAnswer.length === 1 && q.options?.length > 0) {
            const charCode = q.correctAnswer.toUpperCase().charCodeAt(0); // A=65
            const optionIndex = charCode - 65;
            if (optionIndex >= 0 && optionIndex < q.options.length) {
                finalCorrectAnswer = q.options[optionIndex];
            }
        }

        return {
          id: Date.now().toString() + index + Math.random(),
          type: q.type || "multiple_choice",
          question: q.question || "",
          options: q.options || [],
          correctAnswer: finalCorrectAnswer,
          points: 1,
          difficulty: q.difficulty || "medium",
          explanation: q.explanation || ""
        };
      });

      // 5. Cập nhật State
      setAssignment(prev => ({
        ...prev,
        // Nếu AI trả về passage mới thì dùng, không thì giữ cái cũ
        reading_passage: newPassage || prev.reading_passage,
        questions: [...prev.questions, ...newQuestions]
      }));

      if (newQuestions.length > 0) {
        toast.success(`Đã tạo thành công ${newQuestions.length} câu hỏi!`);
        setShowAIDialog(false); // Đóng popup
        setAiContent("");
      } else {
        toast.warning("AI không trả về câu hỏi nào. Vui lòng thử lại với nội dung rõ ràng hơn.");
      }
    } catch (error) {
      console.error("Lỗi Frontend:", error);
      toast.error("Lỗi khi tạo câu hỏi từ AI. Vui lòng thử lại!");
    } finally {
      setAiLoading(false);
    }
  };

  const calculateTotalPoints = () => {
    return assignment.questions.length > 0 ? 10 : 0;
  };

  const handleSave = () => {
    if (!assignment.title || !assignment.class_id || assignment.questions.length === 0) {
      toast.error("Vui lòng điền tiêu đề, chọn lớp và thêm ít nhất 1 câu hỏi!");
      return;
    }
    
    // Gộp ngày và giờ thành ISO String
    let finalDueDate = null;
    if (assignment.dueDate) {
      const dateTimeString = assignment.dueTime 
        ? `${assignment.dueDate}T${assignment.dueTime}` 
        : `${assignment.dueDate}T23:59`;
      finalDueDate = new Date(dateTimeString).toISOString();
    }

    const finalAssignment = {
      ...assignment,
      dueDate: finalDueDate,
      class_id: assignment.class_id,
      totalPoints: calculateTotalPoints(),
    };

    // Xóa các trường thừa không gửi về DB (để sạch data)
    delete finalAssignment.className; 
    delete finalAssignment.dueTime;

    onSave(finalAssignment);
    toast.success("Bài tập đã được tạo thành công!");
    onClose();
  };

  const renderQuestionForm = () => {
    switch (currentQuestion.type) {
      case "multiple_choice":
        return (
          <div className="space-y-4">
            <div>
              <Label>Câu hỏi</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Nhập câu hỏi trắc nghiệm..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Các lựa chọn</Label>
              <div className="space-y-2">
                <RadioGroup
                  value={currentQuestion.correctAnswer}
                  onValueChange={(value) =>
                  setCurrentQuestion({ ...currentQuestion, correctAnswer: value })
                  }
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center space-x-2 w-full">
                        <RadioGroupItem 
                          value={option}
                          id={`option-${index}`}
                          // Chỉ cho phép chọn nếu ô input đã có nội dung (tránh chọn ô rỗng)
                         disabled={!option || option.trim() === ""} 
                        />

                        <Input
                          value={option}
                          onChange={(e) => {
                            const newText = e.target.value;
                            const oldText = option; // Lưu lại giá trị cũ
                        
                            const newOptions = [...(currentQuestion.options || [])];
                            newOptions[index] = newText;

                            // 2. LOGIC ĐỒNG BỘ:
                            // Nếu option đang sửa chính là đáp án đang được chọn là đúng
                            // thì phải cập nhật cả correctAnswer theo text mới.
                            let newCorrectAnswer = currentQuestion.correctAnswer;
                            if (newCorrectAnswer === oldText) {
                            newCorrectAnswer = newText;
                            }
                            setCurrentQuestion({ 
                              ...currentQuestion, 
                              options: newOptions, 
                              correctAnswer: newCorrectAnswer 
                            });
                          }}
                            placeholder={`Lựa chọn ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case "true_false":
        return (
          <div className="space-y-4">
            <div>
              <Label>Câu hỏi</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Nhập câu hỏi đúng/sai..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Đáp án đúng</Label>
              <RadioGroup
                value={currentQuestion.correctAnswer}
                onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value})}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true">Đúng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false">Sai</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case "fill_blank":
        return (
          <div className="space-y-4">
            <div>
              <Label>Câu hỏi (sử dụng ___ cho chỗ trống)</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="VD: I _____ to school yesterday."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Đáp án đúng</Label>
              <Input
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                placeholder="Nhập đáp án..."
              />
            </div>
          </div>
        );

      case "short_answer":
      case "essay":
        return (
          <div className="space-y-4">
            <div>
              <Label>Câu hỏi</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Nhập câu hỏi tự luận..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Gợi ý đáp án (tùy chọn)</Label>
              <Textarea
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                placeholder="Nhập gợi ý đáp án để hỗ trợ chấm điểm..."
                className="min-h-[60px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Tạo bài tập mới
          </DialogTitle>
          <DialogDescription>
            Tạo bài tập chi tiết với nhiều dạng câu hỏi và AI hỗ trợ
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-purple-600" : "text-gray-500"}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${currentStep > step.id ? "bg-purple-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <Tabs value={currentStep.toString()} className="space-y-6">
          {/* Step 0: Basic Information */}
          <TabsContent value="0" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tiêu đề bài tập</Label>
                    <Input
                      value={assignment.title}
                      onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                      placeholder="VD: Unit 5: Past Simple Tense"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lớp học</Label>
                    <Select value={assignment.class_id} onValueChange={(value) => 
                      setAssignment({ ...assignment, class_id: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        {classesList.map(cls => (
                          <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Loại bài tập</Label>
                    <Select value={assignment.type} onValueChange={(value) => 
                      setAssignment({ ...assignment, type: value})
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignmentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hạn nộp</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={assignment.dueDate}
                        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        type="time"
                        value={assignment.dueTime}
                        onChange={(e) => setAssignment({ ...assignment, dueTime: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mô tả bài tập</Label>
                  <Textarea
                    value={assignment.description}
                    onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                    placeholder="Mô tả chi tiết về bài tập..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hướng dẫn làm bài</Label>
                  <Textarea
                    value={assignment.instructions}
                    onChange={(e) => setAssignment({ ...assignment, instructions: e.target.value })}
                    placeholder="Hướng dẫn cụ thể cho học sinh..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 1: Settings */}
          <TabsContent value="1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Thời gian làm bài (phút)</Label>
                      <Input
                        type="number"
                        value={assignment.timeLimit || ""}
                        onChange={(e) => setAssignment({ ...assignment, timeLimit: parseInt(e.target.value) || "" })}
                        placeholder="60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Số lần làm được phép</Label>
                      <Select value={(assignment.attempts ?? '').toString()} onValueChange={(value) => 
                        setAssignment({ ...assignment, attempts: parseInt(value) })
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 lần</SelectItem>
                          <SelectItem value="2">2 lần</SelectItem>
                          <SelectItem value="3">3 lần</SelectItem>
                          <SelectItem value="-1">Không giới hạn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Trộn câu hỏi</Label>
                        <p className="text-sm text-muted-foreground">
                          Thứ tự câu hỏi sẽ khác nhau cho mỗi học sinh
                        </p>
                      </div>
                      <Switch
                        checked={assignment.randomizeQuestions}
                        onCheckedChange={(checked) => setAssignment({ ...assignment, randomizeQuestions: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Hiển thị kết quả</Label>
                        <p className="text-sm text-muted-foreground">
                          Học sinh xem điểm ngay sau khi nộp bài
                        </p>
                      </div>
                      <Switch
                        checked={assignment.showResults}
                        onCheckedChange={(checked) => setAssignment({ ...assignment, showResults: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Cho phép nộp muộn</Label>
                        <p className="text-sm text-muted-foreground">
                          Học sinh có thể nộp sau hạn chót
                        </p>
                      </div>
                      <Switch
                        checked={assignment.allowLateSubmission}
                        onCheckedChange={(checked) => setAssignment({ ...assignment, allowLateSubmission: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Questions */}
          <TabsContent value="2" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Câu hỏi</CardTitle>
                    <CardDescription>
                      Đã có {assignment.questions.length} câu hỏi - Tổng {calculateTotalPoints()} điểm
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAIDialog(true)}
                      className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Brain className="w-4 h-4" />
                      AI tạo câu hỏi
                    </Button>
                    <Button
                      onClick={() => setShowQuestionDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm câu hỏi
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* --- THÊM PHẦN NÀY: Ô NHẬP READING PASSAGE --- */}
                {assignment.type === 'reading' && (
                  <div className="mb-6 p-4 bg-slate-50 border rounded-lg space-y-2">
                    <Label className="flex items-center gap-2 text-purple-700 font-semibold">
                      <BookOpen className="w-4 h-4" /> {/* Nhớ import BookOpen từ lucide-react */}
                      Nội dung bài đọc (Reading Passage)
                    </Label>
                    <Textarea 
                      value={assignment.reading_passage}
                      onChange={(e) => setAssignment({...assignment, reading_passage: e.target.value})}
                      placeholder="Dán nội dung bài đọc tiếng Anh vào đây, hoặc để AI tự tạo..."
                      className="min-h-[200px] bg-white font-serif text-base leading-relaxed"
                    />
                  </div>
                )}
                {/* --------------------------------------------- */}
                {assignment.questions.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Hãy thêm câu hỏi đầu tiên cho bài tập của bạn
                    </p>
                    <Button onClick={() => setShowQuestionDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm câu hỏi
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignment.questions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                {questionTypes.find(t => t.value === question.type)?.icon} {questionTypes.find(t => t.value === question.type)?.label}
                              </Badge>
                              <Badge variant="secondary">{(10 / assignment.questions.length).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} điểm</Badge>
                              <Badge>
                                {question.difficulty === "easy" ? "Dễ" : question.difficulty === "medium" ? "Trung bình" : "Khó"}
                              </Badge>
                            </div>
                            <p className="font-medium text-sm mb-2">Câu {index + 1}: {question.question}</p>
                            {question.options && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Đáp án:</strong> {question.correctAnswer}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editQuestion(index)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => duplicateQuestion(index)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteQuestion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Preview */}
          <TabsContent value="3" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Xem trước bài tập</CardTitle>
                <CardDescription>
                  Kiểm tra lại thông tin trước khi tạo bài tập
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Thông tin chung</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tiêu đề:</strong> {assignment.title}</p>
                      <p><strong>Lớp học:</strong> {classesList.find(c => c._id === assignment.class_id)?.name || "Chưa chọn"}</p>
                      <p><strong>Loại:</strong> {assignmentTypes.find(t => t.value === assignment.type)?.label}</p>
                      <p><strong>Hạn nộp:</strong> {assignment.dueDate} {assignment.dueTime}</p>
                      <p><strong>Thời gian:</strong> {assignment.timeLimit} phút</p>
                      <p><strong>Số lần làm:</strong> {assignment.attempts === -1 ? "Không giới hạn" : `${assignment.attempts} lần`}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Thống kê câu hỏi</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Tổng câu hỏi:</strong> {assignment.questions.length}</p>
                      <p><strong>Tổng điểm:</strong> {calculateTotalPoints()}</p>
                      <p><strong>Trộn câu hỏi:</strong> {assignment.randomizeQuestions ? "Có" : "Không"}</p>
                      <p><strong>Hiển thị kết quả:</strong> {assignment.showResults ? "Có" : "Không"}</p>
                      <p><strong>Cho nộp muộn:</strong> {assignment.allowLateSubmission ? "Có" : "Không"}</p>
                    </div>
                  </div>
                </div>

                {assignment.description && (
                  <div>
                    <h4 className="font-medium mb-2">Mô tả</h4>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  </div>
                )}

                {assignment.instructions && (
                  <div>
                    <h4 className="font-medium mb-2">Hướng dẫn</h4>
                    <p className="text-sm text-muted-foreground">{assignment.instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Question Dialog */}
        <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
              </DialogTitle>
              <DialogDescription>
                {isEditingQuestion ? "Cập nhật thông tin câu hỏi" : "Tạo câu hỏi mới cho bài tập"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại câu hỏi</Label>
                  <Select value={currentQuestion.type} onValueChange={(value) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      type: value,
                      options: value === "multiple_choice" ? (currentQuestion.options?.length ? currentQuestion.options : ["", "", "", ""]) : []
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Điểm số</Label>
                  <div className="p-2 bg-gray-100 rounded text-sm text-gray-600">
                    Tự động (10 điểm / {assignment.questions.length + (isEditingQuestion ? 0 : 1)} câu)
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Độ khó</Label>
                  <Select value={currentQuestion.difficulty} onValueChange={(value) =>
                    setCurrentQuestion({ ...currentQuestion, difficulty: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Dễ</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {renderQuestionForm()}

              <div className="space-y-2">
                <Label>Giải thích (tùy chọn)</Label>
                <Textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  placeholder="Giải thích đáp án cho học sinh..."
                  className="min-h-[60px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={addQuestion}>
                  {isEditingQuestion ? "Cập nhật" : "Thêm câu hỏi"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Input Dialog */}
        <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600"/>
                AI Soạn đề tự động
              </DialogTitle>
              <DialogDescription>
                Dán văn bản, bài đọc hoặc chủ đề vào đây để AI tạo câu hỏi.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nội dung nguồn</Label>
                <Textarea
                  placeholder="Dán đoạn văn hoặc chủ đề..."
                  className="min-h-[150px]"
                  value={aiContent}
                  onChange={(e) => setAiContent(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                {assignment.type !== 'writing' && (
                <div className="flex-1 space-y-2">
                  <Label>Số lượng câu</Label>
                  <Input
                    type="number" min="1" max="50" value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                  />
                </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>Hủy</Button>
              <Button
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {aiLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/> Đang tạo...</> : <><Sparkles className="w-4 h-4 mr-2"/> Tạo ngay</>}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Quay lại
          </Button>

          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                className="flex items-center gap-2"
              >
                Tiếp theo
                <Plus className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4" />
                {isEditing ? "Cập nhật bài tập" : "Tạo bài tập"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
