import { useState, useEffect } from "react";
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { Link, useParams, useSearchParams } from "react-router";
import Pagination from "../../components/Pagination";
import Filter from "../../components/Filter";
import { useTranslation } from "../../hooks/useTranslations";

export default function SearchPage(){
    const [videos, setVideos] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nbPages, setNbPages] = useState(null);
    const [limitOptions, setLimitOptions] = useState(null);
    const { searchValue } = useParams();
    const { t } = useTranslation();

    const uploadsUrl = import.meta.env.VITE_API_URL + "/uploads/";
    const defaultThumbnailUrl = uploadsUrl + "defaults/default_thumbnail.jpg";

    useEffect(() => {
        apiService
            .getSearchResults(searchValue)
            .then((res) => {
                if (res.success === true) {
                    var data = res.data;
                    var matchedVideos = Object.values(data.videos);
                    var matchedGallery = Object.values(data.gallery);
                    var matchedTags = Object.values(data.tags);
                    setVideos(matchedVideos);
                    setGallery(matchedGallery);
                    setTags(matchedTags);
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
    }, [searchValue]);

    if (loading) return <Loading/>;
    if (error)   return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
        <h2 className="ms-4 mt-3">{t('search.results.videos', {'nb_videos': videos.length})}</h2>
        <div className="d-flex flex-wrap mx-auto gap-2">
            {videos.length > 0 ? videos.map((video) => {
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
                                            <Link to={`/tags/${tag.slugger}`}>{tag.name}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="video_tag">{t('videos.detail.empty_tags')}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                );
            }) : <h3 className="ms-4 mt-3">{t('videos.list.empty_state')}</h3>}
        </div>

        <h2 className="ms-4 mt-3">{t('search.results.gallery', {'nb_collections': gallery.length})}</h2>
        <div className="d-flex flex-wrap mx-auto gap-2">
            {gallery.length > 0 ? gallery.map((collection) => {
                const coverSrc = collection.cover
                    ? `${uploadsUrl}covers/${collection.cover}`
                    : defaultThumbnailUrl;

                return (
                    <div className="card" key={collection.slugger}>
                        <div className="card-body">
                            <Link to={`/gallery/${collection.slugger}`} className="thumbnail-link">
                                <img
                                className="card-img-top"
                                src={coverSrc}
                                alt={collection.title}
                                />
                            </Link>
                            <h5 className="card-title mt-2">{collection.title}</h5>
                        </div>
                    </div>
                );
            }) : <h3 className="ms-4 mt-3">{t('gallery.list.empty_state')}</h3>}
        </div>

        <h2 className="ms-4 mt-3">{t('search.results.tags', {'nb_tags': tags.length})}</h2>
        <div className="d-flex flex-wrap gap-2 mb-3 ms-4">
            {tags.length > 0 ? tags.map((tag) => {

                return (
                    <Link to={`/tags/${tag.slugger}`} className="btn btn-dark" key={tag.slugger}>
                        <h5 className="card-title">{tag.name}</h5>
                    </Link>
                );
            }) : <h3 className="ms-4 mt-3">{t('tags.list.empty_state')}</h3>}
        </div>

        </>
    );
}