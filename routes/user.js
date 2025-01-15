const express = require('express');
const router = express.Router();
const { createUser, loginUser  } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/Auth');

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('user/dashboard', { user: req.session.user, title: 'Dashboard' });
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