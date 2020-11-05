import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config();

import app, {server} from './app';

const main = ():void => {
    
    const serviceAccount = require('../google/abacox-vm-firebase-adminsdk-8aejj-71ee91cd42.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://abacox-vm.firebaseio.com'
    });
    
    server.listen(app.get('port'));
    require('./modules/machine/machine_routes');
    console.log(`Server on port ${app.get('port')}`);
}

main();
