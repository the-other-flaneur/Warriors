import { backendPlayer } from "./backendPlayer";

export interface PlayersCollection {
    [socketId: string]: backendPlayer;
}

export class Manager {
    private players: PlayersCollection = {};
  
    // Add a new player
    addPlayer(socketId: string, player: backendPlayer): void {
        this.players[socketId] = player;
    }
  
    // Remove a player
    removePlayer(socketId: string): void {
        delete this.players[socketId];
    }
  
    // Get a player
    getPlayer(socketId: string): backendPlayer {
        return this.players[socketId];
    }
  
    // Get all players
    getAllPlayers(): PlayersCollection {
        return this.players;
    }

    // get length
    get length(): number {
        return Object.keys(this.players).length;
    }
  }

export class Lobby {
  id: string;
  manager: Manager;
  isActive: boolean;

    constructor(id: string, isActive: boolean) {
        this.id = id;
        this.manager = new Manager();
        this.isActive = isActive;
    }
}