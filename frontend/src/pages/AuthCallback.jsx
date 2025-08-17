import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('authToken', token);
            navigate('/dashboard');
        } else {
            navigate('/?error=auth_failed');
        }
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Logging you in...
                </h1>
                <p className="text-gray-500 mt-2">Please wait a moment.</p>
            </div>
        </div>
    );
};

export default AuthCallback;