import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api";
import showToast from "../../utils/showToast";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const res = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      const authData = res.data;

      // Store authentication using the same structure
      // expected by api.js
      localStorage.setItem("userInfo", JSON.stringify(authData));

      showToast("Admin login successful!", "success");

      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Admin login failed";

      setError(msg);
      showToast(msg, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleAdminLogin}>
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

        <button className="btn btn-dark w-100" type="submit">
          Admin Login
        </button>

        <p className="text-center mt-3">
          Not an admin? <a href="/login">User Login</a>
        </p>
      </form>
    </div>
  );
}

export default AdminLoginPage;
