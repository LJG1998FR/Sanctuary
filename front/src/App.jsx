import Navbar from './components/Navbar';
import { BrowserRouter} from 'react-router';
import AppRouter from './router';

function App() {
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