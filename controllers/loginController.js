const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No user found with this email' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Successful login logic
    req.session.userId = user._id; // Store user id in session
    return res.status(200).json({ message: 'Login successful!', userId: user._id });
  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(500).json({ message: 'Error during login. Please try again.' });
  }
}

module.exports = {
  handleLogin,
};
