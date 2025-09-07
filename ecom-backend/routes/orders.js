import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Orders.js';
import OrderItems from '../models/Order_Items.js';
import Product from '../models/Products.js';
import { ORDER_STATUS } from '../models/Order_Status.js';

const router = express.Router();

// CREATE ORDER
router.post('/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { user_id, items } = req.body;

    // 1. Create a draft order
    const orderObj = new Order({ user_id });
    const savedOrder = await orderObj.save({ session });

    try {
        // 2. Prepare order items and calculate total
        const orderItems = [];
        let totalAmount = 0;

        for (const i of items) {
            const product = await Product.findById(i._id).session(session);
            if (!product) {
                throw new Error(`Product not found with id ${i._id}`);
            }
            if (product.stock_quantity < i.requestedQuantity) {
                // Change status to REJECTED if stock is insufficient
                savedOrder.status = ORDER_STATUS.REJECTED;
                await savedOrder.save({ session });
                throw new Error(`Not enough stock for product ${product.name}. Order has been marked as REJECTED.`);
            }

            // Reduce stock
            product.stock_quantity -= i.requestedQuantity;
            await product.save({ session });
            
            // Calculate item total and add to order total
            const itemTotal = product.price * i.requestedQuantity;
            totalAmount += itemTotal;

            // Prepare order item for insertion
            orderItems.push({
                order_id: savedOrder._id,
                product_id: i._id,
                quantity: i.requestedQuantity,
                price_at_time: product.price
            });
        }

        // 3. Save all order items
        await OrderItems.insertMany(orderItems, { session });

        // 4. Calculate final amount with tax and fees
        const taxAmount = totalAmount * (savedOrder.tax / 100);
        const finalAmount = totalAmount + taxAmount + savedOrder.fees;

        // 5. Update the order with totals and set status to COMPLETED
        savedOrder.total = totalAmount;
        savedOrder.finalAmount = finalAmount;
        savedOrder.status = ORDER_STATUS.COMPLETED;
        await savedOrder.save({ session });

        // 6. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder,
            items: orderItems
        });

    } catch (err) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// GET ORDER DETAILS
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate({
                path: "orderItems",
                populate: {
                    path: "product_id",
                    select: "sku name" // Added name for better display
                }
            })
            .select("_id status user_id createdAt total tax fees finalAmount"); // ✅ Added new fields

        if (!order) {
            return res.status(404).json({ message: "Order Not Found!!" });
        }

        // Format the response for the frontend
        const response = {
            order_id: order._id,
            status: order.status,
            user_id: order.user_id,
            created_at: order.createdAt,
            total: order.total,
            tax: order.tax,
            fees: order.fees,
            finalAmount: order.finalAmount,
            items: order.orderItems.map(item => ({
                order_item_id: item._id,
                quantity: item.quantity,
                price_at_time: item.price_at_time,
                product_id: item.product_id._id,
                sku: item.product_id.sku,
                name: item.product_id.name
            }))
        };

        res.status(200).json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});


export default router;
