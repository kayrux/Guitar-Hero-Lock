let score = 0;

function animateButton(element, buttonNumber) {
    switch (buttonNumber) {
        case 1:
            element.classList.add('flash-red');
            break;
        case 2:
            element.classList.add('flash-blue');
            break;
        case 3:
            element.classList.add('flash-green');
            break;
    }

    setTimeout(() => {
        element.classList.remove('flash-red', 'flash-blue', 'flash-green');
    }, 500);
}


// My idea is display the score on the button itself, but not finish yet.
function checkHit(buttonNumber) {
    let note = document.querySelector('.note:nth-child(' + buttonNumber + ')');
    let buttonTop = document.querySelectorAll('.guitar-button')[buttonNumber - 1].getBoundingClientRect().top;
    let noteTop = note.getBoundingClientRect().top;

    if (Math.abs(buttonTop - noteTop) < 30) {
        score += 10;
        document.querySelectorAll('.guitar-button')[buttonNumber - 1].innerText = "Button " + buttonNumber + " (" + score + ")";
    }
}

function checkHitAndAnimate(buttonNumber, element) {
    checkHit(buttonNumber);
    animateButton(element, buttonNumber);
}
