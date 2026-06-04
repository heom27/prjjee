import { NextResponse } from 'next/server';
import { getSubmissions, getAuthors } from '@/lib/db';

export async function GET() {
  try {
    const submissions = getSubmissions();
    const authors = getAuthors();
    
    const authorCounts = {};
    authors.forEach(a => { authorCounts[a.id] = { name: a.name, count: 0 }; });
    
    submissions.forEach(sub => {
      if (sub.winner && authorCounts[sub.winner.id]) {
        authorCounts[sub.winner.id].count++;
      }
    });

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([id, data]) => ({ id, ...data }));

    return NextResponse.json({
      totalSubmissions: submissions.length,
      topAuthors,
    });
  } catch (error) {
    console.error('GET /api/v1/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
