import React, { useState, useEffect } from 'react';
import './App.css';  // Assuming we have some basic styling

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history from backend on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8000/history');
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        // Map backend history to match frontend format (no response/timestamp)
        const backendHistory = (data.history || []).map(item => ({
          id: item.id,
          question: item.question,
          response: item.answer || '',
          timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString() : ''
        }));
        setHistory(backendHistory);
      } catch (err) {
        // Optionally set error, but don't block UI
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data.response);
      
      // Add to history
      setHistory(prev => [
        ...prev,
        {
          question,
          response: data.response,
          id: data.question_id,
          timestamp: new Date().toLocaleString()
        }
      ]);
      
      setQuestion('');  // Clear input after sending
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
              {history.map((item) => (
                <li key={item.id}>
                  <strong>Q:</strong> {item.question}<br />
                  <strong>A:</strong> {item.response}<br />
                  <small>{item.timestamp}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;