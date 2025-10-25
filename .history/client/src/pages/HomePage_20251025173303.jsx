import React from 'react';

function HomePage() {
  return (
    <>
      <div className="min-h-screen relative overflow-hidden 
                      bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 
                      text-white flex flex-col justify-center items-center">

        {/* Nút Đăng nhập */}
        <div className="absolute top-6 right-6 z-10">
          <a
            href="/login"
            className="text-white bg-sky-500 hover:bg-sky-600 
                       font-semibold py-2 px-6 rounded-lg 
                       shadow-md hover:shadow-xl 
                       transition-all duration-300 ease-in-out 
                       transform hover:-translate-y-0.5"
          >
            Đăng nhập
          </a>
        </div>

        {/* Nội dung chính */}
        <div className="text-center px-4">
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
