const express = require('express');

const router = express.Router();

// @ROUTE   GET /api/contacts
// @DESC    Returns all contacts
// @ACCESS  private
router.get('/', (req, res) => res.send('Get contacts'));

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