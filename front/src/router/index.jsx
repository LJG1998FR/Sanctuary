import { createBrowserRouter, RouterProvider } from 'react-router';

import ProtectedRoute      from '@/components/ProtectedRoute';
import Login           from '@/pages/Login';
import Home            from '@/pages/Home';
import VideosList          from '@/pages/VideosList';
import VideoPlayer     from '@/pages/VideoPlayer';
import Gallery     from '@/pages/Gallery';
import GalleryItem from '@/pages/GalleryItem';

const router = createBrowserRouter([
    // Public routes
    {
        path: '/login',
        element: <Login />,
    },

    // Protected routes
    {
        element: <ProtectedRoute />,   // keeps the group
        children: [
            { index: true, path: '/',                            element: <Home /> },
            { path: '/videos',                                   element: <VideosList /> },
            { path: '/videos/:slugger',                               element: <VideoPlayer /> },
            { path: '/gallery',                              element: <Gallery /> },
            { path: '/gallery/:slugger',                          element: <GalleryItem /> },
        ],
    },

    // Resp 404
    {
        path: '*',
        element: <div>Not found. </div>
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}