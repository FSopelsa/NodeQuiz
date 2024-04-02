<template>
  <body>
    <div id="g_id_onload"
        data-client_id="687502014639-9smnn3le2jb20v74a0ev89p7cirn32o8.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleCredentialResponse"
        data-auto_prompt="false">
    </div>
    <div v-if="profile">
      <p>Welcome, {{ profile.fullName }}!</p>
      <button @click="signOut">Sign Out</button>
    </div>
      <div v-else>
        <div class="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="filled_black"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left">
        </div>
      </div>
    <h1>Felix Quiz Game</h1><br>
   <!-- <button @click="fetchNewQuiz" id="quizbutton">JavaScript Quiz</button> -->
    <button @click="fetchNewTDB" id="TDBbutton">Start a new Quiz</button>
    <div class="input-container" v-if="!gameCodeSubmitted">
      <input type="text" id="gameCode" v-model="gameCode" placeholder="Enter code for a specific quiz">
      <button @click="fetchQuizFromDatabase" class="special-button">Go</button>
    </div>
      <div id="quizArea" ref="quizArea" v-if="showQuizArea">
        <div v-if="generatedGameCode">
          <h2>Quiz code: <br> {{ generatedGameCode }}</h2>
        </div>
        <!-- Current question number and question are displayed -->
        <div v-if="questions.length > 0">
          <h2>Question {{ currentQuestionIndex + 1 }}: {{ decodeHtml(questions[currentQuestionIndex].question) }}</h2>
          <!-- Display the answer options -->
          <div id="alternatives" v-for="(answer, answerIndex) in questions[currentQuestionIndex].answers" :key="`${currentQuestionIndex}-${answerIndex}`">
            <div v-if="answer !== null">  
              <label class="checkbox-label">
                <input id="checkBox" type="checkbox" :name="'question-' + currentQuestionIndex" :value="answer" @change="selectAnswer($event, answerIndex)">
                <span class="checkbox-custom"></span>
                {{ decodeHtml(answer) }}
              </label>
            </div>
          </div>
          <!-- Button to move to the next question -->
          <button id="nextButton" @click="nextQuestion">Next</button>
        </div>
        <p id="scoreElem">Points: {{ score }}</p>
        
      </div>
  </body>
</template>

