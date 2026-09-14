const mongoose = require('mongoose');

const householdMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    relationship: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const householdSchema = new mongoose.Schema({
  householdName: {
    type: String,
    required: true,
    trim: true
  },

  householdIdentifier: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  members: {
    type: [householdMemberSchema],
    default: []
  }
});

module.exports = mongoose.model('Household', householdSchema);