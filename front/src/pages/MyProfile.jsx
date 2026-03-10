import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslations';
import Loading from "@/components/Loading";

export default function MyProfile() {
    const { deleteUser, updateUser, user }    = useAuth();
    const navigate     = useNavigate();
    const location     = useLocation();
    const from         = location.state?.from?.pathname ?? '/';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error,    setError]    = useState(null);
    const [success,    setSuccess]    = useState(null);
    const [loading,  setLoading]  = useState(true);
    const { t } = useTranslation();


    useEffect(() => {
        setUsername(user.data.item.username);
        setLoading(false);
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            updateUser(user.data.item.username, password, confirmPassword)
            .then(() => {
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setSuccess(t('auth.profile.success_update'));
            })
            .catch((error) => {
                var dataError = JSON.parse(error.config.data);
                if(error.status == 400 && dataError.password !== dataError.confirmPassword){
                    setError(t('auth.profile.errors.different_passwords'));
                } else {
                    setError(t('auth.profile.error_server'));
                }
            })
            .finally(() => {
                setLoading(false);
            })
        } catch(error) {
            setError(t('auth.profile.error_server'));
        }
    };

    const handleDeleteUserSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await deleteUser(user.data.item.username);
            navigate('/login', { replace: true });
        } catch(error) {
            setError(t('auth.profile.error_server'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading/>;

    return (
        <>
        <form className="w-50 mx-auto mt-5 d-flex flex-column justify-content-center" style={{ height: '560px' }} onSubmit={handleSubmit}>

            <legend>{t('auth.profile.title')} - {username}</legend>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <fieldset>
                <label htmlFor="password">{t('auth.profile.label_password')}</label>
                <input className="form-control" type="password" id='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
            </fieldset>

            <fieldset className='mt-3'>
                <label htmlFor="confirmpassword">{t('auth.profile.label_confirm_password')}</label>
                <input className="form-control" type="password" id='confirmpassword' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
            </fieldset>

            <button className="btn btn-dark mt-3" type="submit" disabled={loading}>
                {loading ? t('common.messages.loading') : t('auth.profile.button_change_password')}
            </button>
        </form>
        <form className='ms-3' onSubmit={handleDeleteUserSubmit}>
            <button className="btn btn-danger" type="submit" disabled={loading}>
                {loading ? t('common.messages.loading') : t('auth.profile.button_delete_account')}
            </button>
        </form>
        </>
    );
}