import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  question: String,
  description: String,
  answers: {
    answer_a: String,
    answer_b: String,
    answer_c: String,
    answer_d: String,
    answer_e: String,
    answer_f: String,
  },
  multiple_correct_answers: String,
  correct_answers: {
    answer_a_correct: String,
    answer_b_correct: String,
    answer_c_correct: String,
    answer_d_correct: String,
    answer_e_correct: String,
    answer_f_correct: String,
  },
  explanation: String,
  tip: String,
  tags: [String],
  category: String,
  difficulty: String,
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;