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
        <form className="w-50 mx-auto mt-5 d-flex flex-column justify-content-center" style={{height: '560px'}} onSubmit={handleSubmit}>
            <h1>Log In</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label htmlFor="username">Username</label>
                <input className="form-control mb-4" type="username"  id='username'   value={username}    onChange={e => setUsername(e.target.value)}    placeholder="username"     required />

                <label htmlFor="password">Password</label>
                <input className="form-control" type="password"  id='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
            </div>
            
            <div>

            </div>
            
            <button className="btn btn-dark mt-3" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    );
}