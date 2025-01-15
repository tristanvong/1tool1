const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const session = require('express-session');
const mysqlSessionStore = require('express-mysql-session')(session);
const { connectDB } = require('./config/db');

const errorRoutes = require('./routes/error');
const userRoutes = require('./routes/user.js');
const chatRoutes = require('./routes/chat.js');

dotenv.config();
const app = express();
connectDB();

const sessionStore = new mysqlSessionStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    key: 'user_sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false, 
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/', chatRoutes);
app.use('/user', userRoutes); 
app.use('/', errorRoutes);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});