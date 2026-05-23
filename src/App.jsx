import { useState } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import Dashboard from './components/Dashboard';
import SwipeApp from './components/SwipeApp';
import MapUI from './components/MapUI';
import DialogueUI from './components/DialogueUI';
import MarriageCeremony from './components/MarriageCeremony';
import ChildhoodRaising from './components/ChildhoodRaising';

function AppContent() {
  const { gameState } = useGame();
  const { gamePhase } = gameState;

  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'swipe', 'map', 'dialogue'
  const [activeNpcId, setActiveNpcId] = useState(null);

  const triggerTalk = (npcId) => {
    setActiveNpcId(npcId);
    setActiveView('dialogue');
  };

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

  return (
    <div className="app-background">
      {activeView === 'dashboard' && (
        <Dashboard 
          onOpenSwipe={() => setActiveView('swipe')} 
          onOpenMap={() => setActiveView('map')} 
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
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
