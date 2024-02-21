import request from 'supertest';
import express from 'express';
import quizRoutes from '../routes/quizRoutes.js';
import gameSessionRoutes from '../routes/gameSessionRoutes.js';
import mongoose from 'mongoose';
import { app, startServer } from '../index.js';
import dotenv from 'dotenv';
dotenv.config();


app.use(express.json());
app.use('/api/quizzes', quizRoutes);
app.use('/api/gameSessions', gameSessionRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    }, 10000);
afterAll(async () => {
    await mongoose.connection.close();
    }, 10000);

describe('Server', () => {
     // use a different port for testing
     let serverInstance = startServer(process.env.TESTPORT1); // start the server on port 5000
    afterAll(done => {
      serverInstance.close(done);
    });
  it('should be running', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('Quiz Routes', () => {
  it('should return quizzes', async () => {
    const res = await request(app).get('/api/quizzes');
    expect(res.statusCode).toEqual(200);
    // Add more assertions based on your application's behavior
  }, 10000);
});

describe('Game Session Routes', () => {
  it('should return game sessions', async () => {
    const res = await request(app).get('/api/gameSessions');
    expect(res.statusCode).toEqual(200);
    // Add more assertions based on your application's behavior
  });
});

/*
describe('Index', () => {
  it('should use the correct port', () => {
    expect(port).toEqual(process.env.TESTPORT1 || 5000);
  });
});
*/