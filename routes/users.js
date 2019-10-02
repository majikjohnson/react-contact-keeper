const express = require('express');

const router = express.Router();

// @ROUTE   GET /api/users
// @DESC    Gets all users
// @ACCESS  public
router.get('/', (req, res) => res.send('Get users'));

module.exports = router;