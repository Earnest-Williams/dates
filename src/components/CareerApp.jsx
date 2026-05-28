import { useState } from 'react';
import { useGameStore } from '../state/store';
import { getProjectsForTrackAndTier, CAREER_TRACKS } from '../data/projects';
import { gigs, sideHustles } from '../data/gigs';
import './CareerApp.css';

export default function CareerApp({ onClose }) {
  const { gameState, startProject, workOnProject, takeGig, switchTrack } = useGameStore();
  const { activeTrack, currentProject, projectProgress, promotionPoints, titleLevel, gigReputation } = gameState.career;
  const { energy } = gameState.needs;
  const stats = gameState.stats;

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'gigs', 'hustles', 'tracks'

  const trackData = CAREER_TRACKS[activeTrack];
  const currentTitle = trackData?.levels.find(t => t.level === titleLevel);
  const nextTitle = trackData?.levels.find(t => t.level === titleLevel + 1);
  const availableProjects = trackData ? getProjectsForTrackAndTier(activeTrack, titleLevel) : [];

  return (
    <div className="career-app animate-fade-in glass-panel">
      <div className="career-header">
        <h2>Career Hub</h2>
        <button onClick={onClose} className="btn-close-career">Close</button>
      </div>

      {trackData && currentTitle && (
        <div className="career-title-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{trackData.name}</h3>
            <span style={{ opacity: 0.8 }}>Level {titleLevel}: {currentTitle.title}</span>
          </div>
          {nextTitle ? (
            <div className="promotion-stats">
              <div className="promotion-points-label">
                <span>Promotion Progress</span>
                <span>{promotionPoints} / {nextTitle.reqPoints} Pts</span>
              </div>
              <progress value={promotionPoints} max={nextTitle.reqPoints}></progress>
              <span className="promotion-next-level">Next Role: {nextTitle.title}</span>
            </div>
          ) : (
            <div className="max-level-badge">
              <span>🏆</span> Maximum Career Level Reached!
            </div>
          )}
        </div>
      )}

      <div className="career-tabs" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', color: activeTab === 'projects' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'projects' ? '2px solid var(--neon-blue)' : 'none' }}>Projects</button>
        <button className={`tab-btn ${activeTab === 'gigs' ? 'active' : ''}`} onClick={() => setActiveTab('gigs')} style={{ background: 'none', border: 'none', color: activeTab === 'gigs' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'gigs' ? '2px solid var(--neon-blue)' : 'none' }}>Freelance Gigs</button>
        <button className={`tab-btn ${activeTab === 'hustles' ? 'active' : ''}`} onClick={() => setActiveTab('hustles')} style={{ background: 'none', border: 'none', color: activeTab === 'hustles' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'hustles' ? '2px solid var(--neon-blue)' : 'none' }}>Side Hustles</button>
        <button className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`} onClick={() => setActiveTab('tracks')} style={{ background: 'none', border: 'none', color: activeTab === 'tracks' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'tracks' ? '2px solid var(--neon-blue)' : 'none' }}>Career Tracks</button>
      </div>

      <div className="tab-content" style={{ overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }}>
        {activeTab === 'projects' && (
          <>
            {currentProject ? (
              <div className="active-project-card glass-panel">
                <h4 style={{ color: 'var(--neon-pink)' }}>Active Project: {availableProjects.find(p => p.id === currentProject)?.name || 'Unknown'}</h4>
                <div className="progress-bar-container" style={{ margin: '1rem 0' }}>
                  <div className="progress-bar-fill" style={{ width: `${projectProgress}%`, background: 'var(--neon-pink)' }}></div>
                </div>
                <div className="project-progress-row" style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8, marginBottom: '1rem' }}>
                  <span>Project Completion</span>
                  <strong>{projectProgress.toFixed(1)}%</strong>
                </div>
                
                <button 
                  disabled={energy < 20}
                  onClick={() => workOnProject(20)}
                  className="btn-primary w-100"
                >
                  Work on Project (8h) [⚡ 20]
                </button>
              </div>
            ) : (
              <div className="project-selection">
                <h4 style={{ marginBottom: '1rem' }}>Available Projects</h4>
                <div className="project-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {availableProjects.map(project => (
                    <div key={project.id} className="project-row glass-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
                      <div className="project-row-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong className="project-row-name">{project.name}</strong>
                        <button 
                          onClick={() => startProject(project.id)} 
                          className="btn-primary"
                          style={{ padding: '0.4rem 1rem' }}
                        >
                          Start
                        </button>
                      </div>
                      <div className="project-row-details" style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>
                        <span style={{ color: 'var(--neon-blue)' }}>Reward: {project.rewardPoints} Pts</span>
                        <br />
                        Requires: {project.requirements?.stats ? Object.keys(project.requirements.stats).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(', ') : 'None'}
                      </div>
                    </div>
                  ))}
                  {availableProjects.length === 0 && <p>No projects available at this tier.</p>}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'gigs' && (
          <div className="gigs-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
               <span>⭐ <strong>Gig Reputation:</strong> {gigReputation || 0}</span>
               <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>Higher Rep unlocks better gigs!</span>
            </div>
            {Object.values(gigs).map(gig => {
              const meetsCreds = !gig.requirements?.credentials || gig.requirements.credentials.every(c => stats.credentials?.includes(c));
              const meetsStats = !gig.requirements?.stats || Object.entries(gig.requirements.stats).every(([s, v]) => (stats[s] || 0) >= v);
              const meetsRep = !gig.requirements?.rep || (gigReputation || 0) >= gig.requirements.rep;
              const canTake = meetsCreds && meetsStats && meetsRep && energy >= 30;

              return (
                <div key={gig.id} className="gig-card glass-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ color: 'var(--neon-purple)', fontSize: '1.1rem' }}>{gig.name}</strong>
                      <p style={{ margin: '0.3rem 0', opacity: 0.9, fontSize: '0.9rem' }}>{gig.description}</p>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        Requirements: 
                        {gig.requirements?.credentials?.length > 0 && <span style={{ color: meetsCreds ? '#10b981' : '#ef4444' }}> {gig.requirements.credentials.join(', ')} </span>}
                        {gig.requirements?.stats && <span style={{ color: meetsStats ? '#10b981' : '#ef4444' }}> | Stats: {Object.entries(gig.requirements.stats).map(([s,v]) => `${s}(${v})`).join(', ')}</span>}
                        {gig.requirements?.rep && <span style={{ color: meetsRep ? '#10b981' : '#ef4444' }}> | Rep: {gig.requirements.rep}</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: '#10b981' }}>
                        Earn: ${gig.rewards.money} (+{gig.rewards.rep || 0} Rep)
                      </div>
                    </div>
                    <button 
                      className="btn-primary" 
                      onClick={() => takeGig(gig.id)}
                      disabled={!canTake}
                    >
                      Take Gig (⚡ 30)
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'hustles' && (
          <div className="hustles-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Side hustles provide steady income but drain energy quickly.</p>
            {Object.values(sideHustles).map(hustle => {
              const meetsVehicles = !hustle.requirements?.vehicles || hustle.requirements.vehicles.every(v => gameState.properties.vehicles?.includes(v));
              const meetsStats = !hustle.requirements?.stats || Object.entries(hustle.requirements.stats).every(([s, v]) => (stats[s] || 0) >= v);
              const energyCost = hustle.energyCostPerTick * 6; // 1 hour
              const canTake = meetsVehicles && meetsStats && energy >= energyCost;

              return (
                <div key={hustle.id} className="hustle-card glass-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ color: 'var(--neon-green)', fontSize: '1.1rem' }}>{hustle.name}</strong>
                      <p style={{ margin: '0.3rem 0', opacity: 0.9, fontSize: '0.9rem' }}>{hustle.description}</p>
                      <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        Requirements: 
                        {hustle.requirements?.vehicles?.length > 0 && <span style={{ color: meetsVehicles ? '#10b981' : '#ef4444' }}> {hustle.requirements.vehicles.join(', ')} </span>}
                        {hustle.requirements?.stats && <span style={{ color: meetsStats ? '#10b981' : '#ef4444' }}> | Stats: {Object.entries(hustle.requirements.stats).map(([s,v]) => `${s}(${v})`).join(', ')}</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: '#10b981' }}>
                        Earn: ${hustle.moneyPerTick * 6} / hour
                      </div>
                    </div>
                    <button 
                      className="btn-primary" 
                      onClick={() => useGameStore.getState().workSideHustle(hustle.id)}
                      disabled={!canTake}
                    >
                      Hustle (1h, ⚡ {energyCost})
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="tracks-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Switching tracks requires passing an interview (minimum 20 in the track's primary stat). Doing so resets your current title progress.</p>
            {Object.values(CAREER_TRACKS).map(track => (
              <div key={track.id} className="track-card glass-panel" style={{ padding: '1rem', borderRadius: '8px', border: activeTrack === track.id ? '2px solid var(--neon-blue)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{track.name}</h4>
                    <p style={{ margin: '0.3rem 0', opacity: 0.8, fontSize: '0.9rem' }}>{track.description}</p>
                  </div>
                  {activeTrack !== track.id && (
                    <button className="btn-primary" style={{ background: 'var(--neon-purple)' }} onClick={() => switchTrack(track.id)}>
                      Switch Track
                    </button>
                  )}
                  {activeTrack === track.id && (
                    <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
