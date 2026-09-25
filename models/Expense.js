const mongoose = require('mongoose');

const participantShareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    share: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    date: {
      type: Date,
      default: Date.now
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExpenseCategory',
      required: true
    },

    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household',
      required: true
    },

    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    participants: {
      type: [participantShareSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);