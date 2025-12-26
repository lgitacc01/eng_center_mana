import Material from "../models/Material.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import Class from "../models/Class.js";

// Helper để xóa file vật lý
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Lấy danh sách tài liệu
export const getMaterials = async (req, res) => {
  try {
    const { status, scope } = req.query; // Cho phép lọc theo scope từ frontend
    let query = {};

    if (status) query.status = status;
    
    // Nếu frontend chủ động lọc scope (ví dụ tab "Thư viện chung")
    if (scope) query.scope = scope;

    if (req.user) {
        // A. GIÁO VIÊN
        if (req.user.role === 2) {
            // Logic: Lấy bài của mình tạo HOẶC bài chung của trung tâm
            query.$or = [
                { uploader_id: req.user.id }, // Bài của mình
                { scope: 'center', status: 'approved' } // Bài chung (chỉ xem approved)
            ];
        }
        
        // B. HỌC SINH
        else if (req.user.role === 3) {
            const classes = await Class.find({ students: req.user.id });
            const classNames = classes.map(c => c.name);
            
            query.status = 'approved';
            // Logic: Bài thuộc lớp mình HOẶC bài chung
            query.$or = [
                { classes: { $in: classNames } }, // Bài thuộc lớp
                { scope: 'center' }               // Bài chung
            ];
        }
        
        // C. ADMIN: Mặc định thấy hết, không cần filter gì thêm
    }

    const materials = await Material.find(query)
      .populate('uploader_id', 'full_name')
      .sort({ createdAt: -1 });
      
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

// 2. Upload tài liệu
export const createMaterial = async (req, res) => {
  try {
    // 1. Kiểm tra xem có file được upload không (từ Middleware Cloudinary)
    if (!req.file) {
      return res.status(400).json({ msg: "Vui lòng chọn file để tải lên" });
    }

    // 2. Lấy dữ liệu từ Form
    const { title, description, type, classes, tags } = req.body;
    
    // 3. Xác định Role của người upload (Lấy từ req.user do verifyToken giải mã)
    const userRole = req.user.role; // 1: Admin, 2: Teacher
    const userId = req.user.id;

    // --- LOGIC QUAN TRỌNG ---
    let materialScope = 'class'; // Mặc định là tài liệu lớp
    let materialStatus = 'pending'; // Mặc định là chờ duyệt
    let assignedClasses = [];

    // Nếu là ADMIN (Role 1)
    if (userRole === 1) {
        materialScope = 'center';   // Tài liệu dùng chung
        materialStatus = 'approved'; // Admin đăng là duyệt luôn
        assignedClasses = [];        // Không thuộc lớp cụ thể nào
    } 
    // Nếu là TEACHER (Role 2)
    else {
        materialScope = 'class';
        materialStatus = 'pending'; // Giáo viên đăng phải chờ duyệt
        // Xử lý chuỗi classes gửi lên (vd: "Lớp 1,Lớp 2") thành mảng
        if (classes) {
            assignedClasses = classes.split(',').map(c => c.trim()).filter(c => c);
        }
    }

    // 4. Tạo đối tượng Material mới
    const newMaterial = new Material({
      title,
      description,
      type,
      // 👇 Cloudinary trả về đường dẫn tuyệt đối (https://...) trong req.file.path
      file_path: req.file.path, 
      size: (req.file.size / 1024 / 1024).toFixed(2) + ' MB', // Tính size
      uploader_id: userId,
      classes: assignedClasses,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      status: materialStatus,
      scope: materialScope,
      views: 0,
      downloads: 0
    });

    // 5. Lưu vào MongoDB
    await newMaterial.save();

    res.status(201).json({ 
        msg: "Tạo tài liệu thành công!", 
        data: newMaterial 
    });

  } catch (error) {
    console.error("❌ Lỗi createMaterial:", error); // Log lỗi ra terminal để debug
    res.status(500).json({ msg: "Lỗi Server khi tạo tài liệu", error: error.message });
  }
};

// 3. Xóa tài liệu
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ msg: "Không tìm thấy tài liệu" });
    }

    // Xóa file vật lý trong thư mục uploads
    // Đường dẫn tương đối từ root server
    const filePath = path.join(process.cwd(), material.file_path); 
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // Xóa trong DB
    await Material.findByIdAndDelete(id);

    res.status(200).json({ msg: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi khi xóa" });
  }
};

// 4. Cập nhật tài liệu
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, classes, tags } = req.body;

    // Tìm tài liệu cũ trong DB
    const material = await Material.findById(id);
    if (!material) {
      return res.status(404).json({ msg: "Không tìm thấy tài liệu" });
    }

    // Xử lý dữ liệu text (nếu có gửi lên thì cập nhật, không thì giữ cũ)
    material.title = title || material.title;
    material.description = description || material.description;
    material.type = type || material.type;
    
    // Xử lý mảng (classes, tags gửi lên dạng chuỗi "A,B")
    if (classes) material.classes = classes.split(',').filter(x => x);
    if (tags) material.tags = tags.split(',').filter(x => x);

    // --- XỬ LÝ FILE MỚI (NẾU CÓ) ---
    // Middleware 'upload' đã chạy trước đó. Nếu có file, req.file sẽ có dữ liệu.
    if (req.file) {
      // 1. Xóa file vật lý cũ đi cho đỡ rác server
      const oldFilePath = path.join(process.cwd(), material.file_path);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.error("Không xóa được file cũ:", err);
        }
      }

      // 2. Cập nhật đường dẫn file mới vào DB
      material.file_path = req.file.path;
      
      // 3. Cập nhật kích thước file mới
      const sizeInBytes = req.file.size;
      if (sizeInBytes < 1024 * 1024) {
        material.size = (sizeInBytes / 1024).toFixed(1) + " KB";
      } else {
        material.size = (sizeInBytes / (1024 * 1024)).toFixed(1) + " MB";
      }
    }

    // 👇 THÊM DÒNG NÀY: Reset trạng thái về 'pending' khi có chỉnh sửa
    material.status = 'pending';

    await material.save();
    res.json({ msg: "Cập nhật thành công! Tài liệu đang chờ duyệt lại.", material });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi server khi cập nhật" });
  }
};

export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ msg: "File không tồn tại" });
    }

    // // 👇 LOGIC BẢO VỆ MỚI
    // // Nếu không phải Admin (role 1)
    // if (req.user && req.user.role !== 1) {
    //     // Nếu file bị từ chối hoặc chờ duyệt
    //     if (material.status !== 'approved') {
    //         // Nếu không phải chủ sở hữu file -> CHẶN
    //         if (material.uploader_id.toString() !== req.user.id) {
    //             return res.status(403).json({ msg: "Tài liệu này chưa được duyệt hoặc đã bị ẩn." });
    //         }
    //     }
    // }
    // // -----------------------

    // Tạo đường dẫn tuyệt đối đến file trên server
    const absolutePath = path.join(process.cwd(), material.file_path); 

    // Kiểm tra file có tồn tại vật lý không
    if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ msg: "File vật lý không tìm thấy trên server" });
    }

    // Trả về file để trình duyệt tải xuống
    res.download(absolutePath, material.title + path.extname(material.file_path));

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi tải file" });
  }
};

// Duyệt tài liệu
export const approveMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' hoặc 'rejected'

        const material = await Material.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true } // Trả về data mới sau khi update
        );

        if (!material) {
            return res.status(404).json({ msg: "Tài liệu không tồn tại" });
        }

        res.json({ msg: "Cập nhật trạng thái thành công", material });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server" });
    }
};