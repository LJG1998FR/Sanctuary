import Login           from '@/pages/Login';
import Home            from '@/pages/Home';
import { Navigate, Route, Routes } from 'react-router';
import VideosList          from '@/pages/VideosList';
import VideoPlayer     from '@/pages/VideoPlayer';
import Gallery     from '@/pages/Gallery';
import GalleryItem from '@/pages/GalleryItem';
import ProtectedRoute      from '@/components/ProtectedRoute';
import Landing from '../pages/Landing';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/"                  element={<Home />} />
                <Route path="/videos"            element={ <VideosList />} />
                <Route path="/videos/:slugger"   element= {<VideoPlayer />} />
                <Route path="/gallery"           element={ <Gallery /> }/>
                <Route path="/gallery/:slugger"  element= {<GalleryItem />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRouter;