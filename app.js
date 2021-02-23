// require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'})
const Server = require('./models/server');

const server = new Server();


server.listen()
