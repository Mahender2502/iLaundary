const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/Ilaundry')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  phonenumber: Number,
  email: { type: String, unique: true },
  password: String,
  otp: String,
});

const User = mongoose.model('User', userSchema);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vangarimahender2@gmail.com',           
    pass: 'ijpctoekkpsoqqqh'                
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp) {
  const mailOptions = {
    from: 'vangarimahender2@gmail.com',
    to: email,
    subject: 'Your Password Reset OTP',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

app.post('/api/signup', async (req, res) => {
  const { fullname, username, phonenumber, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({
      fullname,
      username,
      phonenumber,
      email,
      password 
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post('/api/request-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.com/.test(email)) {
    return res.status(400).json({ message: 'Please enter a vaild email address' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      
      return res.json({ message: 'If this email exists, an OTP has been sent' });
    }

    const otp = generateOTP();


    user.otp = otp;
    await user.save();

    const sent = await sendOTP(normalizedEmail, otp);
    if (!sent) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('DEV OTP:', otp);
    }
    
    res.json({ 
      message: 'OTP sent successfully',
      email: normalizedEmail 
    });
  } catch (error) {
    console.error('OTP Request Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ 
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found or OTP expired' });
    }

    if (user.otp !== otp) {
      
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    
    user.otp = undefined;
    await user.save();

    res.json({ 
      message: 'OTP verified successfully',
      email: user.email
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword} = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required' 
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ 
      email: normalizedEmail
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP' 
      });
    }

    user.password = newPassword; 
    user.otp = undefined;
    await user.save();

    res.json({ 
      success: true,
    });

  } catch (error) {
    console.error('Password Reset Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during password reset' 
    });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});