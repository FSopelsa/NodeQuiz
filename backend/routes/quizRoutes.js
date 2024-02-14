import express from 'express';
import Quiz from '../models/quizModel.js';
import { fetchQuestionsFromQuizApi } from '../integrations/quizApiIntegration.js';

const router = express.Router();

// Hämta lokala quizzes
router.get('/', async (req, res) => {
    try {
      const quizzes = await Quiz.find();
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Skapa ett lokalt quiz
router.post('/', async (req, res) => {
    const quiz = new Quiz({
      question: req.body.question,
      description: req.body.description,
      answers: req.body.answers,
      multiple_correct_answers: req.body.multiple_correct_answers,
      correct_answers: req.body.correct_answers,
      explanation: req.body.explanation,
      tip: req.body.tip,
      tags: req.body.tags,
      category: req.body.category,
      difficulty: req.body.difficulty,
    });

  try {
    const nyttQuiz = await quiz.save();
    res.status(201).json(nyttQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route för att hämta frågor från QuizAPI
router.get('/fetch-quiz', async (req, res) => {
    const { tags = 'JavaScript', difficulty = 'Easy', limit = 5 } = req.query;
    try {
      const questions = await fetchQuestionsFromQuizApi(tags, difficulty, limit);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Could not fetch questions from QuizAPI' });
    }
  });
  
  export default router;
