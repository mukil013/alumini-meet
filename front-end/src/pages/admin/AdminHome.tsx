import React from 'react'
import './style/AdminHome.css'
import { Outlet } from 'react-router-dom'
import AdminNav from './AdminNav'

export default function AdminHome() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  )
}
