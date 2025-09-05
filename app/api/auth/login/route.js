export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/utils/auth';

export async function POST(req) {
  try {
    // Validate env
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: 'Server DB not configured' }, { status: 500 });
    }
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server auth not configured' }, { status: 500 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // create JWT
    const token = signToken({ sub: user._id.toString(), role: user.role, name: user.name });

    const res = NextResponse.json({
      ok: true,
      user: { name: user.name, role: user.role, email: user.email }
    });

    // secure httpOnly cookie
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err?.message || 'Server error. Try again.' }, { status: 500 });
  }
}
