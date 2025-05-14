
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.json({ message: 'Cita registrada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la cita.' });
  }
});

module.exports = router;
