
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
const { handleRegister } = useAuth(); 
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

//-----------------Hande Change Form ---------
const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };
//-------------------------------------------

//-------------Handle Submit-----------
const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await handleRegister(formValues);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

//-------------------------------------

    return (
        <Container maxWidth="xs" sx={{ mt: 8, mb: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                Register
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
                    sx={{ p: 1.5, textTransform: 'none' }}
                >
                {loading ? <CircularProgress size={24} /> : 'Register'}

                </Button>

                <Button
                    variant="text"
                    component={Link}
                    to="/login"
                    sx={{ textTransform: 'none' }}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;
