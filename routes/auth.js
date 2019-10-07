const express = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const router = express.Router();

// @ROUTE   GET /api/auth
// @DESC    Gets logged in user
// @ACCESS  private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ msg: 'Internal Server Error' });
	}
});

// @ROUTE   POST /api/auth
// @DESC    Auth user and get token
// @ACCESS  public
router.post('/', 
    [
		check('email', 'Please use a valid email address').isEmail(),
		check('password', 'Please enter a password').not().isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}
		const { email, password } = req.body;

		try {
			const user = await User.findOne({ email });
			if (!user) return res.status(400).json({ msg: "User doesn't exist" });
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (error) {
			console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}
);

module.exports = router;
