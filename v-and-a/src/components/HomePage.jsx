import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const submitHandler = () => {
    if (input.trim()) {
      navigate(`/room/${input}`);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-80">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your name..."
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={submitHandler}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default HomePage;
