import axios from 'axios';

const QUIZ_API_URL = 'https://quizapi.io/api/v1/questions';
const API_KEY = process.env.QUIZ_API_KEY;

export const fetchQuestionsFromQuizApi = async (category, difficulty, limit = 10) => {
  try {
    const response = await axios.get(QUIZ_API_URL, {
      params: {
        apiKey: API_KEY,
        tags,
        difficulty,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching questions from QuizAPI:', error);
    throw error;
  }
};
