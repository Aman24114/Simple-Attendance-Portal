export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const payload = verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ user: null }, { status: 200 });

    await connectDB();
    const user = await User.findById(payload.sub).select('name email role createdAt');
    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
