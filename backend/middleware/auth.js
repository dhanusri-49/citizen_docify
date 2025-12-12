const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 2. Remove "Bearer " prefix if it exists
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7, authHeader.length) 
      : authHeader;

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    
    // 4. Add user to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token format' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};