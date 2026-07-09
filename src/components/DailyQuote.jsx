import React, { useState, useEffect } from 'react';

const quotes = [
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Education is the most powerful weapon.", author: "Nelson Mandela" },
  { text: "Success is no accident. It is hard work.", author: "Pelé" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

function DailyQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem('dailyQuote');
    const savedDate = localStorage.getItem('quoteDate');

    if (savedQuote && savedDate === today) {
      setQuote(JSON.parse(savedQuote));
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      localStorage.setItem('dailyQuote', JSON.stringify(randomQuote));
      localStorage.setItem('quoteDate', today);
    }
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      borderRadius: '12px',
      padding: '0.8rem 1rem',
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'flex-start'
    }}>
      <span style={{ fontSize: '1.2rem' }}>💡</span>
      <div>
        <p style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '0.2rem', fontStyle: 'italic' }}>"{quote.text}"</p>
        <p style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 500 }}>— {quote.author}</p>
      </div>
    </div>
  );
}

export default DailyQuote;