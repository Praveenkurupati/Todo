const { errFunction } = require("../errFunction");
const { Todo,User,Category } = require("../models/Db_schemas");

// Create a new Todo
exports.createTodo = async (req, res) => {
  try {
    const { todoHeadline, todoDescription, completedBy, userId, categoryId } = req.body;

    // Create the Todo in the database
    const newTodo = await Todo.create({
      todoHeadline: todoHeadline,
      todoDescription: todoDescription,
      completedByTime: completedBy,
      userId: userId,
      categoryId: categoryId, // Add the categoryId field
    });

    res.status(201).json({ message: "Todo created successfully.", todo: newTodo });
  } catch (error) {
    errFunction(error,res)

  }
};


exports.createMultipleTodos = async (req, res) => {
  try {
    const todosData = req.body; // An array of Todo objects

    // Use map to transform the data into an array of objects compatible with bulkCreate
    const todosToCreate = todosData.map((data) => ({
      todoHeadline: data.todoHeadline,
      todoDescription: data.todoDescription,
      completedByTime: data.completedBy,
      userId: data.userId,
      categoryId: data.categoryId,
    }));

    // Create multiple Todos in the database using bulkCreate
    const createdTodos = await Todo.bulkCreate(todosToCreate);

    res.status(201).json({ message: "Todos created successfully.", todos: createdTodos });
  } catch (error) {
    errFunction(error,res)
  }
};



// Get all Todos
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      include:[
        {model:User,
          attributes:{exclude:'password'},
          as:"userTodos"
        },
        { model : Category,
          as :"Todocategory"}
        ]});

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching all Todos." });
  }
};

exports.getAllTodosOfUser = async (req, res) => {
  const userId = req.params.userId
  try {
    const todos = await Todo.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: 'password',
          },
          as: 'userTodos',
        },
        {
          model: Category,
          as: 'Todocategory',
        },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching all Todos.' });
  }
};




exports.getTodosByUserIdAndCategoryId = async (req, res) => {
  try {
    const { userId, categoryId } = req.query;

    // Find all todos that match the given userId and categoryId
    const todos = await Todo.findAll({
      where: { userId: userId, 
        categoryId: categoryId },
      include: [
        {
          model: User,
          attributes: {
            exclude: 'password',
          },
          as: 'userTodos',
        },
        {
          model: Category,
          as: 'Todocategory',
        },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos by userId and categoryId." });
  }
};

exports.getInActiveTodos = async (req, res) => {
  try {

    // Find all todos that match the given userId, categoryId, and isActive is false
    const todos = await Todo.findAll({
      where: {
        isActive: false, // Add this condition
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: 'password',
          },
          as: 'userTodos',
        },
        {
          model: Category,
          as: 'Todocategory',
        },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos by userId, categoryId, and isActive." });
  }
};


exports.getInActiveTodosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all todos that match the given userId, categoryId, and isActive is false
    const todos = await Todo.findAll({
      where: {
        userId: userId,
        isActive: false, // Add this condition
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: 'password',
          },
          as: 'userTodos',
        },
        {
          model: Category,
          as: 'Todocategory',
        },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "An error occurred while fetching todos by userId, categoryId, and isActive." });
  }
};

exports.getActiveTodosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all todos that match the given userId, categoryId, and isActive is false
    const todos = await Todo.findAll({
      where: {
        userId: userId,
        isActive: true, // Add this condition
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: 'password',
          },
          as: 'userTodos',
        },
        {
          model: Category,
          as: 'Todocategory',
        },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos by userId, categoryId, and isActive." });
  }
};




// Get Todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find the Todo by ID
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    res.status(200).json({ todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the Todo." });
  }
};

// Update Todo by ID
exports.updateTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { todoHeadline, todoDescription, completedBy, userId } = req.body;

    // Find the Todo by ID
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    // Update Todo properties
    todo.todoHeadline = todoHeadline || todo.todoHeadline;
    todo.todoDescription = todoDescription || todo.todoDescription;
    todo.completedBy = completedBy || todo.completedBy;
    todo.userId = userId || todo.userId;

    // Save the updated Todo
    await todo.save();

    res.status(200).json({ message: "Todo updated successfully.", todo });
  } catch (error) {
    errFunction(error,res)
  }
};


// Update a Todo by ID
exports.updateActiveTodoById = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update the isActive field
    todo.isActive = isActive;

    // Save the updated document
    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Delete Todo by ID
exports.deleteTodoById = async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find the Todo by ID
    const todo = await Todo.findByPk(todoId);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }

    // Delete the Todo
    await todo.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the Todo." });
  }
};
