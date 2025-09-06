import { useEffect, useState } from 'react';
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
            return false;
        }
        
        if (!REGEX_PATTERN.test(repoID)) {
            setAlert({ type: 'error', message: 'Please enter a valid GitHub username and repository in the following format: <username>/<repository>' })
            return false;
        }
        
        return true;
    }

    useEffect(() => {
        if (Cookies.get('sessionID')) {
            setIsConnected(true);
            updateConnectionStatus(true);
            // TODO: Make request to restore session data to backend
        }
    }, []);

    const handleRepoSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateRepositoryURL(repoID)) {
            return;
        }

        setIsLoading(true);

        let [owner, name] = repoID.split("/");

        const response = await fetch("http://localhost:8000/connect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken") || "",
            },
            body: JSON.stringify({ 
                owner: owner,
                name: name,
            }),
            credentials: "include"
        });

        response.json().then((data) => {
            setIsLoading(false);
            if (response.status === 200) {
                setIsConnected(true);
                setAlert({ type: 'success', message: `Connected to '${repoID}' successfully!` })
                updateConnectionStatus(true);
            } else if (response.status === 404) {
                setIsConnected(false);
                setAlert({ type: 'error', message: `GitHub Repository '${repoID}' not found. Please try again.` });
                updateConnectionStatus(false);
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