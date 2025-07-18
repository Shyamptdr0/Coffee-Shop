import mongoose from "mongoose";
import Cart from "../../models/Cart.js";

export const addToCart = async (req, res) => {
    let { userId, productId, name, type, image, size, price, quantity } = req.body;

    // console.log("📥 Add to cart received:", req.body);

    if (!userId || !productId || !size || !quantity) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const objectUserId = new mongoose.Types.ObjectId(userId);

        let cart = await Cart.findOne({ userId: objectUserId });

        if (!cart) {
            cart = new Cart({ userId: objectUserId, items: [] });
        }

        const existingItem = cart.items.find(
            item => item.productId === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, name, type, image, size, price, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Item added to cart", cart });
    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ success: false, message: "Add to cart failed", error: err.message });
    }
};

export const getCart = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const cart = await Cart.findOne({ userId });
        res.status(200).json({ success: true, cart: cart || { items: [] } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch cart", error: err.message });
    }
};


// ✅ Update quantity
export const updateQuantity = async (req, res) => {
    const {userId, productId, size, quantity} = req.body;

    try {
        const cart = await Cart.findOne({userId});
        if (!cart) return res.status(404).json({success: false, message: "Cart not found"});

        const item = cart.items.find(i => i.productId === productId && i.size === size);
        if (item) {
            item.quantity = quantity;
            await cart.save();
            return res.status(200).json({success: true, message: "Quantity updated", cart});
        }

        res.status(404).json({success: false, message: "Item not found"});
    } catch (err) {
        res.status(500).json({success: false, message: "Update failed", error: err.message});
    }
};

// ✅ Remove item
export const removeItem = async (req, res) => {
    const { userId } = req.params;
    const { productId, size } = req.query; // GET query params from URL

    if (!userId || !productId || !size) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => !(item.productId === productId && item.size === size));
        await cart.save();

        res.status(200).json({ success: true, message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Remove failed", error: err.message });
    }
};

// ✅ Clear cart
export const clearCart = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Clear failed", error: err.message });
    }
};
