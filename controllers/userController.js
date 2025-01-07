const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('data:', name, email);

  if (!name || !email || !password) {
    return res.render('user/create', {
      error: 'All fields (name, email, password) are required.',
      name,
      email
    });
  }

  try {
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, bcryptRounds);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, hashedPassword]);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: result.insertId, name, email },
    });
  } catch (err) {
    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.render('user/create', {
        title: 'Create User',
        error: 'This email address is already in use. Please choose a different one.',
        name,
        email
      });
    }

    res.render('user/create', {
        title: 'Create User',
        error: 'An unexpected error occurred.<br/>Please try again later.<br/>Error message: ' + err.message,        name,
        email,
    });
  }
};

module.exports = { createUser };