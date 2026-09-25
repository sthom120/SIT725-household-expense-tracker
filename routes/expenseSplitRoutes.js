const express = require('express');
const {
  calculateEqualSplit
} = require('../utils/expenseCalculations');

const router = express.Router();

router.post('/preview', (req, res) => {
  const { amount, participantIds } = req.body;

  try {
    const participants = calculateEqualSplit(
      Number(amount),
      participantIds
    );

    res.json({ participants });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;