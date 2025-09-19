import { useState } from 'react';
import Cookies from "js-cookie";

import { 
  Box, 
  Container, 
  Stack 
} from "@mui/material";

import { TopBar } from './components/TopBar/TopBar';
import { Connector } from './components/Connector/Connector';
import { QA } from './components/QA/QA';

import './App.css';

export default function App() {
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
    <Stack spacing={10} alignItems="center">
      <TopBar />

      {/* Side-by-side layout */}
      <Stack direction="row" spacing={6} alignItems="flex-start">
        <Box>
          <Connector onConnectionChange={handleConnectionChange} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <QA isConnected={isConnected} />
        </Box>
      </Stack>
    </Stack>
  );
}
