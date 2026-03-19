const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: {
      id: user._id, name: user.name,
      email: user.email, role: user.role
    }});
  } catch (err) { 
  console.error(err);   // show error in terminal
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/auth/register (admin only in prod — open for setup)
router.post('/register', async (req, res) => {
  console.log("REGISTER API HIT");
    console.log(req.body);
  try {
    const { name, email, password, role, hospital } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User exists' });
    const user = await User.create({ name, email, password, role, hospital });
    res.status(201).json({ msg: 'User created', userId: user._id });
  } catch (err) { 
     console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;