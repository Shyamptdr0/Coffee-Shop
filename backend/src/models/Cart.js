import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: { type: String, required: true }, // or ObjectId if referencing Product
    name: String,
    type: String, // 'Bean' or 'Coffee'
    image: String,
    size: String,
    price: Number,
    quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
