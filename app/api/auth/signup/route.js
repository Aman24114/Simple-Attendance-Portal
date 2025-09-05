import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import StudentMeta from '@/models/StudentMeta';
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      role, 
      rollNumber, 
      department, 
      batch, 
      currentSemester, 
      section, 
      phoneNumber 
    } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if roll number already exists (for students)
    if (role === 'student' && rollNumber) {
      const existingRollNumber = await User.findOne({ rollNumber });
      if (existingRollNumber) {
        return NextResponse.json(
          { message: 'Roll number already exists' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber: phoneNumber || null
    };

    // Add role-specific fields
    if (role === 'student') {
      if (!rollNumber || !department || !batch || !currentSemester || !section) {
        return NextResponse.json(
          { message: 'Missing required student information' },
          { status: 400 }
        );
      }
      userData.rollNumber = rollNumber;
      userData.department = department;
    } else if (role === 'professor') {
      if (!department) {
        return NextResponse.json(
          { message: 'Department is required for professors' },
          { status: 400 }
        );
      }
      userData.department = department;
    }

    const user = await User.create(userData);

    // Create student metadata if role is student
    if (role === 'student') {
      await StudentMeta.create({
        student: user._id,
        rollNumber,
        department,
        batch,
        currentSemester,
        section,
        phoneNumber: phoneNumber || null
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
