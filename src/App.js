import React, { useState, useEffect } from 'react';
import './App.css';
import useBackend from './hooks/useBackend';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const { fetchHistory, askQuestion } = useBackend();

  useEffect(() => {
    fetchHistory()
      .then(backendHistory => {
        setHistory(backendHistory.reverse());
        setCurrentPage(0); // Reset to first page on new fetch
      })
      .catch(() => {}); // Optionally set error, but don't block UI
  }, [fetchHistory]);

  const handleSend = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { response: answer, question_id } = await askQuestion(question);
      setResponse(answer);
      setHistory(prev => [
        ...prev,
        {
          question,
          response: answer,
          id: question_id,
          timestamp: new Date().toLocaleString()
        }
      ]);
      setQuestion('');
    } catch (err) {
      setError(err.message);
      setResponse("Sorry, there was an error processing your question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="app-container">
      <h1>Tally Assistant – Demo</h1>
      
      <div className="chat-container">
        <div className="input-area">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask something..."
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {response && (
          <div className="response-area">
            <h3>Response:</h3>
            <p>{response}</p>
          </div>
        )}
        
        {history.length > 0 && (
          <div className="history-area">
            <h3>Previous Questions:</h3>
            <ul>
              {history.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE).map((item) => (
                <li key={item.id}>
                  <strong>Q:</strong> {item.question}<br />
                  <strong>A:</strong> {item.response}<br />
                  <small>{item.timestamp}</small>
                </li>
              ))}
            </ul>
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={(currentPage + 1) * ITEMS_PER_PAGE >= history.length}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;