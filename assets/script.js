// questions, choices and asnwers for the quiz
const questions = [
  {
    question: "JavaScript is a ___ -side programming language.",
    choices: [
      "A. Client",
      "B. Server",
      "C. Both",
      "D. Neither",
    ],
    answer: 2
  },
  {
    question: "Which is the correct way to write a comment in JavaScript?",
    choices: [
      "A. <!--- .... ---!>",
      "B. {# ... #}",
      "C. \\ ...",
      "D. // ....",
    ],
    answer: 3,
  },
  {
    question: "Which of these is used to add an element to the end of an array?",
    choices: [
      "A. addToEnd()",
      "B. push()",
      "C. add()",
      "D. attach()",
    ],
    answer: 1,
  },
  {
    question: "What does the DOM stand for in JavaScript?",
    choices: [
      "A. Document Object Model",
      "B. Data Object Model",
      "C. Document Object Method",
      "D. Dynamic Object Model",
    ],
    answer: 0,
  },
  {
    question: "Which of the following is used to declare a variable in JavaScript?",
    choices: [
      "A. variable",
      "B. declare",
      "C. var",
      "D. let",
    ],
    answer: 3,
  }
];


// start at first questino
let questionIndex = 0;
// time at start
let timeLeft = 60; 
let timerInterval;



// bring in html ID's
const startButton = document.getElementById("startbutton");
const quizContainer = document.getElementById("quizcontainer");
const questionText = document.getElementById("questions");
const choicesList = document.getElementById("choicesList");
const timeDisplay = document.getElementById("timeleft");
const initialsForm = document.getElementById("scoreform");
const initialsInput = document.getElementById("initials");

// hide quiz and the end screen so we only see start screen
document.getElementById("quiz").style.display = "none";
document.getElementById("endscreen").style.display = "none";
document.getElementById("highscoresscreen").style.display = "none";

// used with start button from start screen to start quiz
startButton.addEventListener("click", startQuiz);

function startQuiz() {
  // Reset the question index and time left when we start the quiz
  questionIndex = 0;
  timeLeft = 60;

  // when quiz starts we hide other screens and show the quiz area
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("endscreen").style.display = "none";
  document.getElementById("highscoresscreen").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  // start timing
  startTimer();

  // show our first question
  displayQuestion();
}

// this function handles the timer, if it his 0 we end the quiz
function startTimer() {
  timerInterval = setInterval(function() {
      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endQuiz();
      } else {
          timeLeft--;
          timeDisplay.textContent = timeLeft;
      }
  }, 1000);
}

// this will show us the current qquestion and the choices
function displayQuestion() {
  const currentQuestion = questions[questionIndex];
  questionText.textContent = currentQuestion.question;
  choicesList.innerHTML = "";

  // Fill in choices for the current question
  currentQuestion.choices.forEach((choice, index) => {
      // create a list item for choice
      const choiceItem = document.createElement("li");
      choiceItem.textContent = choice;
      // when you click on a choice list item it is selected
      choiceItem.addEventListener("click", () => checkAnswer(index));
      choicesList.appendChild(choiceItem);
  });
}


// compare the selected choice against correct answer
function checkAnswer(selectedIndex) {
  const currentQuestion = questions[questionIndex];
  // if selected choice = answer then its correct
  if (selectedIndex === currentQuestion.answer) {
  } else {
      // else incorrect answer and we subtract 10 seconds, or to 0 seconds reamining if under 10 seconds
      timeLeft -= 10; 
      if (timeLeft < 0) timeLeft = 0;
  }
  
  questionIndex++;
  // show next question if we havent reached last question
  if (questionIndex < questions.length) {
      displayQuestion();
  } else {
      endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);

  // Display the end screen, hide the quiz screen
  document.getElementById("quiz").style.display = "none";
  document.getElementById("endscreen").style.display = "block";

  // submit initials and score(time left will equal score)
  initialsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const initials = initialsInput.value.trim();
      const scoreEntry = {initials, score: timeLeft}
      
      // show new score
      scoreDisplay.textContent = timeLeft

      // update high scores
      updateStoredScores(scoreEntry);

  });
}


// gget high scores from local storage and put into array (score = time left, so you get a higher score for doing it faster and for not giving incorrect answers)
function getHighscores() {
  const highscoreInfo = localStorage.getItem("highscoreInfo");
  return highscoreInfo ? JSON.parse(highscoreInfo) : [];
}


//update highscores with local storage
function updateStoredScores(highscoreEntry) {
  let highscoreInfo = getHighscores();
  highscoreInfo.push(highscoreEntry);
  localStorage.setItem("highscoreInfo", JSON.stringify(highscoreInfo));

}

// display highscores
function displayHighscores() {
  const highscores = getHighscores();
  // Sort highscores by score (from highest to lowest)
  highscores.sort((a, b) => b.score - a.score);
  const highscoresList = document.getElementById("highscoresList");
  highscoresList.innerHTML = ""; 

  // creating list items for highscores
  highscores.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${entry.initials} - ${entry.score}`;
    highscoresList.appendChild(listItem);
  });
}

// take us to highscores
const highscoresButton = document.getElementById("highscoresButton");
highscoresButton.addEventListener("click", () => {
  // Call function to show highscores
  displayHighscores();
  // Hide other screens
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("endscreen").style.display = "none";
  // Show high scores screen
  document.getElementById("highscoresscreen").style.display = "block";
});

