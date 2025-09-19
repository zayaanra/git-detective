import {
    Avatar,
    ThemeProvider,
    Stack,
    Paper,
    Typography
} from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import theme from '../theme';

export function UserMessage({ query }) {
    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row" spacing={2} alignItems="flex-end">
                <Paper 
                    elevation={0} 
                    sx={{
                        bgcolor: "primary.light",
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        maxWidth: "60%",
                        wordBreak: "break-word"
                    }}
                >
                    <Typography color="white" variant="body1">{query}</Typography>
                </Paper>
                <Avatar>
                    <AccountCircleIcon />
                </Avatar>
            </Stack>
        </ThemeProvider>
    );
}
