import {
    Avatar,
    ThemeProvider,
    Stack,
    Paper,
    Typography
} from "@mui/material";

import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';

import Markdown from 'react-markdown';

import theme from '../theme';

export function BotMessage({ answer }) {
    return (
        <ThemeProvider theme={theme}>
            <Stack direction="row" spacing={2} alignItems="flex-end">
                <Avatar>
                    <SmartToyTwoToneIcon />
                </Avatar>
                <Paper 
                    elevation={0} 
                    sx={{
                        bgcolor: "grey.300",
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        maxWidth: "60%",
                        wordBreak: "break-word"
                    }}
                >
                    <Typography variant="body1"><Markdown>{answer}</Markdown></Typography>
                </Paper>
            </Stack>
        </ThemeProvider>
    );
}
