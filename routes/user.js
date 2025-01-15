const express = require('express');
const router = express.Router();
const { createUser, loginUser  } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/Auth');
const { pool } = require('../config/db');

router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const query = 'SELECT id, name, email FROM users WHERE id != ?'
        const [users] = await pool.query(query, [req.session.user.id]);
        res.render('user/dashboard', { user: req.session.user, users, title: 'Dashboard' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

router.get('/create', (req, res) => {
    res.render('user/create', {title: 'Create User'}); 
});
router.post('/create', createUser);

router.get('/login', (req, res) => {
    res.render('user/login', { title: 'Login' });
});

router.post('/login', loginUser);

router.get('/logout', (req, res)=> {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out: ', err);
            return res.redirect('/user/dashboard');
        }
        res.redirect('/user/login');
    });
});

module.exports = router;