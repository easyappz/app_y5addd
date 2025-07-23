const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  isEvaluated: { type: Boolean, default: false },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'] },
      age: { type: Number }
    }
  ],
  statistics: {
    male: { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
    female: { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
    other: { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
    ageGroups: {
      under20: { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
      '20to30': { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
      '30to40': { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } },
      over40: { count: { type: Number, default: 0 }, totalScore: { type: Number, default: 0 } }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photo', PhotoSchema);