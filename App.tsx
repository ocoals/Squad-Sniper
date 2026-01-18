import React, { useState } from 'react';
import { GameInterface } from './components/GameInterface';
import { SetupScreen } from './components/SetupScreen';
import { Player } from './types';
import { INITIAL_PLAYERS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<'setup' | 'game'>('setup');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);

  return (
    <div className="w-full h-screen overflow-hidden">
      {mode === 'setup' ? (
        <SetupScreen 
          players={players} 
          onPlayersChange={setPlayers}
          onStart={() => setMode('game')}
        />
      ) : (
        <GameInterface 
          players={players} 
          onBack={() => setMode('setup')}
        />
      )}
    </div>
  );
};

export default App;
