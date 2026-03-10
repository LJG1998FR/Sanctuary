import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslations';
import Loading from "@/components/Loading";
export default function Register() {
    const { register }    = useAuth();
    const navigate     = useNavigate();
    const location     = useLocation();
    const from         = location.state?.from?.pathname ?? '/';

    const [username, setUsername]    = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error,    setError]    = useState(null);
    const [loading,  setLoading]  = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(username, password, confirmPassword);
            navigate('/login', { replace: true });
        } catch(error) {

            switch (error.status) {
                case 409:
                    setError(t('auth.register.error_username_taken'));
                    break;
                default:
                    setError(t('auth.register.error_server'));
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading/>;

    return (
        <form className="w-50 mx-auto mt-5 d-flex flex-column justify-content-center" style={{height: '560px'}} onSubmit={handleSubmit}>
            
            <legend>{t('auth.register.title')}</legend>
            <a href={'/login'}>{t('auth.register.link_login')}</a>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <fieldset className='mt-3'>
                <label htmlFor="username">{t('auth.register.label_username')}</label>
                <input className="form-control mb-4" type="username"  id='username'   value={username}    onChange={e => setUsername(e.target.value)}    placeholder="username"     required />
            </fieldset>

            <fieldset>
                <label htmlFor="password">{t('auth.register.label_password')}</label>
                <input className="form-control" type="password"  id='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
            </fieldset>

            <fieldset className='mt-3'>
                <label htmlFor="confirmpassword">{t('auth.register.label_password_confirm')}</label>
                <input className="form-control" type="password"  id='confirmpassword' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
            </fieldset>
            
            <button className="btn btn-dark mt-3" type="submit" disabled={loading}>
                {loading ? t('common.messages.loading') : t('auth.register.button_submit')}
            </button>
        </form>
    );
}