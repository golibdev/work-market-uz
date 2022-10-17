const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const expressFileUpload = require('express-fileupload')
const indexRouter = require('./src/routes/index');
//const nodemailer = require('nodemailer');
require('dotenv').config()

const app = express();
app.use(cors())
app.use(expressFileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', indexRouter);

module.exports = app;
