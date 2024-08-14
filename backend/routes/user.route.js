import express from "express"
import Protect from "../middlewares/authMiddleware.js";
import { assignStudentsToTeacher, 
         assignTeacherToClassroom, 
         createClassroom, 
         createTimetableEntry, 
         deleteUser, 
         getAllClassrooms, 
         getAllStudents, 
         getAllTeachers,
         getStudent,
         getTeacher,
         updateUser} from "../controllers/userController.js";
import { verifyToken } from "../utils/jwtUtils.js";

const Route = express.Router();

Route.get('/', getAllClassrooms);
Route.post('/createClassroom',Protect('PRINCIPAL') ,createClassroom)
Route.post('/assign-teacher',Protect('PRINCIPAL') , assignTeacherToClassroom)
Route.post('/assign-students', Protect('PRINCIPAL') , assignStudentsToTeacher)

// Route to get all teachers
Route.get('/teachers', getAllTeachers)
Route.get('/teachers/:id',getTeacher);


// Route to get all students
Route.get('/students', getAllStudents);
Route.get('/students/:id',getStudent);

// Create timetable entry for a specific teacher's classroom
Route.post(
    '/timetable/:teacherId',
    verifyToken, createTimetableEntry
  );



//UPDATE 
// Update Student
Route.put('/students/:id', updateUser);

// Update Teacher
Route.put('/teachers/:id', updateUser);


//DELETE student
Route.delete('/students/:id', deleteUser);

// Delete Teacher
Route.delete('/teachers/:id', deleteUser);

export default Route