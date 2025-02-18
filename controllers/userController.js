const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const dotenv = require('dotenv');
const { emailValidator, passwordValidator, nameValidator } = require('../validators');

dotenv.config();


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('user/login', {
      error: 'Both email and password are required fields.',
      title: 'Login',
    });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.render('user/login', {
        error: 'Invalid email or password.',
        title: 'Login',
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('user/login', {
        error: 'Invalid email or password.',
        title: 'Login',
      });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);

    res.render('user/login', {
      error: 'An unexpected error occurred. Please try again later.',
      title: 'Login',
    });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/user/dashboard');
    }
    res.redirect('/user/login');
  });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log('data:', name, email);

  const errors = [
    nameValidator(name),
    emailValidator(email),
    passwordValidator(password),
  ].filter((error) => error !== null);

  if (errors.length > 0) {
    return res.render('user/create', {
      title: 'Create User',
      error: errors.join(' '),
      name,
      email,
    })
  }

  try {
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, bcryptRounds);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [name, email, hashedPassword]);

    res.redirect('/user/login');
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

const editUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.session.user.id;

  const errors = [
    nameValidator(name),
    emailValidator(email),
    password ? passwordValidator(password) : null,    
  ].filter((error) => error !== null);

  if (errors.length > 0){
    return res.render('user/edit', {
      error: errors.join(' '),
      title: 'Edit Account',
      name,
      email,
    });
  }

  try {
    let updateQuery = 'UPDATE users SET name = ?, email = ?';
    const queryParams = [name, email, userId];

    if (password) {
      const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS, 10);
      const hashedPassword = await bcrypt.hash(password, bcryptRounds);
      updateQuery += ', password = ?';
      queryParams.splice(2, 0, hashedPassword);
    }

    updateQuery += ' WHERE id = ?';

    await pool.query(updateQuery, queryParams);

    req.session.user.name = name;
    req.session.user.email = email;

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);

    res.render('user/edit', {
      title: 'Edit Account',
      error: 'An unexpected error occurred. Please try again later.',
      name,
      email,
    });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.session.user.id;

  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const deleteMessagesQuery = `
        DELETE FROM messages
        WHERE chat_id IN (
          SELECT id FROM chats WHERE sender_id = ? OR receiver_id = ?
        )
      `;
      await connection.query(deleteMessagesQuery, [userId, userId]);

      const deleteChatsQuery = 'DELETE FROM chats WHERE sender_id = ? OR receiver_id = ?';
      await connection.query(deleteChatsQuery, [userId, userId]);

      const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
      await connection.query(deleteUserQuery, [userId]);

      await connection.commit();

      connection.release();
      req.session.destroy((err) => {
        if (err) {
          console.error('Error logging out:', err);
          return res.redirect('/user/dashboard');
        }
        res.redirect('/user/login');
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error(err);
      res.status(500).send('Error deleting account.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error establishing database connection.');
  }
};

module.exports = { createUser, loginUser, logoutUser, editUser, deleteUser };