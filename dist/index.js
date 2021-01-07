"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
dotenv_1.default.config();
const app_1 = __importStar(require("./app"));
const main = () => {
    const serviceAccount = require('../google/abacox-vm-firebase-adminsdk-8aejj-71ee91cd42.json');
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        databaseURL: 'https://abacox-vm.firebaseio.com'
    });
    app_1.server.listen(app_1.default.get('port'));
    require('./modules/machine/machine_routes');
    console.log(`Server on port ${app_1.default.get('port')}`);
};
main();
//# sourceMappingURL=index.js.map