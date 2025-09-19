import { useState } from 'react';
import { 
    Typography, 
    TextField,
    ThemeProvider, 
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
import { BotMessage } from './BotMessage';

export function QA({ isConnected }) {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [history, setHistory] = useState([]);

    const askQuestion = async () => {
        if (!question.trim()) return;

        // add user message immediately
        setHistory((prev) => [...prev, { role: "user", text: question }]);
        const currentQuestion = question;
        setQuestion("");

        setIsLoading(true);
        try {
            console.log(currentQuestion);
            const res = await fetch("http://localhost:8000/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: currentQuestion }),
            });

            const data = await res.json();
            const answer = data.answer || "No response.";

            // add bot message
            setHistory((prev) => [...prev, { role: "bot", text: answer }]);
        } catch (err) {
            setHistory((prev) => [...prev, { role: "bot", text: "Error: " + err.message }]);
        }
        setIsLoading(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={3} sx={{ 
                textAlign: "center",
                width: 712,
                height: 710,
                border: 2,
                borderRadius: 5,
                borderColor: "white"
            }}>
                <Stack my={5} spacing={3} sx={{ alignItems: "center" }}>
                    <Typography variant="h4" sx={{
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
                            p: 2
                        }}
                    >
                        <List>
                            {history.map((msg, index) => (
                                <ListItem key={index} sx={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                    {msg.role === "user" 
                                        ? <UserMessage query={msg.text} /> 
                                        : <BotMessage answer={msg.text} />}
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
