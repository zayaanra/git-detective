import Cookies from "js-cookie";

import React, { useState } from 'react';
import { Container } from "@mui/material"
import { Stack } from "@mui/material"
import { QuestionInput } from './components/QuestionInput/QuestionInput';
import { ResponseDisplay } from './components/ResponseDisplay/ResponseDisplay';
import { TopBar } from './components/TopBar/TopBar';
import { Connector } from './components/Connector/Connector';
import './App.css';


export default function App() {
  const [repository, setRepository] = useState('');
  const [isRepoConnected, setIsRepoConnected] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);

  const handleRepoSubmit = async (repo) => {
    setIsRepoLoading(true);

    let link = repo.split("/")

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
      setIsRepoLoading(false);
      if (response.status === 400) {
        // TODO: Repo not found - pop up component
        setRepository('');
        setIsRepoConnected(false);
      } else if (response.status === 200) {
        setRepository(repo);
        setIsRepoConnected(true);
      }
    });
  };

  const handleQuestionSubmit = (q) => {
    setIsQuestionLoading(true);
    setQuestion(q);
    
    // Simulate LLM response
    setTimeout(() => {
      setResponse(
        `Here's information about ${repository} regarding "${q}". This is a simulated response that would come from an LLM analyzing the repository code.`
      );
      setIsQuestionLoading(false);
    }, 2000);
  };

  return (
  <Stack spacing={15} alignItems="center">
    <TopBar />
    <Connector />
  </Stack>
    

    // <div className="app-container">
    //   <Header />
    //   <main className="app-main">
    //     <RepoInput onSubmit={handleRepoSubmit} isRepoLoading={isRepoLoading} />
    //     {isRepoConnected && (
    //       <>
    //         <div className="connected-info">
    //           Connected to:{' '}
    //           <span className="connected-repo">{repository}</span>
    //         </div>
    //         <QuestionInput
    //           onSubmit={handleQuestionSubmit}
    //           isQuestionLoading={isQuestionLoading}
    //           disabled={!isRepoConnected}
    //         />
    //       </>
    //     )}
    //     {response && (
    //       <ResponseDisplay question={question} response={response} />
    //     )}
    //   </main>
    // </div>
  );
}
