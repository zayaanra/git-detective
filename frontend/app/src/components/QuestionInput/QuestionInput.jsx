import React, { useState } from 'react';
import { SendIcon, LoaderIcon } from 'lucide-react';
import './QuestionInput.css';

export function QuestionInput({ onSubmit, isQuestionLoading, disabled }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  return (
    <div className="question-box">
      <h2 className="question-title">Ask about the repository</h2>
      <p className="question-subtext">
        What would you like to know about this codebase?
      </p>
      <form onSubmit={handleSubmit} className="question-form">
        <textarea
          className="question-textarea"
          placeholder="Example: Explain the architecture of this project, or How does the authentication system work?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={disabled || isQuestionLoading}
          required
        />
        <button
          type="submit"
          disabled={disabled || isQuestionLoading}
          className="question-button"
        >
          {isQuestionLoading ? (
            <>
              <LoaderIcon className="icon spin" />
              Analyzing...
            </>
          ) : (
            <>
              <SendIcon className="icon" />
              Ask Question
            </>
          )}
        </button>
      </form>
    </div>
  );
}
