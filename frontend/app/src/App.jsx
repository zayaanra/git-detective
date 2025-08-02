import React, { useState } from 'react';
import { Header } from './components/Header/Header';
import { RepoInput } from './components/RepoInput/RepoInput';
import { QuestionInput } from './components/QuestionInput/QuestionInput';
import { ResponseDisplay } from './components/ResponseDisplay/ResponseDisplay';
import './App.css';

export default function App() {
  const [repository, setRepository] = useState('');
  const [isRepoConnected, setIsRepoConnected] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRepoSubmit = (repo) => {
    setIsLoading(true);
    // Simulate connecting to a repository
    setTimeout(() => {
      setRepository(repo);
      setIsRepoConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuestionSubmit = (q) => {
    setQuestion(q);
    setIsLoading(true);
    // Simulate LLM response
    setTimeout(() => {
      setResponse(
        `Here's information about ${repository} regarding "${q}". This is a simulated response that would come from an LLM analyzing the repository code.`
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <RepoInput onSubmit={handleRepoSubmit} isLoading={isLoading} />
        {isRepoConnected && (
          <>
            <div className="connected-info">
              Connected to:{' '}
              <span className="connected-repo">{repository}</span>
            </div>
            <QuestionInput
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
              disabled={!isRepoConnected}
            />
          </>
        )}
        {response && (
          <ResponseDisplay question={question} response={response} />
        )}
      </main>
    </div>
  );
}
