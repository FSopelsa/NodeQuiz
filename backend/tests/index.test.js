import request from 'supertest';
import express from 'express';
import quizRoutes from '../routes/quizRoutes.js';
import gameSessionRoutes from '../routes/gameSessionRoutes.js';
import mongoose from 'mongoose';
import { app, server } from '../index.js';
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
    afterAll(() => {
        return new Promise((resolve) => server.close(resolve));
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