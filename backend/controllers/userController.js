import Prisma from "../utils/prisma.js";
import bcrypt from "bcrypt"

export const createClassroom = async(req,res) =>{
    const {name, startTime , endTime ,days,teacherId} = req.body;
    console.log(teacherId);
    try{
        //checking if teacher exists
        if (teacherId) {
            const teacher = await Prisma.user.findUnique({
              where: { id: teacherId }
            });
      
            // if (!teacher) {
            //   return res.status(404).json({ message: 'Teacher not found' });
            // }
        }

        const classroom = await Prisma.classroom.create({
            data : {
                name,
                startTime,
                endTime,
                days,
                teacher: teacherId ? {
                    connect : {id : teacherId},
                } : undefined
            }
        })
        console.log("Classroom created successfully");
        res.status(200).json({message : " Request Successful"})
    }
    catch(err){
        console.log(err);
    }

}

export const assignTeacherToClassroom = async(req,res) =>{
    
    const { classroomId , teacherId} = req.body;
    console.log(req.body);

    try{
        const classroom = await Prisma.classroom.update({
            where : {id : classroomId},
            data : {
                teacher: {
                    connect : {id :teacherId},
                },
            }
        })
        res.status(200).json({message : "Teacher Assigned to Classroom"})
    }
    catch(err){
        console.log(err);
    }
}

export const assignStudentsToTeacher = async(req,res) =>{

    const { teacherId , studentId} = req.body;
    console.log(req.body);
    try{

        // Finding the Teacher
        const teacher = await Prisma.user.findUnique({
            where: { id: teacherId },
        });

        if (!teacher || teacher.role !== 'TEACHER') {
            return res.status(404).json({ message: 'Teacher not found or invalid role' });
        }

        const student = await Prisma.user.findUnique({
            where: { id: studentId },
        });

        if (!student || student.role !== 'STUDENT') {
            return res.status(404).json({ message: 'Student not found or invalid role' });
        }

        //CREATING AND UPDATING
        await Prisma.teacherStudent.upsert({
            where: {
              teacherId_studentId: {
                teacherId,
                studentId,
              },
            },
            update: {},
            create: {
              teacherId,
              studentId,
            },
          });
      

        res.status(200).json({message : " Student Assigned to Teacher"})
    }
    catch(err){
        console.log(err);
    }
}

export const getAllTeachers = async (req, res) => {
    try {
      const teachers = await Prisma.user.findMany({ 
        where : {role: 'TEACHER'} });
      res.status(200).json(teachers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const getAllStudents = async (req, res) => {
    try {
      const students = await Prisma.user.findMany( {
        where : { 
            role: 'STUDENT' 
        }
    });
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const getStudent = async (req, res) => {
    try {
        const {id} = req.params
      const student = await Prisma.user.findUnique( {
        where : {id},
    });
    if (!student || student.role !== 'STUDENT') {
        return res.status(404).json({ message: 'Student not found or invalid role' });
      }
      res.json(student);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const getTeacher = async (req, res) => {
    try {
        const {id} = req.params
      const teacher = await Prisma.user.findUnique( {
        where : {id},
    });
    if (!teacher || teacher.role !== 'TEACHER') {
        return res.status(404).json({ message: 'Teacher not found or invalid role' });
      }
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const getAllClassrooms = async (req, res) => {
    try {
      const classrooms = await Prisma.classroom.findMany();
      res.status(200).json(classrooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

export const createTimetableEntry = async (req,res)=>{
    // const { teacherId } = req.params;
  const { teacherId , subject, startTime, endTime, day, classroomId } = req.body;

  console.log(req.body);
  if (!teacherId || !subject || !startTime || !endTime || !day) {
    return res.status(400).json({ error: 'All fields are required' });
}

  try {
    // Fetch the teacher's assigned classroom
    const classroom = await Prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    // Check if the timetable entry is within the classroom's hours
    if (startTime < classroom.startTime || endTime > classroom.endTime) {
      return res.status(400).json({ error: 'Timetable entry is outside classroom hours' });
    }

    // Check for overlapping entries (optional)
    const existingEntries = await Prisma.timetable.findMany({
      where: {
        classroomId,
        day,
        OR: [
          { startTime: { lte: endTime } },
          { endTime: { gte: startTime } },
        ],
      },
    });

    if (existingEntries.length > 0) {
      return res.status(400).json({ error: 'Timetable entry overlaps with existing entries' });
    }

    // Create the timetable entry
    const newEntry = await Prisma.timetable.create({
      data: {
        subject,
        startTime,
        endTime,
        day,
        classroomId,
        teacher: { connect: { id: teacherId } }
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating timetable entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;
  
    try {
        let updatedData = { email };

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10); 
          updatedData.password = hashedPassword; 
        }
    
        const updatedUser = await Prisma.user.update({
          where: { id },
          data: updatedData,
        });
    
        res.status(200).json({message :"Updated Successfully",updatedUser});
    
    } 
    catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Prisma.user.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };