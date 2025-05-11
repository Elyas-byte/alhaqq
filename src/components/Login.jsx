import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();
    const auth = getAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(`/`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (auth.currentUser != null) {
        navigate(`/`);
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-full">
            <div className="bg-black p-6 rounded-lg shadow-md w-96">
                <h2 className="text-lg font-semibold text-center">{t('login')}</h2>
                {error && <p className="text-white-500 px-3 py-2 rounded-lg text-sm bg-red-800">{error}</p>}
                <form onSubmit={handleLogin} className="my-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white-700" htmlFor="email">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="mt-1 block w-full bg-[#121212] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white-700" htmlFor="password">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="mt-1 block w-full bg-[#121212] border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-red-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-md text-white font-semibold ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                            } transition duration-200`}
                        disabled={loading}
                    >
                        {loading ? t('s_in') : t('login')}
                    </button>
                </form>
                <a className="block text-center mx-auto mt-4 text-blue-400 hover:underline cursor-pointer" onClick={()=> navigate("/signup")}>Dont't have an account?</a>
            </div>
        </div>
    );
};

export default Login;
