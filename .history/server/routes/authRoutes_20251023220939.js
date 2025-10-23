import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// --- CHỨC NĂNG ĐĂNG KÝ ĐÃ BỊ XÓA BỎ ---
// Bạn không cần route /register nữa

// --- CHỈ CÒN ĐĂNG NHẬP (Login) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
    }

    // TẠO JWT
    const payload = {
      user: {
        id: user._id, // _id của MongoDB
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        role: user.role_id // Thông tin phân quyền
      }
    };

    // Ký token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Hết hạn sau 1 giờ
    );

    // Gửi token về
    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;