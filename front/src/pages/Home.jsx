import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '../hooks/useTranslations';
function Greeting({username}) {

    const { t } = useTranslation();
    const isLocal = import.meta.env.VITE_ENV === 'local';
    return (
        <>
            <h1 className='ms-4'>{import.meta.env.VITE_APP_NAME}</h1>
            {isLocal && <div className='ms-4'>{t('home.local_description')}</div>}
            {!isLocal && <div className='ms-4'>{t('home.description')}</div>}
        </>
    );
}

export default function Home() {
    const {user} = useAuth();
    return <Greeting username={user.data.item.username}/>
}
