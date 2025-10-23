// Hàm này nhận vào một mảng các role_id được phép
// Ví dụ: checkRole([1]) hoặc checkRole([1, 2])
const checkRole = (allowedRoles) => {
  
  return (req, res, next) => {
    
    // 1. Kiểm tra xem req.user (từ verifyToken) có tồn tại
    // và role của user đó (là một con số) có nằm trong mảng allowedRoles không
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      
      // Nếu không, trả về lỗi 403 (Forbidden)
      return res.status(403).json({ msg: 'Không có quyền truy cập (Forbidden)' });
    }
    
    // 2. Nếu có quyền, cho request đi tiếp
    next();
  };
};

export default checkRole;