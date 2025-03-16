import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Navbar.css';

export default function Navbar() {
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
          <Link to="/home/profile">Home</Link> {/* Updated to /home */}
        </li>
        <li>
          <Link to="/home/batches">Batches</Link> {/* Updated to /home/batches */}
        </li>
        <li>
          <Link to="/home/event">Events</Link> {/* Placeholder */}
        </li>
        <li>
          <Link to="/home/projects">Projects</Link> {/* Placeholder */}
        </li>
        <li>
          <Link to="/home/mentorship">Mentorships</Link> {/* Placeholder */}
        </li>
        <li>
          <Link to="/home/opensource">Open Source</Link> {/* Placeholder */}
        </li>
        <li>
          <Link to="/home/placements">Placement</Link> {/* Placeholder */}
        </li>
        <li>
          <Link to="/home/profile">Profile</Link> {/* Updated to /home/profile */}
        </li>
      </ul>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}