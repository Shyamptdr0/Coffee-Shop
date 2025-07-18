import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth/authRoutes.js";
import cartRoute from "./routes/Cart/cart-route.js";
import coffeeRoute from "./routes/coffeeData/coffee-route.js";
import beansRoute from "./routes/beansData/beans-route.js";
import likeRoute from "./routes/like/like-route.js";
import orderRoute from "./routes/order/order-route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/assets", express.static("public"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/data", coffeeRoute);
app.use("/api/beans", beansRoute);
app.use("/api/like", likeRoute );
app.use("/api/order", orderRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB().then(() => console.log("MongoDB connected")).catch(console.error);
});
