import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';


const LoginPage = () => {
    
     const { handleLogin } = useAuth();
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

//-----------------handle Sumbit for Login-----------
     const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await handleLogin(formValues);
            
        } catch (err) {
            
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
//------------------------------------------------------------------------------

    

    return (
        <Container maxWidth="xs" sx={{ml:30,mt: 8, mb: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formValues.password}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                 {error && <Alert severity="error">{error}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{p: 1.5, textTransform: 'none' }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
                
                <Button
                    variant="text"
                    component={Link} 
                    sx={{ textTransform: 'none' }}
                >
                    Don't have an account? Register
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;
