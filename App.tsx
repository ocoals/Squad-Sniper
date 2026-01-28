import React, { useState } from 'react';
import { GameInterface } from './components/GameInterface';
import { SetupScreen } from './components/SetupScreen';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { Player } from './types';
import { INITIAL_PLAYERS, Language } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<'setup' | 'game'>('setup');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="relative w-full flex-grow flex flex-col">
      <GoogleAnalytics />
      {mode === 'setup' ? (
        <SetupScreen
          players={players}
          onPlayersChange={setPlayers}
          onStart={() => setMode('game')}
          language={language}
          onLanguageChange={setLanguage}
        />
      ) : (
        <GameInterface
          players={players}
          onBack={() => setMode('setup')}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
};

export default App;
