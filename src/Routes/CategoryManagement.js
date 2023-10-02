const express = require('express');
const router = express.Router();
const CategoryController = require("../Controllers/CategoryControllers"); // Import your Category controller

// Create a new category
router.post('/category', CategoryController.createCategory);

// Create multiple categories
router.post('/categories', CategoryController.createMultipleCategories);

// Get all categories
router.get('/categories', CategoryController.getAllCategories);

// Get a category by ID
router.get('/category/:id', CategoryController.getCategoryById);

// Update a category by ID
router.put('/category/:id', CategoryController.updateCategoryById);

// Delete a category by ID
router.delete('/category/:id', CategoryController.deleteCategoryById);

module.exports = router;
