import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header
  const authHeader = req.header('Authorization');
  
  // Header thường có dạng "Bearer <token>"
  // Tách chữ "Bearer " ra
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Kiểm tra xem có token không
  if (!token) {
    return res.status(401).json({ msg: 'Không có token, từ chối truy cập' });
  }

  try {
    // 3. Xác thực token
    // Nó sẽ dùng JWT_SECRET của bạn để giải mã
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("👉 DECIDED TOKEN:", decoded); // Xem log này ở terminal server

    // 4. Nếu hợp lệ, giải mã thành công
    // Gắn thông tin user (payload) vào đối tượng request
    req.user = decoded.user;
 
    // 5. Cho phép request đi tiếp
    next();
  } catch (err) {
    // Nếu token sai, hết hạn, hoặc không hợp lệ
    res.status(401).json({ msg: 'Token không hợp lệ' });
  }
};

export default verifyToken;