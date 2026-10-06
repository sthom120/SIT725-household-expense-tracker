const Household = require('../models/Household');
const User = require('../models/User');
const {
  isValidId,
  isHouseholdMember
} = require('../utils/householdAccess');

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

// US11 - join an existing household using its household identifier.
// NOTE: login (US02) was not delivered, so the user ID is sent by the
// client as a stand-in for the logged-in user.
const joinHousehold = async (req, res) => {
  try {
    const { householdIdentifier, userId } = req.body;

    if (
      typeof householdIdentifier !== 'string' ||
      !householdIdentifier.trim() ||
      !userId
    ) {
      return res.status(400).json({
        message: 'Household identifier and user ID are required.'
      });
    }

    if (!isValidId(userId)) {
      return res.status(400).json({
        message: 'Invalid user ID.'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    const household = await Household.findOne({
      householdIdentifier: householdIdentifier.trim()
    });

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    if (isHouseholdMember(household, userId)) {
      return res.status(409).json({
        message: 'You are already a member of this household.'
      });
    }

    household.members.push({
      user: userId,
      relationship: 'member'
    });

    await household.save();

    return res.status(200).json({
      message: 'Joined household successfully.',
      householdId: household._id
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to join household.'
    });
  }
};

// US11 - household dashboard data, only for members of the household.
const getHouseholdDashboard = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!isValidId(req.params.id) || !isValidId(userId)) {
      return res.status(400).json({
        message: 'A valid household ID and user ID are required.'
      });
    }

    const household = await Household.findById(req.params.id)
      .populate('members.user', 'name email');

    if (!household) {
      return res.status(404).json({
        message: 'Household not found.'
      });
    }

    if (!isHouseholdMember(household, userId)) {
      return res.status(403).json({
        message: 'You are not a member of this household.'
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
  getHousehold,
  joinHousehold,
  getHouseholdDashboard
};
