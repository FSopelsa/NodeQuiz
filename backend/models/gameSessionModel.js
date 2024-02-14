import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  participants: [{ type: mongoose.Schema.Types.Mixed }],
  results: [{ 
    participant: mongoose.Schema.Types.Mixed,
    score: Number,
    answers: [mongoose.Schema.Types.Mixed]
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GameSession', gameSessionSchema);
