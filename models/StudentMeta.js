import mongoose from 'mongoose';

const StudentMetaSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    rollNumber: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      uppercase: true
    },
    department: { 
      type: String, 
      required: true,
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'MME', 'PIE', 'CHE', 'Mining', 'Metallurgy'],
      trim: true 
    },
    batch: { 
      type: Number, 
      required: true,
      min: 2020,
      max: new Date().getFullYear() + 4
    },
    currentSemester: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 8 
    },
    section: { 
      type: String, 
      required: true,
      enum: ['A', 'B', 'C', 'D'],
      trim: true
    },
    phoneNumber: { 
      type: String, 
      trim: true,
      match: /^[0-9]{10}$/
    },
    parentPhoneNumber: { 
      type: String, 
      trim: true,
      match: /^[0-9]{10}$/
    },
    address: { 
      type: String, 
      trim: true,
      maxlength: 500
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

export default mongoose.models.StudentMeta || mongoose.model('StudentMeta', StudentMetaSchema);
