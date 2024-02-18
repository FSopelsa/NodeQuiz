import express from 'express';
import GameSession from '../models/gameSessionModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('GET /api/gameSessions');
  try {
    const gameSessions = await GameSession.find();
    res.json(gameSessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Hämta en specifik spelomgång
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId }).populate('questions');
    if (!session) {
      return res.status(404).send('Spelomgången hittades inte.');
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Spara resultat för en spelomgång
router.post('/:sessionId/results', async (req, res) => {
    const { participantName, score, answers } = req.body;
    const participantIdentifier = participantName; // Skapa en unik identifierare för deltagaren
    try {
      const session = await GameSession.findOne({ sessionId: req.params.sessionId });
  
      if (!session) {
        return res.status(404).send('Spelomgången hittades inte.');
      }
      // Kontrollera om deltagaren redan finns i resultatlistan
      const hasAlreadyParticipated = session.results.some(result => result.participant === participantIdentifier);
      if (hasAlreadyParticipated) {
        return res.status(400).send('Deltagaren har redan spelat denna omgång.');
      }
      // Lägg till deltagarens resultat om de inte redan har deltagit
      session.results.push({ participant: participantIdentifier, score, answers });
      await session.save();
  
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
export default router;
