"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.MONGO_URI + '', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err)
        return console.log(err.message);
    console.log('Database is online');
});
//# sourceMappingURL=database.js.map