const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

async function handleLogin(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('error_msg', 'No user found');
      return res.redirect('/login');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid password');
      return res.redirect('/login');
    }

    // If login is successful, set session variables or JWT tokens as per your authentication strategy
    req.session.userId = user._id; // Store user id in session
    req.flash('success_msg', 'Login successful!');
    res.redirect('/dashboard'); // Redirect to dashboard or any authenticated route

  } catch (error) {
    console.error('Error during user login:', error);
    req.flash('error_msg', 'Error during login. Please try again.');
    res.redirect('/login'); // Redirect back to login page on error
  }
}

module.exports = {
  handleLogin,
};
