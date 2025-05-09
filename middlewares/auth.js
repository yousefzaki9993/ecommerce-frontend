// authMiddleware.js

const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.sendStatus(401);

	const token = authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403); // invalid token
		req.user = decoded; // decoded contains user_id or whatever you encoded
		next();
	});
}

// Session-based Authentication Middleware
function isAuthenticated(req, res, next) {
	if (req.session && req.session.userData) {
		return next();
	}
	req.flash('error_msg', 'Please login to view this page');
	res.redirect('/user/login');
}



exports.verifyAdmin = (req, res, next) => {
	const authHeader = req.headers.authorization;
  
	if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
	const token = authHeader.split(' ')[1];
  
	try {
	  const decoded = jwt.verify(token, 'your_jwt_secret');
	  req.admin = decoded;
	  next();
	} catch (err) {
	  return res.status(403).json({ message: 'Invalid token' });
	}
  };




module.exports = {
	authenticateToken,
	isAuthenticated
};
