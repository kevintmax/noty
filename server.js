const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const SAVE_FILE_PATH = path.join(__dirname, 'savedContent.txt');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');
    let userId;

    // Load saved content when a user connects
    fs.readFile(SAVE_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading saved content:', err);
            data = '';
        }
        socket.emit('load content', data);
    });

    // Save content and broadcast changes to all clients
    socket.on('save content', ({ content, cursorPos }) => {
        fs.writeFile(SAVE_FILE_PATH, content, (err) => {
            if (err) {
                console.error('Error saving content:', err);
            } else {
                socket.broadcast.emit('update content', {
                    content,
                    cursorPos,
                    senderId: userId
                });
            }
        });
    });

    // Handle new user
    socket.on('new user', ({ userId: id }) => {
        userId = id;
        console.log(`New user connected: ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
