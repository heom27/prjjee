import { NextResponse } from 'next/server';
import { publishQuestions } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = publishQuestions();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('POST /api/v1/admin/publish error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
