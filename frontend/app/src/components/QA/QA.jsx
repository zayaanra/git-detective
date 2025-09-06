import { useState } from "react";
import Cookies from "js-cookie";

import { 
    Box, 
    Divider, 
    IconButton, 
    InputAdornment, 
    List, 
    ListItem, 
    Paper, 
    Stack, 
    TextField, 
    ThemeProvider, 
    Tooltip, 
    Typography 
} from "@mui/material";

import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel'

import theme from '../theme';

export function QA({ onConnectionChange }) {
    const [items, setItems] = useState([]);
    const [question, setQuestion] = useState('');
    
    const handleQuery = async (e) => {
        // if (!items.length || items[items.length - 1] !== "New Answer") {
        //     setItems([...items, `Answer ${items.length + 1}`]);
        // }

        const response = await fetch("http://localhost:8000/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            },
            credentials: "include",
            body: JSON.stringify({ 
                text: question,
            }),
        });

        response.json().then((data) => {
            console.log(data);
        })
    };
    
    return (
        <ThemeProvider theme={theme}>
        <Paper elevation={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                height: 512,
                width: 764,
                borderRadius: 5,
                minHeight: 200,
                p: 3
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <Typography variant="h3" sx={{ fontFamily: "monospace" }}>
                    Ask me anything!
                </Typography>
                <Divider sx={{ width: "100%", my: 1 }} />
            </Box>

            <TextField value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question..." multiline maxRows={Infinity}
                sx={{ width: 500 }}
                slotProps={{
                    input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title="Send">
                                <IconButton onClick={(e) => handleQuery(e)} sx={{ color: "primary.light" }}>
                                    <SendIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Disconnect from repository">
                                <IconButton onClick={() => onConnectionChange(false)} sx={{ color: "red"}}>
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                        ),
                    },
                }}
                />
        </Paper>
        </ThemeProvider>

        // <ThemeProvider theme={theme}>
        //     <Stack
        //     spacing={5}
        //     sx={{
        //         justifyContent: "center",
        //         alignItems: "center",
        //     }}
        //     >

        //     <Typography
        //         variant="h1"
        //         sx={{
        //         fontFamily: "Inter",
        //         fontSize: 64,
        //         }}
        //     >
        //         <TypeAnimation
        //         sequence={["What can I help you with?"]}
        //         speed={50}
        //         cursor={false}
        //         />
        //     </Typography>

        //     <Paper elevation={0}
        //         sx={{
        //             p: 2,
        //             width: 700,
        //             height: 500,
        //             maxHeight: 300,
        //             overflowY: "auto",
        //             borderRadius: 2,
        //             border: "3px solid black",
        //             bgcolor: "primary.dark"
        //         }}
        //     >
        //         <List>
        //         {items.map((item, index) => (
        //             <ListItem key={index} sx={{ py: 0 }}>
        //             {item}
        //             </ListItem>
        //         ))}
        //         </List>
        //     </Paper>

        //     <TextField
        //         placeholder="Ask a question..."
        //         multiline
        //         maxRows={Infinity}
        //         sx={{ width: 500 }}
        //         slotProps={{
        //         input: {
        //             endAdornment: (
        //             <InputAdornment position="end">
        //                 <Tooltip title="Send">
        //                 <IconButton onClick={handleSend}>
        //                     <SendIcon />
        //                 </IconButton>
        //                 </Tooltip>
        //                 <Tooltip title="Disconnect from repository" color="error">
        //                 <IconButton onClick={() => updateConnectionStatus(false)}>
        //                     <CancelIcon />
        //                 </IconButton>
        //                 </Tooltip>
        //             </InputAdornment>
        //             ),
        //         },
        //         }}
        //     />

        //     <Typography variant="h6"
        //         sx = {{
        //             fontFamily: "Inter"
        //         }}
        //         >
        //             connected to: 
        //         </Typography>

        //     </Stack>         
        // </ThemeProvider>

    );
}
