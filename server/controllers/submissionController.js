// controllers/submissionController.js
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import { evaluateAnswerAI } from "./aiController.js";

/**
 * Học viên nộp bài
 */
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, answers, timeSpent } = req.body;
    const studentId = req.user.id; // từ verifyToken

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
    }

    // Map câu hỏi
    const questionMap = {};
    assignment.questions.forEach(q => {
      questionMap[q.id] = q;
    });

    //LOGIC TÍNH ĐIỂM THANG 10
    const totalQuestions = assignment.questions.length;
    const pointPerQuestion = totalQuestions > 0 ? (10 / totalQuestions) : 0;
    
    let correctCount = 0;
    const gradedAnswers = [];

    for (const ans of answers) {
      const question = questionMap[ans.questionId];

      if (!question) {
        gradedAnswers.push({
          questionId: ans.questionId,
          answer: ans.answer,
          isCorrect: false,
          pointsAwarded: 0,
          feedback: "Câu hỏi không còn tồn tại"
        });
        continue;
      }

      let isCorrect = false;
      let feedback = "";
      
      // Biến tạm để lưu điểm AI trả về
      let aiRawPoints = 0; 

      switch (question.type) {
        case "multiple_choice":
        case "true_false":
          if (String(ans.answer).trim() === String(question.correctAnswer).trim()) {
            isCorrect = true;
          }
          break;

        case "fill_blank":
          if (String(ans.answer).trim().toLowerCase() ===
              String(question.correctAnswer).trim().toLowerCase()) {
            isCorrect = true;
          }
          break;

        case "short_answer":
        case "essay": {
            // Gọi AI chấm
            const aiResult = await evaluateAnswerAI({
                questionContent: question.content || question.question,
                correctAnswer: question.correctAnswer,
                studentAnswer: ans.answer,
                maxPoints: question.points
            });
            
            aiRawPoints = aiResult.points;
            feedback = aiResult.feedback;
            
            // Logic xét đúng sai cho tự luận:
            // Nếu AI chấm > 50% số điểm gốc của câu đó thì tính là ĐÚNG
            if (aiRawPoints >= (question.points / 2)) {
                isCorrect = true;
            }
            break;
        }
        default:
            isCorrect = false;
            break;
      }

      // Nếu đúng thì tăng biến đếm
      if (isCorrect) {
        correctCount++;
      }

      gradedAnswers.push({
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect,
        // Lưu điểm của câu này
        pointsAwarded: isCorrect ? pointPerQuestion : 0, 
        feedback
      });
    }
    // Làm tròn 2 chữ số thập phân
    const totalScore = parseFloat((correctCount * pointPerQuestion).toFixed(2));

    const submission = await Submission.findOneAndUpdate(
      { 
        assignmentId: assignmentId, 
        studentId: studentId 
      },
      {
        $set: {
          answers: gradedAnswers,
          score: totalScore,
          timeSpent: timeSpent || 0,
          submittedAt: new Date()
        }
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );

    return res.status(201).json({
      success: true,
      message: "Nộp bài thành công",
      submission,
    });
  } catch (err) {
    console.error("Error submitAssignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Giáo viên xem danh sách bài nộp
 */
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignmentId: req.params.assignmentId,
    })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, submissions });
  } catch (err) {
    console.error("Error getSubmissionsByAssignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Lấy chi tiết bài nộp
 */
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("studentId", "name email");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài nộp" });
    }

    return res.json({ success: true, submission });
  } catch (err) {
    console.error("Error getSubmissionById:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
