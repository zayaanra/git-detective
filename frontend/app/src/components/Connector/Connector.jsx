import React, { useState } from 'react';
import Cookies from "js-cookie";

import { InputAdornment, ThemeProvider } from "@mui/material";

import theme from '../theme';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from "@mui/material"
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import TextField from '@mui/material/TextField';


export function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [repoUrl, setRepoUrl] = useState('');

    const handleRepoSubmit = async (e) => {
        e.preventDefault();

        if (repoUrl.trim()) {
            setIsLoading(true);

            let link = repoUrl.split("/")

            const response = await fetch("http://localhost:8000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken") || "",
                },
                body: JSON.stringify({ 
                    owner: link[0],
                    name:  link[1],
                }),
            });

            response.json().then((data) => {
                setIsLoading(false);
                if (response.status === 400) {
                    // TODO: Repo not found - pop up component
                    setIsConnected(false);
                } else if (response.status === 200) {
                    setIsConnected(true);
                }
            });
        }
    };
    
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation="3" sx={{ 
                justifyContent: "center",
                alignItems: "center",
                width: 712,
                height: 350,
                border: 2,
                borderRadius: 5,
                borderColor: "white"
            }}>
                <Stack mx={10} my={5} spacing={2} textAlign="center">      
                    <Typography variant="h3"
                            sx={{
                            mb: 3,
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            color: 'primary.dark',
                            }}
                    >
                        Connect to a GitHub Repository
                    </Typography>
                    
                    {/* TODO: Enable regex for input: <username>/<repository>*/}
                    <TextField value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="username/repository" variant="outlined" slotProps={{
                        input: {
                            startAdornment:
                            <InputAdornment position="start">
                                <GitHubIcon aria-label="test"/>
                            </InputAdornment>
                        }
                    }}/>

                    <Button onClick={(e) => handleRepoSubmit(e)} loading={isLoading} sx={{ bgcolor: "primary.light"}} variant="contained" disableElevation>Connect to Repository</Button>

                </Stack>
            </Paper>
        </ThemeProvider>
    )
}