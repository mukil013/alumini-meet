import React from "react";
import "./style/Login.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login-body">
      <div className="login-container">
        <aside className="logo">
          <img src={logo} alt="college logo" />
        </aside>
        <aside className="login-form">
          <form action="post">
            <h1>Log in</h1>
            <label>
              Email<br />
              <input type="email" placeholder="Enter your email"/>
            </label>
            <label >
              Password<br />
              <input type="password" placeholder="Enter your password"/>
              <Link to='#' id="forgot-password">Forgot password</Link>
            </label>
            <input type="submit" value="Login"/>
            <p>Don't have an account ? <Link to="/register">Register</Link></p>
          </form>
        </aside>
      </div>
    </div>
  );
}
