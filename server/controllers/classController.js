import Class from "../models/Class.js";
import User from "../models/User.js";

// 1. Lấy tất cả lớp học
export const getAllClasses = async (req, res) => {
  try {

    let query = {};

    // 👇 LOGIC MỚI: Nếu là Giáo viên (role 2), chỉ lấy lớp mình dạy
    if (req.user && req.user.role === 2) {
        // Tìm các lớp mà teacher_ids CÓ CHỨA id của user này
        query.teacher_ids = req.user.id;
    }
    // B. Nếu là Học sinh (role 3): Lấy lớp mình đang học 👇 MỚI THÊM
    else if (req.user && req.user.role === 3) {
      // Tìm các lớp mà mảng 'students' CÓ CHỨA id của user này
      query.students = req.user.id;
    }

    // .populate('teacher_id', 'full_name email') giúp lấy thông tin giáo viên thay vì chỉ lấy ID
    const classes = await Class.find(query)
      .populate('teacher_ids', 'full_name email')
      .populate('students', 'full_name') // Lấy thông tin học sinh (để đếm sĩ số)
      .sort({ createdAt: -1 });
      
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi server khi lấy danh sách lớp" });
  }
};

// 2. Tạo lớp học mới (Admin)
export const createClass = async (req, res) => {
  const { 
    name, code, teacher_ids, level, schedule, 
    room, maxStudents, description, startDate, endDate 
  } = req.body;

  try {
    // Kiểm tra mã lớp trùng
    const existingClass = await Class.findOne({ code });
    if (existingClass) {
      return res.status(400).json({ msg: "Mã lớp học đã tồn tại!" });
    }

    // Validate giáo viên (tối đa 3)
    let validTeachers = [];
    if (teacher_ids && teacher_ids.length > 0) {
        if (teacher_ids.length > 3) {
            return res.status(400).json({ msg: "Một lớp tối đa chỉ 3 giáo viên!" });
        }
        // Kiểm tra xem các ID có phải là giáo viên không
        validTeachers = await User.find({ _id: { $in: teacher_ids }, role_id: 2 });
        if (validTeachers.length !== teacher_ids.length) {
            return res.status(400).json({ msg: "Một số giáo viên không hợp lệ!" });
        }
    }

    const newClass = new Class({
      name,
      code,
      teacher_ids: teacher_ids || [], // Lưu mảng ID
      level,
      schedule,
      room,
      maxStudents,
      description,
      startDate,
      endDate,
      status: 'pending' // Mặc định là sắp mở
    });

    await newClass.save();
    res.status(201).json({ msg: "Tạo lớp học thành công", class: newClass });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi server khi tạo lớp" });
  }
};

// 3. Cập nhật thông tin lớp học (Admin)
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    // Lấy các trường dữ liệu từ body (đã khớp với Frontend gửi lên)
    const { 
        name, code, teacher_ids, level, schedule, 
        room, maxStudents, description, startDate, endDate, status
    } = req.body;

    // Tìm và cập nhật
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        code,
        teacher_ids, // Mảng ID giáo viên
        level,
        schedule,
        room,
        maxStudents,
        description,
        startDate,
        endDate,
        status
      },
      { new: true } // Trả về object mới sau khi update
    );

    if (!updatedClass) {
        return res.status(404).json({ msg: "Không tìm thấy lớp học" });
    }

    res.json({ msg: "Cập nhật thành công", class: updatedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi server khi cập nhật lớp" });
  }
};

// 4. Vô hiệu hóa lớp học (Admin)
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ msg: "Không tìm thấy lớp học" });
    }

    res.status(200).json({ msg: "Đã vô hiệu hóa lớp học", class: updatedClass });
  } catch (error) {
    res.status(500).json({ msg: "Lỗi server khi vô hiệu hóa lớp" });
  }
};  

// 5. Lấy chi tiết 1 lớp (Để sửa hoặc xem)
export const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id)
            .populate('teacher_ids', 'full_name email phone') // Lấy thông tin giáo viên
            .populate('students', 'full_name email phone parentName parentPhone'); // 👈 QUAN TRỌNG: Lấy thông tin học sinh
            
        if (!classItem) return res.status(404).json({ msg: "Không tìm thấy lớp" });
        res.json(classItem);
    } catch (error) {
        res.status(500).json({ msg: "Lỗi server" });
    }
}