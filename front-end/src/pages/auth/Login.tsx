import React, { useState } from "react";
import "./style/Login.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios

export default function Login() {

  const LoginLinkBackend = "Arey bhai inga podunga link ah"

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault(); 

    try {
      const response = await axios.post(LoginLinkBackend, formData);

      // Handle success
      console.log("Login successful:", response.data);
      alert("Login successful!");
      localStorage.setItem("token", response.data.token);
    } catch (error:any) {
      // Handle error
      console.error("Error during login:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <aside className="logo">
          <img src={logo} alt="college logo" />
        </aside>
        <aside className="login-form">
          <form onSubmit={handleSubmit}>
            <h1>Log in</h1>
            <label>
              Email<br />
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password<br />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Link to="#" id="forgot-password">
                Forgot password
              </Link>
            </label>
            <input type="submit" value="Login" />
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}