<script>
export default {
  name: 'QuizPage',
  mounted() {
    this.init();
  },
  data() {
    return {
      profile: null,
      generatedGameCode: '', // Variable to store the generated game code
      gameCodeSubmitted: false, // Variable to track if a game code has been submitted
      showQuizArea: false, // Boolean to show/hide the quiz area
      gameCode: '', // Variable to store a users game code
      questions: [], // Array to store the quiz questions
      userAnswers: null, // Array to store the user's selected answers
      score: 0, // Variable to store the user's score
      currentQuestionIndex: 0, // Index of the current question being displayed
      highScoreUserObject: {}, // Object to store the user's high score
      questionsAnswered: 0, // Variable to store the number of questions answered
    };
  },
  methods: {
    async handleCredentialResponse(response) {
      console.log("ID token: " + response.credential);
      const profile = response.getBasicProfile();
      const fullName = profile.getName();
      const email = profile.getEmail();
      const imageUrl = profile.getImageUrl();
      this.profile = { fullName, email, imageUrl };
    },
    signOut() {
      var auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut().then(() => {
        console.log("User signed out");
        this.profile = null;
      });
    },
    initGoogleAuth() {
      console.log("Init Google Auth");
      window.gapi.load("auth2", function () {
        window.gapi.auth2.init({ client_id: '687502014639-9smnn3le2jb20v74a0ev89p7cirn32o8.apps.googleusercontent.com' });
      });
    },
    renderGoogleAuthButton() { 
      console.log("Render Google Auth Button");
      window.gapi.signin2.render("g-signin2", {
        onsuccess: this.handleCredentialResponse
      });
    },

    init() {
      console.log("Init");

      let gapiScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (!gapiScript) {
        gapiScript = document.createElement('script');
        gapiScript.src = 'https://accounts.google.com/gsi/client';
        document.body.appendChild(gapiScript);
      }

      let checkGapiInterval = setInterval(() => {
        if (window.gapi) {
          clearInterval(checkGapiInterval);
          this.initGoogleAuth();
          this.renderGoogleAuthButton();
        }
      }, 2000);  // check every 2000ms
    },

    async fetchQuizFromDatabase() {
      try {
        const response = await fetch(`http://localhost:4000/quizzes/${this.gameCode}`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('An error occurred while fetching the quiz.');
        }
        const quiz = await response.json();
        this.questions = quiz.questions.map(question => {
          // Create an array of answers and shuffle it
          let answers = [question.correct_answer, ...question.incorrect_answers];
          answers = this.shuffle(answers); 
          return {
            ...question,
            answers: answers,
            correct_answers: [question.correct_answer]
          };
        });
        this.userAnswers = this.questions.map(() => []);
        this.currentQuestionIndex = 0;
        this.showQuizArea = true;
        this.generatedGameCode = quiz.gameCode;
        this.gameCodeSubmitted = true; // Set gameCodeSubmitted to true when a game code is submitted
      } catch (error) {
        console.error('Error:', error);
      }
    },

    selectAnswer(event, answerIndex) {
      if (event.target.checked) {
        this.userAnswers[this.currentQuestionIndex][answerIndex] = this.questions[this.currentQuestionIndex].answers[answerIndex];
      } else {
        this.userAnswers[this.currentQuestionIndex][answerIndex] = null;
      }
    },
    // Function to decode HTML entities
    decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },

    // Function to fetch a new quiz from the backend
    async fetchNewQuiz() {
      try {
        const response = await fetch('http://localhost:4000/quizzes/fetch-quiz');
        if (!response.ok) {
          throw new Error('An error occurred while fetching quiz data.');
        }
        const data = await response.json();
        // Convert answers object to array
        for (let i = 0; i < data.questions.length; i++) {
          data.questions[i].answers = Object.values(data.questions[i].answers);
          // Convert correct_answers object to array
          data.questions[i].correct_answers = Object.entries(data.questions[i].correct_answers)
      .filter(([ value]) => value === 'true')
      .map(() => {});
        }
        this.showQuizArea = true; // Show the quiz area
        this.questions = data.questions;
        this.userAnswers = this.questions.map(() => []);
        this.currentQuestionIndex = 0; // Reset to the first question


      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },

    // Helper function to compare arrays
    arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },

    nextQuestion() {
      // Check if the user's answers are correct
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if ('correct_answers' in currentQuestion) {
        // Compare the user's answer with the correct answer
        if (currentQuestion.correct_answers.some(answer => this.userAnswers[this.currentQuestionIndex].includes(answer))) {
          this.score++;
        }
      }
      // Clear the user's answers for the current question
      let newUserAnswers = [...this.userAnswers];
      newUserAnswers[this.currentQuestionIndex] = [];
      this.userAnswers = newUserAnswers;
      // Move to the next question
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        // If it was the last question, hide the quiz area
        this.showQuizArea = false;
      }
      // Increment the number of questions answered
      this.questionsAnswered++;
      // If 10 questions have been answered, reset the score and the counter
      if (this.questionsAnswered >= 10) {
        this.score = 0;
        this.questionsAnswered = 0;
      }
    },

    // Shuffle function
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },

    // Function to fetch a new TDB quiz from the backend
    async fetchNewTDB() {
      try {
        const TDBresponse = await fetch('http://localhost:4000/quizzes/fetch-quizTDB');
        if (!TDBresponse.ok) {
          throw new Error('An error occurred while fetching quiz data.');
        }
        const TDBdata = await TDBresponse.json();
        this.currentQuestionIndex = 0;
        this.showQuizArea = true; // Show the quiz area
        this.questions = TDBdata.questions.map(question => {
          // Create an array of answers and shuffle it
          let answers = [question.correct_answer, ...question.incorrect_answers];
          answers = this.shuffle(answers); 

          return {
            question: this.decodeHtml(question.question),
            answers: answers,
            correct_answers: [question.correct_answer]
          };
        });
        this.userAnswers = this.questions.map(() => []); 
        this.generatedGameCode = TDBdata.gameCode;

      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.input-container {
  justify-content: center;
  align-items: center;
}

#gameCode {
  margin-bottom: 20px;
  padding: 15px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f2f2f2;
  opacity: 0.9;
  width: 25%;
  justify-content: center;
  align-items: center;
}

.special-button {
  background-color: rgb(42, 16, 190);
  color: white;
  justify-content: center;
  align-items: center;
  border-radius: 30%;
  width: 50px;
  height: 50px;
}

#quizArea {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f2f2f2;
  opacity: 0.9;
  min-width: 40%;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

#scoreElem {
  margin-top: 20px;
  font-size: 25px;
}
</style>