import request from 'supertest';
import app from '../index.js';
import { Quiz } from '../models/quizModel.js';
import { fetchQuestionsFromQuizApi } from '../integrations/quizApiIntegration.js';

describe('Quiz API Integration', () => {
    let server;
  
    beforeAll(() => {
      const testPort = 5000; // use a different port for testing
      server = app.listen(testPort);
    });
  
    afterAll(done => {
      server.close(done);
    });

  it('should fetch data from Quiz API and save it to the database', async () => {
    // Fetch data from Quiz API
    const data = await fetchQuestionsFromQuizApi();
    console.log("data", data);

    // Send a POST request to your app with the fetched data
    const response = await request(app)
      .post('/quizzes')
      .send(data);
    console.log("response", response.body);

    // Check that the response status is 200
    expect(response.status).toBe(200);

    // Check that the data was saved to the database
    const savedQuiz = await Quiz.findOne({ _id: response.body._id });
    expect(savedQuiz).toBeDefined();
    expect(savedQuiz.questions).toEqual(data.questions);
  });
});