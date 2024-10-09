// models/Employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sales: [{
    type: Schema.Types.ObjectId,
    ref: 'Sale'
  }]
});

module.exports = mongoose.model('Employee', EmployeeSchema);
