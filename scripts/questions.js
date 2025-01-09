async function fetchQuestions(difficulty) {
    const response = await fetch(`questions/${difficulty}.json`);
    return await response.json();
}

export async function getRandomQuestions() {
    const easy = await fetchQuestions('easy');
    const medium = await fetchQuestions('medium');
    const hard = await fetchQuestions('hard');

    const questions = [
        ...easy.slice(0, 5),
        ...medium.slice(0, 5),
        ...hard.slice(0, 5)
    ];

    return questions.sort(() => Math.random() - 0.5);
}
