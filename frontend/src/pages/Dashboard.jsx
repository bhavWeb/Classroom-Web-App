import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Simulate getting user role, e.g., from context or localStorage
  const userRole = localStorage.getItem('userRole') || 'student'; // Example: 'principal', 'teacher', 'student'

  React.useEffect(() => {
    if (userRole === 'principal') {
      navigate('/dashboard/principal');
    } else if (userRole === 'teacher') {
      navigate('/dashboard/teacher');
    } else {
      navigate('/dashboard/student');
    }
  }, [userRole, navigate]);

  return (
    <div>
      {/* Optionally show a loading spinner here while redirecting */}
      <p>Loading Dashboard...</p>
    </div>
  );
};

export default Dashboard;
