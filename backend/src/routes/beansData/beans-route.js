import express from "express";
import {getAllBeans} from "../../Controller/beans-data/beansController.js";

const router = express.Router();

router.get("/", getAllBeans);

export default router