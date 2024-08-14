import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../lib/apiRequest';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      const response = await apiRequest.post('/auth/login' , {email,password})
      const {token,role } =response.data

      console.log(response);
      console.log(response.data);

      localStorage.setItem('token' ,token)
      localStorage.setItem('role',role);
      // localStorage.setItem('teacherId',teacherId)
      //REDIRECTING BASED ON ROLE
      navigate(`/dashboard/${role}`)
    }
    catch(err){
      console.log(err);
    }
    
    // const userRole = email.includes('principal') ? 'principal' : email.includes('teacher') ? 'teacher' : 'student';
    // navigate(`/dashboard/${userRole}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-80">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full p-4 mb-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-lg w-full font-medium transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
