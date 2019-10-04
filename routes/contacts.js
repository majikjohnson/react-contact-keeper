const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Contact = require('../models/Contact');

const router = express.Router();

// @ROUTE   GET /api/contacts
// @DESC    Returns all contacts
// @ACCESS  private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1});
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Internal Server Error'});
    }
});

// @ROUTE   POST /api/contacts
// @DESC    Creates a new contacts
// @ACCESS  private
router.post('/', (req, res) => res.send('Create new contact'));

// @ROUTE   PUT /api/contacts
// @DESC    Updates a contact
// @ACCESS  private
router.put('/:id', (req, res) => res.send('Update contact'));

// @ROUTE   DELETE /api/contacts
// @DESC    Deletes a contact
// @ACCESS  private
router.delete('/:id', (req, res) => res.send('Delete contact'));

module.exports = router;