// Scripts here

const guitarBackgroundElement = document.getElementById("guitar-background");
const fallAreaElement = document.getElementById("fall-area");
const fallLane1Element = document.getElementById("fall-lane-1");
const fallLane2Element = document.getElementById("fall-lane-2");
const fallLane3Element = document.getElementById("fall-lane-3");
let fallingButtons = [];

const trigger1Element = document.getElementById("trigger-1");
const trigger2Element = document.getElementById("trigger-2");
const trigger3Element = document.getElementById("trigger-3");
const triggers = [trigger1Element, trigger2Element, trigger3Element];

// const startButtonElement = document.getElementById("start-button");
let fallingButtonsClicked = [];
const passcode = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const startTriggers = [0, 0, 0];

let counter = 0;
const maxExecutions = 4;
let intervalId = 0;
let awaitingStart = true;
setTriggerBackgroundState(0);

/* ******************************************************************************************* */
function setTriggersToGameMode() {
  for (let i = 0; i < triggers.length; i++) {
    triggers[i].classList.add("game-mode-" + (i + 1));
  }
}

function setTriggersToWaitMode() {
  for (let trigger of triggers) {
    trigger.classList.add("wait-mode");
  }
}

function resetTriggersBackground() {
  for (let trigger of triggers) {
    trigger.className = "";
  }
}

function addDefaultClassesToTrigger() {
  for (let trigger of triggers) {
    trigger.classList.add("guitar-button");
  }
}

function setTriggersText(text) {
  for (let trigger of triggers) {
    trigger.innerHTML = text;
  }
}

function setTriggerBackgroundState(state) {
  resetTriggersBackground();
  addDefaultClassesToTrigger();
  switch (state) {
    case 0:
      setTriggersText("Tap to start");
      setTriggersToWaitMode();
      break;
    case 1:
      setTriggersText("");
      setTriggersToGameMode();
  }
}
/* ******************************************************************************************* */

function start() {
  // startButtonElement.remove();
  addFallingButtons();
  intervalId = setInterval(addFallingButtons, 3000);
  awaitingStart = false;
  setTriggerBackgroundState(1);
}

function clearFallLanes() {
  fallLane1Element.innerHTML = "";
  fallLane2Element.innerHTML = "";
  fallLane3Element.innerHTML = "";
}

function addFallingButtons() {
  clearFallLanes();
  fallingButtons = [];

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
    // newButton.addEventListener("click", function () {
    //   onFallingButtonClick(buttonId);
    // });
    parentElement.appendChild(newButton);
    fallingButtons.push(newButton);
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
  return id.substring(id.indexOf("-", id.length - 3) + 1, id.length);
}

// function onFallingButtonClick(id) {
//   console.log("button " + id + " clicked");
//   fallingButtonsClicked[getFallButtonIndexFromId(id)] = 1;
// }

function reset() {
  fallingButtonsClicked = [];
  for (let i = 0; i < startTriggers.length; i++) {
    startTriggers[i] = 0;
  }
  counter = 0;
  awaitingStart = true;
  setTriggerBackgroundState(0);
  // guitarBackgroundElement.appendChild(startButtonElement);
}

/* ******************************************************************************************************************************** */

function animateButton(element, buttonNumber) {
  switch (buttonNumber) {
    case 1:
      element.classList.add("flash-red");
      break;
    case 2:
      element.classList.add("flash-blue");
      break;
    case 3:
      element.classList.add("flash-green");
      break;
  }

  setTimeout(() => {
    element.classList.remove("flash-red", "flash-blue", "flash-green");
  }, 500);
}

// My idea is display the score on the button itself, but not finish yet.
// function checkHit(buttonNumber) {
//   let note = document.querySelector(".note:nth-child(" + buttonNumber + ")");
//   let buttonTop = document
//     .querySelectorAll(".guitar-button")
//     [buttonNumber - 1].getBoundingClientRect().top;
//   let noteTop = note.getBoundingClientRect().top;

//   if (Math.abs(buttonTop - noteTop) < 30) {
//     score += 10;
//     document.querySelectorAll(".guitar-button")[buttonNumber - 1].innerText =
//       "Button " + buttonNumber + " (" + score + ")";
//   }
// }

function startConditionsMet() {
  for (let i of startTriggers) {
    if (i == 0) return false;
  }
  return true;
}

function checkHit(buttonNumber, element) {
  let marginOfError = 50;
  let fallingButton = fallingButtons[buttonNumber - 1];
  let hitBox = fallingButton.getBoundingClientRect();
  let targetRect = element.getBoundingClientRect();

  if (
    targetRect.top > hitBox.top - marginOfError &&
    targetRect.bottom < hitBox.bottom + marginOfError
  ) {
    console.log("HIT", fallingButton);
    fallingButtonsClicked[getFallButtonIndexFromId(fallingButton.id)] = 1;
  }
}

function checkHitAndAnimate(buttonNumber, element) {
  // checkHit(buttonNumber);
  animateButton(element, buttonNumber);
  if (awaitingStart) {
    startTriggers[buttonNumber - 1] = 1;
    if (buttonNumber == 1) {
      element.classList.add("ready-1");
    } else if (buttonNumber == 2) {
      element.classList.add("ready-2");
    } else {
      element.classList.add("ready-3");
    }
    element.innerHTML = "Ready";

    if (startConditionsMet()) {
      console.log("Start conditions met");
      start();
    }
    console.log("Start conditions not met");
  } else {
    checkHit(buttonNumber, element);
  }
}
