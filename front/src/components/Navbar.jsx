
import { useAuth } from '@/context/AuthContext';
import { tokenStorage } from '@/api/client';
import { authApi } from '../api/auth';

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
                <a className="nav-link" href="/">{appName}</a>
              </li>
              {/* <li className="nav-item">
                  <a className="nav-link" href="/tags">All Tags</a>
              </li> */}
              <li className="nav-item">
                  <a className="nav-link" href="/videos">All Videos</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" href="/gallery">Gallery</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" id="randomphoto" href="/gallery/random">Random Collection</a>
              </li>
              <li className="nav-item">
                  <a className="nav-link" id="randomvideo" href="/videos/random">Random Video</a>
              </li>
              {isAuthenticated && <li className="nav-item">
                  <a className="nav-link" href="#" onClick={handleLogout}>Logout</a>
              </li>
              }
            </ul>
          </div>
        </nav>
}

function getRandomVideo(){}

function getRandomGalleryItem(){}

const handleLogout = async () => {
  authApi.logout();
  window.location.href = '/login';
};