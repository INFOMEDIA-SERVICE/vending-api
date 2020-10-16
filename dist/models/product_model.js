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
const productSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: [true, 'The productId is required']
    },
    description: {
        type: String,
        required: [true, 'The description is required']
    },
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    image: {
        type: String,
        required: [true, 'The image is required']
    },
    price: {
        type: String,
        required: [true, 'The price is required']
    },
    available: {
        type: String,
        default: false
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
productSchema.methods.encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hashSync(password, salt);
});
productSchema.methods.validatePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(password, this.password);
    });
};
exports.default = mongoose_1.model('product', productSchema);
//# sourceMappingURL=product_model.js.map