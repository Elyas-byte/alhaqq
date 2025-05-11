import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountsContext } from '../context/AccountsContext';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Account = () => {
    const { t, i18n } = useTranslation();
    document.body.dir = i18n.dir();

    // Consume the AccountsContext to get visibility state
    const { isAccountsVisible, toggleAccountsVisibility } = useContext(AccountsContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toggleAccountsVisibility()
            console.log('User logged in successfully');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false)
        }
    };

    const popupStyle = {
        position: 'absolute',
        top: '75px',
        [i18n.dir() === 'rtl' ? 'left' : 'right']: '10px',
        zIndex: 9999,
        minWidth: '180px',
        padding: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const navigate = useNavigate()
    // Only render if isAccountsVisible is true
    if (!isAccountsVisible) return null;
    if (auth.currentUser != null) {
        const handleLogout = async () => {
            setLoading(true)
            try {
                await auth.signOut();
                console.log('User logged out');
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                setLoading(false)
            }
        };
    
        return (
            <div style={popupStyle} className='border-2 border-gray-100 flex justify-center'>
                <button 
                    onClick={handleLogout} 
                    className={`py-1 px-2 rounded-lg  m-1 ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                    } transition duration-200` } 
                    disabled={loading}
                >
                    <div className='flex'>
                    <img src={assets.logout} className='w-6 mr-1'/>{t('l_out')}
                    </div>
                </button>
            </div>
        );
    }
    
    return (
        <div style={popupStyle} className='border-2 border-gray-100 w-72'>
            <h1 className="text-center text-white text-2xl font-bold">{t('login')}</h1>
            <form onSubmit={handleLogin} className='flex flex-col items-center'>
                {error && <p className='bg-red-600 text-white p-1 rounded text-center'>{error}</p>}
                
                <div className="flex flex-col w-full">
                    <label className='m-1 ml-7 text-white'>{t('email')}</label>
                    <input
                        type="email"
                        value={email}
                        className='bg-[#121212] border-2 px-2 border-gray-100 rounded m-1 w-3/4 mx-auto' // Center the input field
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="flex flex-col w-full">
                    <label className='m-1 ml-7 text-white'>{t('password')}</label>
                    <input
                        type="password"
                        value={password}
                        className='bg-[#121212] border-2 px-2 border-gray-100 rounded m-1 w-3/4 mx-auto' // Center the input field
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className='flex justify-center m-1 mt-2'>
                    <button type="submit" className={`py-1 px-2 rounded-lg  m-1 ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                            } transition duration-200` } disabled={loading}><div className='flex'><img src={assets.login} className='w-6 mr-1'/>{loading ? t('s_in') :  t('login')}</div></button>
                    <button onClick={() => navigate(`/signup`)} className='py-1 px-2 bg-white hover:bg-gray-200 rounded-lg text-black m-1'>{t('signup')}</button>
                </div>
            </form>
        </div>
    );
};

export default Account;
