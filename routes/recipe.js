const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Search for a recipe by name
router.get('/search', async (req, res) => {
    try {
        const recipeName = req.query.name;
        const recipe = await Recipe.findOne({ name: recipeName });
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new recipe (optional, for testing purposes)
router.post('/add', async (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const recipe = new Recipe({ name, ingredients, instructions });
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
