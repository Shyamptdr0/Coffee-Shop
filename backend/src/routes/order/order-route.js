// routes/orderRoutes.js
import express from "express";
import {
    createOrder, getUserOrders
} from "../../Controller/Order/order-controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/user/:userId", getUserOrders);

export default router;
