const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, error: errors.array() });
    }

    const { username, password } = req.body;
    
    // Replace with actual user authentication logic
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { id: 1, username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        data: {
          token,
          user: { id: 1, username, role: 'admin' }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.adminLogout = (req, res, next) => {
  // In a real implementation, you might want to blacklist the token
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};