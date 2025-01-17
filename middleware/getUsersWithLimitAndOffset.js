const { pool } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const getUsersWithLimitOffset = async (req, res, next) => {
    try {
        const { limit = 3, offset = 0, email = '' } = req.query;
        const pageLimit = parseInt(limit, 10);
        const pageOffset = parseInt(offset, 10);
        
        let query = 'SELECT id, name, email FROM users WHERE id != ?';
        const queryParams = [req.session.user.id];

        if (email) {
            query += ' AND email LIKE ?'; 
            queryParams.push(`%${email}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(pageLimit, pageOffset);

        const [users] = await pool.query(query, queryParams);

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