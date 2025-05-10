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
exports.isLoggedIn = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

// Session-based Authentication Middleware
function isAuthenticated(req, res, next) {
	if (req.session && req.session.userData) {
		return next();
	}
	req.flash('error_msg', 'Please login to view this page');
	res.redirect('/user/login');
}

module.exports = {
	authenticateToken,
	isAuthenticated
};
