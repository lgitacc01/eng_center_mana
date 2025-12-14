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

    let totalScore = 0;
    const gradedAnswers = [];

    for (const ans of answers) {
      const question = questionMap[ans.questionId];

      if (!question) {
        gradedAnswers.push({
          questionId: ans.questionId,
          answer: ans.answer,
          isCorrect: false,
          pointsAwarded: 0,
        });
        continue;
      }

      let isCorrect = false;
      let points = 0;
      let feedback = "";

      switch (question.type) {
        case "multiple_choice":
        case "true_false":
          if (String(ans.answer).trim() === String(question.correctAnswer).trim()) {
            isCorrect = true;
            points = question.points;
          }
          break;

        case "fill_blank":
          if (String(ans.answer).trim().toLowerCase() ===
              String(question.correctAnswer).trim().toLowerCase()) {
            isCorrect = true;
            points = question.points;
          }
          break;

        // Những câu này cần chấm tay
        case "short_answer":
        case "essay":
            // Gọi hàm AI chấm điểm
            const aiResult = await evaluateAnswerAI({
                questionContent: question.content || question.question, // Tùy field trong DB của bạn
                correctAnswer: question.correctAnswer,
                studentAnswer: ans.answer,
                maxPoints: question.points
            });
            points = aiResult.points;
            feedback = aiResult.feedback;
            // Coi là đúng nếu được > 50% số điểm (hoặc tùy logic bạn)
            isCorrect = points >= (question.points / 2);
            break;
        default:
            isCorrect = false;
            points = 0;
            break;
      }

      totalScore += points;

      gradedAnswers.push({
        questionId: ans.questionId,
        answer: ans.answer,
        isCorrect,
        pointsAwarded: points,
        feedback // Lưu feedback vào DB
      });
    }

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
          submittedAt: new Date() // Cập nhật lại thời gian nộp
        }
      },
      { 
        new: true,   // Trả về dữ liệu mới sau khi update
        upsert: true, // Nếu chưa có thì tạo mới, có rồi thì update
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
