const { pool } = require('../config/db');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required' });
  }

  try {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, password]);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: result.insertId, name, email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

module.exports = { createUser };