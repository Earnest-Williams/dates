import { useState } from 'react';
import { useGameStore } from '../state/store';
import { getProjectsForTrackAndTier, CAREER_TRACKS, JOB_SEARCH_OPTIONS, CAREER_ACTIVITY_WINDOWS } from '../data/projects';
import { getBusinessById, getJobOpeningsForSettlement } from '../data/businesses';
import { gigs, sideHustles } from '../data/gigs';
import { formatTimeWindow, getTimeWindowStatus } from '../sim/time';
import { getDayKeyForDayNumber, getShiftForDay } from '../sim/workSchedule';
import './CareerApp.css';

export default function CareerApp({ onClose }) {
  const { gameState, startProject, workOnProject, takeGig, switchTrack, jobHunt } = useGameStore();
  const { activeTrack, currentProject, projectProgress, promotionPoints, titleLevel, gigReputation } = gameState.career;
  const { energy } = gameState.needs;
  const stats = gameState.stats;

  const [activeTab, setActiveTab] = useState(activeTrack ? 'projects' : 'jobSearch'); // 'jobSearch', 'projects', 'gigs', 'hustles', 'tracks'
  const [jobSearchFeedback, setJobSearchFeedback] = useState(null);

  const trackData = CAREER_TRACKS[activeTrack];
  const currentTitle = trackData?.levels.find(t => t.level === titleLevel);
  const nextTitle = trackData?.levels.find(t => t.level === titleLevel + 1);
  const availableProjects = trackData ? getProjectsForTrackAndTier(activeTrack, titleLevel) : [];
  const hasBasicPhone = Boolean(gameState.inventory?.basic_phone);
  const currentSettlementId = gameState.activeLocation === 'home' ? 'Endleigh' : gameState.activeLocation;
  const currentEmployer = getBusinessById(gameState.career.employerId);
  const projectWorkStatus = getTimeWindowStatus(gameState.time, CAREER_ACTIVITY_WINDOWS.projectWork, 32);
  const interviewStatus = getTimeWindowStatus(gameState.time, CAREER_ACTIVITY_WINDOWS.interview);
  const todayShift = getShiftForDay(gameState.career, gameState.time.day);

  const formatStat = (stat) => stat.replace(/([A-Z])/g, ' $1').replace(/^./, char => char.toUpperCase());
  const getJobScore = (option) => (
    (stats[option.primaryStat] || 0) +
    Math.floor((stats[option.secondaryStat] || 0) / 2) +
    option.scoreBonus
  );
  const handleJobHunt = (option) => {
    const wasUnemployed = !useGameStore.getState().gameState.career.activeTrack;
    jobHunt(option.id);

    const nextState = useGameStore.getState().gameState;
    const hired = wasUnemployed && Boolean(nextState.career.activeTrack);
    const trackName = CAREER_TRACKS[nextState.career.activeTrack]?.name;
    const employer = getBusinessById(nextState.career.employerId);

    setJobSearchFeedback({
      type: hired ? 'success' : 'miss',
      title: hired ? `Offer accepted: ${employer?.name || trackName}` : 'No offer yet',
      body: nextState.logs[0] || `${option.name} finished.`,
    });
  };

  return (
    <div className="career-app animate-fade-in glass-panel">
      <div className="career-header">
        <h2>Career Hub</h2>
        <button onClick={onClose} className="btn-close-career">Close</button>
      </div>

      {!trackData && (
        <div className="career-title-card unemployed-card">
          <div>
            <h3>Unemployed</h3>
            <p>You have no job yet. The rent is handled for now, but the year will move quickly.</p>
          </div>
          <div className="starter-tools">
            <span>Basic Phone</span>
            <strong>{hasBasicPhone ? 'Ready' : 'Missing'}</strong>
          </div>
        </div>
      )}

      {trackData && currentTitle && (
        <div className="career-title-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{trackData.name}</h3>
            <span style={{ opacity: 0.8 }}>Level {titleLevel}: {currentTitle.title}</span>
          </div>
          {currentEmployer && (
            <div className="starter-tools">
              <span>{currentEmployer.name}</span>
              <strong>{gameState.career.jobTitle || currentTitle.title}</strong>
            </div>
          )}
          {gameState.career.supervisorName && (
            <div className="starter-tools">
              <span>Supervisor</span>
              <strong>{gameState.career.supervisorName} ({gameState.career.supervisorRole || 'Shift Lead'})</strong>
            </div>
          )}
          {todayShift && (
            <div className="starter-tools">
              <span>Today's Shift ({getDayKeyForDayNumber(gameState.time.day).toUpperCase()})</span>
              <strong>{todayShift.startHour}:00-{todayShift.endHour}:00</strong>
            </div>
          )}
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
        <button className={`tab-btn ${activeTab === 'jobSearch' ? 'active' : ''}`} onClick={() => setActiveTab('jobSearch')} style={{ background: 'none', border: 'none', color: activeTab === 'jobSearch' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'jobSearch' ? '2px solid var(--neon-blue)' : 'none' }}>Job Search</button>
        <button disabled={!activeTrack} className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', color: activeTab === 'projects' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: activeTrack ? 'pointer' : 'not-allowed', opacity: activeTrack ? 1 : 0.45, borderBottom: activeTab === 'projects' ? '2px solid var(--neon-blue)' : 'none' }}>Projects</button>
        <button className={`tab-btn ${activeTab === 'gigs' ? 'active' : ''}`} onClick={() => setActiveTab('gigs')} style={{ background: 'none', border: 'none', color: activeTab === 'gigs' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'gigs' ? '2px solid var(--neon-blue)' : 'none' }}>Freelance Gigs</button>
        <button className={`tab-btn ${activeTab === 'hustles' ? 'active' : ''}`} onClick={() => setActiveTab('hustles')} style={{ background: 'none', border: 'none', color: activeTab === 'hustles' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'hustles' ? '2px solid var(--neon-blue)' : 'none' }}>Side Hustles</button>
        <button className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`} onClick={() => setActiveTab('tracks')} style={{ background: 'none', border: 'none', color: activeTab === 'tracks' ? 'var(--neon-blue)' : 'white', padding: '0.5rem', cursor: 'pointer', borderBottom: activeTab === 'tracks' ? '2px solid var(--neon-blue)' : 'none' }}>Career Tracks</button>
      </div>

      <div className="tab-content">
        {activeTab === 'jobSearch' && (
          <div className="job-search-list">
            <div className={`job-search-feedback ${jobSearchFeedback?.type || 'info'}`} role="status">
              {jobSearchFeedback ? (
                <>
                <strong>{jobSearchFeedback.title}</strong>
                <p>{jobSearchFeedback.body}</p>
                </>
              ) : (
                <p>Starter work is found through named employers in {currentSettlementId}: official listings, walking around, and whatever your phone can load.</p>
              )}
            </div>
            {Object.values(JOB_SEARCH_OPTIONS).map(option => {
              const score = getJobScore(option);
              const localOpenings = getJobOpeningsForSettlement(currentSettlementId, option.id);
              const needsItem = option.requiresItem && !gameState.inventory?.[option.requiresItem];
              const timeStatus = getTimeWindowStatus(gameState.time, option.availableWindow, option.durationTicks);
              const canTry = !activeTrack && energy >= option.energyCost && !needsItem && localOpenings.length > 0 && timeStatus.available;

              return (
                <div key={option.id} className={`job-search-card glass-panel ${timeStatus.available ? '' : 'unavailable'}`}>
                  <div className="job-search-main">
                    <strong>{option.name}</strong>
                    <p>{option.description}</p>
                    <div className="job-search-meta">
                      <span>{localOpenings.length} local opening{localOpenings.length === 1 ? '' : 's'}</span>
                      <span>{Math.floor(option.durationTicks / 6)}h</span>
                      <span className={timeStatus.available ? 'met' : 'unmet'}>
                        {formatTimeWindow(option.availableWindow)}
                      </span>
                      <span>Energy {option.energyCost}</span>
                      <span className={score >= option.minimumScore ? 'met' : 'unmet'}>
                        Fit {score}/{option.minimumScore}
                      </span>
                    </div>
                    <div className="job-search-requirements">
                      Uses {formatStat(option.primaryStat)} and {formatStat(option.secondaryStat)}
                      {option.requiresItem && ` • Requires ${option.requiresItem.replaceAll('_', ' ')}`}
                      {!timeStatus.available && ` • ${timeStatus.reason}`}
                    </div>
                    {localOpenings.length > 0 && (
                      <div className="job-search-employers">
                        {localOpenings.slice(0, 4).map((opening) => (
                          <span key={`${opening.businessId}-${opening.title}`}>
                            {opening.businessName}: {opening.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => handleJobHunt(option)}
                    disabled={!canTry}
                  >
                    {activeTrack ? 'Already Hired' : 'Try'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'projects' && (
          <>
            {!trackData && (
              <div className="empty-career-state glass-panel">
                <strong>No job yet.</strong>
                <p>Find starter work from the Job Search tab before taking career projects.</p>
              </div>
            )}
            {trackData && currentProject ? (
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
                  disabled={energy < 20 || !projectWorkStatus.available}
                  onClick={() => workOnProject(20)}
                  className="btn-primary w-100"
                >
                  Work on Project (8h) [⚡ 20]
                </button>
                <div className={`career-action-window ${projectWorkStatus.available ? 'met' : 'unmet'}`}>
                  {formatTimeWindow(CAREER_ACTIVITY_WINDOWS.projectWork)}
                  {!projectWorkStatus.available && ` • ${projectWorkStatus.reason}`}
                </div>
              </div>
            ) : trackData ? (
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
            ) : null}
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
              const timeStatus = getTimeWindowStatus(gameState.time, gig.availableWindow, gig.durationTicks);
              const canTake = meetsCreds && meetsStats && meetsRep && energy >= 30 && timeStatus.available;

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
                      <div className={`career-action-window ${timeStatus.available ? 'met' : 'unmet'}`}>
                        {formatTimeWindow(gig.availableWindow)}
                        {!timeStatus.available && ` • ${timeStatus.reason}`}
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
              const timeStatus = getTimeWindowStatus(gameState.time, hustle.availableWindow, 6);
              const canTake = meetsVehicles && meetsStats && energy >= energyCost && timeStatus.available;

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
                      <div className={`career-action-window ${timeStatus.available ? 'met' : 'unmet'}`}>
                        {formatTimeWindow(hustle.availableWindow)}
                        {!timeStatus.available && ` • ${timeStatus.reason}`}
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
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{activeTrack ? 'Switching tracks requires passing an interview. Doing so resets your current title progress.' : 'Formal tracks are harder to enter cold. Job Search is the practical first move, but you can still try an interview.'}</p>
            <div className={`career-action-window ${interviewStatus.available ? 'met' : 'unmet'}`}>
              Interviews: {formatTimeWindow(CAREER_ACTIVITY_WINDOWS.interview)}
              {!interviewStatus.available && ` • ${interviewStatus.reason}`}
            </div>
            {Object.values(CAREER_TRACKS).map(track => (
              <div key={track.id} className="track-card glass-panel" style={{ padding: '1rem', borderRadius: '8px', border: activeTrack === track.id ? '2px solid var(--neon-blue)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{track.name}</h4>
                    <p style={{ margin: '0.3rem 0', opacity: 0.8, fontSize: '0.9rem' }}>{track.description}</p>
                  </div>
                  {activeTrack !== track.id && (
                    <button
                      className="btn-primary"
                      style={{ background: 'var(--neon-purple)' }}
                      onClick={() => switchTrack(track.id)}
                      disabled={!interviewStatus.available}
                    >
                      {activeTrack ? 'Switch Track' : 'Interview'}
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
