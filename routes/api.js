const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('api-documentation', { title: 'API Documentation' });
});

module.exports = router;