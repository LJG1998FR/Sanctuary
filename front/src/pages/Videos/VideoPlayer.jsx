import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { useTranslation } from "../../hooks/useTranslations";

export default function VideoPlayer() {

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const uploadsUrl = import.meta.env.VITE_API_URL + "/uploads/";
    const { slugger } = useParams(); 
    useEffect(() => {
        var fetchedData = (slugger === "random") ? apiService.getRandomVideo() : apiService.getVideo(slugger)
        fetchedData
            .then((res) => {
            if (res.success === true) {
                setVideo(res.data.item);
                setVideoControls();
            } else {
                setError("Cannot fetch data.");
            }
            })
            .catch((err) => {
                setError("Error : " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slugger]);

    if (loading) return <Loading/>;
    if (error)   return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
        <h1 className="ms-4">{t('videos.detail.title', {title: video.title})} (<span className="duration_info">{t('videos.detail.label_duration')}</span>)</h1>
        <div id="card-container" className="d-flex flex-wrap mx-auto gap-2">
            <video id="course-video" width="100%" controls>
                <source src={uploadsUrl + 'videos/' + video.filename} type="video/mp4" />
            </video>
        </div>
        </>
    );
}


function setVideoControls(){
    //show length
    var video = document.querySelector('#course-video');
    var durationInfo = document.querySelector('.duration_info');
    if(!video){return;}
    var i = setInterval(function() {
        if(video.readyState > 0) {
            var minutes = parseInt(video.duration / 60, 10);
            var seconds = parseInt(video.duration % 60);

            durationInfo.innerHTML += ` : ${minutes}:` + (seconds < 10 ? `0${seconds}` : `${seconds}`);
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