import { useState, useEffect } from "react";
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { Link, useSearchParams } from "react-router";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import { useTranslation } from "../hooks/useTranslations";

export default function VideosList() {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nbPages, setNbPages] = useState(null);
    const [limitOptions, setLimitOptions] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [options, setOptions] = useState([]);
    const { t } = useTranslation();

    const uploadsUrl = import.meta.env.VITE_API_URL + "/uploads/";
    const defaultThumbnailUrl = uploadsUrl + "defaults/default_thumbnail.jpg";

    useEffect(() => {
        var options = [];
        searchParams.forEach((value, key) => {
            options[key] = value;
        })
        setOptions(options);
        apiService
            .getVideos(options)
            .then((res) => {
            if (res.success === true) {
                var data = res.data;
                var apiVideos = Object.values(data.items);
                setVideos(apiVideos);
                setNbPages(data.nb_pages);
                setLimitOptions(Object.values(data.limitOptions));
                
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
    }, [searchParams]);

    if (loading) return <Loading/>;
    if (error)   return <p style={{ color: "red" }}>{error}</p>;
    if (videos.length === 0) return <p>{t('videos.list.empty_state')}</p>;


    return (
        <>
        <h1 className="ms-4">{t('videos.list.title')}</h1>
        <Filter limit={searchParams.get('limit') ?? '5'}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''}
            limitOptions={limitOptions} />
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
                                    <li className="video_tag">{t('videos.detail.empty_tags')}</li>
                                )}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>

        ({nbPages > 1 && <Pagination page={parseInt(searchParams.get('page')) ?? 1}
            nb_pages={nbPages}
            limit={parseInt(searchParams.get('limit')) ?? 5}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''} />})

        </>
    );
}