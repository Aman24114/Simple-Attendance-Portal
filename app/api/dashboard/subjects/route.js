import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Subject from '@/models/Subject';

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.sub || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subjectCode, subjectName, department, semester, credits, professor, academicYear } = await request.json();

    if (!subjectCode || !subjectName || !department || !semester || !credits || !professor || !academicYear) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ subjectCode });
    if (existingSubject) {
      return NextResponse.json({ error: 'Subject code already exists' }, { status: 400 });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      department,
      semester: parseInt(semester),
      credits: parseInt(credits),
      professor,
      academicYear,
      isActive: true
    });

    return NextResponse.json({
      message: 'Subject created successfully',
      subject: {
        _id: subject._id,
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        department: subject.department,
        semester: subject.semester,
        credits: subject.credits,
        academicYear: subject.academicYear
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Subject creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
