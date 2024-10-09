// models/Sale.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  }
});

module.exports = mongoose.model('Sale', SaleSchema);
