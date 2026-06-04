import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn(`[db.js] Could not write to ${filename} (expected on Vercel read-only FS).`);
  }
}

export function getActiveQuestions() {
  const questions = readJSON('questions.json');
  return questions.filter(q => q.active).sort((a, b) => a.order - b.order);
}

export function getAllQuestions() {
  return readJSON('questions.json');
}

export function getAuthors() {
  return readJSON('authors.json');
}

export function getQuestionVersion() {
  const questions = getActiveQuestions();
  const maxVersion = Math.max(...questions.map(q => q.version || 1), 0);
  const today = new Date().toISOString().slice(0, 10);
  return `v${today}-${maxVersion}`;
}

export function saveQuestion(question) {
  const questions = readJSON('questions.json');
  const index = questions.findIndex(q => q.id === question.id);
  const now = new Date().toISOString();
  let updatedQuestion;
  if (index >= 0) {
    updatedQuestion = { ...questions[index], ...question, updatedAt: now };
    questions[index] = updatedQuestion;
  } else {
    updatedQuestion = { ...question, createdAt: now, updatedAt: now };
    questions.push(updatedQuestion);
  }
  writeJSON('questions.json', questions);
  return updatedQuestion;
}

export function deleteQuestion(questionId) {
  let questions = readJSON('questions.json');
  questions = questions.filter(q => q.id !== questionId);
  writeJSON('questions.json', questions);
}

export function getSubmissions() {
  return readJSON('submissions.json');
}

export function getSubmissionById(id) {
  const submissions = readJSON('submissions.json');
  return submissions.find(s => s.id === id) || null;
}

export function saveSubmission(submission) {
  const entry = {
    id: `sub_${Math.random().toString(36).substring(2, 10)}`,
    ...submission,
    createdAt: new Date().toISOString(),
  };
  // Try to persist, but don't crash if filesystem is read-only (Vercel)
  try {
    const submissions = readJSON('submissions.json');
    submissions.push(entry);
    writeJSON('submissions.json', submissions);
  } catch (err) {
    console.warn('[db] saveSubmission: could not persist (read-only FS), continuing without save.');
  }
  return entry;
}

export function deleteSubmission(id) {
  let submissions = readJSON('submissions.json');
  submissions = submissions.filter(s => s.id !== id);
  writeJSON('submissions.json', submissions);
}

export function publishQuestions() {
  const questions = readJSON('questions.json');
  const newVersion = Math.max(...questions.map(q => q.version || 1), 0) + 1;
  const updated = questions.map(q => ({ ...q, version: newVersion, updatedAt: new Date().toISOString() }));
  writeJSON('questions.json', updated);
  return { version: newVersion, count: updated.length };
}
