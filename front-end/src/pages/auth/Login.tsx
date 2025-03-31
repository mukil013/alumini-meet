import { useState } from "react";
import "./style/Login.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { mainUrlPrefix } from "../../main";

export default function Login() {
  const LoginLinkBackend = `${mainUrlPrefix}/user/validateUser`;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(LoginLinkBackend, formData);

      // Save tokens to sessionStorage
      const { accessToken, refreshToken, userDetail } = response.data;
      const { userId, role } = userDetail
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("user", userId);
      sessionStorage.setItem("role", role)

      switch (role) {
        case "user":
          nav("/home");
          break;
        case "alumini":
          nav("/home");
          break;
        case "admin":
          nav("/admin-home");
          break;
        default:
          nav("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        console.error(
          "Error during login:",
          axiosError.response?.data?.message || axiosError.message
        );
        alert(
          axiosError.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
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
              Email
              <br />
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
              Password
              <br />
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