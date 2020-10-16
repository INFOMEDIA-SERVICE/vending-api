import dotenv from 'dotenv';
dotenv.config();

import app, {server} from './app';
import './database';

const main = ():void => {
    server.listen(app.get('port'));
    require('./routes/socket_routes');
    console.log(`Server on port ${app.get('port')}`);
}

main();
