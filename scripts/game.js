import { getRandomQuestions } from './questions.js';

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function loadGame() {
    questions = await getRandomQuestions();
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;

    question.answers.forEach((answer, index) => {
        const button = document.getElementById(`answer${index + 1}`);
        button.innerText = answer;
        button.onclick = () => checkAnswer(index);
    });
}

function checkAnswer(selected) {
    const question = questions[currentQuestionIndex];
    if (selected === question.correct) {
        score += 10;
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    alert(`Game over! Your score: ${score}`);
    location.reload();
}

document.getElementById('fiftyFifty').onclick = () => {
    // Logic for 50:50
};

document.getElementById('switchQuestion').onclick = () => {
    currentQuestionIndex++;
    loadQuestion();
};

loadGame();
