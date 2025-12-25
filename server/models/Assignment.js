// models/Assignment.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "multiple_choice",
        "true_false",
        "fill_blank",
        "short_answer",
        "essay",
        "listening",
        "speaking"
      ],
      default: "multiple_choice",
    },

    question: { type: String, required: true },

    // Với multiple choice
    options: { type: [String], default: [] },
    correctAnswer: { type: String, default: "" },

    points: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    explanation: { type: String, default: "" }
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    type: { type: String, enum: ["grammar", "vocabulary", "reading", "writing"], default: "mixed" }, // có thể thêm "listening", "speaking"

    dueDate: { type: Date },
    // dueTime: { type: String },

    instructions: { type: String, default: "" },

    reading_passage: { type: String, default: "" }, // Lưu nội dung bài đọc

    timeLimit: { type: Number, default: 0 }, // phút
    attempts: { type: Number, default: 1 }, // -1 = unlimited

    randomizeQuestions: { type: Boolean, default: false },
    showResults: { type: Boolean, default: false },
    allowLateSubmission: { type: Boolean, default: false },

    questions: { type: [questionSchema], default: [] },
    totalPoints: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["draft", "active", "overdue", "completed"],
      default: "draft",
    }
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
