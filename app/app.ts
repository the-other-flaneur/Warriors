/**
 * Sets up an Express server with Socket.io integration.
 * 
 * - Serves static files from the `dist` directory.
 * - Provides a basic API route at `/api/hello`.
 * - Serves the `index.html` file for all other routes.
 * - Handles Socket.io connections and disconnections.
 * 
 * @file /home/felipe/Documents/gamedev/app/app.ts
 */

import { Socket } from 'socket.io';
import express from 'express';
import path from 'path';

// Socket.io setup
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
    // Add more specific MIME type settings as needed
  }
}));

/**
 * Handles a new Socket.io connection.
 * 
 * @param socket - The connected socket instance.
 */
io.on('connection', (socket: Socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});