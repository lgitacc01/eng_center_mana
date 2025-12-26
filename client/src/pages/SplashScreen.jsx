import React, { useState, useEffect } from 'react';
import { Progress } from "../components/ui/progress";
import { GraduationCap } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simple and reliable progress timer
    const duration = 3000; // 3 seconds total
    const increment = 100 / (duration / 100); // Update every 100ms
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md w-full px-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DreamClass
            </h1>
            <p className="text-gray-600 mt-2">
              Hệ thống quản lý lớp học thông minh
            </p>
          </div>
        </div>

        {/* Loading */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
          </div>
        </div>

        {/* Version */}
        <p className="text-xs text-gray-400">
          Phiên bản 1.0.0 - Dành cho trung tâm tiếng Anh
        </p>
      </div>
    </div>
  );
}