import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 👇 QUAN TRỌNG: Thêm 'pdf' vào danh sách RAW
    const isRaw = file.mimetype.match(/(text|application|msword|pdf|zip|rar)/);
    
    // Tạo tên ngẫu nhiên
    const uniqueName = `doc-${Date.now()}`;
    
    // Lấy đuôi file (ví dụ: .pdf)
    const ext = file.originalname.includes('.') ? `.${file.originalname.split('.').pop()}` : '';

    console.log(`[CHECK] Uploading: ${file.originalname} -> Mode: ${isRaw ? 'RAW' : 'AUTO'}`);

    if (isRaw) {
      return {
        folder: req.uploadFolder || 'materials',
        resource_type: 'raw', // Bắt buộc cho PDF
        // Với RAW, phải nối đuôi file vào ID thì tải về mới mở được
        public_id: `${uniqueName}${ext}`, 
      };
    } else {
      return {
        folder: req.uploadFolder || 'materials',
        resource_type: 'auto', // Ảnh/Video
        public_id: uniqueName,
      };
    }
  },
});

// Bộ lọc giữ nguyên
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|mp4|mp3|jpg|jpeg|png|gif|zip|rar/;
  if (allowedTypes.test(file.originalname.toLowerCase().split('.').pop())) {
    return cb(null, true);
  }
  cb(new Error('Định dạng file không hỗ trợ!'));
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter
});

export default upload;