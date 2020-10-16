"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
;
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform: (dot, ret) => {
            ret.id = dot._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    },
    toObject: {
        transform: (dot, ret) => {
            ret.id = dot._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
userSchema.methods.encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hashSync(password, salt);
});
userSchema.methods.validatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
exports.default = mongoose_1.model('User', userSchema);
//# sourceMappingURL=user_model.js.map