const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  strength: Number,
  defense: Number,
  stamina: Number,
  speed: Number,
  technique: Array,
  imageURL: String,
});

module.exports = mongoose.model('Character', characterSchema);
