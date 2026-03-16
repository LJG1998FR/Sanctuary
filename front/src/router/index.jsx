import Home            from '@/pages/Home';
import Landing            from '@/pages/Landing';
import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute      from '@/components/ProtectedRoute';
import MyProfile from '../pages/Auth/MyProfile';
import Tag from '../pages/Tags/Tag';
import TagsList from '../pages/Tags/TagsList';
import Gallery from '../pages/Gallery/Gallery';
import GalleryItem from '../pages/Gallery/GalleryItem';
import VideoPlayer from '../pages/Videos/VideoPlayer';
import VideosList from '../pages/Videos/VideosList';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import GamesPage from '@/pages/Games/GamesPage';
import MemoryPage from '@/pages/Games/MemoryPage';
import PuzzlePage from '@/pages/Games/PuzzlePage';
import SearchPage from '../pages/Search/SearchPage';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/"                  element={<Home />} />
                <Route path="/videos"            element={ <VideosList />} />
                <Route path="/videos/:slugger"   element= {<VideoPlayer />} />
                <Route path="/gallery"           element={ <Gallery /> }/>
                <Route path="/gallery/:slugger"  element= {<GalleryItem />} />
                <Route path="/tags"            element={ <TagsList />} />
                <Route path="/tags/:slugger"            element={ <Tag />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/games"            element={ <GamesPage />} />
                <Route path="/games/puzzle"            element={ <PuzzlePage />} />
                <Route path="/games/memory"            element={ <MemoryPage />} />
                <Route path="/search/:searchValue"            element={ <SearchPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRouter;