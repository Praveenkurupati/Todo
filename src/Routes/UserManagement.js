const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserControllers'); // Import your user controller
const loginController = require('../Authentication/Login'); // Import your user controller

// Create a new user
router.post('/user', UserController.createUser);
router.post('/login', loginController.userLogin);

// Get all users
router.get('/users', UserController.getAllUsers);

// Get a user by ID
router.get('/users/:id', UserController.getUserById);

// Update a user by ID
router.put('/users/:id', UserController.updateUserById);

// Update the active status of a user by ID
router.put('/users/active/:id', UserController.updateUserActiveStatus);

// Delete a user by ID
router.delete('/users/:id', UserController.deleteUserById);

// Update user password by ID
router.put('/users/password/:id', UserController.updatePassword);

// Request a password reset OTP
router.post('/users/forgot-password', UserController.forgotPassword);

// Reset user password with OTP
router.post('/users/reset-password', UserController.resetPassword);

module.exports = router;
