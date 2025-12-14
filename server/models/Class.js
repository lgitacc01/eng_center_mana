import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên lớp (VD: Lớp A1 - Morning)
  code: { type: String, required: true, unique: true }, // Mã lớp (VD: ENG-A1-01)
  
  // Liên kết với Giáo viên (User có role_id = 2)
  teacher_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  
  // Danh sách học sinh trong lớp (Mảng các User ID)
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  level: { type: String, default: "" }, // Trình độ: A1, B1...
  schedule: { type: String, default: "" }, // Lịch học: T2-T4-T6
  room: { type: String, default: "" }, // Phòng học
  maxStudents: { type: Number, default: 20 }, // Sĩ số tối đa
  description: { type: String, default: "" },
  
  startDate: { type: Date },
  endDate: { type: Date },
  
  status: { 
    type: String, 
    enum: ['active', 'pending', 'completed', 'canceled', 'inactive'], default: 'pending', 
    default: 'pending' 
  }
}, { 
  timestamps: true 
});

const Class = mongoose.model("Class", classSchema);
export default Class;