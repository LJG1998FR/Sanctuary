import { useState, useEffect } from "react";
import { Link, useParams } from 'react-router';
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { useTranslation } from "../hooks/useTranslations";
import { Modal } from "react-bootstrap";

export default function Tag() {

    const [tag, setTag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    const { slugger } = useParams();
    useEffect(() => {
        var fetchedData = (slugger === "random") ? apiService.getRandomTag() : apiService.getTag(slugger);
        fetchedData
            .then((res) => {
            if (res.success === true) {
                setTag(res.data.item);
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

    const uploadsUrl = import.meta.env.VITE_API_URL + "/uploads/";
    const defaultThumbnailUrl = uploadsUrl + "defaults/default_thumbnail.jpg";


    return (
        <>
        {tag.videos.length > 0 ? <h1 className="ms-4">{t('tags.detail.title', {'title': tag.name})}</h1>
        : <h1 className="ms-4">{t('tags.detail.empty_table', {'title': tag.name})}</h1> }

        <div id="card-container" className="d-flex flex-wrap gap-3 mx-auto mt-4">
            {tag.videos.length && tag.videos.map((video,index) => {
                const thumbnailSrc = video.thumbnailname
                ? `${uploadsUrl}thumbnails/${video.thumbnailname}`
                : defaultThumbnailUrl;
                return (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <Link to={`/videos/${video.slugger}`} className="thumbnail-link">
                                <img
                                className="card-img-top"
                                src={thumbnailSrc}
                                alt={video.title}
                                />
                            </Link>
                            <h5 className="card-title mt-2">{video.title}</h5>
                        </div>
                    </div>
                );
            })}
        </div>
        </>
    );
}