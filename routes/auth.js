// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar empleado
  const employee = await Employee.findOne({ email });
  if (!employee) {
    return res.status(400).json({ message: 'Empleado no encontrado' });
  }

  // Verificar contraseña
  const isMatch = await bcrypt.compare(password, employee.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Generar JWT
  const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
  res.json({ token });
});

module.exports = router;
