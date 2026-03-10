
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { Link, replace, useLocation, useNavigate } from "react-router";
import { useTranslation } from '../hooks/useTranslations';
import { apiService } from '../api/services';
import { useEffect, useState } from 'react';

export default function Navbar(){
	const {isAuthenticated} = useAuth();
	const location = useLocation();
  	const isActive = (path) => location.pathname === path;
	const appName = import.meta.env.VITE_APP_NAME;
	const { t } = useTranslation();
	const [randomVideoSlugger, setRandomVideoSlugger] = useState('');

	useEffect(() => {
		try {
			apiService.getRandomVideo()
			.then((res) => {
				var data = res.data;
				if(data.success === true){
					setRandomVideoSlugger(data.item.slugger);
					console.log(randomVideoSlugger)
				}
			})

		} catch (error) {
			
		}

	}, [randomVideoSlugger])

	return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse justify-content-between mx-3" id="navbarNav">
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link className={isActive('/') ? 'nav-link active' : 'nav-link'} to="/">{appName}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/tags') ? 'nav-link active' : 'nav-link'} to="/tags">{t('common.navigation.tags')}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/videos') ? 'nav-link active' : 'nav-link'} to="/videos">{t('common.navigation.videos')}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/gallery') ? 'nav-link active' : 'nav-link'} to="/gallery">{t('common.navigation.gallery')}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/gallery/random') ? 'nav-link active' : 'nav-link'} id="randomcollection" to="/gallery/random">{t('common.navigation.gallery_random')}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/videos/random') ? 'nav-link active' : 'nav-link'} id="randomvideo" to="/videos/random">{t('common.navigation.video_random')}</Link>
					</li>
					<li className="nav-item">
						<Link className={isActive('/tags/random') ? 'nav-link active' : 'nav-link'} id="randomtag" to="/tags/random">{t('common.navigation.tag_random')}</Link>
					</li>
					{isAuthenticated && <li className="nav-item">
						<Link className={isActive('/my-profile') ? 'nav-link active' : 'nav-link'} to="/my-profile">{t('common.navigation.profile')}</Link>
					</li>}
					{isAuthenticated && <li className="nav-item">
						<Link className="nav-link" to="#" onClick={handleLogout}>{t('common.navigation.logout')}</Link>
					</li>
					}
				</ul>
			</div>
	</nav>)
}

async function handleLogout() {
	try {
		await authApi.logout();
		window.location.href = '/login';	
	} catch (error) {
		console.error(error);
	}
};