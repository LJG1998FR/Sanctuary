import { Link, useSearchParams } from "react-router";
import { useTranslation } from "../hooks/useTranslations";

export default function Filter({ limit, field, order, search, limitOptions, baseComponentPath} ){

    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(limit)
    const isDisabled = (option) => option === parseInt(limit);
    const buildSearch = (limit, search) => "?page=1&limit="+limit+"&field="+field+"&order="+order+"&search="+search;
    return(<div className="d-flex align-items-center ms-4 mb-4">
        <h4>{t('common.pagination.items_per_page')}</h4>
        <div className="btn-group ms-3" role="group">
         
            {limitOptions.map((option) => {
                return(<Link key={"option-"+option} className={`btn btn-dark pagination-option ${isDisabled(option) ? 'disabled' : ''}`} to={{pathname: baseComponentPath, search: buildSearch(option, search)}}>
                    {option}
                </Link>);
            })}
               
        </div>

        <div className="ms-3">
            <input type="search" className="form-control" placeholder={t('gallery.list.search_placeholder')} aria-label="Search" id="searchbar" autoComplete="off" onChange={e => updateSearch(e)}/>
        </div>
        
    </div>);

    async function updateParams (key, value) {
        setSearchParams(params => {
            params.set(key, value);
            return params;
        })
    }

    function updateSearch(e){
        var searchBar = document.getElementById('searchbar');
        updateParams('search', searchBar.value);
    }
}


