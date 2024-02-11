class QuizState {
    private lives: number;
    private score: number;
    private questionNumber: number;

    public nextComposite: number;
    public nextPrime: number;

    constructor(lives: number) {
        this.lives = lives;
        this.score = 0;
        this.questionNumber = 0;
        
        this.nextComposite = 1;
        this.nextPrime = 2;
    }

    public reset(): void {
        this.lives = DEFAULT_LIVES;
        this.score = 0;
        this.questionNumber = 0;
        
        this.nextComposite = 1;
        this.nextPrime = 2;
    }

    public getLives(): number {
        return this.lives;
    }

    public getScore(): number {
        return this.score;
    }

    public getQuestionNumber(): number {
        return this.questionNumber;
    }

    public nextQuestion(): void {
        this.questionNumber++;
    }

    public correctAnswer(): void {
        this.score++;
    }

    public wrongAnswer(): void {
        this.lives--;
    }

    public isGameOver(): boolean {
        return this.lives === 0;
    }
}

const DEFAULT_LIVES = 2;
let quizState = new QuizState(DEFAULT_LIVES);