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

document.addEventListener('turbo:visit', () => {
	spinner.classList.replace('d-none', 'd-flex');
})

document.addEventListener('turbo:submit-start', () => {
	spinner.classList.replace('d-none', 'd-flex');
	console.log("chat")
})

document.addEventListener('turbo:load', () => {
	spinner.classList.replace('d-flex', 'd-none');
})