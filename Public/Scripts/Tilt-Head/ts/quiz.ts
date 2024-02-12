const DEFAULT_LIVES = 2;

export enum Choice {
    Left,
    Right
}

export class QuizState {
    private gameStarted: boolean;
    private leftChoice: string;
    private rightChoice: string;

    private answer: Choice;

    private lives: number;
    private questionNumber: number;
    private score: number;

    public nextComposite: number;
    public nextPrime: number;

    constructor() {
        this.lives = DEFAULT_LIVES;
        this.score = 0;
        this.questionNumber = 0;

        this.gameStarted = false;
        this.leftChoice = "Tilt Head Left";
        this.rightChoice = "To Start";
        
        this.nextComposite = 0;
        this.nextPrime = 0;
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

    public GuessChoice(c:Choice): boolean {
        if (!this.gameStarted) {
            if (c === Choice.Right) {
                return true;
            }
            this.gameStarted = true;
            this.generateQuestion();
            return true;
        }
        if (!(c == this.answer)) {
            this.wrongAnswer();
            return false;
        }
        this.correctAnswer();
        return true;
    }

    private correctAnswer(): void {
        this.score++;
        this.generateQuestion();
    }
    private wrongAnswer(): void {
        this.lives--;
        if (this.isGameOver()) {
            this.endGame();
        } else {
            this.generateQuestion();
        }
    }

    // Generates a random integer between min and max.
    // Assumes min < max-- will explode and do bad things otherwise.
    private randomIntInRange(min, max: number): number {
        return Math.round(Math.random() * (max-min))+min;
    }
    // Generates a random biprime on the order of 2^(q+1),
    // where q is the current question number.
    private generateComposite(): number {
        let exponent = Math.floor((this.questionNumber)/2);
        let primeOne = this.generatePrime(exponent);
        let primeTwo = this.generatePrime(exponent);
        return primeOne * primeTwo;
    }

    private isPrime(n: number): boolean {
        for(let i = 2, s = Math.sqrt(n); i <= s; i++) {
            if(n % i === 0) return false;
        }
        return n > 1;
    }

    private generatePrime(exponent : number): number {
        let min = 2 ** exponent;
        let max = 2 ** (exponent + 1);
        let num = this.randomIntInRange(min, max);
        while (!this.isPrime(num)) {
            num++;
        }
        return num;
    }

    // Given the question number q, we generate a composite and prime
    // number that are between 2^q and 2^(q+1), inclusive.
    private generateQuestion(): void {
        this.questionNumber++;
        this.nextComposite = this.generateComposite();
        this.nextPrime = this.generatePrime(this.questionNumber);
        this.showQuestion();
    }
    private showQuestion(): void {
        if (Math.round(Math.random()) === 0) {
            this.leftChoice = this.nextComposite.toString();
            this.rightChoice = this.nextPrime.toString();
            this.answer = Choice.Right;
        } else {
            this.leftChoice = this.nextPrime.toString();
            this.rightChoice = this.nextComposite.toString();
            this.answer = Choice.Left;
        }
    }

    public isGameOver(): boolean {
        return this.lives === 0;
    }

    public endGame(): void {
        this.leftChoice = "Try Again?";
        this.rightChoice = "SCORE: " + this.score.toString();

        this.reset();
    }

    public reset() : void {
        this.gameStarted = false;
        this.lives = DEFAULT_LIVES;
        this.nextComposite = 0;
        this.nextPrime = 0;
        this.questionNumber = 0;
        this.score = 0;
    }
}
