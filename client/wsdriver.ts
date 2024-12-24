import { Socket } from 'socket.io';

// Note: Websocket driver
export class wsDriver {
    socket: Socket;

    constructor(socket: any) {
        this.socket = socket;
    }

    createPlayer(width: number, height: number) {
        this.socket.emit('createPlayer', width, height);
    }

    keyPress(key: string) {
        this.socket.emit('keyPress', key);
    }

    keyRelease(key: string) {
        this.socket.emit('keyRelease', key);
    }
}
