import React from 'react';
import { Typography, Container } from '@mui/material';

const Dashboard = () => {
  const userName = localStorage.getItem('userName') || 'User';
  const role = localStorage.getItem('userRole');

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Welcome, {userName}</Typography>
      <Typography variant="subtitle1" color="textSecondary">Role: {role}</Typography>
    </Container>
  );
};

export default Dashboard;
