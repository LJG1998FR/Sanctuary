import { useState, useEffect } from "react";
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { Link } from "react-router";

export default function VideosList() {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const uploadsUrl = import.meta.env.VITE_API_URL + "/uploads/";
    const defaultThumbnailUrl = uploadsUrl + "defaults/default_thumbnail.jpg";

    useEffect(() => {
        apiService
            .getVideos()
            .then((res) => {
            if (res.success === true) {
                var apiVideos = Object.values(res.data.items)
                setVideos(apiVideos);
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
    }, []);

    if (loading) return <Loading/>;
    if (error)   return <p style={{ color: "red" }}>{error}</p>;
    if (videos.length === 0) return <p>No available data.</p>;


    return (
        <>
        <h1 className="ms-4">All Videos</h1>
        <div id="card-container" className="d-flex flex-wrap mx-auto gap-2">
            {videos.map((video) => {
                const thumbnailSrc = video.thumbnailname
                    ? `${uploadsUrl}thumbnails/${video.thumbnailname}`
                    : defaultThumbnailUrl;

                return (
                    <div className="card" key={video.slugger}>
                        <div className="card-body">
                            <Link to={`/videos/${video.slugger}`} className="thumbnail-link">
                                <img
                                className="card-img-top"
                                src={thumbnailSrc}
                                alt={video.title}
                                />
                            </Link>
                            <h5 className="card-title mt-2">{video.title}</h5>
                            <ul className="video_tags">
                                {video.tags && video.tags.length > 0 ? (
                                    video.tags.map((tag) => (
                                        <li key={tag.id} className="video_tag">
                                            <a href={`/tags/${tag.slugger}`}>{tag.name}</a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="video_tag">No tags</li>
                                )}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );
}