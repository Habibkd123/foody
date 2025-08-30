// controllers/userController.ts
import User from '../models/User';
import connectDB from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
  // सभी users get करना
  static async getAllUsers(): Promise<{ success: boolean; data: User[]; message?: string }> {
    try {
      await connectDB();
      const users = await User.find({}).select('-password');
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // नया user create करना
  static async createUser(userData: Partial<User>): Promise<{ success: boolean; data: User; message?: string }> {
    try {
      await connectDB();
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      const user = await User.create(userData);
      const userResponse = user.toObject();
      delete userResponse.password; // Password response में नहीं भेजना

      return {
        success: true,
        data: userResponse,
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // User login
  static async loginUser(email: string, password: string): Promise<{ success: boolean; data: { user: User; token: string }; message?: string }> {
    try {
      await connectDB();
      
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // JWT token generate करना
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        "habibkd02",
        { expiresIn: '7d' }
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        data: {
          user: userResponse,
          token,
        },
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // User को ID से get करना
  static async getUserById(id: string): Promise<{ success: boolean; data: User | null; message?: string }> {
    try {
      await connectDB();
      const user = await User.findById(id).select('-password');
      
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // User update करना
  static async updateUser(id: string, updateData: Partial<User>): Promise<{ success: boolean; data: User | null; message?: string }> {
    try {
      await connectDB();
      
      const user = await User.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        data: user,
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // User delete करना
  static async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      await connectDB();
      
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

