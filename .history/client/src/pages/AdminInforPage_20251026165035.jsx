import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig.js'; // 1. Import apiConfig

function AdminInfoPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 2. Call the API for the "Info" page
    // (This API is in dataRoute.js: GET /data/admin/info)
    const userId = localStorage.getItem('userId');// Get userId from localStorage
    console.log("Fetching info for User ID:", userId);
    api.get(`/users/${userId}`)
      .then(res => {
        setInfo(res.data.adminInfo); // Receive data
      })
      .catch(err => {
        // 3. If it fails (e.g., token expired), the interceptor will handle it
        // and redirect to /login. Otherwise, show an error here.
        setError('Không thể tải thông tin Admin.');
        console.error("Error calling API /data/admin/info:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Run once when the component loads

  // 4. Show loading state
  if (loading) {
    return (
      <div className="text-center">
        <p className="text-2xl text-gray-400">Đang tải thông tin...</p>
      </div>
    );
  }
  
  // 5. Show error state
  if (error) {
    return (
      <div className="text-center">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  // 6. Show content
  return (
    // Add fade-in animation (animate-fadeIn)
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-2xl animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-600 pb-3">
        Thông Tin Admin
      </h1>
      {info ? (
        <div className="space-y-4 text-lg">
          <p>
            <span className="font-semibold text-gray-300 w-32 inline-block">Email:</span> 
            {info.email}
          </p>
          <p>
            <span className="font-semibold text-gray-300 w-32 inline-block">Ngày tham gia:</span> 
            {new Date(info.joinedDate).toLocaleDateString('vi-VN')}
          </p>
          <p>
            <span className="font-semibold text-gray-300 w-32 inline-block">Quyền hạn:</span> 
            {info.permissions}
          </p>
        </div>
      ) : (
        <p>Không có thông tin.</p>
      )}
    </div>
  );
}

export default AdminInfoPage;

