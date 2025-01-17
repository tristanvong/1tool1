const { pool } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const getUsersWithLimitOffset = async (req, res, next) => {
    try {
        const { limit = 3, offset = 0 } = req.query;
        const pageLimit = parseInt(limit, 10);
        const pageOffset = parseInt(offset, 10);

        const query = 'SELECT id, name, email FROM users WHERE id != ? LIMIT ? OFFSET ?';
        const [users] = await pool.query(query, [req.session.user.id, pageLimit, pageOffset]);

        req.users = users;
        req.limit = pageLimit;
        req.offset = pageOffset;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users.');
    }
};

module.exports = { getUsersWithLimitOffset };