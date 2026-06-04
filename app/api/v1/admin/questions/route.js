import { NextResponse } from 'next/server';
import { getAllQuestions, saveQuestion, deleteQuestion } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const questions = getAllQuestions();
  return NextResponse.json({ questions });
}

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const question = await request.json();
    if (!question.id || !question.text || !question.options) {
      return NextResponse.json({ error: 'Missing required fields: id, text, options' }, { status: 400 });
    }
    const saved = saveQuestion(question);
    return NextResponse.json({ question: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/admin/questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const question = await request.json();
    if (!question.id) {
      return NextResponse.json({ error: 'Question id is required' }, { status: 400 });
    }
    const saved = saveQuestion(question);
    return NextResponse.json({ question: saved });
  } catch (error) {
    console.error('PUT /api/v1/admin/questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Question id is required' }, { status: 400 });
    }
    deleteQuestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/v1/admin/questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
