const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

const chatRoomAccessMiddleware = async (req, res, next) => {    
    try {
        const chatRoomId = req.params.id;
        const userId = req.session.user.id;

        const query = 'SELECT sender_id, receiver_id FROM chats WHERE id = ?';
        const [chatDetails] = await pool.query(query, [chatRoomId]);

        if (!chatDetails.length) {
        return res.status(404).send('Chat not found.');
        }

        const { sender_id, receiver_id } = chatDetails[0];

        if (sender_id === userId || receiver_id === userId) {
        next(); 
        } else {
        return res.status(403).send('You do not have permission to access this chat room.');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error checking chat access.');
    }
};

module.exports = {chatRoomAccessMiddleware};