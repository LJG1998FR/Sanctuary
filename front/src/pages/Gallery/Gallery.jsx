import { useState, useEffect } from "react";
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { Link, useSearchParams } from "react-router";
import Pagination from "../../components/Pagination";
import Filter from "../../components/Filter";
import { useTranslation } from "../../hooks/useTranslations";

export default function Gallery() {

    const [photoCollections, setPhotoCollections] = useState([]);
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
            .getGallery(options)
            .then((res) => {
            if (res.success === true) {
                var data = res.data;
                var apiphotoCollections = Object.values(data.items);
                setPhotoCollections(apiphotoCollections);
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
    if (photoCollections.length === 0) return <p>{t('gallery.list.empty_state')}</p>;


    return (
        <>
        <h1 className="ms-4">{t('gallery.list.title')}</h1>
        <Filter limit={searchParams.get('limit') ?? '5'}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''}
            limitOptions={limitOptions}
            baseComponentPath='/gallery' />
        <div id="card-container" className="d-flex flex-wrap mx-auto gap-2">
            {photoCollections.map((collection) => {
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
            })}
        </div>

        {nbPages > 1 && <Pagination page={searchParams.has('page') ? parseInt(searchParams.get('page')) : 1}
            nb_pages={nbPages}
            limit={searchParams.has('limit') ? parseInt(searchParams.get('limit')) : 5}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''}
            baseComponentPath='/gallery' />}

        </>
    );
}