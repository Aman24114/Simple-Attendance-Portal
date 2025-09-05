import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import User from '@/models/User';
import Subject from '@/models/Subject';
import Attendance from '@/models/Attendance';
import Enrollment from '@/models/Enrollment';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'professor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const professor = await User.findById(payload.sub);
    if (!professor) {
      return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
    }

    // Get professor's subjects
    const subjects = await Subject.find({ professor: professor._id, isActive: true });
    const subjectIds = subjects.map(s => s._id);

    // Get total students across all subjects
    const totalStudents = await Enrollment.countDocuments({ 
      subject: { $in: subjectIds }, 
      isActive: true 
    });

    // Get average attendance across all subjects
    const attendanceStats = await Attendance.aggregate([
      { $match: { subject: { $in: subjectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAttendanceRecords = attendanceStats.reduce((sum, stat) => sum + stat.count, 0);
    const presentCount = attendanceStats.find(s => s._id === 'present')?.count || 0;
    const avgAttendance = totalAttendanceRecords > 0 ? Math.round((presentCount / totalAttendanceRecords) * 100) : 0;

    return NextResponse.json({
      totalStudents,
      activeSubjects: subjects.length,
      avgAttendance: `${avgAttendance}%`,
      nextClass: '2:00 PM'
    });

  } catch (error) {
    console.error('Professor stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
