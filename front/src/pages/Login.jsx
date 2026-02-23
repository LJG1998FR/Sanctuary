import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login }    = useAuth();
    const navigate     = useNavigate();
    const location     = useLocation();
    const from         = location.state?.from?.pathname ?? '/';

    const [username, setUsername]    = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState(null);
    const [loading,  setLoading]  = useState(false);

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

    return (
        <form onSubmit={handleSubmit}>
            <h1>Connexion</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="username"    value={username}    onChange={e => setUsername(e.target.value)}    placeholder="username"     required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    );
}