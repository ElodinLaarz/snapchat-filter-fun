// Tilt Head.js
// Version: 0.1.0
// Event: On Awake
// Description: Set up Head Component and calculate and trigger head right, left and reset event.

//@input float angle {"widget" : "slider", "min" : 0, "max" : 90, "step" : 0.1}
/** @type {number} */
var angle = script.angle;

//@input int faceIndex
/** @type {number} */
var faceIndex = script.faceIndex;

//@ui {"widget": "separator"}
//@input bool useBehavior
//@input string onLeftTrigger = "ON_LEFT" {"showIf" : "useBehavior"}
//@input string onRightTrigger = "ON_RIGHT"  {"showIf" : "useBehavior"}
//@input string onResetTrigger = "ON_RESET"  {"showIf" : "useBehavior"}
//@ui {"widget":"separator"}
//@input bool callApiFunc
//@input Component.ScriptComponent scriptWithApi  {"showIf" : "callApiFunc"}
//@input string onLeftFunction = "onLeft" {"showIf" : "callApiFunc"}
//@input string onRightFunction = "onRight"  {"showIf" : "callApiFunc"}
//@input string onResetFunction = "onReset"  {"showIf" : "callApiFunc"}

const eps = 0.1;
var State = { "NONE": 0, "LEFT": 1, "RIGHT": 2 };
var currentState = State.NONE;
var x;
var threshold = Math.abs(Math.sin(angle / 180 * Math.PI))

var so = script.getSceneObject();
var head = global.scene.createSceneObject("Head Binding");
head.setParent(so);
var headTransform = head.getTransform();
var headComponent = head.createComponent("Component.Head");
headComponent.faceIndex = faceIndex;

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

function onLeft() {
    if (script.callApiFunc && script.scriptWithApi && script.onLeftFunction && script.scriptWithApi[script.onLeftFunction]) {
        script.scriptWithApi[script.onLeftFunction]();
    }
    if (script.useBehavior && global.behaviorSystem && script.onLeftTrigger) {
        global.behaviorSystem.sendCustomTrigger(script.onLeftTrigger);
    }
}

function onRight() {
    if (script.callApiFunc && script.scriptWithApi && script.onRightFunction && script.scriptWithApi[script.onRightFunction]) {
        script.scriptWithApi[script.onRightFunction]();
    }
    if (script.useBehavior &&global.behaviorSystem && script.onRightTrigger) {
        global.behaviorSystem.sendCustomTrigger(script.onRightTrigger);
    }
}

function onReset() {
    if (script.callApiFunc && script.scriptWithApi && script.onResetFunction && script.scriptWithApi[script.onResetFunction]) {
        script.scriptWithApi[script.onResetFunction]();
    }
    if (script.useBehavior &&global.behaviorSystem && script.onResetTrigger) {
        global.behaviorSystem.sendCustomTrigger(script.onResetTrigger);
    }
}