import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { apiService } from "@/api/services";
import Loading from "@/components/Loading";
import { useTranslation } from "@/hooks/useTranslations";
import { Modal } from "react-bootstrap";

export default function GalleryItem() {

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    const { slugger } = useParams();
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const handleOpen = (photo) => setSelectedPhoto(photo);
    const handleClose = () => setSelectedPhoto(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        var fetchedData = (slugger === "random") ? apiService.getRandomGalleryItem() : apiService.getGalleryItem(slugger);
        fetchedData
            .then((res) => {
            if (res.success === true) {
                setCollection(res.data.item);
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

    return (
        <>
        <h1 className="ms-4">{collection.title} ({collection.photos.length} {t('gallery.detail.subtitle')})</h1>

        <div className="d-flex flex-wrap gap-3 mx-auto mt-4">
            {collection.photos.map((photo,index) => {
                return (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <button className="photo" type="button" onClick={() => handleOpen(photo)}>
                                <img id={"photo-"+(index+1)}
                                className="card-img-top"
                                src={apiUrl+'/uploads/photos/'+collection.slugger+'/'+photo.filename}
                                alt={photo.filename}
                                width={254}
                                max-height={381}
                                />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        <Modal show={!!selectedPhoto} onHide={handleClose} id="photoModal">
            <Modal.Header closeButton />
                <Modal.Body className="d-flex justify-content-center">
                {selectedPhoto && (
                    <img
                    src={apiUrl+'/uploads/photos/'+collection.slugger + "/" + selectedPhoto.filename}
                    alt={selectedPhoto.filename}
                    className="img-fluid"
                    />
                )}
                </Modal.Body>
        </Modal>
        </>
    );
}