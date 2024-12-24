import { backendPlayer } from './backendPlayer';
import { Lobby } from './lobby';
import { v4 as uuidv4 } from 'uuid';

import { Socket } from 'socket.io';
import express from 'express';
import path from 'path';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

const lobbies: Map<string, Lobby> = new Map();


// Find or create an available lobby
function findAvailableLobby(): Lobby {
  // Check existing lobbies
  for (const [_, lobby] of lobbies) {
      if (!lobby.isActive && lobby.manager.length < 2) {
          return lobby;
      }
  }
  
  // Create new lobby if none available
  const newLobby = new Lobby(uuidv4(), false);
  lobbies.set(newLobby.id, newLobby);
  return newLobby;
}


// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist'), {
  setHeaders: (res, filePath) => {
    // Correctly set MIME types for different file types
    if (path.extname(filePath) === '.css') {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Socket Connection 
io.on('connection', (socket: Socket) => {

  console.log('New connection:', socket.id);

  socket.on('join_game', (width, height) => {

    // Add the player to the game
    const playerColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const player = new backendPlayer(socket.id, width, height, playerColor);
    
    const lobby = findAvailableLobby();
    lobby.manager.addPlayer(socket.id, player);

    // join socket to the lobby room
    socket.join(lobby.id);

    io.to(lobby.id).emit('updatePlayers', lobby.manager.getAllPlayers());

    console.log('Player joined:', socket.id);

    if (lobby.manager.length === 1) {
      console.log('Waiting for another player to join...');
      io.to(lobby.id).emit('waitingForPlayer');
    }

    // start game if lobby is full
    if (lobby.manager.length === 2) {
      lobby.isActive = true;

      io.to(lobby.id).emit('startGame', lobby.id);
    }
  
  });

  // game actions
  socket.on('keyPress', (key: string) => {

    let player: backendPlayer | undefined;

    // grab player from lobby by socket id
    for (const [_, lobby] of lobbies) {
      player = lobby.manager.getPlayer(socket.id);
      if (player) {
        player.keys.add(key);
      }
    }
    
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

    let player: backendPlayer | undefined;

    // grab player from lobby by socket id
    for (const [_, lobby] of lobbies) {
      player = lobby.manager.getPlayer(socket.id);
      if (player) {
        player.keys.add(key);
      }
    }

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

  // handle player disconnection 
  socket.on('disconnect', () => {
    console.log('A user disconnected ' + socket.id);

    const lobby = lobbies.get(socket.id);
    if (lobby) {
      lobby.manager.removePlayer(socket.id);
      io.to(lobby.id).emit('updatePlayers', lobby.manager.getAllPlayers());
    }

    if (lobby && lobby.manager.length === 0) {
      lobbies.delete(lobby.id);
    }

  });
});

setInterval(() => {
  // Update the game state for each lobby
  for (const [_, lobby] of lobbies) {
    if (lobby.isActive) {
      for (const id in lobby.manager.getAllPlayers()) {
        const player = lobby.manager.getPlayer(id);
        if (player) {
          player.update();
        }
      }

      // Notify all clients in the lobby of the updated game state
      io.to(lobby.id).emit('updatePlayers', lobby.manager.getAllPlayers());
    }
  }
}, 15);  // Update the game state every 15ms; 60fps


server.listen(PORT, () => {
  console.log("Server running on port ${PORT}");
});