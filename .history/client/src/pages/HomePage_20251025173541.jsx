import React from "react";

function HomePage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">

      {/* ===== Nút Đăng nhập (tách riêng hoàn toàn) ===== */}
      <div className="absolute top-6 right-6">
        <a
          href="/login"
        >
          Đăng nhập
        </a>
      </div>

      {/* ===== Nội dung chính (độc lập, không dính nút) ===== */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Chào mừng bạn
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Đây là trang chủ của ứng dụng.
        </p>
      </div>

    </div>
  );
}

export default HomePage;
