import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Attendance from '@/models/Attendance';

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'professor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subjectId, date, session, attendance } = await request.json();

    if (!subjectId || !date || !session || !attendance) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if attendance already exists for this date and subject
    const existingAttendance = await Attendance.find({
      subject: subjectId,
      date: new Date(date)
    });

    if (existingAttendance.length > 0) {
      return NextResponse.json({ error: 'Attendance already marked for this date' }, { status: 400 });
    }

    // Create attendance records for each student
    const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
      student: studentId,
      subject: subjectId,
      date: new Date(date),
      status: status,
      session: session,
      markedBy: payload.sub
    }));

    await Attendance.insertMany(attendanceRecords);

    return NextResponse.json({
      message: 'Attendance marked successfully',
      recordsCreated: attendanceRecords.length
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
