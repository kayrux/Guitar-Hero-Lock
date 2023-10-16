function animateButton(element) {
    element.classList.add('flash-animation');

    setTimeout(() => {
        element.classList.remove('flash-animation');
    }, 500);
}
