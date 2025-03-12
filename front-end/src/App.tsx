import React from 'react'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import { Routes, Route } from 'react-router-dom'

export default function App() {
  const isAuth = false
  return (
      <Routes>
        <Route path='/' element={(!isAuth) ? <Login/> : null}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
  )
}
