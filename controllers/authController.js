const User = require('../models/User');
const { hashPassword } = require('../utils/password');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required.'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Registration successful.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to register user.'
    });
  }
};

module.exports = {
  registerUser
};