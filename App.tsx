import React, { useState, useEffect } from 'react';
import { GameInterface } from './components/GameInterface';
import { SetupScreen } from './components/SetupScreen';
import { Player } from './types';
import { INITIAL_PLAYERS, Language } from './constants';

// 언어별 메타 데이터
const META_DATA = {
  ko: {
    title: 'SQUAD SNIPER | 궁극의 축구 스쿼드 드래프트 도구',
    description: 'SQUAD SNIPER - 프로페셔널 축구 스쿼드 드래프트 & 팀 배정 도구. 리얼리스틱 3D 스타디움 환경에서 페널티킥 드래프트 모드로 축구 포지션을 배정하세요.',
    keywords: '축구 드래프트, 축구 팀 배정, 스쿼드 빌더, 페널티킥 게임, 팀 랜더마이저, 축구 포지션 드래프트, 축구 팀 빌더, 스쿼드 스나이퍼',
    ogTitle: 'SQUAD SNIPER - 궁극의 축구 드래프트 도구',
    ogDescription: '스릴 넘치는 슈팅 드래프트 모드로 축구 포지션을 배정하세요. 아마추어 팀과 소셜 매치에 완벽합니다.'
  },
  en: {
    title: 'SQUAD SNIPER | Ultimate Football Squad Draft Tool',
    description: 'SQUAD SNIPER - Professional Football Squad Draft & Team Assignment Tool. Assign soccer roles by shooting targets in a realistic 3D stadium environment with penalty shootout draft mode.',
    keywords: 'soccer draft, football team assignment, squad builder, penalty shootout game, team randomizer, football position draft, soccer team builder, squad sniper',
    ogTitle: 'SQUAD SNIPER - Ultimate Football Draft Tool',
    ogDescription: 'Assign soccer positions with a thrilling shootout draft mode. Perfect for amateur teams and social matches in a realistic 3D stadium environment.'
  }
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'setup' | 'game'>('setup');
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [language, setLanguage] = useState<Language>('en');

  // 언어 변경 시 메타 태그 동적 업데이트
  useEffect(() => {
    const meta = META_DATA[language];

    // HTML lang 속성 변경
    document.documentElement.lang = language === 'ko' ? 'ko' : 'en';

    // Title 변경
    document.title = meta.title;

    // Meta description 변경
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    }

    // Meta keywords 변경
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', meta.keywords);
    }

    // OG Title 변경
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.ogTitle);
    }

    // OG Description 변경
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', meta.ogDescription);
    }

    // Twitter Title 변경
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', meta.ogTitle);
    }

    // Twitter Description 변경
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', meta.ogDescription);
    }
  }, [language]);

  return (
    <div className="relative w-full">
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
