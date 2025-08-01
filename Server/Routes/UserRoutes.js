const express = require('express');
const userRouter = express.Router();
const UserController = require('../Controllers/UserController');

// Create instance of UserController
const userController = new UserController();

// Authentication routes
userRouter.post('/login', userController.loginUser);
userRouter.post('/logout', userController.logoutUser);
userRouter.post('/register', userController.createUser);

// CRUD routes
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.post('/', userController.createUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);


module.exports = userRouter;