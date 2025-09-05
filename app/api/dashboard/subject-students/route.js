import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import User from '@/models/User';

export async function GET(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'professor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json({ error: 'Subject ID required' }, { status: 400 });
    }

    await connectDB();

    // For now, return all students since we don't have enrollment system
    // In a real system, you'd filter by enrollment records
    const students = await User.find({ 
      role: 'student',
      isActive: true 
    })
    .select('name rollNumber department')
    .sort({ rollNumber: 1 });

    return NextResponse.json({
      students
    });

  } catch (error) {
    console.error('Subject students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
