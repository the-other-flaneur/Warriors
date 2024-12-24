import { game } from './game.js';
import { frontManager, frontendPlayer } from './frontendPlayer.js';

const socket = (window as any).io();

const manager = new frontManager();

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
ctx.fillStyle = 'white';

socket.on("connect", () => {
    socket.emit('join_game', canvas.width, canvas.height);
});

socket.on('waitingForPlayer', () => {
    console.log('Waiting for another player to join...');
})

socket.on('startGame', (lobbyId: string) => {
    console.log('Game started on lobby:', lobbyId);
    console.log('Players:', manager.getAllPlayers());
});

socket.on('updatePlayers', (backendPLayers: any) => {  
      
    for (const id in backendPLayers) {
        if (!manager.getPlayer(id)) {
            const player = new frontendPlayer(id, backendPLayers[id].position, backendPLayers[id].size, socket, backendPLayers[id].color);
            manager.addPlayer(id, player);
        } 
        manager.getPlayer(id)?.update(backendPLayers[id].position);
    }

    for (const id in manager.getAllPlayers()) {
        if (!backendPLayers[id]) {
            manager.removePlayer(id);
        }
    }

});

let gameInstance: game;
gameInstance = new game(ctx, canvas, manager.getAllPlayers());
gameInstance.draw(manager.getAllPlayers());