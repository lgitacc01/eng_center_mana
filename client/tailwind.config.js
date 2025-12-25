/** @type {import('tailwindcss').Config} */
export default {
  // Mục này cho Tailwind biết nơi tìm kiếm các lớp CSS được sử dụng
  content: [
    "./index.html",
    // QUAN TRỌNG: Đường dẫn này bao phủ tất cả các file trong thư mục src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}