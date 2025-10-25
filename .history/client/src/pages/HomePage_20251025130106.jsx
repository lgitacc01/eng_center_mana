import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import '../App.css'; 

function HomePage() {
  const [count, setCount] = useState(0);

  return (
    // Thêm container và padding để nội dung không bị dính vào lề
    <div className="container mx-auto p-4 text-center">
      
      {/* Toàn bộ code cũ của bạn giữ nguyên, 
         CHỈ CẦN XÓA thanh nav (hộp trắng) bị dư thừa đi */}
         
      <div className="flex justify-center gap-4 my-4">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold">Vite + React (Home Page)</h1>
      <div className="card p-4">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-gray-700 p-2 rounded"
        >
          count is {count}
        </button>
        <p className="my-2">
          Edit <code>src/pages/HomePage.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default HomePage;