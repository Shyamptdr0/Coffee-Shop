import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";

export const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // 1. Fetch the user's cart
        const cart = await Cart.findOne({ userId });

        // 2. Check if cart and items exist
        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty or not found" });
        }

        // 3. Calculate total amount
        const totalAmount = cart.items.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        // 4. Create the order
        const newOrder = await Order.create({
            userId,
            cartId: cart._id.toString(),
            cartItems: cart.items,
            totalAmount,
            orderStatus: "pending",
            orderDate: new Date()
        });

        // 5. Clear the cart after order
        cart.items = [];
        await cart.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order: newOrder,
        });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Server error while placing order" });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ orderDate: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user orders" });
    }
};

