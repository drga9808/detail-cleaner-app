
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  service: String,
  datetime: String
});

module.exports = mongoose.model('Appointment', appointmentSchema);
