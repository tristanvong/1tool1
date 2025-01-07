const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

router.post('/create', createUser);

// test endpoint for now - remove later
router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;