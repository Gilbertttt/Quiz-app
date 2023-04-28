const question = document.getElementById("question");
const choices = Array.from (document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById ("questionCounter");
const scoreText = document.getElementById ("score");

//  Creating Variables

let currentQuestion = {};
let acceptingAnswers = false;// To create a delay before going to the next question 
let score = 0; //To start at 0
let questionCounter = 0; //Telling the user what question they're on
let availableQuestions = []; // A copy of our local questions set

let questions = [
//     {
//          questidon: "What is my favourite car??",
//          choice1: "Elantra",
//          choice2: "Venza",
//          choice3: "Range Rover",
//          choice4: "Lambourgini",
//          answer: 4
// },
//     {
//          question: "What is my Best food??",
//          choice1: "Beans and egg",
//          choice2: "Plantain and egg",
//          choice3: "Fried Rice and Beans",
//          choice4: "White Rice and stew",
//          answer: 2
// },
//     {
//          question: "What Phone am i using currently??",
//          choice1: "Samsung Note 11 ",
//          choice2: "Techno Spark 12",
//          choice3: "Infinix Note 11",
//          choice4: "Iphone 14 Pro Max",
//          answer: 4
// },
//     {
//          question: "What is my Name??",
//          choice1: "Gilbert",
//          choice2: "Albert",
//          choice3: "Micheal",
//          choice4: "James",
//          answer: 1
// },

//     {
//          question: "Where do i live??",
//          choice1: "Ikeja",
//          choice2: "Gbagada",
//          choice3: "Lekki",
//          choice4: "Ikorodu",
//          answer: 2
// },

//     {
//          question: "What is my favourite car??",
//          choice1: "Elantra",
//          choice2: "Venza",
//          choice3: "Range Rover",
//          choice4: "Lambourgini",
//          answer: 4
// },

];

// Fetch Api to load questions Api
fetch(
    "https://opentdb.com/api.php?amount=4&category=27&difficulty=easy&type=multiple")

    .then(res => {  // Javascript Promise
        return res.json();

    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results)
        questions = loadedQuestions.results.map(loadedQuestion =>{
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1, 0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
               formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch(err => {
        console.error(err);
    })



//Constraints
const CORRECT_BONUS = 10; // Telling us what we score after answering a question
const MAX_QUESTIONS = 4;  //Telling us the number of questions available

startGame = () => {     // Creating a function to startGame
     questionCounter = 0;     //Starting game counter should be on 0
     score = 0;               // Scoreboard should be 0
     availableQuestions = [...questions];   
      // Getting the questions available and putting it into an array. Basically taking the array(questions) and spread it out into availableQuestions array
      getNewQuestion();
};



getNewQuestion = () => {
  
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {

        localStorage.setItem("mostRecentScore", score); // When user end game to save user score in the local storage. So that the end screen ca access it



        //Go to end page
        return window.location.assign("/end.html");
    }


    questionCounter++;  // Add 1 to every new question. Telling users what questions theyre on

    questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;  //To update our question numbers on display


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];  // Getting the data-number in the html for each choices
        choice.innerText = currentQuestion["choice" + number]; 
    });

    availableQuestions.splice(questionIndex, 1);  // so as not to repeat questions
     acceptingAnswers = true; 
};

choices.forEach(choice => { 
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";  // To show which is correct and which isn't correct in the console

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

setTimeout (() => {  // Adding a timer, to count 1000 miliseconds before going to next question
    selectedChoice.parentElement.classList.remove(classToApply); // This allows us to remove a question page once answered.
    
    getNewQuestion();

}, 1000);
    });
});

incrementScore = num => {
    score += num
    scoreText.innerText = score;
};



