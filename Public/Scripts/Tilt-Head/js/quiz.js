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
    function QuizState() {
        this.lives = DEFAULT_LIVES;
        this.score = 0;
        this.questionNumber = 0;
        this.gameStarted = false;
        this.leftChoice = "Tilt Head Left";
        this.rightChoice = "To Start";
        this.nextComposite = 0;
        this.nextPrime = 0;
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
    // Generates a random integer between min and max.
    // Assumes min < max-- will explode and do bad things otherwise.
    QuizState.prototype.randomIntInRange = function (min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    };
    // Generates a random biprime on the order of 2^(q+1),
    // where q is the current question number.
    QuizState.prototype.generateComposite = function () {
        var exponent = Math.floor((this.questionNumber) / 2);
        var primeOne = this.generatePrime(exponent);
        var primeTwo = this.generatePrime(exponent);
        return primeOne * primeTwo;
    };
    QuizState.prototype.isPrime = function (n) {
        for (var i = 2, s = Math.sqrt(n); i <= s; i++) {
            if (n % i === 0)
                return false;
        }
        return n > 1;
    };
    QuizState.prototype.generatePrime = function (exponent) {
        var min = Math.pow(2, exponent);
        var max = Math.pow(2, (exponent + 1));
        var num = this.randomIntInRange(min, max);
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
        this.nextPrime = this.generatePrime(this.questionNumber);
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
        this.nextComposite = 0;
        this.nextPrime = 0;
        this.questionNumber = 0;
        this.score = 0;
    };
    return QuizState;
}());
module.exports.QuizState = QuizState;
