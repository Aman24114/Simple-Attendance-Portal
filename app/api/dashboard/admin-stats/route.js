import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import User from '@/models/User';
import Subject from '@/models/Subject';
import Enrollment from '@/models/Enrollment';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get total users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get active subjects
    const activeSubjects = await Subject.countDocuments({ isActive: true });

    // Get total enrollments
    const totalEnrollments = await Enrollment.countDocuments({ isActive: true });

    // System health (mock data)
    const systemHealth = '98%';

    return NextResponse.json({
      totalUsers,
      activeSubjects,
      totalEnrollments,
      systemHealth
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
