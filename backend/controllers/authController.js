import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Prisma from "../utils/prisma.js";
import { generateToken } from "../utils/jwtUtils.js";

export const loginUser = async (req,res) =>{
    const {email ,password } = req.body;

    try{
        const user = await Prisma.user.findUnique({
            where : {email},
        })

        if (!user) return res.status(404).json({ error: 'User not found' });
        const isValidPassword = await bcrypt.compare(password,user.password);
        if (!isValidPassword) return res.status(401).json({ error: 'Invalid password' });

        const token = generateToken(user);
        res.status(200).json({ token, role: user.role,teacherId :user.id   ,message: 'Login successful' });
    }
    catch(err){
        res.status(400).json({message : "Login Failed   "})
        console.log(err);
    }
}

export const signupUser = async (req,res) =>{

    const {email,password,role}= req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await Prisma.user.create({
            data : {
                    email , 
                    password: hashedPassword,
                    role
                }
        })

        res.status(200).json({message : "user Created Successfully"})
    }
    catch(err){
        console.log(err);
    }
}

export const logout = (req,res) =>{

    res.status(200).json({message : "log out successfull"})
}