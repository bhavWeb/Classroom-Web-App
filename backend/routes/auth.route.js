import express from 'express'
import { loginUser, logout, signupUser } from '../controllers/authController.js';

const Route = express.Router();

//LOGIN Route
Route.post('/login',loginUser)

//SIGNUP Route
Route.post('/signup', signupUser )

//LOGOUT Route

Route.post('/logout',logout)
export default Route