import BeansData from "../../data/beansData/beansData.js";

export const getAllBeans = (req, res)=>{
    res.status(200).json(BeansData);
}