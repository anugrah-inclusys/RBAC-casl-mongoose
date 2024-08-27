const express = require('express');
const app = express();
const authorize = require('./app/controllers/middleware');
const User = require('./models/Users'); // Assuming User is a Mongoose model
const connectDB = require('./config/db');
const router = express.Router();


// Connect Database
connectDB();
// Initialize Middleware
app.use(express.json({ extended: false }));
app.get('/users', authorize('read', 'User'), async (req, res) => {
    const users = await User.accessibleBy(req.ability).exec(); // Fetch only accessible users
    res.json(users);
  });

// POST route to create a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Validate the request body
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Please provide name, email, and role' });
    }
    req.user = {
      id: '12345',  // mock user ID
      role: 'admin' // mock user role
    };
    // Assign the name to req.user.role for this request
    //req.user.role = name;

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      role
    });

    // Save the user to the database
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error occurred:', error.message);  // Log the error for debugging
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



app.put('/users/:id', authorize('update', 'User'), async (req, res) => {
  console.log("rOLE",req.user.role);
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

app.delete('/users/:id', authorize('delete', 'User'), async (req, res) => {
  console.log("rOLE",req.user.role);
  
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


