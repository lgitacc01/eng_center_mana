// controllers/assignmentController.js
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import mongoose from "mongoose"; // 👈 Thêm dòng này để xử lý ObjectId


/**
 * Tạo bài tập mới
 */
export const createAssignment = async (req, res) => {
  try {
    const data = req.body;

    // Auto tính tổng điểm
    if (!data.totalPoints) {
      data.totalPoints = (data.questions || [])
        .reduce((sum, q) => sum + (parseInt(q.points) || 0), 0);
    }

    let assignment = await Assignment.create({
      ...data,
      createdBy: req.user.id,
      status: "active"
    });

    assignment = await assignment.populate([
      { path: "class_id", select: "name code" }, // Lấy tên lớp
      { path: "createdBy", select: "name email" } // Lấy tên GV (nếu cần)
    ]);

    return res.status(201).json({
      success: true,
      message: "Tạo bài tập thành công",
      assignment,
    });
  } catch (err) {
    console.error("Error createAssignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Lấy danh sách bài tập (lọc theo class_id nếu cần)
 */
export const getAssignments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log(`🔍 DEBUG: Đang tìm bài tập cho User: ${userId} (Role: ${userRole})`);

    let filter = {};

    // =======================
    // 1. NẾU LÀ HỌC SINH (Student)
    // =======================
    if (userRole === 'student' || userRole === 3) {
      
      // Chuyển String ID sang ObjectId để tìm kiếm chính xác hơn trong MongoDB
      let userObjectId;
      try {
        userObjectId = new mongoose.Types.ObjectId(userId);
      } catch (e) {
        console.log("Lỗi convert ID, dùng string gốc");
        userObjectId = userId;
      }

      // Tìm các lớp mà học sinh này là thành viên
      // Kiểm tra cả dạng String lẫn ObjectId cho chắc chắn
      const classes = await Class.find({
        students: { $in: [userId, userObjectId] }
      }).select('_id name');

      console.log(`🔍 DEBUG: Tìm thấy ${classes.length} lớp học sinh này tham gia:`, classes);

      // Nếu không có lớp nào -> Trả về rỗng luôn
      if (classes.length === 0) {
        return res.json({ success: true, assignments: [] });
      }

      const classIds = classes.map(c => c._id);

      // Lọc bài tập thuộc các lớp đó VÀ không phải bản nháp
      filter = {
        class_id: { $in: classIds },
        // status: { $ne: 'draft' } 
      };
    }

    // =======================
    // 2. NẾU LÀ GIÁO VIÊN (Teacher)
    // =======================
    else if (userRole === 'teacher' || userRole === 2) {
      const classes = await Class.find({
        teacher_ids: userId // Giáo viên thì thường lưu dạng String hoặc ObjectId đều được
      }).select('_id');

      const classIds = classes.map(c => c._id);
      
      if (classIds.length === 0) {
        return res.json({ success: true, assignments: [] });
      }

      filter = {
        class_id: { $in: classIds }
        // Có thể thêm createdBy: userId nếu muốn
      };
    }

    // =======================
    // 3. THỰC HIỆN QUERY BÀI TẬP
    // =======================
    console.log("🔍 DEBUG: Filter bài tập:", filter);

    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .populate("class_id", "name code")
      .populate("createdBy", "name email");
    
    console.log(`✅ KẾT QUẢ: Tìm thấy ${assignments.length} bài tập.`);

    return res.json({ success: true, assignments });

  } catch (err) {
    console.error("❌ getAssignments error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Lấy chi tiết 1 bài tập
 */
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("class_id", "name code")
      .populate("createdBy", "name email");

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
    }

    const isTeacher = req.user.role === 'teacher' || req.user.role === 'admin';

    let responseData = assignment.toObject();

    if (!isTeacher) {
      // Xóa field correctAnswer trong từng câu hỏi
      if (responseData.questions) {
        responseData.questions = responseData.questions.map(q => {
          const { correctAnswer, ...rest } = q;
          return rest;
        });
      }
    }

    return res.json({ success: true, assignment: responseData });
  } catch (err) {
    console.error("Error getAssignmentById:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Cập nhật bài tập
 */
export const updateAssignment = async (req, res) => {
  try {
    const data = req.body;

    // SỬA: Nếu có cập nhật danh sách câu hỏi, phải tính lại tổng điểm
    if (data.questions && Array.isArray(data.questions)) {
      data.totalPoints = data.questions.reduce(
        (sum, q) => sum + (parseInt(q.points) || 0), 
        0
      );
    }

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
    }

    return res.json({
      success: true,
      message: "Cập nhật thành công",
      assignment: updated,
    });
  } catch (err) {
    console.error("Error updateAssignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Xóa bài tập
 */
export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập" });
    }

    return res.json({ success: true, message: "Xóa bài tập thành công" });
  } catch (err) {
    console.error("Error deleteAssignment:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

