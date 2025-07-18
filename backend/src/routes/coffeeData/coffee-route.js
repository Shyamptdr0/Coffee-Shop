import express from "express";
import { getAllCoffee } from "../../Controller/coffee-data/coffeeController.js";

const router = express.Router();

router.get("/", getAllCoffee); // GET /api/coffee

export default router;
