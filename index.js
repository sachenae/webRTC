'use strict';

const express = require('express');
const app = express();


//app.use(express.static(path.join(__dirname, 'public')));

const https = require('https');
const fs = require('fs');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};


const server = https.createServer(options, app).listen(3000);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.use('/modules', express.static('node_modules'));



io.on('connection', socket => {
    const socketid = socket.id;
    console.log('a user connected with session id ' + socket.id);

    socket.on('call', (msg) => {
      console.log('call broadcasted');
      socket.broadcast.emit('call', msg);
    });

    socket.on('answer', (msg) => {
      console.log('answer broadcasted');
      socket.broadcast.emit('answer', msg);
    });

  },
);

app.get('/', (req, res) => {
    res.redirect('videochat.html');
  });
