import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.QUIZ_API_KEY;

export const fetchQuestionsFromQuizApi = async () => {
  try {
    const response = await axios.get("https://quizapi.io/api/v1/questions", {
      params: {
        apiKey: 'ohUYuKCK5gkwQ5KxxXEc9ZB0Trw3ncEYJf20tvzt',
        tags: 'JavaScript',
        difficulty: 'easy',
        limit: '1'
      },
    });

    // Transform the data to match Quiz schema
    const data = {
      questions: response.data,
    };

    return data;
  } catch (error) {
    console.error('Error fetching questions from QuizAPI:', error);
    throw error;
  }
};
