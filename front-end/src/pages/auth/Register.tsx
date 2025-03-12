import React, { use, useState } from "react";
import "./style/Register.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Register() {
  const [next, setNext] = useState(false);

  return (
    <div className="register-body">
      <div className="register-container">
        <aside className="logo">
          <img src={logo} alt="college logo" />
        </aside>
        <aside className="register-form">
          <form action="post">
            {!next && (
              <>
                <h1>Create a new account</h1>
                <p className="descripton">
                  Join our platform and connect with opportunities
                </p>
                <button className="student-role" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="#1f1f1f"
                  >
                    <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
                  </svg>
                  <p>
                    <h4>Sign up as a Student</h4>
                    Compete, learn, and apply for jobs and internships
                  </p>
                </button>
                <button className="student-role" type="button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#1f1f1f"
                  >
                    <path d="M160-80v-240h120v240H160Zm200 0v-476q-50 17-65 62.5T280-400h-80q0-128 75-204t205-76q100 0 150-49.5T680-880h80q0 88-37.5 157.5T600-624v544h-80v-240h-80v240h-80Zm120-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z" />
                  </svg>
                  <p>
                    <h4>Sign up as a Student</h4>
                    Compete, learn, and apply for jobs and internships
                  </p>
                </button>
                <button
                  className="next-btn"
                  type="button"
                  onClick={() => {
                    setNext(true);
                  }}
                >
                  Next
                </button>
              </>
            )}
            {next && (
              <section className="register-form-portion">
                <div onClick={() => setNext(false)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#9e9e9e"
                  >
                    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                  </svg>
                </div>
                <label className="username">
                  <label>First Name<input type="text" placeholder="First name"/></label>
                  <label>Last Name<input type="text" placeholder="Last name"/></label>
                </label>
                <label>
                  Email
                  <input type="email" placeholder="Enter your email" />
                </label>
                <label>
                  Password
                  <input type="password" placeholder="Enter your password" />
                </label>
                <label>
                  Retype Password
                  <input type="password" placeholder="Enter your password" />
                </label>
                <label>
                  <label>
                    Phone
                    <input type="tel" placeholder="Enter your phone number"/>
                  </label>
                </label>
                <label className="gender">
                    Gender
                    <select>
                      <option disabled value="" >[not selected]</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                <input type="submit" value="Register" />
                <p className="redirect">
                  Already have an account ? <Link to="/">Login</Link>
                </p>
              </section>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
}
