const Household = require('../models/Household');

const createHousehold = async (req, res) => {
  try {
    const { householdName, householdIdentifier, members } = req.body;

    if (!householdName || !householdIdentifier) {
      return res.status(400).json({
        message: 'Household name and household identifier are required.'
      });
    }

    const existingHousehold = await Household.findOne({
      householdIdentifier
    });

    if (existingHousehold) {
      return res.status(409).json({
        message: 'A household with this identifier already exists.'
      });
    }

    const household = new Household({
      householdName,
      householdIdentifier,
      members: members || []
    });

    await household.save();

    return res.status(201).json({
      message: 'Household created successfully.',
      household
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to create household.'
    });
  }
};

const getHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    return res.status(200).json(household);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve household.'
    });
  }
};

module.exports = {
  createHousehold,
  getHousehold
};