import CoffeeData from "../../data/coffeeData/coffeeData.js";

export const getAllCoffee = (req, res) => {
    res.status(200).json(CoffeeData);
};
