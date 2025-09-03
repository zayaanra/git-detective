import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import { ThemeProvider  } from '@mui/material';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import BoltTwoToneIcon from '@mui/icons-material/BoltTwoTone';

import theme from '../theme';

export function TopBar() {
  return (
    <ThemeProvider theme={theme}>
        <AppBar sx={{bgcolor: "secondary.light", width: "100vw"}} position="static">
            <Toolbar>
                <SmartToyTwoToneIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography variant="h6" noWrap component="a"
                    sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'white',
                    textDecoration: 'none',
                    }}
                >
                    GitAbsorber
                </Typography>

                <Typography variant="h5" noWrap component="a" sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'white',
                    textDecoration: 'none',
                    }}
                >
                    GitAbsorber
                </Typography>
                <Box sx={{ flexGrow: 1 }}/>
                <Chip icon={<BoltTwoToneIcon color="white" />} sx={{ fontFamily: "Inter", bgcolor: "primary.dark", color: "white" }} label="Powered by AI"/>
            </Toolbar>
        </AppBar>
    </ThemeProvider>
  );
}