import { useTranslation } from '../hooks/useTranslations';

export default function Home() {

    const { t } = useTranslation();
    const isLocal = import.meta.env.VITE_ENV === 'local';
    const homeImg = import.meta.env.VITE_API_URL + "/uploads/defaults/home.jpg";
    return (
        <>
            <h1 className='ms-4'>{import.meta.env.VITE_APP_NAME}</h1>
            <div className='d-flex flex-row'>
                <img src={homeImg} alt="Home Image"/>

                {isLocal && <p className='mx-4'>{t('home.local_description')}</p>}
                {!isLocal && <p className='mx-4'>{t('home.description')}</p>}
            </div>
        </>
    );
}