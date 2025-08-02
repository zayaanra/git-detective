import React, { useState } from 'react';
import { GithubIcon, LoaderIcon } from 'lucide-react';
import './RepoInput.css';

export function RepoInput({ onSubmit, isLoading }) {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onSubmit(repoUrl);
    }
  };

  return (
    <div className="repo-box">
      <h2 className="repo-title">Connect a GitHub Repository</h2>
      <p className="repo-subtext">
        Enter a GitHub repository URL to analyze its code and ask questions about it.
      </p>
      <form onSubmit={handleSubmit} className="repo-form">
        <div className="input-wrapper">
          <div className="input-icon">
            <GithubIcon className="icon icon-muted" />
          </div>
          <input
            type="text"
            className="repo-input"
            placeholder="github.com/username/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="repo-button"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="icon spin" />
              Connecting...
            </>
          ) : (
            'Connect Repository'
          )}
        </button>
      </form>
    </div>
  );
}
