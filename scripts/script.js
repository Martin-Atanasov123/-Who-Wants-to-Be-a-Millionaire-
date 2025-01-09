const questionDatabase = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Mars", "Jupiter", "Saturn", "Neptune"],
        correct: 1
    },
    {
        question: "Which element has the chemical symbol 'Au'?",
        options: ["Silver", "Aluminum", "Gold", "Copper"],
        correct: 2
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mars", "Mercury"],
        correct: 3
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correct: 1
    },
    {
        question: "What is the chemical formula for water?",
        options: ["CO2", "H2O", "NaCl", "O2"],
        correct: 1
    },
    {
        question: "What is the smallest bone in the human body?",
        options: ["Stapes", "Femur", "Radius", "Tibia"],
        correct: 0
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Mercury", "Jupiter"],
        correct: 1
    },
    {
        question: "What is the chemical formula for table salt?",
        options: ["CO2", "H2O", "NaCl", "O2"],
        correct: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum"],
        correct: 2
    },
    {
        question: "Which country has the largest population?",
        options: ["India", "China", "USA", "Russia"],
        correct: 0
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correct: 2
    },
    {
        question: "What is the deepest point in the ocean?",
        options: ["Mariana Trench", "Tonga Trench", "Philippine Trench", "Puerto Rico Trench"],
        correct: 0
    },
    {
        question: "Who discovered penicillin?",
        options: ["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Joseph Lister"],
        correct: 1
    }
];

const prizeLevels = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];

class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.totalPrize = 0;
        this.safePrize = 0;
        this.selectedOption = null;
        this.questions = this.generateQuestions();
        this.initializeGame();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateQuestions() {
        // Shuffle the entire question database
        const shuffledQuestions = this.shuffleArray(questionDatabase).slice(0, 15);
        
        return shuffledQuestions.map((q, index) => {
            // For each question, create pairs of options and their correct status
            const optionPairs = q.options.map((opt, i) => ({
                text: opt,
                isCorrect: i === q.correct
            }));
            
            // Shuffle the options
            const shuffledOptions = this.shuffleArray(optionPairs);
            
            // Find the new index of the correct answer
            const newCorrectIndex = shuffledOptions.findIndex(opt => opt.isCorrect);
            
            // Return the reformatted question with shuffled options
            return {
                question: q.question,
                options: shuffledOptions.map(opt => opt.text),
                correct: newCorrectIndex,
                prize: prizeLevels[index]
            };
        });
    }

    initializeGame() {
        this.createMoneyLadder();
        this.addEventListeners();
        this.startGame();
    }

    createMoneyLadder() {
        const ladder = document.getElementById('money-ladder');
        ladder.innerHTML = '';
        prizeLevels.slice().reverse().forEach(prize => {
            const level = document.createElement('div');
            level.className = 'prize-level';
            level.id = `prize-${prize}`;
            level.textContent = `$${prize.toLocaleString()}`;
            if (prize === 1000 || prize === 32000) {
                level.classList.add('safe');
            }
            ladder.appendChild(level);
        });
    }

    addEventListeners() {
        document.getElementById('submit-btn').addEventListener('click', () => this.submitAnswer());
    }

    startGame() {
        this.currentQuestion = 0;
        this.totalPrize = 0;
        this.safePrize = 0;
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        document.getElementById('question').textContent = question.question;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = `${String.fromCharCode(65 + index)}: ${option}`;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });

        this.updateMoneyLadder();
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('message').textContent = '';
    }

    selectOption(index) {
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        options[index].classList.add('selected');
        this.selectedOption = index;
        document.getElementById('submit-btn').disabled = false;
    }

    async submitAnswer() {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option');
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (this.selectedOption === question.correct) {
            options[this.selectedOption].classList.add('correct');
            this.totalPrize = question.prize;
            
            if (this.currentQuestion === 4) this.safePrize = 1000;
            if (this.currentQuestion === 9) this.safePrize = 32000;
            
            document.getElementById('message').textContent = `Correct! You've won $${question.prize.toLocaleString()}!`;
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.currentQuestion++;
            if (this.currentQuestion >= this.questions.length) {
                this.gameWon();
            } else {
                this.showQuestion();
            }
        } else {
            options[this.selectedOption].classList.add('wrong');
            options[question.correct].classList.add('correct');
            this.gameOver();
        }
    }

    updateMoneyLadder() {
        const levels = document.querySelectorAll('.prize-level');
        levels.forEach(level => level.classList.remove('current'));
        
        const currentPrize = this.questions[this.currentQuestion].prize;
        document.getElementById(`prize-${currentPrize}`).classList.add('current');
    }

    gameOver() {
        document.getElementById('message').textContent = 
            `Game Over! You'll take home $${this.safePrize.toLocaleString()}`;
        document.getElementById('submit-btn').textContent = 'Play Again';
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-btn').addEventListener('click', () => {
            location.reload();
        }, { once: true });
    }

    gameWon() {
        document.getElementById('message').textContent = 
            `Congratulations! You've won $${this.totalPrize.toLocaleString()}!`;
        document.getElementById('submit-btn').textContent = 'Play Again';
        document.getElementById('submit-btn').disabled = false;
        document.getElementById('submit-btn').addEventListener('click', () => {
            location.reload();
        }, { once: true });
    }
}

// Start the game when the page loads
new QuizGame();
