const { pool } = require('../config/db');

const chatRoomAlreadyExists = async (req, res, next) => {
  try {
    const senderId = req.session.user.id;
    const receiverId = req.body.receiverId;
    const [existingChat] = await pool.query(`
      SELECT id 
      FROM chats 
      WHERE (sender_id = ? AND receiver_id = ?) 
      OR (sender_id = ? AND receiver_id = ?)
    `, [senderId, receiverId, receiverId, senderId]);
  
    if (existingChat.length > 0) {
      return res.redirect(`/chat/room/${existingChat[0].id}`);
    }
  
    next(); 
  } catch (err) {
    console.error('Error in chatRoomAlreadyExists:', err);
    res.status(500).send('Error checking existing chat.');
  }
};

module.exports = { chatRoomAlreadyExists };