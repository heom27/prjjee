import { NextResponse } from 'next/server';
import { getActiveQuestions, getAuthors, getQuestionVersion } from '@/lib/db';

export async function GET() {
  try {
    const questions = getActiveQuestions();
    const authors = getAuthors();
    const version = getQuestionVersion();
    return NextResponse.json({ version, questions, authors });
  } catch (error) {
    console.error('GET /api/v1/quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
