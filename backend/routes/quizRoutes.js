import express from 'express';
import { Quiz } from '../models/quizModel.js';
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
  try {
    const savedQuizzes = [];
    for (let question of req.body) {
      const quiz = new Quiz(question);
      const savedQuiz = await quiz.save();
      savedQuizzes.push(savedQuiz);
    }
    res.status(200).json(savedQuizzes);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Route för att hämta frågor från QuizAPI
router.get('/fetch-quiz', async (req, res) => {
    try {
      const questions = await fetchQuestionsFromQuizApi();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Could not fetch questions from QuizAPI' });
    }
  });
  
  export default router;