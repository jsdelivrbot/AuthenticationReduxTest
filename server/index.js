//Main starting point of the server
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); //middleware which parses any request which comes
const morgan = require('morgan'); //middleware for logging
const mongoose = require('mongoose');
const app = express();
const router = require('./router');
const cors = require('cors');

//DB setup
mongoose.connect('mongodb://localhost:auth/auth');

//App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening to port', port);