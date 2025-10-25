import React from 'react';

function HomePage() {
  return (
    <>
      {/* FIX: Khôi phục lại div bọc ngoài cùng.
        - min-h-screen: Đảm bảo full chiều cao màn hình.
        - bg-gradient-to-br...: Tạo background gradient.
        - relative: Làm mốc để định vị tuyệt đối cho nút đăng nhập.
        - overflow-hidden: Ngăn các hiệu ứng transform làm xuất hiện thanh cuộn.
      */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        
        {/* Nút Đăng nhập */}
        <div className="absolute top-6 right-6 z-10">
          {/* Sử dụng thẻ <a> tiêu chuẩn để điều hướng */}
         <a
  href="/login"
  className="relative inline-flex items-center justify-center 
             px-8 py-3 overflow-hidden font-semibold text-white 
             rounded-xl shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 
             transition-all duration-300 ease-out 
             hover:scale-105 hover:shadow-indigo-500/30 hover:from-indigo-600 hover:to-purple-700
             focus:outline-none focus:ring-4 focus:ring-indigo-300"
>
  <span className="relative z-10">Đăng nhập</span>
  <span className="absolute inset-0 bg-white/10 blur-md opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
</a>
        </div>

        {/* Nội dung chính của trang chủ (căn giữa) */}
        {/* class "text-center" dùng để căn giữa chữ bên trong h1 và p */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Chào mừng bạn
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300">
            Đây là trang chủ của ứng dụng.
          </p>
        </div>

      </div>
    </>
  );
}

export default HomePage;

