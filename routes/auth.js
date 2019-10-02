const express = require('express');

const router = express.Router();

// @ROUTE   GET /api/users
// @DESC    Gets logged in user
// @ACCESS  private
router.get('/', (req, res) => res.send('Get logged in user'));

// @ROUTE   POST /api/users
// @DESC    Auth user and get token
// @ACCESS  public
router.post('/', (req, res) => res.send('Log in user'));

module.exports = router;