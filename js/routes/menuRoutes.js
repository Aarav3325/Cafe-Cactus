const express = require("express");
const router = express.Router();
const Menu = require("../model/menuModel");
const mongoose = require("mongoose");


// GET all menu items — /api/menu
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to add a new menu item
router.post("/menu", async (req, res) => {
    try {
      const { name, price, description, category, image } = req.body;
  
      const newItem = new Menu({
        name,
        description,
        price,
        image,
        category,
      });
  
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      console.error("Error saving menu item:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

// GET by ID — /api/menu/id/:id
router.get("/menu/id/:id", async (req, res) => {
    try {
      const id = req.params.id.trim();
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
  
      const item = await Menu.findById(id);
  
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      res.json(item);
    } catch (error) {
      console.error("Error fetching menu item by ID:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
// GET by name — /api/menu/name/:name
router.get("/menu/name/:name", async (req, res) => {
  try {
    const itemName = decodeURIComponent(req.params.name).trim();
    const item = await Menu.findOne({ name: itemName });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching menu item by name:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/menu/:name", async (req, res) => {
    try {
      const itemName = decodeURIComponent(req.params.name).trim();
      const updatedItem = await Menu.findOneAndUpdate(
        { name: itemName },
        req.body,
        { new: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
  
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating menu item by name:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // DELETE route — /api/menu/:name
router.delete("/menu/:name", async (req, res) => {
  try {
    const itemName = decodeURIComponent(req.params.name).trim();

    const deletedItem = await Menu.findOneAndDelete({ name: itemName });

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully", item: deletedItem });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

  

module.exports = router;
