import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: "Inter"
    },
    palette: {
        primary: {
            light: '#2B70FFff',
            main: '#F5FAFCff',
            dark: '#4B5E7Aff',
            contrastText: '#fff',
        },
        secondary: {
                light: '#16233Aff',
                main: '#CDD6E2ff',
                dark: '#4B5E7Aff',
                contrastText: '#fff',
        }
    },
});

export default theme;