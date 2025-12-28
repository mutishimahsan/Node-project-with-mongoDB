const express = require('express');
const router = express.Router();

const MenuItem = require('../models/MenuItem');

// Create Menu Item
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        const newMenuItem = new MenuItem(data);

        const response = await newMenuItem.save();
        console.log("Menu Item saved");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Get Menu Items
router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log("Menu items fetched");
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Parameterized URL
router.get('/:taste', async(req, res) => {
    try {
        const tasteType = req.params.tasteType;

        if (tasteType == 'spicy' || tasteType == 'sour' || tasteType == 'sweet') {
            const response = await MenuItem.find({taste: tasteType});

            console.log("response fetched");
            res.status(200).json(response);
        } else {
            res.status(404).json({error: 'Invalid taste type'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

module.exports = router;