import { Schema, model } from 'mongoose';

// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isOwner: {
    type: Boolean,
    default: false   // Default role is not an owner
  },
  state: {
    type: String,
    required: true,  // State is required
    trim: true
  },
  city: {
    type: String,
    required: true,  // City is required
    trim: true
  },
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

export default model('User', userSchema);
