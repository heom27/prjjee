/**
 * Computes per-author scores from user answers.
 * @param {Object} answers - e.g. { q01: 'A', q02: 'C', ... }
 * @param {Array} questions - question objects from questions.json
 * @param {Array} authors - author objects from authors.json
 * @returns {{ scores: Object, winner: { id: string, name: string, confidence: number } }}
 */
export function scoreAnswers(answers, questions, authors) {
  // Initialize scores to 0 for each author
  const scores = {};
  authors.forEach(a => { scores[a.id] = 0; });

  // Sum scores from each answer
  for (const [qId, optionKey] of Object.entries(answers)) {
    const question = questions.find(q => q.id === qId);
    if (!question) continue;
    const option = question.options.find(o => o.key === optionKey);
    if (!option) continue;
    for (const [authorId, points] of Object.entries(option.scores)) {
      if (scores[authorId] !== undefined) {
        scores[authorId] += points;
      }
    }
  }

  // Find winner (highest score, deterministic tiebreak by author id alphabetical)
  const sortedAuthors = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]); // deterministic tiebreak
  });

  const winnerId = sortedAuthors[0][0];
  const winnerScore = sortedAuthors[0][1];
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const confidence = totalScore > 0 ? Math.round((winnerScore / totalScore) * 100) / 100 : 0;

  const winnerAuthor = authors.find(a => a.id === winnerId);

  return {
    scores,
    winner: {
      id: winnerId,
      name: winnerAuthor ? winnerAuthor.name : winnerId,
      confidence,
    },
  };
}
