import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Subject from '@/models/Subject';
import User from '@/models/User';

export async function POST() {
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

    // Get a professor to assign subjects to
    const professor = await User.findOne({ role: 'professor' });
    if (!professor) {
      return NextResponse.json({ error: 'No professor found. Please add a professor first.' }, { status: 400 });
    }

    // Sample subjects for NIT Jamshedpur
    const sampleSubjects = [
      {
        subjectCode: 'CS101',
        subjectName: 'Programming Fundamentals',
        department: 'CSE',
        semester: 1,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      },
      {
        subjectCode: 'CS102',
        subjectName: 'Data Structures',
        department: 'CSE',
        semester: 2,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      },
      {
        subjectCode: 'CS201',
        subjectName: 'Algorithms',
        department: 'CSE',
        semester: 3,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      },
      {
        subjectCode: 'CS202',
        subjectName: 'Database Systems',
        department: 'CSE',
        semester: 4,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      },
      {
        subjectCode: 'EC101',
        subjectName: 'Digital Electronics',
        department: 'ECE',
        semester: 1,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      },
      {
        subjectCode: 'EC102',
        subjectName: 'Signals and Systems',
        department: 'ECE',
        semester: 2,
        credits: 4,
        professor: professor._id,
        academicYear: '2024-2025',
        isActive: true
      }
    ];

    // Check if subjects already exist
    const existingSubjects = await Subject.find({});
    if (existingSubjects.length > 0) {
      return NextResponse.json({ message: 'Subjects already exist in the database' });
    }

    // Create subjects
    await Subject.insertMany(sampleSubjects);

    return NextResponse.json({
      message: 'Sample subjects created successfully',
      subjectsCreated: sampleSubjects.length
    });

  } catch (error) {
    console.error('Setup subjects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
