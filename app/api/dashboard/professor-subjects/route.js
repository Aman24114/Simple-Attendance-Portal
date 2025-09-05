import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Subject from '@/models/Subject';

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

    // For now, return all subjects since we don't have professor-subject assignment
    // In a real system, you'd filter by professor ID
    const subjects = await Subject.find({ isActive: true })
      .select('subjectCode subjectName department semester')
      .sort({ subjectCode: 1 });

    return NextResponse.json({
      subjects
    });

  } catch (error) {
    console.error('Professor subjects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
