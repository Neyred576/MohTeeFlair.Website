import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, label }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeKeys = Object.keys(timeLeft);
  if (timeKeys.length === 0) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
      <h3 style={{ color: 'var(--rg-gold)', marginBottom: '16px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{label}</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        {timeKeys.map((interval) => (
          <div key={interval} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>
              {timeLeft[interval].toString().padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
              {interval}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
