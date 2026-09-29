const Household = require('../models/Household');
const User = require('../models/User');

const createHousehold = async (req, res) => {
  try {
    const {
      householdName,
      householdIdentifier,
      creatorId
    } = req.body;

    if (!householdName || !householdIdentifier || !creatorId) {
      return res.status(400).json({
        message:
          'Household name, household identifier and creator are required.'
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

    const creator = await User.findById(creatorId);

    if (!creator) {
      return res.status(400).json({
        message: 'Creator user not found.'
      });
    }

    const household = new Household({
      householdName,
      householdIdentifier,
      members: [
        {
          user: creator._id,
          relationship: 'creator'
        }
      ]
    });

    await household.save();

    return res.status(201).json({
      message: 'Household created successfully.',
      household
    });
  } catch (error) {
    console.error('Create household error:', error);

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