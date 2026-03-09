import Navbar from './components/Navbar';
import { BrowserRouter} from 'react-router';
import AppRouter from './router';
import { useTranslation } from '@/hooks/useTranslations';

function App() {
    // set document title
    const { t } = useTranslation();
    document.title = import.meta.env.VITE_APP_NAME ?? "App Name";
    return (
        <div>
            <BrowserRouter>
                <Navbar/>
                <AppRouter />
            </BrowserRouter>
        </div>
    );
}

export default App;