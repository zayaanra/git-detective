import { useState } from 'react';

import { 
    Box, 
    Typography, 
    TextField,
    ThemeProvider, 
    Button,
    InputAdornment,
    Stack,
    Paper,
    Tooltip,
    IconButton,
    List,
    ListItem
} from "@mui/material";

import SendIcon from '@mui/icons-material/Send';

import theme from '../theme';

import { UserMessage } from './UserMessage';

export function QA({ isConnected }) {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [history, setHistory] = useState([]);

    const askQuestion = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            setResponse(data.answer || "No response.");

            setHistory((prev) => [...prev, question]);
            setQuestion("");
        } catch (err) {
            setResponse("Error: " + err.message);
        }
        setIsLoading(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={3} sx={{ 
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                width: 712,
                height: 710,
                border: 2,
                borderRadius: 5,
                borderColor: "white"
            }}>
                <Stack my={5} spacing={3} sx={{
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h4" 
                        sx={{
                            mb: 3,
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            color: 'primary.dark',
                        }}>
                        Ask a Question
                    </Typography>

                    <Paper elevation={1} 
                        sx={{
                            width: 690,
                            height: 500,
                            overflowY: "auto",
                            borderColor: "black"
                        }}
                    >
                        <List>
                            {history.map((value, index) => (
                                <ListItem key={index}>
                                    <UserMessage query={value} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <TextField 
                        label="Ask a question..." 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        multiline 
                        sx={{ width: 690 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Send">
                                        <IconButton onClick={askQuestion} disabled={isLoading}>
                                            <SendIcon />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
            </Paper>
        </ThemeProvider>
    );
}
