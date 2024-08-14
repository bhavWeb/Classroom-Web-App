import React, { useState ,useEffect } from 'react';
import Table from '../Table';
import Modal from '../Modal';
import apiRequest from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';

const PrincipalDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    startTime: '',
    endTime: '',
    days: [],
  });

  const [timetable, setTimetable] = useState([]);
  const [newTimetableEntry, setNewTimetableEntry] = useState({
    subject: '',
    startTime: '',
    endTime: '',
    day: '',
  });


  const [newTeacher, setNewTeacher] = useState({
    email: '',
    password: '',
  });
  const [newStudent, setNewStudent] = useState({
    email: '',
    password: '',
  }); 

  const token = localStorage.getItem('token');

  const fetchData = async () => {

    const teacherRes = await apiRequest.get('/classroom/teachers', {
      headers: { 'Authorization' : `Bearer ${token}` },
    });
    setTeachers(teacherRes.data);

    const studentRes = await apiRequest.get('/classroom/students', {
      headers: { 'Authorization' : `Bearer ${token}` },
    });
    setStudents(studentRes.data);

    const classroomRes = await apiRequest.get('/classroom', {
      headers: { 'Authorization' : `Bearer ${token}` },
    });
    setClassrooms(classroomRes.data);
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreateTimetableEntry = async (req,res) => {
    try {
      const teacherId = req.body.teacherId;
      const classroomRes = await apiRequest.post(`/classroom/timetable/:${teacherId}`,{
        ...newTimetableEntry,teacherId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const classroom = classroomRes.data;

      if (
        newTimetableEntry.startTime < classroom.startTime ||
        newTimetableEntry.endTime > classroom.endTime
      ) {
        alert('Timetable entry must be within the classroom start and end times');
        return;
      }

      const overlap = timetable.some(
        (entry) =>
          entry.day === newTimetableEntry.day &&
          ((newTimetableEntry.startTime >= entry.startTime &&
            newTimetableEntry.startTime < entry.endTime) ||
            (newTimetableEntry.endTime > entry.startTime &&
              newTimetableEntry.endTime <= entry.endTime))
      );

      if (overlap) {
        alert('Timetable entry overlaps with another entry');
        return;
      }

      await apiRequest.post(
        `/classroom/timetable/${teacherId}`,
        newTimetableEntry,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Timetable entry created successfully');
    } catch (error) {
      console.error('Failed to create timetable entry', error);
    }
  }
  const handleCreateClassroom = async (req,res) => {
    try {
      const response = await apiRequest.post('/classroom/createClassroom', newClassroom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        alert('Classroom created successfully');
    } else {
        
        console.error('Failed to create classroom: ', response.statusText);
    }
    } catch (error) {
      console.error('Failed to create classroom', error);
    }
  };

  const handleAssignTeacher = async (classroomId, teacherId) => {
    try {
      await apiRequest.post(
        `/classroom/assign-teacher`,
        { classroomId, teacherId  },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Teacher assigned successfully');
    } catch (error) {
      console.error('Failed to assign teacher', error);
    }
  };

  const handleAssignStudent = async (teacherId, studentId) => {
    try {
      const response = await apiRequest.post(
        `/classroom/assign-student`,
        { teacherId, studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Student assigned successfully');
    } catch (error) {
      console.error('Failed to assign student', error);
    }
  };

  const handleCreateTeacher = async () => {
    try {
      const response = await apiRequest.post(
        '/auth/signup',
        { ...newTeacher, role: 'TEACHER' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert('Teacher account created successfully');
    } else {
        console.log('Unexpected response status:', response.status);
    }
    } catch (error) {
      console.log('Failed to create teacher account'  );
    }
  };

  const handleCreateStudent = async () => {
    try {
      await apiRequest.post(
        '/auth/signup',
        { ...newStudent, role: 'STUDENT' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Student account created successfully');
    } catch (error) {
      console.error('Failed to create student account', error);
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

  const handleUpdate = async (id, email, password) => {
    try {
      await apiRequest.put(`classroom/students/${id}`, { email, password });
      alert('Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/students/${id}`);
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };
  return (
    <div className="p-4 space-y-6">
  <h1 className="text-3xl font-bold mb-4 text-center">Principal Dashboard</h1>
{/* Create Teacher */}
<div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Create Teacher Account</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newTeacher.password}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, password: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleCreateTeacher}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Teacher
          </button>
        </div>
      </div>

      {/* Create Student */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Create Student Account</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newStudent.password}
            onChange={(e) =>
              setNewStudent({ ...newStudent, password: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleCreateStudent}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Student
          </button>
        </div>
      </div>

  {/* Timetable Creation */}
  {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md">
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
  </div> */}
    
    {/* Create Classroom */}
<div className="bg-gray-100 p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-2">Create Classroom</h2>
  <div className="space-y-4">
    <input
      type="text"
      placeholder="Classroom Name"
      value={newClassroom.name}
      onChange={(e) =>
        setNewClassroom({ ...newClassroom, name: e.target.value })
      }
      className="w-full p-2 border border-gray-300 rounded"
    />
    <input
      type="time"
      placeholder="Start Time"
      value={newClassroom.startTime}
      onChange={(e) =>
        setNewClassroom({ ...newClassroom, startTime: e.target.value })
      }
      className="w-full p-2 border border-gray-300 rounded"
    />
    <input
      type="time"
      placeholder="End Time"
      value={newClassroom.endTime}
      onChange={(e) =>
        setNewClassroom({ ...newClassroom, endTime: e.target.value })
      }
      className="w-full p-2 border border-gray-300 rounded"
    />
    <input
      type="text"
      placeholder="Days (e.g., Monday to Saturday)"
      value={newClassroom.days}
      onChange={(e) =>
        setNewClassroom({ ...newClassroom, days: e.target.value.split(',') })
      }
      className="w-full p-2 border border-gray-300 rounded"
    />
    <button
      onClick={handleCreateClassroom}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Create Classroom
    </button>
  </div>
</div>

{/* Assign Teacher to Classroom */}
<div className="bg-gray-100 p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-2">Assign Teacher to Classroom</h2>
  <div className="space-y-4">
    <select
      onChange={(e) => setSelectedClassroomId(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    >
      <option value="">Select Classroom</option>
      {Array.isArray(classrooms) && classrooms.map((classroom) => (
        <option key={classroom.id} value={classroom.id}>
          {classroom.name}
        </option>
      ))}
    </select>
    <select
      onChange={(e) => setSelectedTeacherId(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    >
      <option value="">Select Teacher</option>
      {Array.isArray(teachers) && teachers.map((teacher) => (
        
        <option key={teacher.id} value={teacher.id}>
          {teacher.email}
        </option>
      ))}
    </select>
    <button
      onClick={() => handleAssignTeacher(selectedClassroomId, selectedTeacherId)}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Assign Teacher
    </button>
  </div>
</div>

{/* Assign Student to Teacher */}
<div className="bg-gray-100 p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-2">Assign Student to Teacher</h2>
  <div className="space-y-4">
    <select
      onChange={(e) => setSelectedTeacherId(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    >
      <option value="">Select Teacher</option>
      {Array.isArray(teachers) && teachers.map((teacher) => (
        <option key={teacher.id} value={teacher.id}>
          {teacher.email}
        </option>
      ))}
    </select>
    <select
      onChange={(e) => setStudents(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded"
    >
      <option value="">Select Student</option>
      {Array.isArray(students) && students.map((student) => (
        <option key={student.id} value={student.id}>
          {student.email}
        </option>
      ))}
    </select>
    <button
      onClick={() => handleAssignStudent(teacherId, studentId)}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Assign Student
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
          <div className="space-x-2">
              <button
                onClick={() => handleUpdate(student.id, prompt('New email:'), prompt('New password:'))}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Teacher List */}
  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">Your Teachers</h2>
    <ul className="space-y-2">
      {teachers.map((teacher) => (
        <li key={teacher.id} className="bg-white p-2 border border-gray-200 rounded">
          {teacher.email}
          <div className="space-x-2">
              <button
                onClick={() => handleUpdate(teacher.id, prompt('New email:'), prompt('New password:'))}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(teacher.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Timetable */}
  {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">Your Timetable</h2>
    <ul className="space-y-2">
      {timetable.map((entry, index) => (
        <li key={index} className="bg-white p-2 border border-gray-200 rounded">
          {entry.day} - {entry.subject} from {entry.startTime} to {entry.endTime}
        </li>
      ))}
    </ul>
  </div> */}

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

export default PrincipalDashboard;
