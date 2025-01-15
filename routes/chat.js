const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/Auth');
const {chatRoomAccessMiddleware} = require('../middleware/ChatroomAccess');
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

router.get('/chat/room/:id', isAuthenticated, chatRoomAccessMiddleware, async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const userId = req.session.user.id;

    const query = `
      SELECT m.*, u.email AS sender_email
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.chat_id = ? 
      AND (m.sender_id = ? OR m.receiver_id = ?)
      ORDER BY m.created_at DESC
    `;
    const [messages] = await pool.query(query, [chatRoomId, userId, userId]);

    res.render('chat_room', { messages, chatRoomId, user: req.session.user, title: 'Chat Room' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading chat room.');
  }
});

router.post('/chat/send', isAuthenticated, async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;
    const senderId = req.session.user.id;

    if(message == "" || message == null){
      return res.send("Message must not be empty!")
    }

    const [chatDetails] = await pool.query('SELECT sender_id, receiver_id FROM chats WHERE id = ?', [chatRoomId]);

    if (!chatDetails.length) {
      return res.status(404).send('Chat not found.');
    }

    const { sender_id, receiver_id } = chatDetails[0];

    const recipientId = senderId === sender_id ? receiver_id : sender_id;

    const query = 'INSERT INTO messages (chat_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)';
    await pool.query(query, [chatRoomId, senderId, recipientId, message]);

    res.redirect(`/chat/room/${chatRoomId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message.');
  }
});

module.exports = router;