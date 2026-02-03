import './stimulus_bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';
import _ from 'lodash';

var currentURL = window.location.href;

// video page setup
if(currentURL.includes('watch') || currentURL.includes('videos/random')){
	//show length
	var video = document.querySelector('#course-video');
	var durationInfo = document.querySelector('.duration_info');
	var i = setInterval(function() {
		if(video.readyState > 0) {
			var minutes = parseInt(video.duration / 60, 10);
			var seconds = parseInt(video.duration % 60);

			durationInfo.innerHTML += `Duration: ${minutes}:`;
			seconds < 10 ? durationInfo.innerHTML += `0${seconds}` : durationInfo.innerHTML += `${seconds}`;

			clearInterval(i);
		}
	}, 200);
	
	//add listener for fullscreen

	video.addEventListener('click', () => {
		if(video.currentTime > 0.1){
			return;
		}
		var elem = document.documentElement;
		if (elem.requestFullscreen) {
			video.requestFullscreen();
		} else if (elem.mozRequestFullScreen) { /* Firefox */
			video.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			video.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
			video.msRequestFullscreen();
		}
	})

}
