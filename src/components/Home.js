import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import videoBg from './video4.mov'; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="ilaundry-container">
      <video autoPlay loop muted className="background-video">
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <header className="ilaundry-header">
        <div className="logo">iLaundry</div>
        <div className="nav-auth-group">
          <nav className="ilaundry-nav">
            <a href="#pricing">PRICING</a>
            <a href="#locations">LOCATIONS</a>
            <a href="#contact">CONTACT</a>
          </nav>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/signup')}>SignUp</button>
          </div>
        </div>
      </header>

      <main className="ilaundry-content">
        <h1>Transforming Laundry, Enhancing Lives</h1>
        <p className="tagline">We believe that cleanliness is the key to happiness and success in absolutely everything.</p>
        <p className="tagline">Modern Laundry Solutions for Busy Lives</p>
        <p className="experience">Trusted by thousands since 2010</p>
      </main>
    </div>
  );
};

export default Home;
