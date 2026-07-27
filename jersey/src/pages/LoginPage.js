import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import showToast from "../utils/showToast";
import api from "../utils/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      // Temporarily store token so api.js can use it
      localStorage.setItem("userInfo", JSON.stringify(loginRes.data));

      // Fetch the logged-in customer's profile
      const profileRes = await api.get("/api/v1/users/me");

      // Combine authentication + profile information
      const userInfo = {
        ...loginRes.data,
        ...profileRes.data,
      };

      // Store complete user information in Redux + localStorage
      dispatch(login(userInfo));

      showToast("Logged in successfully!", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      showToast(msg, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="text-center mt-3">
          Are you an admin? <a href="/admin/login">Login here</a>
        </p>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
