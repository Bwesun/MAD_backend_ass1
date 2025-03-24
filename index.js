const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); //to use .env file

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected sucessfully!'))
.catch(err => console.error('MongoDB error:', err));

// Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to Day 5 Assignment!');
});

// Student Routes
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});
const Student = mongoose.model('Student', studentSchema); // Defining students model

// Create
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.send(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put('/students/:id', async (req, res) => {
  try {
    const student_update = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(student_update);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.send({ message: 'Student deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(3000, () => console.log(`Server accurately running on http://localhost:3000`));
