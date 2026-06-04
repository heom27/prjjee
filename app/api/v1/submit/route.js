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

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
    const emailHash = userEmail
      ? crypto.createHash('sha256').update(userEmail.toLowerCase().trim()).digest('hex').slice(0, 16)
      : null;

    const submission = saveSubmission({
      userEmailHash: emailHash,
      answers,
      scores,
      winner,
      questionVersion: version,
      ipHash,
    });

    // Send email in background (don't block response)
    const winnerAuthor = authors.find(a => a.id === winner.id);
    if (userEmail && winnerAuthor) {
      sendResultEmail(userEmail, winner, winnerAuthor, scores).catch(err =>
        console.error('[Submit] Email error:', err)
      );
    }

    return NextResponse.json(
      {
        submissionId: submission.id,
        scores,
        winner,
      },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('POST /api/v1/submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
