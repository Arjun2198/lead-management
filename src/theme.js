import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // ✅ Switch to light mode
    primary: {
      main: '#1F3A5F',
    },
    secondary: {
      main: '#3D5A80',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#666',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
