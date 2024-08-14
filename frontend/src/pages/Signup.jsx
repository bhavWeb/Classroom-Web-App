import React, { useState } from 'react';
import apiRequest from '../lib/apiRequest';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Teacher');

  const handleSignup = async (e) => {
    e.preventDefault();

    try{
      await apiRequest.post('/auth/signup',{email,password,role});
      alert("Signup Successfull you can login Now")
    }
    catch(err){
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            className="w-full p-3 mb-4 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-3 mb-4 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full p-3 mb-4 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
