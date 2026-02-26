
import { useAuth } from '../context/AuthContext';

export default function Navbar(){
  const {isAuthenticated} = useAuth();
  const appName = import.meta.env.VITE_APP_NAME;
  return <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between mx-3" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="{{path('dashboard')}}">{appName}</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="{{ path('admin_tag_index') }}">All Tags</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="{{path('admin_video_index')}}">All Videos</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="{{ path('admin_photo_collection_index') }}">Gallery</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" id="randomphoto" href="{{ path('admin_photo_random') }}">Random Photo</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" id="randomvideo" href="{{ path('admin_video_random') }}">Random Video</a>
              </li>
              {isAuthenticated && <li className="nav-item">
                  <a className="nav-link" href="{{ path('admin_logout') }}">Logout</a>
              </li>
              }
            </ul>
          </div>
        </nav>
}