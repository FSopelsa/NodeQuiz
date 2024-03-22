import express from 'express';
import { Quiz, TdbQuiz } from '../models/quizModel.js';
import { fetchQuestionsFromQuizApi, fetchQuestionsFromQuizTDB } from '../integrations/quizApiIntegration.js';

const router = express.Router();

function generateGameCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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

// Route to create a new quiz
router.post('/quizzes', async (req, res) => {
  try {
    console.log(req.body);
    const savedQuizzes = [];
    for (let question of req.body.questions) {
      console.log("quizRoutes.js;: " + question);
      const quiz = new Quiz(question);
      const savedQuiz = await quiz.save();
      savedQuizzes.push(savedQuiz);
    }
    res.status(201).json(savedQuizzes);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
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
  
  router.get('/fetch-quizTDB', async (req, res) => {
    try {
      const TDBquestions = await fetchQuestionsFromQuizTDB();
      const gameCode = generateGameCode(6);
      const quiz = new TdbQuiz({ gameCode: gameCode, questions: TDBquestions.questions });
      const savedQuiz = await quiz.save();
      console.log("savedQuiz: " + savedQuiz)
      res.json(savedQuiz);
    } catch (error) {
      console.error(error); // Log the error to the console
      res.status(500).json({ message: 'Could not fetch questions from QuizTDB-API', error: error.toString() });
    }
  });
/*
  // Route to fetch a specific quiz by its gamneCode
  router.get('/quizzes/:gameCode', async (req, res) => {
    try {
      const quiz = await TdbQuiz.findOne({ gameCode: req.params.gameCode });
      if (!quiz) {
        return res.status(404).send('Quiz not found');
      }
      res.send(quiz);
    } catch (error) {
      res.status(500).send('Server error');
    }
  });
*/
  export default router;