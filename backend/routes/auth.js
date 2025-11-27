const express = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    hd: process.env.ALLOWED_DOMAIN // Hint to Google to show only domain users
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login-failed',
    failureMessage: true
  }),
  (req, res) => {
    // Successful authentication
    const redirectUrl = process.env.CLIENT_REDIRECT_URI || 'http://localhost:5000';
    res.redirect(redirectUrl);
  }
);

router.get('/auth-success',(req, res) => {
    // Successful authentication
    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: req.user._id,
        email: req.user.email,
    }})
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', ensureAuthenticated, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        profilePicture: req.user.profilePicture,
        role: req.user.role,
        assignedRoute: req.user.assignedRoute,
        assignedBus: req.user.assignedBus,
        assignedStop: req.user.assignedStop,
        preferences: req.user.preferences,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', ensureAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(`Logout error: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        logger.error(`Session destroy error: ${err.message}`);
      }
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });
});

// @route   GET /api/auth/check
// @desc    Check if user is authenticated
// @access  Public
router.get('/check', (req, res) => {
  res.json({
    success: true,
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    } : null
  });
});

module.exports = router;