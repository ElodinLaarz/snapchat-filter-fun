import { right } from '../../../../Support/StudioLib';
const DEFAULT_LIVES = 2;

enum Choice {
    Left,
    Right
}

class QuizState {
    private gameStarted: boolean;
    private leftChoice: string;
    private rightChoice: string;

    private answer: Choice;

    private lives: number;
    private questionNumber: number;
    private score: number;

    public nextComposite: number;
    public nextPrime: number;

    constructor(lives: number) {
        this.lives = lives;
        this.score = 0;
        this.questionNumber = 0;

        this.gameStarted = false;
        this.leftChoice = "Tilt Head";
        this.rightChoice = "To Start";
        
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

    public GuessChoice(c:Choice): boolean {
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

    // Generates a random integer between min and max, inclusive.
    // The integer returned is guaranteed to be greater than 1 so
    // that a product of two such numbers is never prime.
    private getRandomFactor(min, max: number): number {
        // Lets us assume min < max and max > 2.
        if ((min >= max) || max <= 2) {
            return 2;
        }
        min = Math.max(2, min);
        return Math.round(Math.random() * (max-min))+min;
    }
    // Generates a random composite integer between 2^q and 2^(q+1),
    // where q is the current question number.
    private generateComposite(): number {
        let q = this.questionNumber;
        let numOne = this.getRandomFactor(2 ** q, 2 ** (q+1));
        let numTwo = this.getRandomFactor(2 ** q, 2 ** (q+1));
        return numOne * numTwo;
    }

    private isPrime(n: number): boolean {
        for(let i = 2, s = Math.sqrt(n); i <= s; i++) {
            if(n % i === 0) return false;
        }
        return n > 1;
    }

    private generatePrime(): number {
        let q = this.questionNumber;
        let min = 2 ** q;
        let max = 2 ** (q+1);
        let num = this.getRandomFactor(min, max);
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
        this.nextPrime = this.generatePrime();
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
        this.nextComposite = 1;
        this.nextPrime = 2;
        this.questionNumber = 0;
        this.score = 0;
    }
}
