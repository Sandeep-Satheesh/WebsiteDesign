const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

app.use(express.json());
app.use(cors());
var currUname = 'User';

app.get('/connect', function(req, res) {
    res.render('index_embed.ejs');
});

app.get('/', function(req, res) {
    console.log('Someone else connected through direct route!');
    res.render('index.ejs');
});

app.post('/setUname', function(req, res) {
    console.log(req.body.currentUname + " is connected to chat!");
    currUname = req.body.currentUname;
    res.end(req.body.currentUname); 
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        if (username === null || username === 'null')
            socket.username = currUname;
        else
            socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat.</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat.</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(2001, function() {
    console.log('Chat server listening on port 2001...');
});