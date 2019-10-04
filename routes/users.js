const express = require('express');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const router = express.Router();

// @ROUTE   POST /api/users
// @DESC    Register a user
// @ACCESS  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more charaters').isLength({min: 6})
], 
async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    }

    const { name, email, password } = req.body;

    try {
        User.findOne({email});

        let user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.send("User added successfully");
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.errmsg}); 

    }

});

module.exports = router;