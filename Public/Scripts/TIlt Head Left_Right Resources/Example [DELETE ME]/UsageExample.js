// UseageExample.js
// Version: 0.1.0
// Event: On Awake
// Description: Recieve head events and trigger effects.

//sets material of corresponding sphere based on left or right tilt
//@input Component.MaterialMeshVisual objectLeft
//@input Component.MaterialMeshVisual objectRight

//@input Asset.Material matGreen
//@input Asset.Material matGrey

script.onLeft = function () {
     script.objectRight.mainMaterial = script.matGrey;
     script.objectLeft.mainMaterial = script.matGreen;
}
//script.api.onLeft = script.onLeft;

script.onRight = function () {
     script.objectRight.mainMaterial = script.matGreen;
     script.objectLeft.mainMaterial = script.matGrey;
}
script.api.onRight = script.onRight;

script.onReset = function () {
     script.objectRight.mainMaterial = script.matGrey;
     script.objectLeft.mainMaterial = script.matGrey;
}
script.api.onReset = script.onReset;