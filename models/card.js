const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);