import React, { useState, useEffect } from 'react';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [newTimetableEntry, setNewTimetableEntry] = useState({
    subject: '',
    startTime: '',
    endTime: '',
    day: '',
  });

  const token = localStorage.getItem('token');
  const teacherId = localStorage.getItem('teacherId'); // Assuming teacherId is stored in localStorage;

  const fetchData = async () => {
    const studentRes = await apiRequest.get(`/classroom/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(studentRes.data);
    console.log(studentRes.data);

    const timetableRes = await apiRequest.get(`/classroom/timetable/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTimetable(timetableRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [token, teacherId]);

  const handleCreateTimetableEntry = async () => {
    try {
      await apiRequest.post(
        `/classroom/timetable/${teacherId}`,
        newTimetableEntry,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Timetable entry created successfully');
    } catch (error) {
      console.error('Failed to create timetable entry', error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await apiRequest.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      navigate('/')
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Teacher Dashboard</h1>

      {/* Create Timetable Entry */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Create Timetable Entry</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={newTimetableEntry.subject}
            onChange={(e) =>
              setNewTimetableEntry({ ...newTimetableEntry, subject: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="time"
            placeholder="Start Time"
            value={newTimetableEntry.startTime}
            onChange={(e) =>
              setNewTimetableEntry({ ...newTimetableEntry, startTime: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="time"
            placeholder="End Time"
            value={newTimetableEntry.endTime}
            onChange={(e) =>
              setNewTimetableEntry({ ...newTimetableEntry, endTime: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Day"
            value={newTimetableEntry.day}
            onChange={(e) =>
              setNewTimetableEntry({ ...newTimetableEntry, day: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleCreateTimetableEntry}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Timetable Entry
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Students</h2>
        <ul className="space-y-2">
          {students.map((student) => (
            <li key={student.id} className="bg-white p-2 border border-gray-200 rounded">
              {student.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Timetable */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Your Timetable</h2>
        <ul className="space-y-2">
          {timetable.map((entry, index) => (
            <li key={index} className="bg-white p-2 border border-gray-200 rounded">
              {entry.day} - {entry.subject} from {entry.startTime} to {entry.endTime}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
