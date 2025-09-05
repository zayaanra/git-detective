import React, { useEffect, useState } from 'react';
import localforage from "localforage";
import Cookies from "js-cookie";

import {
    Alert,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    ThemeProvider,
    Tooltip,
    Typography,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import GitHubIcon from '@mui/icons-material/GitHub';
import TextField from '@mui/material/TextField';

import theme from '../theme';

const REGEX_PATTERN = /[A-Za-z]+\/[A-Za-z]+/i;

export function Connector({ onConnectionChange }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [repoID, setRepoID] = useState('');
    const [alert, setAlert] = useState({
        type: '',
        message: '',
    });

    const updateConnectionStatus = (connected) => {
        onConnectionChange(connected);
    };

    const validateRepositoryURL = (repoID) => {
        if(!repoID.trim()) {
            setAlert({ type: 'error', message: 'Repository cannot be empty. Please enter <username>/<repository>.' })
            // setAlert( values => {
            //     return {
            //         ...values, type: 'error', message: 'Repository cannot be empty. Please enter <username>/<repository>.'
            //     }
            // })
            return false;
        }
        
        if (!REGEX_PATTERN.test(repoID)) {
            setAlert({ type: 'error', message: 'Please enter a valid GitHub username and repository in the following format: <username>/<repository>' })
            // setAlert( values => {
            //     return {
            //         ...values, type: 'error', message: 'Please enter a valid GitHub username and repository in the following format: <username>/<repository>'
            //     }
            // })
            return false;
        }
        
        return true;
    }

    useEffect(() => {
        localforage.getItem("repository_info").then((data) => {
            if (data) {
                setIsConnected(true);
                updateConnectionStatus(true);
                setRepoID(data.id);
                setAlert({ type: 'success', message: `Connected to '${data.id}' successfully!` })
                // setAlert( values => {
                //     return {
                //         ...values, type: 'success', message: `Connected to '${data.id}' successfully!`
                //     }
                // });
            }
        })
    }, [])

    const handleRepoSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateRepositoryURL(repoID)) {
            return;
        }

        setIsLoading(true);

        let [owner, name] = repoID.split("/");

        const response = await fetch("http://localhost:8000/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            },
            body: JSON.stringify({ 
                owner: owner,
                name: name,
            }),
        });

        response.json().then((data) => {
            setIsLoading(false);

            if (response.status === 200) {
                localforage.setItem("repository_info", data.repository_info);
                setIsConnected(true);
                updateConnectionStatus(true);
                setAlert({ type: 'success', message: `Connected to '${repoID}' successfully!` })
                // setAlert( values => {
                //     return {
                //         ...values, type: 'success', message: `Connected to '${repoID}' successfully!`
                //     }
                // });

            } else if (response.status === 404) {
                setIsConnected(false);
                updateConnectionStatus(false);
                setAlert({ type: 'error', message: `GitHub Repository '${repoID}' not found. Please try again.` });
                // setAlert( values => {
                //     return {
                //         ...values, type: 'error', message: `GitHub Repository '${repoID}' not found. Please try again.`
                //     }
                // })
            }
        });

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
                    
                    <TextField
                    value={repoID}
                    onChange={(e) => setRepoID(e.target.value)}
                    placeholder="<username>/<repository>"
                    variant="outlined"
                    slotProps={{
                        input: {
                        startAdornment: (
                            <InputAdornment position="start">
                            <GitHubIcon />
                            </InputAdornment>
                        ),
                        },
                    }}
                    />

                    {alert.message && (
                        <Alert severity={alert.type} sx={{ textAlign: "left" }}>{alert.message}</Alert>
                    )}

                    <Button onClick={(e) => handleRepoSubmit(e)} loading={isLoading} sx={{ bgcolor: "primary.light"}} variant="contained" disableElevation>Connect to Repository</Button>
                </Stack>
            </Paper>
        </ThemeProvider>
    )
}