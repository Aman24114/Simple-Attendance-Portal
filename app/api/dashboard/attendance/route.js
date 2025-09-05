import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Attendance from '@/models/Attendance';
import Subject from '@/models/Subject';

export async function GET(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectFilter = searchParams.get('subject');

    await connectDB();

    let matchQuery = { student: payload.sub };
    if (subjectFilter && subjectFilter !== 'all') {
      const subject = await Subject.findOne({ subjectCode: subjectFilter });
      if (subject) {
        matchQuery.subject = subject._id;
      }
    }

    const attendance = await Attendance.find(matchQuery)
      .populate('subject', 'subjectCode subjectName')
      .sort({ date: -1 })
      .limit(50);

    // Calculate stats
    const stats = await Attendance.aggregate([
      { $match: { student: payload.sub } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalClasses = stats.reduce((sum, stat) => sum + stat.count, 0);
    const presentCount = stats.find(s => s._id === 'present')?.count || 0;
    const overallPercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    const formattedAttendance = attendance.map(record => ({
      date: record.date,
      subject: record.subject?.subjectCode || 'Unknown',
      status: record.status,
      session: record.session,
      remarks: record.remarks
    }));

    return NextResponse.json({
      attendance: formattedAttendance,
      stats: {
        overallPercentage: `${overallPercentage}%`,
        totalClasses,
        present: presentCount,
        absent: stats.find(s => s._id === 'absent')?.count || 0,
        late: stats.find(s => s._id === 'late')?.count || 0
      }
    });

  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
