


import mongoose, { Schema } from "mongoose";
import Order from './Orders.js';

const OrderItemsSchema = new Schema({

    order_id:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    price_at_time:{
        type:Number,
        required:true,
        default:0
    }


});

const OrderItems = new mongoose.model('OrderItems',OrderItemsSchema);

export default OrderItems;