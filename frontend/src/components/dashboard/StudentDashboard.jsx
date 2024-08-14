import React, { useEffect, useState } from 'react';
import apiRequest from '../../lib/apiRequest';

const StudentDashboard = () => {

  const [students,setStudents] = useState([]);
  const token = localStorage.getItem('token');
  const [teacherId, setTeacherId] = useState(null);
  
  useEffect(()=>{
    const fetchTeacherId = async () => {
      try {
        const response = await apiRequest.get('/classroom/teachers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacherId(response.data.id);
      } catch (error) {
        console.error('Failed to fetch teacher ID', error);
      }
  }

  fetchTeacherId();
},[token])

useEffect(() => {
  if (teacherId) {
    const fetchData = async () => {
      try {
        const studentRes = await apiRequest.get(`/classroom/students/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(studentRes.data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    };

    fetchData();
  }
}, [teacherId, token]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Student Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Classmates</h2>
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li key={student.id} className="py-4 flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">{student.email}</span>
              <span className="text-gray-600">{student.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;