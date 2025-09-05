import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    subject: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject', 
      required: true 
    },
    semester: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 8 
    },
    academicYear: { 
      type: String, 
      required: true,
      default: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
      }
    },
    enrollmentDate: { 
      type: Date, 
      default: Date.now 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    grade: { 
      type: String, 
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W'],
      default: null
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, subject: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
