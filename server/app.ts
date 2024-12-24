import { backendPlayer, backManager } from './backendPlayer';

import { Socket } from 'socket.io';
import express from 'express';
import path from 'path';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist'), {
  setHeaders: (res, filePath) => {
    // Correctly set MIME types for different file types
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

const manager = new backManager();

// Socket Connection 
io.on('connection', (socket: Socket) => {

  console.log('A user connected');

  socket.on('createPlayer', (width, height) => {
    // Add the player to the game
    const player = new backendPlayer(socket.id, width, height);
    manager.addPlayer(socket.id, player);
    io.emit('updatePlayers', manager.getAllPlayers());
  });

  socket.on('keyPress', (key: string) => {
    const player = manager.getPlayer(socket.id);

    switch (key) {
      case 'ArrowUp':
        if (player) {
          player.jump();
        }
        break;

      case 'ArrowRight':
        if (player) {
          player.keys.add('ArrowRight');
        }
        break;

      case 'ArrowLeft':
        if (player) {
          player.keys.add('ArrowLeft');
        }
        break;
    }
  });

  socket.on('keyRelease', (key: string) => {
    const player = manager.getPlayer(socket.id);

    switch (key) {
      case 'ArrowRight':
        if (player) {
          player.keys.delete('ArrowRight');
        }
        break;

      case 'ArrowLeft':
        if (player) {
          player.keys.delete('ArrowLeft');
        }
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Remove the player from the game
    manager.removePlayer(socket.id);
  });
});

setInterval(() => {
  // Update the game state
  for (const id in manager.getAllPlayers()) {
    const player = manager.getPlayer(id);
    if (player) {
      player.update();
    }
  }

  // Notify all clients of the updated game state
  io.emit('updatePlayers', manager.getAllPlayers());
}, 15);  // Update the game state every 15ms; 60fps

server.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});