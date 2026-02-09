import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';
import _ from 'lodash';

const spinner = document.getElementById('spinner');
spinner.style.height = document.documentElement.scrollHeight + 'px';

// launches when user visits a new URL
document.addEventListener('turbo:visit', () => {
	spinner.classList.replace('d-none', 'd-flex');
})

// launches when a form is submitted
document.addEventListener('turbo:submit-start', () => {
	spinner.classList.replace('d-none', 'd-flex');
})

// launchen when page is loaded
document.addEventListener('turbo:load', () => {
	spinner.classList.replace('d-flex', 'd-none');
})

// launches when user visits a new URL within a turbo-frame
document.addEventListener("turbo:frame-missing", (event) => {
	const { detail: { response, visit } } = event;
	event.preventDefault();
	visit(response.url);
});

// launches when a request is sent
document.addEventListener('turbo:before-fetch-request', () => {
	spinner.classList.replace('d-none', 'd-flex');
})

// launches when a response is received
document.addEventListener('turbo:before-fetch-response', () => {
	spinner.classList.replace('d-flex', 'd-none');
})