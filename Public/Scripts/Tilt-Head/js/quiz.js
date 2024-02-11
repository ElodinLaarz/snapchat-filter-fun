"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizState = exports.Choice = void 0;
var DEFAULT_LIVES = 2;
var Choice;
(function (Choice) {
    Choice[Choice["Left"] = 0] = "Left";
    Choice[Choice["Right"] = 1] = "Right";
})(Choice || (exports.Choice = Choice = {}));
var QuizState = /** @class */ (function () {
    function QuizState(lives) {
        this.lives = lives;
        this.score = 0;
        this.questionNumber = 0;
        this.gameStarted = false;
        this.leftChoice = "Tilt Head";
        this.rightChoice = "To Start";
        this.nextComposite = 1;
        this.nextPrime = 2;
    }
    QuizState.prototype.getLives = function () {
        return this.lives;
    };
    QuizState.prototype.getScore = function () {
        return this.score;
    };
    QuizState.prototype.getQuestionNumber = function () {
        return this.questionNumber;
    };
    QuizState.prototype.GuessChoice = function (c) {
        if (!(c == this.answer)) {
            this.wrongAnswer();
            return false;
        }
        this.correctAnswer();
        return true;
    };
    QuizState.prototype.correctAnswer = function () {
        this.score++;
        this.generateQuestion();
    };
    QuizState.prototype.wrongAnswer = function () {
        this.lives--;
        if (this.isGameOver()) {
            this.endGame();
        }
        else {
            this.generateQuestion();
        }
    };
    // Generates a random integer between min and max, inclusive.
    // The integer returned is guaranteed to be greater than 1 so
    // that a product of two such numbers is never prime.
    QuizState.prototype.getRandomFactor = function (min, max) {
        // Lets us assume min < max and max > 2.
        if ((min >= max) || max <= 2) {
            return 2;
        }
        min = Math.max(2, min);
        return Math.round(Math.random() * (max - min)) + min;
    };
    // Generates a random composite integer between 2^q and 2^(q+1),
    // where q is the current question number.
    QuizState.prototype.generateComposite = function () {
        var q = this.questionNumber;
        var numOne = this.getRandomFactor(Math.pow(2, q), Math.pow(2, (q + 1)));
        var numTwo = this.getRandomFactor(Math.pow(2, q), Math.pow(2, (q + 1)));
        return numOne * numTwo;
    };
    QuizState.prototype.isPrime = function (n) {
        for (var i = 2, s = Math.sqrt(n); i <= s; i++) {
            if (n % i === 0)
                return false;
        }
        return n > 1;
    };
    QuizState.prototype.generatePrime = function () {
        var q = this.questionNumber;
        var min = Math.pow(2, q);
        var max = Math.pow(2, (q + 1));
        var num = this.getRandomFactor(min, max);
        while (!this.isPrime(num)) {
            num++;
        }
        return num;
    };
    // Given the question number q, we generate a composite and prime
    // number that are between 2^q and 2^(q+1), inclusive.
    QuizState.prototype.generateQuestion = function () {
        this.questionNumber++;
        this.nextComposite = this.generateComposite();
        this.nextPrime = this.generatePrime();
        this.showQuestion();
    };
    QuizState.prototype.showQuestion = function () {
        if (Math.round(Math.random()) === 0) {
            this.leftChoice = this.nextComposite.toString();
            this.rightChoice = this.nextPrime.toString();
            this.answer = Choice.Right;
        }
        else {
            this.leftChoice = this.nextPrime.toString();
            this.rightChoice = this.nextComposite.toString();
            this.answer = Choice.Left;
        }
    };
    QuizState.prototype.isGameOver = function () {
        return this.lives === 0;
    };
    QuizState.prototype.endGame = function () {
        this.leftChoice = "Try Again?";
        this.rightChoice = "SCORE: " + this.score.toString();
        this.reset();
    };
    QuizState.prototype.reset = function () {
        this.gameStarted = false;
        this.lives = DEFAULT_LIVES;
        this.nextComposite = 1;
        this.nextPrime = 2;
        this.questionNumber = 0;
        this.score = 0;
    };
    return QuizState;
}());
exports.QuizState = QuizState;
