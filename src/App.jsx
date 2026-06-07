import { useState, useEffect } from 'react';
import { useGameStore } from './state/store';
import { startSession, endSession, trackError, trackEvent, trackBalanceMetrics, trackRelationship, trackLegacy } from './utils/monitoring';
import Dashboard from './components/Dashboard';
import SwipeApp from './components/SwipeApp';
import MapUI from './components/MapUI';
import DialogueUI from './components/DialogueUI';
import MarriageCeremony from './components/MarriageCeremony';
import ChildhoodRaising from './components/ChildhoodRaising';
import DateEventUI from './components/DateEventUI';
import DateRecap from './components/DateRecap';
import OrganicEncounterUI from './components/OrganicEncounterUI';
import WorkEventUI from './components/WorkEventUI';
import NpcAlertUI from './components/NpcAlertUI';
import SimstagramApp from './components/SimstagramApp';
import CareerApp from './components/CareerApp';
import Intro from './components/Intro';

function AppContent() {
  const gamePhase = useGameStore(state => state.gameState.gamePhase);
  const gameState = useGameStore(state => state.gameState);
  const dispatch = useGameStore(state => state.dispatch);

  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'swipe', 'map', 'dialogue'
  const [activeNpcId, setActiveNpcId] = useState(null);

  // Start monitoring session on app load
  useEffect(() => {
    const playerId = gameState.family?.playerName || 'unknown';
    const session = startSession(playerId);
    
    // Track app start
    trackEvent('app_start', {
      phase: gamePhase,
      playerId,
    });
    
    // Track balance metrics periodically
    const interval = setInterval(() => {
      if (gameState.stats) {
        trackBalanceMetrics({
          money: gameState.stats.money,
          day: gameState.time?.day,
          housingTier: gameState.stats.housingTier,
        });
      }
    }, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(interval);
      endSession();
    };
  }, []);

  // Track game phase changes
  useEffect(() => {
    trackEvent('phase_change', { 
      from: 'unknown', 
      to: gamePhase 
    });
  }, [gamePhase]);

  // Track errors globally
  useEffect(() => {
    const handleError = (event) => {
      trackError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Track unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      trackError(event.reason, {
        type: 'unhandled_rejection',
      });
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  const triggerTalk = (npcId) => {
    setActiveNpcId(npcId);
    setActiveView('dialogue');
    trackEvent('dialogue_start', { npcId });
  };

  if (gamePhase === 'intro') {
    return (
      <div className="app-background">
        <Intro />
      </div>
    );
  }

  // If in a special legacy phase, override normal navigation
  if (gamePhase === 'marriage') {
    return (
      <div className="app-background">
        <MarriageCeremony />
      </div>
    );
  }

  if (gamePhase === 'parenting') {
    return (
      <div className="app-background">
        <ChildhoodRaising />
      </div>
    );
  }

  if (gamePhase === 'date') {
    return (
      <div className="app-background">
        <DateEventUI />
      </div>
    );
  }

  if (gamePhase === 'date_recap') {
    return (
      <div className="app-background">
        <DateRecap />
      </div>
    );
  }

  if (gamePhase === 'encounter') {
    return (
      <div className="app-background">
        <OrganicEncounterUI />
      </div>
    );
  }

  if (gamePhase === 'work_event') {
    return (
      <div className="app-background">
        <WorkEventUI />
      </div>
    );
  }

  if (gamePhase === 'npc_alert') {
    return (
      <div className="app-background">
        <NpcAlertUI />
      </div>
    );
  }

  return (
    <div className="app-background">
      {activeView === 'dashboard' && (
        <Dashboard 
          onOpenSwipe={() => {
            setActiveView('swipe');
            trackEvent('view_swipe_app');
          }} 
          onOpenMap={() => {
            setActiveView('map');
            trackEvent('view_map');
          }}
          onOpenSimstagram={() => {
            setActiveView('simstagram');
            trackEvent('view_simstagram');
          }}
          onOpenCareer={() => {
            setActiveView('career');
            trackEvent('view_career');
          }}
        />
      )}

      {activeView === 'swipe' && (
        <SwipeApp 
          onClose={() => setActiveView('dashboard')} 
          onTalkNpc={triggerTalk}
        />
      )}

      {activeView === 'map' && (
        <MapUI 
          onClose={() => setActiveView('dashboard')} 
          onTalkNpc={triggerTalk}
        />
      )}

      {activeView === 'dialogue' && activeNpcId && (
        <DialogueUI 
          npcId={activeNpcId} 
          onClose={() => setActiveView('dashboard')}
        />
      )}

      {activeView === 'simstagram' && (
        <div className="app-overlay-container animate-fade-in">
          <SimstagramApp onClose={() => setActiveView('dashboard')} />
        </div>
      )}

      {activeView === 'career' && (
        <div className="app-workspace-container animate-fade-in">
          <CareerApp onClose={() => setActiveView('dashboard')} />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
