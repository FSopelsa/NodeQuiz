import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answer_a: String,
  answer_b: String,
  answer_c: String,
  answer_d: String,   
  answer_e: String,
  answer_f: String,
});

const correctAnswerSchema = new mongoose.Schema({
  answer_a_correct: String,
  answer_b_correct: String,
  answer_c_correct: String,
  answer_d_correct: String,
  answer_e_correct: String,
  answer_f_correct: String,
});

const questionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  description: String,
  answers: answerSchema,
  multiple_correct_answers: String,
  correct_answers: correctAnswerSchema,
  correct_answer: String,
  explanation: String,
  tip: String,
  tags: [String],
  category: String,
  difficulty: String,
});

const quizSchema = new mongoose.Schema({
  questions: [questionSchema],
});

//------------------------------------------------------------
const tdbQuestionSchema = new mongoose.Schema({
  type: String,
  difficulty: String,
  category: String,
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
});

const tdbQuizSchema = new mongoose.Schema({
  gameCode: {
    type: String,
    required: true,
    unique: true
  },
  questions: [tdbQuestionSchema],
});


const TdbQuiz = mongoose.model('TdbQuiz', tdbQuizSchema);
const Quiz = mongoose.model('Quiz', quizSchema);

export { Quiz, TdbQuiz };