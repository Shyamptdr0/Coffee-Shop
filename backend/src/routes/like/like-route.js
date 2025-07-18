import express from "express";
import {addToFav, removeFav, getFav} from "../../Controller/Like/like-controller.js"

const router = express.Router();

router.post("/add", addToFav);
router.delete("/remove", removeFav);
router.get("/get/:userId", getFav);


export default router;