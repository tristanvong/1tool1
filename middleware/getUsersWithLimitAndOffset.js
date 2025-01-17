const { pool } = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

const getUsersWithLimitOffset = async (req, res, next) => {
    try {
        const { limit = 3, offset = 0, query = '', sort = 'id', order = 'ASC' } = req.query;
        const pageLimit = parseInt(limit, 10);
        const pageOffset = parseInt(offset, 10);
        const validSortFields = ['id', 'name', 'email'];
        const validOrder = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sort) ? sort : 'id';
        const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

        let queryBase = `SELECT id, name, email FROM users WHERE id != ?`;
        const queryParams = [req.session.user.id];

        if (query) {
            queryBase += ` AND (name LIKE ? OR email LIKE ? OR id LIKE ?)`;
            queryParams.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        queryBase += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
        queryParams.push(pageLimit, pageOffset);

        const [users] = await pool.query(queryBase, queryParams);

        req.users = users;
        req.limit = pageLimit;
        req.offset = pageOffset;
        req.sort = sortField;
        req.order = sortOrder;

        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users.');
    }
};

module.exports = { getUsersWithLimitOffset };