import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getActiveQuestions, getAuthors, getQuestionVersion, saveSubmission } from '@/lib/db';
import { scoreAnswers } from '@/lib/scoring';
import { sendResultEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const { success, remaining } = checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    const body = await request.json();
    const { userEmail, answers } = body;

    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'Answers are required.' }, { status: 400 });
    }

    const questions = getActiveQuestions();
    const authors = getAuthors();
    const version = getQuestionVersion();

    const { scores, winner } = scoreAnswers(answers, questions, authors);

    const ip2 = getClientIp(request);
    const ipHash = crypto.createHash('sha256').update(ip2).digest('hex').slice(0, 16);
    const emailHash = userEmail
      ? crypto.createHash('sha256').update(userEmail.toLowerCase().trim()).digest('hex').slice(0, 16)
      : null;

    // Try to save submission — don't crash if Vercel FS is read-only
    let submissionId = `sub_${Math.random().toString(36).substring(2, 10)}`;
    try {
      const submission = saveSubmission({
        userEmailHash: emailHash,
        answers,
        scores,
        winner,
        questionVersion: version,
        ipHash,
      });
      submissionId = submission.id;
    } catch (saveErr) {
      console.warn('[Submit] Could not save submission (read-only FS):', saveErr.message);
    }

    // Send email — always attempt regardless of save result
    const winnerAuthor = authors.find(a => a.id === winner.id);
    if (userEmail && winnerAuthor) {
      sendResultEmail(userEmail, winner, winnerAuthor, scores).catch(err =>
        console.error('[Submit] Email error:', err.message)
      );
    }

    return NextResponse.json(
      { submissionId, scores, winner },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('POST /api/v1/submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
