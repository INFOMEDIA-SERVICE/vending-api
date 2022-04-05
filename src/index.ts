import dotenv from 'dotenv';
import { socketController } from './modules/machine/controller';

dotenv.config();

import app, { server } from './app';

const main = (): void => {
    server.listen(app.get('port'));
    require('./modules/machine/routes');
    console.log(`Server on port ${app.get('port')}`);

    socketController.listenBarCode();
}

main();
