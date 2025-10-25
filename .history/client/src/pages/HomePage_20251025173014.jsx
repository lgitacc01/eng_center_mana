import React from 'react';

function HomePage() {
  return (
    <>
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
    
    {/* Nút Đăng nhập */}
    <div className="absolute top-6 right-6 z-10 isolate">
     <a
  href="/login"
  className="text-white bg-sky-500 hover:bg-sky-600 
             font-semibold py-2 px-6 rounded-lg 
             transition duration-200 shadow-lg"
>
  Đăng nhập
</a>
    </div>

    {/* Nội dung chính */}
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

