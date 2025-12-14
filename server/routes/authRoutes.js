import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// --- CHỈ CÒN ĐĂNG NHẬP (Login) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // Kiểm tra trạng thái tài khoản
    // Nếu status là 'inactive' (đã bị khóa/xóa mềm) thì chặn luôn
    if (user.status === 'inactive') {
      return res.status(403).json({ msg: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên.' });
    }
    // ---------------------------------------------------

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // --- TẠO TOKEN ---
    // 1. Tạo Access Token Payload (Token chính, ngắn hạn)
    const accessTokenPayload = {
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        role: user.role_id
      }
    };

    // 2. Tạo Refresh Token Payload (Token làm mới, dài hạn)
    // (Chỉ cần ID để biết user nào muốn làm mới)
    const refreshTokenPayload = {
      user: {
        id: user._id
      }
    };

    // 3. Ký (Sign) cả hai token
    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 👈 Đổi thành 15 phút (ngắn hạn)
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.JWT_REFRESH_SECRET, // 👈 Dùng khóa bí mật MỚI
      { expiresIn: '7d' } // 👈 Hết hạn sau 7 ngày
    );

    // Gửi CẢ HAI token về cho client
    res.json({ 
      accessToken, 
      refreshToken, 
      id: user._id,
      role: user.role_id,
      user: {
        id: user._id,
        full_name: user.full_name, 
        email: user.email,         
        avatar: user.avatar,
        role: user.role_id
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// --- THÊM MỚI: ROUTE ĐỂ LÀM MỚI TOKEN ---
// Endpoint: /auth/refresh
router.post('/refresh', async (req, res) => {
  // Client sẽ gửi refreshToken trong body
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Không có refresh token' });
  }

  try {
    // 1. Xác thực Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // 2. Nếu hợp lệ, tìm user trong DB
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(403).json({ msg: 'Token không hợp lệ (user không tồn tại)' });
    }

    // 3. Tạo lại Access Token MỚI (vẫn 15 phút)
    const newAccessTokenPayload = {
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        role: user.role_id
      }
    };

    const newAccessToken = jwt.sign(
      newAccessTokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // 4. Gửi Access Token mới về
    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ msg: 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }
});


export default router;