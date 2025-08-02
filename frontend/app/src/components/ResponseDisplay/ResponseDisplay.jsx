import React from 'react';
import { MessageSquareIcon } from 'lucide-react';
import './ResponseDisplay.css';

export function ResponseDisplay({ question, response }) {
  return (
    <div className="response-container">
      <h2 className="response-title">Response</h2>

      <div className="question-box">
        <div className="content-row">
          <div className="icon-bg question-icon-bg">
            <MessageSquareIcon className="icon question-icon" />
          </div>
          <div>
            <p className="label question-label">Your question:</p>
            <p className="text question-text">{question}</p>
          </div>
        </div>
      </div>

      <div className="answer-box">
        <div className="content-row">
          <div className="icon-bg answer-icon-bg" aria-hidden="true">
            <svg
              className="icon answer-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V12M12 16H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="label answer-label">AI Response:</p>
            <p className="text answer-text" style={{ whiteSpace: 'pre-line' }}>
              {response}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
