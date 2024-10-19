const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized access' });

  try {
    // Verify the token and extract the payload
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.companyId = verified.companyId;
    req.email = verified.email;  // Optional: Attach email if needed

    next();  // Proceed to the protected route
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
