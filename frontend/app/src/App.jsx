import { useState } from 'react';
import Cookies from "js-cookie";

import { 
  Box, 
  Container, 
  Connector, 
  Fade, 
  Stack 
} from "@mui/material";

import { TopBar } from './components/TopBar/TopBar';
import { Connector } from './components/Connector/Connector';
import { QA } from './components/QA/QA';

import './App.css';

export default function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

  const disconnectFromRepository = async () => {
    await fetch('http://localhost:8000/disconnect', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      credentials: "include",
    });
  }
  
  const handleConnectionChange = (connected) => {
    if (!connected) {
      disconnectFromRepository();
    }
    setIsConnected(connected);
  }

  return (
    <Stack spacing={15} alignItems="center">
      <TopBar />

      <Box>
        <Fade in={!isConnected} timeout={500} unmountOnExit mountOnEnter>
          <Box>
            <Connector onConnectionChange={handleConnectionChange} />
          </Box>
        </Fade>

        <Fade in={isConnected} timeout={500} unmountOnExit mountOnEnter>
          <Box>
            <QA onConnectionChange={handleConnectionChange}/>
          </Box>
        </Fade>
      </Box>

    </Stack>
  );
}