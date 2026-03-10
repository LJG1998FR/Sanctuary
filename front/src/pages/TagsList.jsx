import { useState, useEffect } from "react";
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { Link, useSearchParams } from "react-router";
import Pagination from "../components/Pagination";
import Filter from "../components/Filter";
import { useTranslation } from "../hooks/useTranslations";

export default function TagsList() {

    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nbPages, setNbPages] = useState(null);
    const [limitOptions, setLimitOptions] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [options, setOptions] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        var options = [];
        searchParams.forEach((value, key) => {
            options[key] = value;
        })
        setOptions(options);
        apiService
            .getTags(options)
            .then((res) => {
            if (res.success === true) {
                var data = res.data;
                var apiTags = Object.values(data.items);
                setTags(apiTags);
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
    if (tags.length === 0) return <p>{t('tags.list.empty_state')}</p>;


    return (
        <>
        <h1 className="ms-4">{t('tags.list.title')}</h1>
        <Filter limit={searchParams.get('limit') ?? '5'}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''}
            limitOptions={limitOptions}
            baseComponentPath='/tags' />
        <div id="card-container" className="d-flex justify-content-center flex-wrap gap-2">
            {tags.map((tag) => {

                return (
                    <Link to={`/tags/${tag.slugger}`} className="btn btn-dark" key={tag.slugger}>
                        <h5 className="card-title">{tag.name}</h5>
                    </Link>
                );
            })}
        </div>

        ({nbPages > 1 && <Pagination page={parseInt(searchParams.get('page')) ?? 1}
            nb_pages={nbPages}
            limit={parseInt(searchParams.get('limit')) ?? 5}
            field={searchParams.get('field') ?? 'title'}
            order={searchParams.get('order') ?? 'ASC'}
            search={searchParams.get('search') ?? ''}
            baseComponentPath='/tags' />})

        </>
    );
}