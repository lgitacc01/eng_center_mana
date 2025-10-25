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
  className="px-6 py-2 rounded-xl font-semibold text-white 
             bg-gradient-to-r from-indigo-500 to-fuchsia-500 
             shadow-md shadow-indigo-900/30
             hover:from-indigo-400 hover:to-fuchsia-400 
             hover:shadow-lg hover:shadow-fuchsia-600/40
             transition-all duration-300 ease-out 
             focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60
             backdrop-blur-sm bg-opacity-90"
>
  Đăng nhập
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

