import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation middleware
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer_not_to_say'])
    .withMessage('Please provide a valid gender'),
];

const validateStudentProfile = [
  body('board')
    .isIn(['cbse', 'icse', 'state', 'ib', 'cambridge', 'other'])
    .withMessage('Please provide a valid educational board'),
  body('stream')
    .isIn(['science', 'commerce', 'humanities'])
    .withMessage('Please provide a valid stream'),
  body('percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentage must be between 0 and 100'),
  body('preferredField')
    .optional()
    .isIn(['engineering', 'medicine', 'business', 'computer-science', 'law', 'arts', 'science', 'design', 'other'])
    .withMessage('Please provide a valid preferred field'),
  body('budget')
    .optional()
    .isIn(['under-2-lakh', '2-5-lakh', '5-10-lakh', '10-20-lakh', 'above-20-lakh'])
    .withMessage('Please provide a valid budget range'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// @route   GET /api/v1/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: StudentProfile,
        as: 'studentProfile'
      }],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      code: 'GET_PROFILE_ERROR'
    });
  }
});

// @route   PUT /api/v1/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', validateProfileUpdate, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, profilePicture } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (profilePicture) updateData.profilePicture = profilePicture;

    await req.user.update(updateData);

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    logger.info('User profile updated', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

// @route   POST /api/v1/user/student-profile
// @desc    Create or update student profile
// @access  Private
router.post('/student-profile', validateStudentProfile, handleValidationErrors, async (req, res) => {
  try {
    const {
      board,
      stream,
      percentage,
      cgpa,
      grade,
      subjects,
      entranceExams,
      preferredField,
      locationPreference,
      budget,
      budgetAmount,
      additionalInfo,
      achievements,
      extracurricularActivities,
      workExperience
    } = req.body;

    // Check if student profile already exists
    let studentProfile = await StudentProfile.findOne({
      where: { userId: req.user.id }
    });

    const profileData = {
      board,
      stream,
      percentage,
      cgpa,
      grade,
      subjects: subjects || {},
      entranceExams: entranceExams || {},
      preferredField,
      locationPreference: locationPreference || [],
      budget,
      budgetAmount,
      additionalInfo,
      achievements: achievements || [],
      extracurricularActivities: extracurricularActivities || [],
      workExperience: workExperience || []
    };

    if (studentProfile) {
      // Update existing profile
      await studentProfile.update(profileData);
    } else {
      // Create new profile
      studentProfile = await StudentProfile.create({
        userId: req.user.id,
        ...profileData
      });
    }

    logger.info('Student profile saved', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Student profile saved successfully',
      data: {
        studentProfile
      }
    });
  } catch (error) {
    logger.error('Save student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save student profile',
      code: 'SAVE_PROFILE_ERROR'
    });
  }
});

// @route   GET /api/v1/user/student-profile
// @desc    Get student profile
// @access  Private
router.get('/student-profile', async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        studentProfile
      }
    });
  } catch (error) {
    logger.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get student profile',
      code: 'GET_STUDENT_PROFILE_ERROR'
    });
  }
});

// @route   DELETE /api/v1/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    // Soft delete - mark as inactive
    await req.user.update({ isActive: false });

    logger.info('User account deactivated', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      code: 'DELETE_ACCOUNT_ERROR'
    });
  }
});

// @route   PUT /api/v1/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;

    await req.user.update({ preferences });

    logger.info('User preferences updated', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    logger.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      code: 'UPDATE_PREFERENCES_ERROR'
    });
  }
});

export default router;
