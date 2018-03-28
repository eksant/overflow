require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var fb = require('fb')
var mongoose = require('mongoose')
var sgMail = require('@sendgrid/mail');
var kue = require('kue')
var app = express();

mongoose.connection.openUri('mongodb://localhost/overflow');
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {
  console.log('mongoose connection success');
}).on('error', (error) => {
  console.log('connection error', error);
})

var queue = kue.createQueue({
  prefix: 'ququ',
  redis:{
    port:6379,
    host:'127.0.0.1'
  }
});

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/question', require('./routes/question'));
app.use('/api/answer', require('./routes/answer'));
app.use('/api/category', require('./routes/category'));

kue.app.listen(6366)
queue.process('email',function(job,done){
  sgMail.setApiKey(process.env.sendgrid);
  const msg = {
    to: job.data.email,
    from: 'eksant@gmail.com',
    subject: job.data.subject,
    text: job.data.text,
    html: job.data.html,
  };
  console.log(msg);
  sgMail.send(msg);
  done()
})

module.exports = app;
