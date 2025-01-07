const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,      
  port: process.env.DB_PORT,       
  password: process.env.DB_PASSWORD,         
  database: process.env.DB_NAME,   
  waitForConnections: true,                        
  connectionLimit: 10,                             
  queueLimit: 0                                    
});

const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database \n:', err.stack);
      process.exit(1);
    } else {
      console.log('Connected to MySQL database as ID ' + connection.threadId);
      connection.release();
    }
  });
};

module.exports = connectDB;