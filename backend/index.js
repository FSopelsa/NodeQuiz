import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import quizRoutes from './routes/quizRoutes.js';
import gameSessionRoutes from './routes/gameSessionRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Ansluten till MongoDB...'))
  .catch(err => console.error('Kunde inte ansluta till MongoDB...', err));

const app = express();

app.use(express.json());
app.use('/quizzes', quizRoutes);
app.use('/api/gameSessions', gameSessionRoutes);// Path: mitt-fullstack-projekt/backend/routes/gameSessionRoutes.js

// Konfiguration för express-session
app.use(session({
    secret: 'din hemliga nyckel', // Använd en lång, slumpmässig sträng här
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: 'auto', maxAge: 1000 * 60 * 60 * 24 } // Exempel: säker cookie, 1 dag lång
  }));

app.get('/', (req, res) => {
    res.status(200).send('Server is running');
  });

app.get('/quizzes', (req, res) => {
    res.status(200).json({ message: 'Quizzes fetched successfully' });
    console.log('Quizzes fetched successfully')
  });

let mainServerInstance;
const startServer = (port) => {
    if (!mainServerInstance) {
      let server = app.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
      });
      return server;
    } else {
      console.log(`Server is already running on port ${port}...`);
      return mainServerInstance;
    }
};

mainServerInstance = startServer(process.env.PORT); // start the server on port 4000
// mainServerInstance.close();

export { app, startServer };      