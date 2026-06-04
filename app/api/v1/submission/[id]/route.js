import { NextResponse } from 'next/server';
import { getSubmissionById, deleteSubmission } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const submission = getSubmissionById(params.id);
  if (!submission) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(submission);
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  deleteSubmission(params.id);
  return NextResponse.json({ success: true, message: 'Submission deleted (GDPR)' });
}
