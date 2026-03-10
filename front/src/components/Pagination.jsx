import { Link } from "react-router"
import { useTranslation } from "@/hooks/useTranslations";

export default function Pagination({ page, limit, nb_pages, field, order, search, baseComponentPath }){

    const pages = Array.from({ length: nb_pages }, (_, i) => i + 1);
    const buildSearch = (targetPage) => "?page="+targetPage+"&limit="+limit+"&field="+field+"&order="+order+"&search="+search;
    const { t } = useTranslation();

    return (<nav aria-label="List navigation">
        <ul className="pagination justify-content-center">
            <li className={(page == 1) ? 'page-item disabled' : 'page-item'}>
                <Link className="page-link" to={{pathname: baseComponentPath, search: buildSearch(page - 1)}} tabIndex="-1" aria-disabled={(page == 1) ? 'true' : 'false'}>{t('common.pagination.previous')}</Link>
            </li>
        

            {pages.map((index) => {
                return (<li key={index} className={(page === index) ? "page-item active" : "page-item"}>
                    <Link className="page-link" to={{ pathname: baseComponentPath, search: buildSearch(index) }}>
                        {index}
                    </Link>
                </li>)
            })}

            <li className={(page >= nb_pages) ? 'page-item disabled' : 'page-item'}>
                <Link className="page-link" to={{pathname: baseComponentPath, search: buildSearch(page + 1)}} aria-disabled={(page + 1 > nb_pages) ? 'true' : 'false'}>{t('common.pagination.next')}</Link>
            </li>
        </ul>
    </nav>);
}