import { useState } from 'react'
import { BrowserRouter , Route, Router, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PrincipalDashboard from './components/dashboard/PrincipalDashboard'
import TeacherDashboard from './components/dashboard/TeacherDashboard'
import StudentDashboard from './components/dashboard/StudentDashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<Login />}></Route>
          <Route path='/signup' element = {<Signup />} ></Route>
          <Route path='/dashboard' element = {<Dashboard/>} ></Route>
          <Route path='/dashboard/principal' element = {<PrincipalDashboard/>} ></Route>
          <Route path='/dashboard/teacher' element = {<TeacherDashboard/>} ></Route>
          <Route path='/dashboard/student' element = {<StudentDashboard/>} ></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
