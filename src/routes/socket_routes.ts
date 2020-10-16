import ws from 'ws'
import { server } from '../app';
import { Request } from 'express';
import url from 'url';
import { socketController } from '../controllers/socket_controller';

const wsServer = new ws.Server({ noServer: true });

wsServer.on('connection', socketController.onConnect);

server.on('upgrade', (request:Request, socket, head) => {

    const pathname:string = url.parse(request.url).pathname + '';

    if(pathname === '/connection') {

        wsServer.handleUpgrade(request, socket, head, socket => {
            wsServer.emit('connection', socket, request);
        });
    }
});
