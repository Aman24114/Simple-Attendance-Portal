import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
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
    date: { 
      type: Date, 
      required: true,
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'late', 'excused'], 
      required: true,
      default: 'present'
    },
    markedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    remarks: { 
      type: String, 
      trim: true,
      maxlength: 200 
    },
    session: { 
      type: String, 
      enum: ['morning', 'afternoon', 'evening'], 
      default: 'morning'
    },
    academicYear: { 
      type: String, 
      required: true,
      default: () => {
        const year = new Date().getFullYear();
        return `${year}-${year + 1}`;
      }
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate attendance records
AttendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
