import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        //show length
        var video = this.element.querySelector('#course-video');
        var durationInfo = this.element.querySelector('.duration_info');
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
}