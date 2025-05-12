import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login.css";
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      if (response.status === 200) {
        alert('Login successful');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Welcome Back!</h2>
          <p>Please enter your credentials to continue</p>
          <div className="input-group">
            <input type="text" id="username" required placeholder=" "  autocomplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder=" " autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="password">Password</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <button type="button" onClick={handleLogin}>Login</button>

          <p className="sign-up-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;