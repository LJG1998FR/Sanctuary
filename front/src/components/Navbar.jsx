
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { Link, useLocation } from "react-router";

export default function Navbar(){
	const {isAuthenticated} = useAuth();
	const location = useLocation();
  	const isActive = (path) => location.pathname === path;
	const appName = import.meta.env.VITE_APP_NAME;

	return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse justify-content-between mx-3" id="navbarNav">
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link className={isActive('/') ? 'nav-link active' : 'nav-link'} to="/">{appName}</Link>
					</li>
					{/* <li className="nav-item">
						<a className="nav-link" href="/tags">All Tags</a>
					</li> */}
					<li className="nav-item">
						<Link className={isActive('videos') ? 'nav-link active' : 'nav-link'} to="/videos">All Videos</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('gallery') ? 'nav-link active' : 'nav-link'} to="/gallery">Gallery</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" id="randomphoto" to="/gallery/random">Random Collection</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" id="randomvideo" to="/videos/random">Random Video</Link>
					</li>
					{isAuthenticated && <li className="nav-item">
						<Link className="nav-link" to="#" onClick={handleLogout}>Logout</Link>
					</li>
					}
				</ul>
			</div>
	</nav>)
}

function getRandomVideo(){}

function getRandomGalleryItem(){}

async function handleLogout() {
	try {
		await authApi.logout();
		window.location.href = '/login';	
	} catch (error) {
		console.error(error);
	}

};