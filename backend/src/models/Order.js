// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cartId: String,
    cartItems: [
        {
            productId: { type: String, required: true },
            name: String,
            type: String,
            image: String,
            size: String,
            price: Number,
            quantity: { type: Number, default: 1 },
        }
    ],
    totalAmount: Number,
    orderDate: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Order", OrderSchema);
