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

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Load saved content when a user connects
    fs.readFile(SAVE_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading saved content:', err);
            data = '';
        }
        socket.emit('load content', data);
    });

    // Save content on changes
    socket.on('save content', (content) => {
        fs.writeFile(SAVE_FILE_PATH, content, (err) => {
            if (err) {
                console.error('Error saving content:', err);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
