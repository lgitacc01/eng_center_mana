import React from 'react';
// Đã xóa 'import { Link }' từ 'react-router-dom' để khắc phục lỗi context

function HomePage() {
  return (
    <>
     
      
        
        {/* Nút Đăng nhập */}
        <div className="absolute top-6 right-6 z-10">
          {/* FIX: Đã thay thế <Link> bằng thẻ <a> tiêu chuẩn.
            Điều này sẽ khắc phục lỗi crash do thiếu context của React Router.
            Nó sẽ điều hướng đến trang /login (nhưng sẽ làm tải lại trang).
          */}
          <a 
            href="/login" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Đăng nhập
          </a>
        </div>

        {/* Nội dung chính của trang chủ (căn giữa) */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          
          {/* Đã xóa class 'animate-fade-in-down' */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Chào mừng bạn
          </h1>
          
          {/* Đã xóa class 'animate-fade-in-up' */}
          <p className="text-xl md:text-2xl text-gray-300">
            Đây là trang chủ của ứng dụng.
          </p>
        </div>

      
    </>
  );
}

export default HomePage;

