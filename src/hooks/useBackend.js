import { useCallback } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function useBackend() {
  // Fetch history from backend
  const fetchHistory = useCallback(async () => {
    const res = await fetch(`${BACKEND_URL}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    const data = await res.json();
    // Map backend history to match frontend format (no response/timestamp)
    return (data.history || []).map(item => ({
      id: item.id,
      question: item.question,
      response: item.answer || '',
      timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString() : ''
    }));
  }, []);

  // Ask a question to backend
  const askQuestion = useCallback(async (question) => {
    const res = await fetch(`${BACKEND_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }
    const data = await res.json();
    return {
      response: data.response,
      question_id: data.question_id,
    };
  }, []);

  return { fetchHistory, askQuestion };
}

export default useBackend; 