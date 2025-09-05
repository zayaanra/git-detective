import Cookies from "js-cookie";

import React, { useState } from 'react';
import { Container } from "@mui/material";
import { Box, Stack } from "@mui/material";
import { Fade } from "@mui/material";
import { QuestionInput } from './components/QuestionInput/QuestionInput';
import { ResponseDisplay } from './components/ResponseDisplay/ResponseDisplay';
import { TopBar } from './components/TopBar/TopBar';
import { Connector } from './components/Connector/Connector';
import { QA } from './components/QA/QA';
import './App.css';
import localforage from "localforage";



export default function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnectionChange = (connected) => {
    if (!connected) {
      localforage.removeItem('repository_info');
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
