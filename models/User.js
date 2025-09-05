import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored as hash
    role: { type: String, enum: ['student', 'professor', 'admin'], required: true },
    rollNumber: { 
      type: String, 
      unique: true, 
      sparse: true,
      trim: true,
      uppercase: true
    },
    department: { 
      type: String, 
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'MME', 'PIE', 'CHE', 'Mining', 'Metallurgy'],
      trim: true 
    },
    profilePicture: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { 
      type: String, 
      trim: true,
      match: /^[0-9]{10}$/
    }
  },
  { timestamps: true }
);

// avoid recompiling model on hot-reload
export default mongoose.models.User || mongoose.model('User', UserSchema);
