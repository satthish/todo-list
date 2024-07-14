import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';

const Login: React.FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
 // Use the base URL from environment variables
 const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
      dispatch(setCredentials({ token: response.data.token, user: email }));
      router.push('/todo');
    } catch (error) {
      console.error('Failed to login:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
      }}
    >
      <Card sx={{ width: '100%', padding: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link href="/" variant="body2">
              Register
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
