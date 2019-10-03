const express = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @ROUTE   POST /api/users
// @DESC    Register a user
// @ACCESS  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more charaters').isLength({min: 6})
], 
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }
    res.send('Success');
});

module.exports = router;