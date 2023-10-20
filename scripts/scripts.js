// Scripts here

const guitarBackgroundElement = document.getElementById("guitar-background");
const incorrectPasscodeElement = document.getElementById(
  "incorrect-passcode-notifier"
);
const executionCountElement = document.getElementById("execution-count");

const passcodeDisplayElement = document.getElementById(
  "passcode-sequence-display"
);

const fallAreaElement = document.getElementById("fall-area");
const fallLane1Element = document.getElementById("fall-lane-1");
const fallLane2Element = document.getElementById("fall-lane-2");
const fallLane3Element = document.getElementById("fall-lane-3");
let fallingButtons = [];

const trigger1Element = document.getElementById("trigger-1");
const trigger2Element = document.getElementById("trigger-2");
const trigger3Element = document.getElementById("trigger-3");
const triggers = [trigger1Element, trigger2Element, trigger3Element];
for (let i = 0; i < 3; i++) {
  triggers[i].addEventListener("touchend", (event) => {
    event.preventDefault();
    checkHitAndAnimate(i + 1, triggers[i]);
    console.log("Touched");
  });
}

let fallingButtonsClicked = [];
const passcode = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const startTriggers = [0, 0, 0];

let counter = 0;
const maxExecutions = 4;
let intervalId = 0;
let awaitingStart = true;
setTriggerBackgroundState(0);

let passcodeDisplayCircles = [];
initPasscodeSequenceDisplay();

function initPasscodeSequenceDisplay() {
  for (let i = 3; i >= 0; i--) {
    const rowId = "passcode-sequence-row-" + (i + 1);
    const row = document.createElement("div");
    row.classList.add("passcode-sequence-row");
    row.id = rowId;
    passcodeDisplayElement.appendChild(row);
  }

  for (let i = 0; i < 4; i++) {
    const rowElement = document.getElementById(
      "passcode-sequence-row-" + (i + 1)
    );
    for (let j = 0; j < 3; j++) {
      const circleId = "passcode-circle-" + (j + 1);
      const circle = document.createElement("div");
      circle.classList.add("passcode-circle-default");
      circle.id = circleId;
      rowElement.appendChild(circle);
      passcodeDisplayCircles.push(circle);
    }
  }
}

function resetPasscodeSequenceDisplay() {
  passcodeDisplayCircles = [];
  passcodeDisplayElement.innerHTML = "";
  initPasscodeSequenceDisplay();
  passcodeDisplayElement.style.display = "none";
}

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
  incorrectPasscodeElement.style.display = "none";
  passcodeDisplayElement.style.display = "flex";
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
  executionCountElement.innerHTML = counter;

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
    incorrectPasscodeElement.style.display = "block";
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

function reset() {
  fallingButtonsClicked = [];
  for (let i = 0; i < startTriggers.length; i++) {
    startTriggers[i] = 0;
  }
  counter = 0;
  executionCountElement.innerHTML = "";
  awaitingStart = true;
  setTriggerBackgroundState(0);
  resetPasscodeSequenceDisplay();
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
    element.classList.remove("flash-red", "flash-blue", "flash-green", "ring");
  }, 300);
}

function animateHit(buttonNumber) {
  animationContainer = document.getElementById("trigger-" + buttonNumber);
  console.log("Hit", buttonNumber);
  animationContainer.classList.add("ring");
  setTimeout(() => {
    animationContainer.classList.remove("ring");
  }, 500);
}

function startConditionsMet() {
  for (let i of startTriggers) {
    if (i == 0) return false;
  }
  return true;
}

function checkHit(buttonNumber, element) {
  let marginOfError = 100;
  let fallingButton = fallingButtons[buttonNumber - 1];
  let hitBox = fallingButton.getBoundingClientRect();
  let targetRect = element.getBoundingClientRect();

  if (
    targetRect.top > hitBox.top - marginOfError &&
    targetRect.bottom < hitBox.bottom + marginOfError
  ) {
    console.log("HIT", fallingButton);
    let index = getFallButtonIndexFromId(fallingButton.id);
    if (fallingButtonsClicked[index] == 1) return;
    fallingButtonsClicked[getFallButtonIndexFromId(fallingButton.id)] = 1;
    passcodeDisplayCircles[
      getFallButtonIndexFromId(fallingButton.id)
    ].classList.add("ready-" + (((buttonNumber - 1) % 3) + 1));
    animateHit(buttonNumber);
  }
}

function checkHitAndAnimate(buttonNumber, element) {
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
