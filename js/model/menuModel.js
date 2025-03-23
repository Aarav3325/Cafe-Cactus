const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    category : String,
    bestseller: { type: Boolean, default: false },
    category: { type: String, required: true }
});

module.exports = mongoose.model("Menu", menuSchema, "menu");


