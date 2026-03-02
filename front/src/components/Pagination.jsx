import { Link } from "react-router"

export default function Pagination({ page, limit, nb_pages, field, order, search }){

    const pages = Array.from({ length: nb_pages }, (_, i) => i + 1);
    const buildSearch = (targetPage) => "?page="+targetPage+"&limit="+limit+"&field="+field+"&order="+order+"&search="+search;

    return (<nav aria-label="List navigation">
        <ul className="pagination justify-content-center">
            <li className={(page == 1) ? 'page-item disabled' : 'page-item'}>
                <Link className="page-link" to={{pathname: '/videos', search: buildSearch(page - 1)}} tabIndex="-1" aria-disabled={(page == 1) ? 'true' : 'false'}>Previous</Link>
            </li>
        

            {pages.map((index) => {
                return (<li key={index} className={(page === index) ? "page-item active" : "page-item"}>
                    <Link className="page-link" to={{ pathname: "/videos", search: buildSearch(index) }}>
                        {index}
                    </Link>
                </li>)
            })}

            <li className={(page >= nb_pages) ? 'page-item disabled' : 'page-item'}>
                <Link className="page-link" to={{pathname: '/videos', search: buildSearch(page + 1)}} aria-disabled={(page + 1 > nb_pages) ? 'true' : 'false'}>Next</Link>
            </li>
        </ul>
    </nav>);
}