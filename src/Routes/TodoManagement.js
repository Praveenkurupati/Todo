const express = require('express');
const router = express.Router();
const TodoController = require('../Controllers/TodoController'); // Import your Todo controller

// Create a new Todo
router.post('/todo', TodoController.createTodo);
router.post('/todos', TodoController.createMultipleTodos);

// Get all Todos
router.get('/alltodos', TodoController.getAllTodos);
router.get('/todos/:userId', TodoController.getAllTodosOfUser);
router.get('/categoryTodos/:userId', TodoController.getActiveTodosByUserId);
router.get('/categoryTodos', TodoController.getTodosByUserIdAndCategoryId);
router.get('/categoryTodos/InActive', TodoController.getInActiveTodos);
router.get('/categoryTodos/InActive/:userId', TodoController.getInActiveTodosByUserId);

// Get a Todo by ID
router.get('/todo/:id', TodoController.getTodoById);

// Update a Todo by ID
router.put('/todo/:id', TodoController.updateTodoById);
router.put('/todo/Active/:id', TodoController.updateActiveTodoById);

// Delete a Todo by ID
router.delete('/todo/:id', TodoController.deleteTodoById);

module.exports = router;
