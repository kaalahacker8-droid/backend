const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['heritage', 'nature', 'temple', 'waterfall', 'city', 'transit', 'estate', 'trek', 'scenic', 'dam'],
    required: true
  },
  description: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  fareFromTown: { type: Number, required: true },
  distanceFromTown: { type: Number },
  estimatedDuration: { type: Number },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Place', PlaceSchema);

