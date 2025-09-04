import React, { useState } from 'react';
import Cookies from "js-cookie";

import {
    Alert,
    Button,
    InputAdornment,
    Paper,
    Stack,
    ThemeProvider,
    Typography,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import TextField from '@mui/material/TextField';

import theme from '../theme';

const REGEX_PATTERN = /[A-Za-z]+\/[A-Za-z]+/i;

export function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [repoUrl, setRepoUrl] = useState('');
    const [alert, setAlert] = useState({
        type: '',
        message: '',
    });

    const handleRepoSubmit = async (e) => {
        e.preventDefault();

        if(!repoUrl.trim()) {
            setAlert( values => {
                return {
                    ...values, type: 'error', message: 'Repository cannot be empty. Please enter <username>/<repository>.'
                }
            })
            return;
        }
        
        if (!REGEX_PATTERN.test(repoUrl)) {
            setAlert( values => {
                return {
                    ...values, type: 'error', message: 'Please enter a valid GitHub username and repository in the following format: <username>/<repository>'
                }
            })
            return;
        }

        if (repoUrl.trim()) {
            setIsLoading(true);
            
            let components = repoUrl.split("/")

            const response = await fetch("http://localhost:8000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken") || "",
                },
                body: JSON.stringify({ 
                    owner: components[0],
                    name:  components[1],
                }),
            });

            response.json().then((data) => {
                setIsLoading(false);
                if (response.status === 200) {
                    setIsConnected(true);
                    setAlert( values => {
                        return {
                            ...values, type: 'success', message: `Connected to '${repoUrl}' successfully!`
                        }
                    })
                } else if (response.status === 404) {
                    setIsConnected(false);
                    setAlert( values => {
                        return {
                            ...values, type: 'error', message: `GitHub Repository '${repoUrl}' not found. Please try again.`
                        }
                    })
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
                height: 400,
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
                    
                    <TextField value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="<username>/<repository>" variant="outlined" slotProps={{
                        input: {
                            startAdornment:
                            <InputAdornment position="start">
                                <GitHubIcon aria-label="test"/>
                            </InputAdornment>
                        }
                    }}/>

                    {alert.message && (
                        <Alert severity={alert.type} sx={{ textAlign: "left" }}>{alert.message}</Alert>
                    )}

                    <Button onClick={(e) => handleRepoSubmit(e)} loading={isLoading} sx={{ bgcolor: "primary.light"}} variant="contained" disableElevation>Connect to Repository</Button>

                </Stack>
            </Paper>
        </ThemeProvider>
    )
}