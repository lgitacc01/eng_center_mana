import User from "../models/User.js";
import Class from "../models/Class.js";
import bcrypt from "bcryptjs";

// 1. Lấy danh sách học sinh
export const getAllStudents = async (req, res) => {
  try {
    let query = { role_id: 3 }; // Mặc định lấy tất cả học sinh

    // 👇 LOGIC MỚI: Nếu là Giáo viên (role 2), chỉ lấy học sinh của mình
    if (req.user && req.user.role === 2) {
        // 1. Tìm các lớp mà giáo viên này dạy
        const classes = await Class.find({ teacher_ids: req.user.id });
        
        // 2. Lấy danh sách ID các lớp đó
        const classIds = classes.map(c => c._id);

        // 3. Chỉ lấy học sinh thuộc các lớp này
        query.studentClass = { $in: classIds };
    }

    const students = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// 2. Thêm học sinh mới
export const createStudent = async (req, res) => {
  const { 
    full_name, username, password, email, phone, 
    parentName, parentPhone, studentClass, grade 
  } = req.body;

  try {
    // Validate
    if (!full_name || !username || !password || !email) {
      return res.status(400).json({ msg: "Vui lòng điền thông tin bắt buộc!" });
    }

    // Check trùng
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Tên đăng nhập hoặc Email đã tồn tại!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newStudent = new User({
      full_name,
      username,
      password: hashedPassword,
      email,
      phone,
      role_id: 3, // Học sinh
      parentName,
      parentPhone,
      studentClass, // Lưu ý tên trường khớp với Model
      grade,
      averageScore: 0, // Mặc định 0
      status: "active",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`
    });

    if (studentClass) {
        // Tìm lớp theo ID (studentClass bây giờ là class_id)
        // Push ID học sinh mới vào mảng students của lớp
        await Class.findByIdAndUpdate(studentClass, {
            $push: { students: newStudent._id }
        });
    }

    await newStudent.save();
    res.status(201).json({ msg: "Thêm học sinh thành công", student: newStudent });

  } catch (error) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// 3. Xóa học sinh
export const deleteStudent = async (req, res) => {
  // try {
  //   const student = await User.findByIdAndDelete(req.params.id);
  //   if (student && student.studentClass) {
  //       // Nếu học sinh có lớp, xóa ID học sinh khỏi lớp đó
  //       await Class.findByIdAndUpdate(student.studentClass, {
  //           $pull: { students: student._id }
  //       });
  //   }
  //   res.status(200).json({ msg: "Xóa thành công" });
  // } catch (error) {
  //   res.status(500).json({ msg: "Lỗi khi xóa" });
  // }
  try {
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: "Không tìm thấy học viên" });

    // Logic: Nếu đang active thì thành inactive, và ngược lại (Toggle)
    const newStatus = student.status === 'active' ? 'inactive' : 'active';
    
    student.status = newStatus;
    await student.save();

    res.status(200).json({ msg: `Đã cập nhật trạng thái thành: ${newStatus}`, status: newStatus });
  } catch (error) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};