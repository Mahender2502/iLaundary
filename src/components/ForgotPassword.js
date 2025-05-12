import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotpassword.css";
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
       alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (response.ok) {
        setStep(3);
        alert("OTP verified successfully!");
      } else {
        alert(data.message);
      }
    } catch (error) {
       alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          newPassword,
          confirmPassword
        })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      alert('Password reset successfully..')
      navigate('/login');
      
    } catch (error) {
      console.error('Reset Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <p>Enter your email address to receive a verification code</p>
            <div className="input-group">
              <input type="email" id="email" required placeholder=" " autocomplete="off" value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <p>Enter the 6-digit code sent to {email}</p>
            <div className="input-group">
              <input 
                type="text" 
                id="otp" 
                required 
                placeholder=" "
                maxLength="6"
                pattern="\d{6}"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <label htmlFor="otp">Verification Code</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button 
              type="button" 
              className="back-button"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </>
        );
      case 3:
        return (
          <>
            <p>Set your new password</p>
            <div className="input-group">
              <input type="password" 
                id="newPassword" 
                required 
                placeholder=" "
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                id="confirmPassword" 
                required 
                placeholder=" "
                minLength="6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button 
              type="button" 
              className="back-button"
              onClick={() => setStep(2)}
            >
              Back
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    if (step === 1) return handleRequestOTP(e);
    if (step === 2) return handleVerifyOTP(e);
    if (step === 3) return handleResetPassword(e);
  };

  return (
    <div className="forgot-page-container">
      <div className="forgot-container">
        <form onSubmit={handleSubmit}>
          <h2>Reset Your Password</h2>
          
          {getCurrentForm()}

          <p className="sign-up-link">
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;