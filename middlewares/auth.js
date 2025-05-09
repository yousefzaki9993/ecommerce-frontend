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



function verifyAdmin(req, res, next) {
    const token = req.cookies.admin_token;
    console.log("Token:", token);

    if (!token) {
        console.log("No token found, redirecting to login");
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log("Decoded Token:", decoded);

        if (decoded.role !== 'admin') {
            console.log("Not an admin, redirecting to login");
            return res.redirect('/admin/login');
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.log("Error verifying token:", err);
        return res.redirect('/admin/login');
    }
}



module.exports = {
	authenticateToken,
	isAuthenticated,
	verifyAdmin
};
