const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/Auth');
const { pool } = require('../config/db');

router.post('/chat', isAuthenticated, async (req, res) => {
    try {
      const senderId = req.session.user.id;
      const receiverId = req.body.receiverId;
  
      const query = 'INSERT INTO chats (sender_id, receiver_id) VALUES (?, ?)';
      const [result] = await pool.query(query, [senderId, receiverId]);
  
      res.redirect(`/chat/room/${result.insertId}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error starting chat.');
    }
});

router.get('/chat/room/:id', isAuthenticated, async (req, res) => {
    try {
      const chatRoomId = req.params.id;
      const userId = req.session.user.id;
  
      const query = `
        SELECT * FROM messages 
        WHERE chat_id = ? 
        AND (sender_id = ? OR receiver_id = ?)
        ORDER BY created_at ASC
      `;
      const [messages] = await pool.query(query, [chatRoomId, userId, userId]);
  
      res.render('chat_room', { messages, chatRoomId });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error loading chat room.');
    }
});

module.exports = router;