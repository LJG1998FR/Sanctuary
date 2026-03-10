import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslations';
import Loading from "@/components/Loading";

export default function Login() {
    const { login }    = useAuth();
    const navigate     = useNavigate();
    const location     = useLocation();
    const from         = location.state?.from?.pathname ?? '/';

    const [username, setUsername]    = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState(null);
    const [loading,  setLoading]  = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(username, password);
            navigate(from, { replace: true });
        } catch {
            setError('Incorrect credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading/>;
    
    return (
        <form className="w-50 mx-auto mt-5 d-flex flex-column justify-content-center" style={{height: '560px'}} onSubmit={handleSubmit}>
            
            <legend>{t('auth.login.title')}</legend>
            <a href={'/register'}>{t('auth.login.link_register')}</a>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <fieldset className='mt-3'>
                <label htmlFor="username">{t('auth.login.label_username')}</label>
                <input className="form-control mb-4" type="username"  id='username'   value={username}    onChange={e => setUsername(e.target.value)}    placeholder="username"     required />
            </fieldset>

            <fieldset>
                <label htmlFor="password">{t('auth.login.label_password')}</label>
                <input className="form-control" type="password"  id='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
            </fieldset>
            
            <button className="btn btn-dark mt-3" type="submit" disabled={loading}>
                {loading ? t('common.messages.loading') : t('auth.login.button_submit')}
            </button>
        </form>
    );
}