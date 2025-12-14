// models/Submission.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed },
    isCorrect: { type: Boolean, default: false },
    pointsAwarded: { type: Number, default: 0 },
    feedback: { type: String, default: "" }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: { type: [answerSchema], default: [] },

    score: { type: Number, default: 0 },

    timeSpent: { type: Number, default: 0 } // giây
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
