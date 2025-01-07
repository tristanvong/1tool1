const express = require('express');
const router = express.Router();

// customize these later with views
router.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = router;
