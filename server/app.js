/**
 * Created by dragos on 08/06/2017.
 */

"use strict";

const koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const config = require('./config/default');

const errorHandling = require('./src/middlewares/handleErrors');

const routes = require('./src/routes');

const sequilize = require('./src/db');

const passport = require('./src/auth');
const cors = require('koa-cors');

const app = koa();

//Use Koa logger
app.use(logger());

//use cors to allow cross site calls
app.use(cors());

//initilize passport
app.use(passport.initialize());

//custom error handling
app.use(errorHandling());

//body parser
app.use(bodyParser());


app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(config.port);