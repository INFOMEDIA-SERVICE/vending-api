import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IProduct extends Document {
    productId: string
    description: string
    name: string
    image: string
    price: number
    available: boolean
};

const productSchema = new Schema({
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

productSchema.methods.encryptPassword = async(password:string):Promise<string> => {
    const salt:string = await bcrypt.genSalt(10);
    return bcrypt.hashSync(password, salt);
};

productSchema.methods.validatePassword = async function (password:string):Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<IProduct>('product', productSchema);
