import React from 'react';
import { useGameStore } from '../state/store';
import { SOCIAL_MEDIA_CONTENT, SPONSORSHIP_TIERS } from '../data/socialMedia';
import './SimstagramApp.css';

export default function SimstagramApp({ onClose }) {
  const { gameState, postSimstagram } = useGameStore();
  const { simstagram, stats, needs } = gameState;

  return (
    <div className="simstagram-app">
      <div className="app-header">
        <h2>Simstagram</h2>
        <button onClick={onClose} aria-label="Close Simstagram">X</button>
      </div>

      <div className="profile-section">
        <h3>@{gameState.family.playerName}</h3>
        <div className="stats-row">
          <div>
            <div className="stat-value">{simstagram.posts.length}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div>
            <div className="stat-value">{simstagram.followers.toLocaleString()}</div>
            <div className="stat-label">Followers</div>
          </div>
        </div>
        
        {simstagram.activeBuffs.length > 0 && (
          <div className="buffs-list">
            <span>🔥</span> Active Buffs: {simstagram.activeBuffs.join(', ')}
          </div>
        )}
      </div>

      <hr />

      <div className="sponsorships">
        <h4>Sponsorships</h4>
        {simstagram.sponsorships.length === 0 ? (
          <p className="no-matches-msg">No sponsorships yet. Get more followers!</p>
        ) : (
          <ul>
            {simstagram.sponsorships.map(s => (
              <li key={s}>
                <span>{SPONSORSHIP_TIERS[s].name}</span>
                <span>+${SPONSORSHIP_TIERS[s].passiveIncome}/wk</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />

      <div className="create-post">
        <h4>Create Post</h4>
        <div className="create-post-grid">
          {SOCIAL_MEDIA_CONTENT.map(content => {
            const canAfford = needs.energy >= content.energyCost;
            return (
              <button 
                key={content.id}
                disabled={!canAfford}
                onClick={() => postSimstagram(content.id, content.statRequirements, content.baseFollowers, content.energyCost)}
                className="btn-post-choice"
              >
                <span className="post-title">{content.name}</span>
                <span className="post-cost">-{content.energyCost} Energy</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr />

      <div className="feed">
        <h4>Recent Activity</h4>
        {simstagram.posts.length === 0 ? (
          <p className="no-matches-msg">No posts yet.</p>
        ) : (
          <ul className="feed-list">
            {simstagram.posts.map((post, i) => (
              <li key={i} className={`feed-item ${post.viral ? 'viral' : ''}`}>
                <strong>{post.timestamp}</strong> - Posted <em>{post.type}</em>. 
                <span className="gain-tag"> +{post.followersGained.toLocaleString()} followers</span>
                {post.viral && <span className="viral-label">🔥 VIRAL</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
