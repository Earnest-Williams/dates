import { useState } from 'react';
import { useGameStore } from '../state/store';
import { SOCIAL_MEDIA_CONTENT, SPONSORSHIP_TIERS, SOCIAL_MEDIA_CHALLENGES } from '../data/socialMedia';
import './SimstagramApp.css';

export default function SimstagramApp({ onClose }) {
  const { gameState, postSimstagram } = useGameStore();
  const { simstagram, needs, stats } = gameState;
  const [activeCategory, setActiveCategory] = useState('all');

  // Get unique categories from content
  const allCategories = ['all', ...new Set(SOCIAL_MEDIA_CONTENT.map(content => content.category))];
  
  // Filter content by category
  const filteredContent = activeCategory === 'all' 
    ? SOCIAL_MEDIA_CONTENT 
    : SOCIAL_MEDIA_CONTENT.filter(content => content.category === activeCategory);

  // Check if user meets stat requirements for a content type
  const meetsRequirements = (requirements) => {
    if (!requirements) return true;
    return Object.entries(requirements).every(([stat, weight]) => {
      const statValue = stats[stat] || 0;
      const requiredValue = weight * 100; // Convert 0-1 weight to 0-100 scale
      return statValue >= requiredValue;
    });
  };

  // Calculate viral chance display
  const getViralInfo = (content) => {
    if (!content.viralChance) return null;
    const baseChance = content.viralChance * 100;
    // Boost chance if user has high charisma
    const charismaBoost = Math.min(20, (stats.charisma || 0) * 0.2);
    const totalChance = Math.min(95, baseChance + charismaBoost);
    return `${totalChance.toFixed(0)}%`;
  };

  // Calculate next sponsorship threshold
  const getNextSponsorship = () => {
    const currentSponsorships = simstagram.sponsorships || [];
    const allTiers = Object.entries(SPONSORSHIP_TIERS);
    
    for (const [tierId, tier] of allTiers) {
      if (!currentSponsorships.includes(tierId) && simstagram.followers >= tier.followerReq) {
        return { tierId, ...tier };
      }
    }
    
    // If all sponsorships unlocked, return the highest tier info
    if (currentSponsorships.length === allTiers.length) {
      return { tierId: 'all_unlocked', name: 'All Sponsorships Unlocked!', followerReq: 0, passiveIncome: 0 };
    }
    
    // Find the next achievable tier
    const sortedTiers = allTiers.sort((a, b) => a[1].followerReq - b[1].followerReq);
    for (const [tierId, tier] of sortedTiers) {
      if (!currentSponsorships.includes(tierId)) {
        return { tierId, ...tier };
      }
    }
    return null;
  };

  const nextSponsorship = getNextSponsorship();
  const sponsorshipProgress = nextSponsorship && nextSponsorship.followerReq > 0 
    ? Math.min(100, (simstagram.followers / nextSponsorship.followerReq) * 100)
    : 0;

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
          <div>
            <div className="stat-value">{simstagram.posts.filter(p => p.viral).length}</div>
            <div className="stat-label">Viral</div>
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
        
        {nextSponsorship && nextSponsorship.followerReq > 0 && (
          <div className="sponsorship-progress" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>Next: {nextSponsorship.name}</span>
              <span style={{ fontSize: '0.85rem' }}>{Math.round(sponsorshipProgress)}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${sponsorshipProgress}%`, 
                  background: 'var(--neon-purple)'
                }}
              ></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {simstagram.followers.toLocaleString()} / {nextSponsorship.followerReq.toLocaleString()} followers
            </div>
          </div>
        )}
      </div>

      <hr />

      <div className="create-post">
        <h4>Create Post</h4>
        
        {/* Category Filter */}
        <div className="category-filter" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`btn-category ${activeCategory === category ? 'active' : ''}`}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: activeCategory === category ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: activeCategory === category ? 'var(--neon-purple)' : 'white',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="create-post-grid">
          {filteredContent.map(content => {
            const canAfford = needs.energy >= content.energyCost;
            const meetsReqs = meetsRequirements(content.statRequirements);
            const viralInfo = getViralInfo(content);
            const isDisabled = !canAfford || !meetsReqs;
            
            return (
              <button 
                key={content.id}
                disabled={isDisabled}
                onClick={() => postSimstagram(content.id, content.statRequirements, content.baseFollowers, content.energyCost)}
                className="btn-post-choice"
                title={!meetsReqs ? 'Stat requirements not met' : !canAfford ? 'Not enough energy' : viralInfo ? `Viral chance: ${viralInfo}` : ''}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="post-title">{content.name}</span>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                      +{content.baseFollowers} followers
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="post-cost">-{content.energyCost} ⚡</span>
                    {viralInfo && (
                      <div style={{ fontSize: '0.7rem', color: '#10b981' }}>
                        {viralInfo} viral
                      </div>
                    )}
                  </div>
                </div>
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
