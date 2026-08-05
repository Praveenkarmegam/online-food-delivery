import foodModel from "../models/foodModel.js";
import fs from 'fs'

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// update food
const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category } = req.body;
        const updateData = {
            name,
            description,
            price,
            category
        };

        if (req.file) {
            updateData.image = req.file.filename;
            const existingFood = await foodModel.findById(id);
            if (existingFood && existingFood.image) {
                fs.unlink(`uploads/${existingFood.image}`, () => { });
            }
        }

        await foodModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Food Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food" });
    }
}

export { listFood, addFood, removeFood, updateFood }