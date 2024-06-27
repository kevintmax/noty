#!/bin/bash

# Update and install Node.js and npm
sudo apt update
sudo apt install -y nodejs npm

# Clone the repository
git clone https://github.com/kevintmax/noty.git
cd noty

# Install project dependencies
npm init -y
npm install express socket.io

# Set file permissions
chmod 755 server.js
chmod -R 755 public

# Configure firewall
sudo ufw allow 3000/tcp
sudo ufw reload

# Start the server
node server.js

# Alternatively, use pm2 to manage the process
# sudo npm install -g pm2
# pm2 start server.js
# pm2 startup
# pm2 save
