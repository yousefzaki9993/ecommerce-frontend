const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		req.user = decoded;
		next();
	});

}
exports.isLoggedIn = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

module.exports = authenticateToken;