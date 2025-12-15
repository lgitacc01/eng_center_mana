import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";

/**
 * API cho Giáo viên: Lấy bảng điểm tổng hợp của lớp
 * Endpoint này phục vụ cho trang: /teacher/grades
 */
export const getClassGrades = async (req, res) => {
  try {
    const { classId } = req.params;
    
    // 1. Lấy danh sách học sinh trong lớp
    const currentClass = await Class.findById(classId).populate('students', 'full_name email avatar');
    if (!currentClass) return res.status(404).json({ success: false, message: "Lớp không tồn tại" });

    const studentList = currentClass.students;

    // 2. Lấy tất cả bài tập thuộc lớp này
    const assignments = await Assignment.find({ class_id: classId }).select('_id type title');
    const assignmentIds = assignments.map(a => a._id);

    // 3. Lấy tất cả bài nộp tương ứng
    const submissions = await Submission.find({ 
      assignmentId: { $in: assignmentIds } 
    }).populate('assignmentId', 'type title');

    // 4. Tổng hợp dữ liệu
    const reportData = studentList.map(student => {
      // Lọc ra bài làm của học sinh này
      const studentSubs = submissions.filter(s => s.studentId.toString() === student._id.toString());
      
      // Gom nhóm điểm theo kỹ năng
      const gradesBySkill = {
        listening: [],
        speaking: [],
        reading: [],
        writing: [],
        grammar: [], 
        vocabulary: [] 
      };

      let totalScore = 0;
      let count = 0;

      studentSubs.forEach(sub => {
        const type = sub.assignmentId ? (sub.assignmentId.type || 'other') : 'other';
        
        if (gradesBySkill[type]) {
          gradesBySkill[type].push(sub.score);
        }
        
        totalScore += sub.score;
        count++;
      });

      const average = count > 0 ? (totalScore / count).toFixed(1) : 0;

      return {
        studentId: student._id,
        studentName: student.full_name,
        className: currentClass.name,
        avatar: student.avatar || "👤",
        grades: gradesBySkill,
        average: parseFloat(average),
        completedAssignments: count,
        totalAssignments: assignmentIds.length
      };
    });

    return res.json({ success: true, report: reportData });
  } catch (error) {
    console.error("Error getClassGrades:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * API cho Học sinh: Lấy báo cáo cá nhân
 * Endpoint này phục vụ cho trang: /student/grades
 */
export const getStudentReport = async (req, res) => {
  try {
    const studentId = req.user.id; // Lấy từ verifyToken

    // 1. Lấy tất cả bài nộp của học sinh
    const submissions = await Submission.find({ studentId })
      .populate({
        path: 'assignmentId',
        select: 'title type createdAt totalPoints questions timeLimit'
      })
      .sort({ createdAt: -1 });

    // 2. Tính toán thống kê
    let totalScore = 0;
    const subjectStats = {}; 
    const monthlyProgress = {}; 

    const quizResults = submissions.map(sub => {
      if(!sub.assignmentId) return null; 

      const type = sub.assignmentId.type || 'other';

      // Thống kê theo môn
      if (!subjectStats[type]) subjectStats[type] = { sum: 0, count: 0 };
      subjectStats[type].sum += sub.score;
      subjectStats[type].count += 1;

      // Thống kê theo tháng (Tiến độ)
      const dateObj = new Date(sub.createdAt);
      const monthKey = `T${dateObj.getMonth() + 1}`; 
      
      if (!monthlyProgress[monthKey]) monthlyProgress[monthKey] = [];
      monthlyProgress[monthKey].push(sub.score);

      totalScore += sub.score;

      return {
        id: sub._id,
        title: sub.assignmentId.title,
        subject: type,
        date: sub.createdAt,
        score: sub.score,
        maxScore: 10, 
        correctAnswers: sub.answers.filter(a => a.isCorrect).length,
        totalQuestions: sub.answers.length,
        timeSpent: sub.timeSpent ? `${Math.floor(sub.timeSpent / 60)} phút` : '0 phút',
        aiFeedback: sub.answers[0]?.feedback || "Hoàn thành tốt!",
      };
    }).filter(item => item !== null);

    // Format dữ liệu biểu đồ
    const subjectAverages = Object.keys(subjectStats).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      score: parseFloat((subjectStats[key].sum / subjectStats[key].count).toFixed(1))
    }));

    const progressData = Object.keys(monthlyProgress).map(month => {
       const scores = monthlyProgress[month];
       const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
       return { month, score: parseFloat(avg.toFixed(1)) };
    });
    
    // Sắp xếp tháng
    progressData.sort((a, b) => parseInt(a.month.slice(1)) - parseInt(b.month.slice(1)));

    const averageScore = submissions.length > 0 ? (totalScore / submissions.length).toFixed(1) : 0;

    return res.json({
      success: true,
      stats: {
        averageScore,
        totalQuizzes: submissions.length,
        completionRate: 100, // Cần logic so sánh với tổng bài tập được giao
        streak: 1
      },
      quizResults,
      subjectAverages,
      progressData
    });

  } catch (error) {
     console.error("Error getStudentReport:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}