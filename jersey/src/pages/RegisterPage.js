
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import showToast from '../utils/showToast';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API= process.env.REACT_APP_API_URL;


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/users/register`, {
        name,
        email,
        password,
        phone,
      });

      // Auto login after registration
      dispatch(login(res.data));
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      showToast('Account created successfully!', 'success');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="tel"  min="9" max="10"className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
