import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './style/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = () => {
    localStorage.removeItem("user");
    console.log('User logged out');
    navigate('/login'); // Redirect to the login page after logout
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav>
      <div className="nav-logo">Alumini meet</div>
      <ul>
        <li>
          <Link
            to="/home/profile"
            className={isActive('/home/profile') ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/home/batches"
            className={isActive('/home/batches') ? 'active' : ''}
          >
            Batches
          </Link>
        </li>
        <li>
          <Link
            to="/home/event"
            className={isActive('/home/event') ? 'active' : ''}
          >
            Events
          </Link>
        </li>
        <li>
          <Link
            to="/home/projects"
            className={isActive('/home/projects') ? 'active' : ''}
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            to="/home/mentorship"
            className={isActive('/home/mentorship') ? 'active' : ''}
          >
            Mentorships
          </Link>
        </li>
        <li>
          <Link
            to="/home/Refferral"
            className={isActive('/home/Refferral') ? 'active' : ''}
          >
            Referral
          </Link>
        </li>
        <li>
          <Link
            to="/home/placements"
            className={isActive('/home/placements') ? 'active' : ''}
          >
            Placement
          </Link>
        </li>
        <li>
          <Link
            to="/home/profile"
            className={isActive('/home/profile') ? 'active' : ''}
          >
            Profile
          </Link>
        </li>
      </ul>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}