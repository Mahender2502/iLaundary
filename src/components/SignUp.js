import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

function SignUp() {
  const [fullname, setfullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
 
  const validateEmail = (email) => {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    if (!isStrongPassword(password)) {
      alert('Password must be at least 8 characters and include a number and special character.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        fullname,
        username,
        phonenumber,
        email,
        password,
      });
  
      if (response.status === 201) {
        alert('Signup successful');
        navigate('/login');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert('This email is already in use. Please use a different email.');
      } else {
        console.error('Signup failed', error);
        alert('Signup failed');
      }
    }
  };
  

  return (
    <div className="signup-page-container">
      <div className="signup-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Register</h2>
          <div className="input-group">
            <input type="text" id="fullname" required placeholder=" "  autocomplete="off" value={fullname} onChange={(e) => setfullname(e.target.value)} />
            <label htmlFor="fullname">Full Name</label>
          </div>
          <div className="input-group">
            <input type="text" id="username" required placeholder=" "  autocomplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-group">
          <input type="tel" id="phonenumber" required placeholder=" "  autocomplete="off" value={phonenumber}
              onChange={(e) => {
                const input = e.target.value;
                // Only allow digits (0–9)
                if (/^\d{0,10}$/.test(input)) {
                  setphonenumber(input);
                }
              }}
              />
            <label htmlFor="phonenumber">Phone Number</label>
          </div>
          <div className="input-group">
            <input type="email" id="email" required placeholder=" " autocomplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-group">
            <input type="password" id="password" required placeholder=" " autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="password">Password</label>
          </div>

          <div className="input-group">
            <input type="password" id="confirm-password" required placeholder=" " autocomplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <label htmlFor="confirm-password">Confirm Password</label>
          </div>

          <button type="button" onClick={handleSignup}>Sign Up</button>

          <p className="sign-up-button">
            <br />Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
