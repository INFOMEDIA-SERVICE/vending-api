import ws from 'ws'
import { server } from '../../app';
import { Request } from 'express';
import url from 'url';
import { socketController } from './controller';


const wsServer: ws.Server = new ws.Server({ noServer: true });

wsServer.on('connection', socketController.onConnect);

server.on('upgrade', (req: Request, socket, head) => {

    const pathname: string = url.parse(req.url).pathname + '';

    if (pathname === '/connection/') {

        wsServer.handleUpgrade(req, socket, head, socket => {
            wsServer.emit('connection', socket);
        });

    }
});
