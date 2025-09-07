import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
        // The default function will run if no SKU is provided
        default: () => `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    price: {
        type: Number,
        required: true
    },
    stock_quantity: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;