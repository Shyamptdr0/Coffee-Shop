import express from "express";
import { addToCart, getCart, updateQuantity, removeItem, clearCart } from "../../Controller/Cart/cart-controller.js";
import  authMiddleware  from "../../middleware/authmiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get/:userId", authMiddleware, getCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/remove/:userId", authMiddleware, removeItem);
router.delete("/clear/:userId", authMiddleware, clearCart);

export default router;
