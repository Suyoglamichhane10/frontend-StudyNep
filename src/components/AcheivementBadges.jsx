import React from 'react';

function AchievementBadges({ streak, totalHours, completedSubjects }) {
  const badges = [];

  if (streak >= 7) badges.push({ id: 1, name: '7-Day Warrior', icon: '🔥' });
  if (streak >= 30) badges.push({ id: 2, name: 'Legendary Streak', icon: '⚡' });
  if (totalHours >= 50) badges.push({ id: 3, name: '50 Hours Club', icon: '📚' });
  if (totalHours >= 100) badges.push({ id: 4, name: 'Century Club', icon: '💯' });
  if (completedSubjects >= 5) badges.push({ id: 5, name: 'Topic Master', icon: '✅' });

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '1rem',
      border: '1px solid #eef2f6'
    }}>
      <h3 style={{ color: '#1e3a8a', marginBottom: '0.8rem', fontSize: '1rem' }}>🏆 Your Achievements</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {badges.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Complete more studies to earn badges! 🎯</p>
        ) : (
          badges.map(badge => (
            <div key={badge.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: '#f1f5f9',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem'
            }}>
              <span>{badge.icon}</span>
              <span>{badge.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AchievementBadges;