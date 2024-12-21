let divLoad = document.createElement('div')
let divSpinner = document.createElement('div')
let body = document.querySelector('body')
divLoad.setAttribute('class', 'loader-container')
divSpinner.setAttribute('class', 'spinner')
divLoad.appendChild(divSpinner)
body.appendChild(divLoad)

const loaderContainer = document.querySelector('.loader-container');

window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
});