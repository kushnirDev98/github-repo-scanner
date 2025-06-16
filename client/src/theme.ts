import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        error: { main: '#d32f2f' },
    },
    typography: {
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
    },
});