import React from 'react';

function HomePage() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden 
                      bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 
                      text-white flex flex-col justify-center items-center">

        {/* Nút Đăng nhập */}
        <div className="absolute top-4 right-6 z-[9999] pointer-events-auto">
          <a
            href="/login"
            className="relative z-[10000] 
                       text-white font-bold 
                       bg-sky-500/90 hover:bg-sky-600 
                       backdrop-blur-md 
                       py-2 px-6 rounded-lg 
                       shadow-lg hover:shadow-xl 
                       transition-all duration-300 ease-in-out 
                       transform hover:-translate-y-0.5
                       drop-shadow-md"
          >
            Đăng nhập
          </a>
        </div>

        {/* Nội dung chính */}
        <div className="text-center px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
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
