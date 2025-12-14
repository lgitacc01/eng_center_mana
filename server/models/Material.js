import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true }, // pdf, word, video...
    file_path: { type: String, required: true }, // Đường dẫn file trên server
    size: { type: String }, // Lưu string dạng "2.5 MB" cho tiện hiển thị
    classes: [{ type: String }], // Mảng các lớp: ["A1", "B2"]
    tags: [{ type: String }],    // Mảng tags
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ai up file này?

    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' // Mặc định upload lên là chờ duyệt
    },

    scope: { 
        type: String, 
        enum: ['class', 'center'], 
        default: 'class' 
    },
}, { 
    timestamps: true 
});

const Material = mongoose.model("Material", materialSchema);
export default Material;