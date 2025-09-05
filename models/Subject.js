import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    subjectCode: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      uppercase: true 
    },
    subjectName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    department: { 
      type: String, 
      required: true,
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'MME', 'PIE', 'CHE', 'Mining', 'Metallurgy'],
      trim: true 
    },
    semester: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 8 
    },
    credits: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 4 
    },
    professor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    academicYear: { 
      type: String, 
      required: true,
      default: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
      }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
