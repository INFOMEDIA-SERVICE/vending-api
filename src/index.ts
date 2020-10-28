import dotenv from 'dotenv';
dotenv.config();

import app, {server} from './app';

const main = ():void => {
    server.listen(app.get('port'));
    require('./modules/machine/machine_routes');
    console.log(`Server on port ${app.get('port')}`);
}

main();
