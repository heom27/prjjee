import { describe, it, expect } from 'vitest';
import { scoreAnswers } from '../lib/scoring.js';

const mockAuthors = [
  { id: 'y1', name: 'Namık Kemal' },
  { id: 'y2', name: 'Orhan Veli' },
  { id: 'y3', name: 'Tanpınar' },
  { id: 'y4', name: 'Sait Faik' },
  { id: 'y5', name: 'Halide Edip' },
  { id: 'y6', name: 'Cemal Süreya' },
];

const mockQuestions = [
  {
    id: 'q01',
    options: [
      { key: 'A', scores: { y1: 3, y3: 1 } },
      { key: 'B', scores: { y2: 3 } },
      { key: 'C', scores: { y4: 2, y6: 1 } },
      { key: 'D', scores: { y5: 2 } },
    ],
  },
  {
    id: 'q02',
    options: [
      { key: 'A', scores: { y1: 2 } },
      { key: 'B', scores: { y2: 2, y4: 1 } },
      { key: 'C', scores: { y3: 3 } },
      { key: 'D', scores: { y5: 2, y6: 1 } },
    ],
  },
];

describe('scoreAnswers', () => {
  it('correctly sums scores from answers', () => {
    const result = scoreAnswers({ q01: 'A', q02: 'C' }, mockQuestions, mockAuthors);
    expect(result.scores.y1).toBe(3);
    expect(result.scores.y3).toBe(4); // 1 + 3
    expect(result.scores.y2).toBe(0);
    expect(result.winner.id).toBe('y3');
    expect(result.winner.name).toBe('Tanpınar');
  });

  it('computes confidence correctly', () => {
    const result = scoreAnswers({ q01: 'B' }, mockQuestions, mockAuthors);
    // y2=3, total=3, confidence=1.0
    expect(result.winner.id).toBe('y2');
    expect(result.winner.confidence).toBe(1);
  });

  it('handles tiebreak deterministically (alphabetical author id)', () => {
    // Create a tie scenario
    const tieQuestions = [
      {
        id: 'q01',
        options: [
          { key: 'A', scores: { y1: 2, y2: 2 } },
        ],
      },
    ];
    const result = scoreAnswers({ q01: 'A' }, tieQuestions, mockAuthors);
    expect(result.winner.id).toBe('y1'); // y1 < y2 alphabetically
  });

  it('handles empty answers', () => {
    const result = scoreAnswers({}, mockQuestions, mockAuthors);
    expect(result.winner.confidence).toBe(0);
    Object.values(result.scores).forEach(s => expect(s).toBe(0));
  });

  it('ignores unknown question ids', () => {
    const result = scoreAnswers({ q99: 'A' }, mockQuestions, mockAuthors);
    Object.values(result.scores).forEach(s => expect(s).toBe(0));
  });

  it('ignores unknown option keys', () => {
    const result = scoreAnswers({ q01: 'Z' }, mockQuestions, mockAuthors);
    Object.values(result.scores).forEach(s => expect(s).toBe(0));
  });
});
