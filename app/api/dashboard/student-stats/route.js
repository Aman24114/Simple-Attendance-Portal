import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import Enrollment from '@/models/Enrollment';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const student = await User.findById(payload.sub);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get attendance stats
    const attendanceStats = await Attendance.aggregate([
      { $match: { student: student._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalClasses = attendanceStats.reduce((sum, stat) => sum + stat.count, 0);
    const presentCount = attendanceStats.find(s => s._id === 'present')?.count || 0;
    const overallPercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    // Get enrolled subjects count
    const enrolledSubjects = await Enrollment.countDocuments({ 
      student: student._id, 
      isActive: true 
    });

    // Get classes this week (mock data for now)
    const classesThisWeek = 24;

    return NextResponse.json({
      overallAttendance: `${overallPercentage}%`,
      enrolledSubjects,
      classesThisWeek,
      attendanceGoal: '75%',
      present: presentCount,
      absent: attendanceStats.find(s => s._id === 'absent')?.count || 0,
      late: attendanceStats.find(s => s._id === 'late')?.count || 0,
      totalClasses
    });

  } catch (error) {
    console.error('Student stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
