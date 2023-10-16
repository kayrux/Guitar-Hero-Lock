// Scripts here

const guitarBackgroundElement = document.getElementById("guitar-background");
const fallAreaElement = document.getElementById("fall-area");
const fallLane1Element = document.getElementById("fall-lane-1");
const fallLane2Element = document.getElementById("fall-lane-2");
const fallLane3Element = document.getElementById("fall-lane-3");

const startButtonElement = document.getElementById("start-button");
let fallingButtonsClicked = [];
const passcode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let counter = 0;
const maxExecutions = 4;
let intervalId = 0;

function start() {
  startButtonElement.remove();
  addFallingButtons();
  intervalId = setInterval(addFallingButtons, 3000);
}

function clearFallLanes() {
  fallLane1Element.innerHTML = "";
  fallLane2Element.innerHTML = "";
  fallLane3Element.innerHTML = "";
}

function addFallingButtons() {
  clearFallLanes();

  counter++;
  console.log(`This is execution number ${counter}`);

  if (counter === maxExecutions + 1) {
    passcodeSequenceFinished();
    return;
  }
  for (let i = 0; i < 3; i++) {
    const buttonId = `falling-button-${fallingButtonsClicked.length}`;
    const parentElement = document.getElementById(`fall-lane-${i + 1}`);
    const newButton = document.createElement("div");
    newButton.classList.add("falling-button");
    newButton.id = buttonId;
    newButton.addEventListener("click", function () {
      onFallingButtonClick(buttonId);
    });
    parentElement.appendChild(newButton);
    fallingButtonsClicked.push(0);
  }
}

function arraysAreEqual(arr1, arr2) {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Iterate through each element and compare
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // All elements are equal
  return true;
}

function checkPasscode() {
  if (arraysAreEqual(passcode, fallingButtonsClicked)) {
    console.log("PASS");
  } else {
    console.log("FAIL");
    reset();
  }
}

function passcodeSequenceFinished() {
  clearInterval(intervalId);
  console.log("Interval cleared after 4 executions");

  for (let i = 0; i < fallingButtonsClicked.length; i += 3) {
    console.log(
      fallingButtonsClicked[i] +
        " | " +
        fallingButtonsClicked[i + 1] +
        " | " +
        fallingButtonsClicked[i + 2]
    );
  }
  clearFallLanes();
  checkPasscode();
}

function getFallButtonIndexFromId(id) {
  return id.substring(id.length - 1, id.length);
}

function onFallingButtonClick(id) {
  console.log("button " + id + " clicked");
  fallingButtonsClicked[getFallButtonIndexFromId(id)] = 1;
}

function reset() {
  fallingButtonsClicked = [];
  counter = 0;
  guitarBackgroundElement.appendChild(startButtonElement);
}
