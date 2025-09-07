import mongoose, { Schema }  from "mongoose";
import { ORDER_STATUS } from "./Order_Status.js";
const orderSchema = new Schema({

   
   user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',                         
    required: true
    },
    total:{
        type:Number,
        required:true,
        default:0
    },
    status:{
        type:String,
        required:true,
        enum:Object.values[ORDER_STATUS],
        default:"DRAFT"
    },
    tax:{
        type:Number,
        required:true,
        default:5
    },
    fees:{
        type:Number,
        required:true,
        default:1
    },
    finalAmount:{
        type:Number
    }



},{timestamps:{createdAt:true,updatedAt:true}});
orderSchema.virtual("orderItems", {
  ref: "OrderItems",         
  localField: "_id",         
  foreignField: "order_id"   
});

// allow virtuals in JSON responses
orderSchema.set("toObject", { virtuals: true });
orderSchema.set("toJSON", { virtuals: true });
const Order = new mongoose.model('Order',orderSchema);

export default Order;
