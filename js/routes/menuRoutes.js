const express = require("express");
const Menu = require("../model/menuModel"); // Import Menu model
const router = express.Router();

// Fetch all menu items
router.get("/menu", async (req, res) => {
    try {
        const menuItems = await Menu.find(); // Fetch all items from MongoDB
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
