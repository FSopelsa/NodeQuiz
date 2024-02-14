import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import quizRoutes from './routes/quizRoutes.js';
import gameSessionRoutes from './routes/gameSessionRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Ansluten till MongoDB...'))
  .catch(err => console.error('Kunde inte ansluta till MongoDB...', err));

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/quizzes', quizRoutes);

app.use('/api/gameSessions', gameSessionRoutes);// Path: mitt-fullstack-projekt/backend/routes/gameSessionRoutes.js

// Konfiguration för express-session
app.use(session({
    secret: 'din hemliga nyckel', // Använd en lång, slumpmässig sträng här
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: 'auto', maxAge: 1000 * 60 * 60 * 24 } // Exempel: säker cookie, 1 dag lång
  }));

app.listen(port, () => {
  console.log(`Servern körs på port ${port}...`);
});
