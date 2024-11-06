const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

async function handleLogin(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // If login is successful, set session variables or JWT tokens
    req.session.userId = user._id; // Store user id in session

    // Respond with a success message and the user data (id and username only)
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error during user login:', error);
    return res.status(500).json({ success: false, message: 'Error during login. Please try again.' });
  }
}

module.exports = {
  handleLogin,
};
