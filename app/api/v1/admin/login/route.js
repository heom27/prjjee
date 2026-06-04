import { NextResponse } from 'next/server';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await signToken();
    return NextResponse.json({ token, expiresIn: '24h' });
  } catch (error) {
    console.error('POST /api/v1/admin/login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
