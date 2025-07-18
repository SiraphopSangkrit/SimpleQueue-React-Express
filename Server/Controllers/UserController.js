const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

class UserController {
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await UserModel.find().select('-password');
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    }

    // Get user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id).select('-password');
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user',
                error: error.message
            });
        }
    }

    // Create new user
    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validate required fields
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email, and password are required'
                });
            }

            // Check if user already exists
            const existingUser = await UserModel.findOne({ 
                $or: [{ email }, { username }] 
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email or username already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();

            // Remove password from response
            const userResponse = newUser.toObject();
            delete userResponse.password;

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: userResponse
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    }

    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Remove password from updates if present (handle separately)
            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                id, 
                updates, 
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: error.message
            });
        }
    }

    // Delete user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await UserModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: error.message
            });
        }
    }

    // Login user
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userResponse,
                    token
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error during login',
                error: error.message
            });
        }
    }

    // Logout user
    async logoutUser(req, res) {
        try {
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error during logout',
                error: error.message
            });
        }
    }
}

module.exports = UserController;
