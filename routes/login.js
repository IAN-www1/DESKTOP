const express = require('express');
const router = express.Router();
const { handleLogin } = require('../controllers/loginController'); // Adjust the path as necessary

// Route to serve login page
router.get('/login', (req, res) => {
    // Always render the login page, regardless of login state
    res.render('login');
});

// Handle login form submission
router.post('/login', handleLogin);
// Handle login form submission
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body); // Log the incoming request body

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with this email');
      return res.status(401).json({ message: 'No user found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // If login is successful, set session variables or JWT tokens
    req.session.userId = user._id; // Store user id in session
    console.log('Login successful for user:', user.email);
    res.status(200).json({ message: 'Login successful', userId: user._id }); // Send success response

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
