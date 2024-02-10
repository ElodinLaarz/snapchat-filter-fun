// PrimeScriptMagic.js
// Version: 0.1.0
// Event: On Awake
// Description: Recieve head events and trigger effects.

//sets material of corresponding sphere based on left or right tilt
//@input Component.MaterialMeshVisual objectLeft
//@input Component.MaterialMeshVisual objectRight

//@input Component.Text leftText
//@input Component.Text rightText

//@input Asset.Material matGreen
//@input Asset.Material matGrey

script.onLeft = function () {
    script.objectRight.mainMaterial = script.matGrey;
    script.objectLeft.mainMaterial = script.matGreen;

    script.leftText.text = "Left";
}
script.api.onLeft = script.onLeft;

script.onRight = function () {
    script.objectRight.mainMaterial = script.matGreen;
    script.objectLeft.mainMaterial = script.matGrey;

    script.rightText.text = "Right";
}
script.api.onRight = script.onRight;

script.onReset = function () {
    script.objectRight.mainMaterial = script.matGrey;
    script.objectLeft.mainMaterial = script.matGrey;

    script.leftText.text = "Default";
    script.rightText.text = "Default";
}
script.api.onReset = script.onReset;