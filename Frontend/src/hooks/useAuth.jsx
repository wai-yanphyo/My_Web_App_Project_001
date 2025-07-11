
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';


const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
           
            const storedUserEmail = localStorage.getItem('userEmail');
            const storedUserId = localStorage.getItem('userId');
            if (storedUserEmail && storedUserId) {
                setUser({ id: parseInt(storedUserId), email: storedUserEmail });
            }
        }
    }, [token]);

    
    const handleLogin = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.id); 
            setToken(data.token);
            setUser({ id: data.id, email: data.email });
            navigate('/');
        } catch (error) {
            throw error; 
        }
    };


    
    const handleRegister = async (credentials) => {
        try {
            const data = await registerUser(credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.id); 
            setUser({ id: data.id, email: data.email });
            navigate('/');
        } catch (error) {
        }
    };

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return { user, token, handleLogin, handleRegister, handleLogout };
};

export default useAuth;
