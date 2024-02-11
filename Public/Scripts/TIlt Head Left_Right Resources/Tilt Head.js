// Tilt Head.js
// Version: 0.1.0
// Event: On Awake
// Description: Set up Head Component and calculate and trigger head right, left and reset event.

//@input float angle {"widget" : "slider", "min" : 0, "max" : 90, "step" : 0.1}
/** @type {number} */
let angle = script.angle;

//@input int faceIndex
/** @type {number} */
let faceIndex = script.faceIndex;


//@input Component.MaterialMeshVisual indicator

//@input Asset.Material matGreen
//@input Asset.Material matGrey
//@input Asset.Material matRed

//@input Component.Text leftChoice
//@input Component.Text rightChoice

//@input Component.Text attemptText
//@input Component.Text attemptValue

//@input Component.Text scoreText
//@input Component.Text scoreValue

const eps = 0.1;
let State = { "NONE": 0, "LEFT": 1, "RIGHT": 2 };
let currentState = State.NONE;
let x;
let threshold = Math.abs(Math.sin(angle / 180 * Math.PI))

let so = script.getSceneObject();
let head = global.scene.createSceneObject("Head Binding");
head.setParent(so);
let headTransform = head.getTransform();
let headComponent = head.createComponent("Component.Head");
headComponent.faceIndex = faceIndex;

script.createEvent("OnStartEvent").bind(function () {
    resetState();
});
script.createEvent("UpdateEvent").bind(onUpdate);

function onUpdate() {
    if (headComponent.getFacesCount() > 0) {
        x = headTransform.up.x;
        if (Math.abs(x) < eps) {
            if (currentState != State.NONE) {
                currentState = State.NONE;
                onReset();
            }
        } else if (x < -threshold) {
            if (currentState != State.LEFT) {
                currentState = State.LEFT;
                onLeft();
            }
        } else if (x > threshold) {
            if (currentState != State.RIGHT) {
                currentState = State.RIGHT;
                onRight();
            }
        }
    } else {
        if (currentState != State.NONE) {
            currentState = State.NONE;
            onReset();
        }
    }
}

function bottomTextVisible(b) {
    script.attemptText.enaled = b;
    script.attemptValue.enaled = b;
    script.scoreText.enaled = b;
    script.scoreValue.enaled = b;
}

const DEFAULT_LIVES = 2;
let quizState = {
    firstTime: true,
    end: false,
};

function resetState() {
    let prevScore = 0;
    if (!(quizState === undefined) && !(quizState.correctAnswers === undefined)) {
        prevScore = quizState.correctAnswers;
    }
    if (quizState.firstTime) {
        quizState = {
            leftChoice: "Tilt Head",
            rightChoice: "To Start Quiz!",
            
            firstTime: false,
            attemptsRemaining: DEFAULT_LIVES,
            correctAnswers: 0,
            questionNumber: 0,
            end: quizState.end,
        };        
    } else {
        quizState = {
            leftChoice: "Try Again?",
            rightChoice: "SCORE: " + prevScore.toString(),
            
            firstTime: false,
            attemptsRemaining: DEFAULT_LIVES,
            correctAnswers: 0,
            questionNumber: 0,
            end: quizState.end,
        };
    }
    bottomTextVisible(false);
    onReset();
}

function checkEnd() {
    if (quizState.attemptsRemaining == 0) {
        quizState.end = true;
        resetState();
        script.indicator.mainMaterial = script.matRed;
    }
}

function printCurrentState()  {
    script.attemptValue.text = quizState.attemptsRemaining.toString();
    script.scoreValue.text = quizState.correctAnswers.toString();
    
    script.leftChoice.text = quizState.leftChoice;
    script.rightChoice.text = quizState.rightChoice;
}

function onLeft() {
    if (quizState.end) {
        quizState.end = false;
        resetState();
    }
    script.indicator.mainMaterial = script.matGreen;

    quizState.correctAnswers += 1;
    script.leftChoice.text = "Left";
    checkEnd();
}

function onRight() {
    if (quizState.end) {
        return;
    }
    script.indicator.mainMaterial = script.matRed;

    quizState.attemptsRemaining -= 1;
    script.rightChoice.text = "Right";
    checkEnd();
}

function onReset() {
    script.indicator.mainMaterial = script.matGrey;

    script.leftChoice.text = "Default";
    script.rightChoice.text = "Default";
    printCurrentState();
}
