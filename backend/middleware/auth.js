const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const logger = require('../utils/logger');

// Setup Passport
exports.setupPassport = (app, passport) => {
  app.set('trust proxy', 1);
  
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
        .populate('assignedRoute')
        .populate('assignedBus');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      
      // Check if email is from allowed domain
      if (!email.endsWith(`@${process.env.ALLOWED_DOMAIN}`)) {
        return done(null, false, { 
          message: `Only ${process.env.ALLOWED_DOMAIN} emails are allowed` 
        });
      }

      // Find or create user
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      }

      // Create new user
      const adminEmails = process.env.ADMIN_EMAILS 
        ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
        : [];
      
      const isAdmin = adminEmails.includes(email.toLowerCase());

      user = await User.create({
        googleId: profile.id,
        email: email,
        name: profile.displayName,
        profilePicture: profile.photos[0]?.value || null,
        role: isAdmin ? 'admin' : 'user',
        lastLogin: new Date()
      });

      logger.info(`New user created: ${user.email} (${user.role})`);
      done(null, user);

    } catch (err) {
      logger.error(`OAuth error: ${err.message}`);
      done(err, null);
    }
  }));
};

// Middleware to ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false,
    error: 'Unauthorized - Please log in first' 
  });
};

// Middleware to ensure user is admin
exports.ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ 
    success: false,
    error: 'Admin access required' 
  });
};

// Middleware to check if user owns the resource
exports.ensureOwnership = (Model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceId = req.params[paramName];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ 
          success: false,
          error: 'Resource not found' 
        });
      }

      if (resource.user && resource.user.toString() !== req.user.id) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};