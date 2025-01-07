const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const { connectDB } = require('./config/db');

const homeRoutes = require('./routes/home');
const errorRoutes = require('./routes/error');
const userRoutes = require('./routes/user.js');

dotenv.config();
const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.use('/user', userRoutes); 
app.use('/', homeRoutes);
app.use('/', errorRoutes);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});