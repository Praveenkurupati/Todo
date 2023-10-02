const { Category } = require('../models/Db_schemas'); // Import your Category model

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Create the category in the database
    const newCategory = await Category.create({
      name: name,
    });

    res.status(201).json({ message: 'Category created successfully.', category: newCategory });
  } catch (error) {
    errFunction(error,res)
  }
};

// create multiple categories
exports.createMultipleCategories = async (req, res) => {
  try {
    const categoryNames = req.body; // An array of category names

    // Use map to transform the data into an array of objects compatible with bulkCreate
    const categoriesToCreate = categoryNames.map((item) => ({
      name: item.name,
    }));

    // Create multiple categories in the database using bulkCreate
    const newCategories = await Category.bulkCreate(categoriesToCreate);

    res.status(201).json({ message: 'Categories created successfully.', categories: newCategories });
  } catch (error) {
    errFunction(error,res)
  }
};

  

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching all categories.' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the category.' });
  }
};

// Update category by ID
exports.updateCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Update category properties
    category.name = name || category.name;

    // Save the updated category
    await category.save();

    res.status(200).json({ message: 'Category updated successfully.', category });
  } catch (error) {
    errFunction(error,res)
  }
};

// Delete category by ID
exports.deleteCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Delete the category
    await category.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the category.' });
  }
};
