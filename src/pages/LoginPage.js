import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User role not found. Please contact admin.');
      }

      const userData = userDoc.data();
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.displayName || user.email);
      localStorage.setItem('uid', user.uid);

      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setErrorMsg('No user found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setErrorMsg('Incorrect password. Please try again.');
      } else if (err.message.includes('offline')) {
        setErrorMsg('You are offline. Please check your connection.');
      } else {
        setErrorMsg(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/LoginPage.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
