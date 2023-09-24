const mongoose = require('mongoose');

const techniqueSchema = new mongoose.Schema({
  name: String,
  power: Number,
});

const characterSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  strength: Number,
  defense: Number,
  stamina: Number,
  speed: Number,
  technique: [techniqueSchema],  // Array of technique objects
  imageURL: String,
});

module.exports = mongoose.model('Character', characterSchema);
