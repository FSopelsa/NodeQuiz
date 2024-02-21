import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.QUIZ_API_KEY;

export const fetchQuestionsFromQuizApi = async () => {
  try {
    const response = await axios.get("https://quizapi.io/api/v1/questions", {
      params: {
        apiKey: API_KEY,
        tags: 'JavaScript',
        difficulty: 'easy',
        limit: '2'
      },
    });

    // Transform the data to match Quiz schema
    const data = {
      questions: response.data.map(question => ({
        ...question,
        tags: question.tags.map(tag => tag.name),
      })),
    };
    return data;

  } catch (error) {
    console.error('Error fetching questions from QuizAPI:', error);
    throw error;
  }
};
