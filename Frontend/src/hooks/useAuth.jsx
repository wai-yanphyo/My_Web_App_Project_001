
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
      const storedUserRole = localStorage.getItem('userRole');

      if (storedUserEmail && storedUserId && storedUserRole) {
        setUser({
          id: parseInt(storedUserId),
          email: storedUserEmail,
          role: storedUserRole,
        });
      }
    }
  }, [token]);

    
    const handleLogin = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userRole', data.role);
 
            setToken(data.token);
            setUser({ id: data.id, email: data.email,role: data.role });
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
            localStorage.setItem('userRole', data.role);

            setToken(data.token);
            setUser({ id: data.id, email: data.email,role: data.role });
            navigate('/');
        } catch (error) {
            throw error;

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
