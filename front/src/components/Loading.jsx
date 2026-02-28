

export default function Loading() {
    return (<div id="spinner" className="d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
    );
}