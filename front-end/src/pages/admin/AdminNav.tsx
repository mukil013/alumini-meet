import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/AdminNav.css';

export default function AdminNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user")
    console.log('User logged out');
    navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <nav>
      <div className="nav-logo">Alumini meet</div>
      <ul>
        <li>
          <Link to="/admin/user-management">User Management</Link> 
        </li>
        <li>
          <Link to="/admin/edit-event">Edit Event</Link> 
        </li>
        <li>
          <Link to="#">CMS</Link> 
        </li>
        <li>
          <Link to="/admin/placement-info">Placement Info</Link> 
        </li>
      </ul>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}