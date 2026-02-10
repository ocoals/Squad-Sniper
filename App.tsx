import React, { useState, useEffect } from 'react';
import { GameInterface } from './components/GameInterface';
import { SetupScreen } from './components/SetupScreen';
import { Player } from './types';
import { INITIAL_PLAYERS, Language } from './constants';

// 언어별 메타 데이터
const META_DATA = {
  ko: {
    title: 'SQUAD SNIPER | 축구 포지션 배정 게임 - 공정한 드래프트 도구',
    description: '축구 동호회나 풋살 팀의 포지션을 공정하게 정하는 무료 도구. 페널티킥 슈팅 게임으로 GK, ST, CM 등 역할을 재미있게 배정하세요. 인원 제한 없음, 모바일/PC 지원. 2026년 최신 3D 스타디움 환경.',
    keywords: '축구 포지션 배정, 축구 드래프트, 팀 역할 정하기, 공정한 포지션 선정, 페널티킥 게임, 축구 동호회, 풋살 팀, soccer draft, football team assignment, squad builder, penalty shootout game, team randomizer, squad sniper, 축구 포지션 설명, 축구 역할 가이드, 포지션 별 미션',
    ogTitle: 'SQUAD SNIPER - 축구 포지션 배정 게임 | 공정한 드래프트 도구',
    ogDescription: '축구 동호회나 풋살 팀의 포지션을 페널티킥 슈팅으로 공정하게 배정하세요. 무료, 인원 제한 없음, 2026년 최신 3D 스타디움 환경. GK부터 ST까지 재미있게 역할 정하기!'
  },
  en: {
    title: 'SQUAD SNIPER | Fair Football Position Draft Game - Free Tool 2026',
    description: 'Free tool to fairly assign soccer positions for amateur teams and futsal clubs. Use penalty shootout game to assign GK, ST, CM roles. Unlimited players, mobile/PC support. Latest 3D stadium in 2026.',
    keywords: 'soccer position assignment, football draft, fair team roles, penalty shootout game, amateur soccer, futsal team, squad builder, team randomizer, squad sniper 2026, soccer position guide, football role definitions, player missions',
    ogTitle: 'SQUAD SNIPER - Fair Football Position Draft Game',
    ogDescription: 'Assign soccer positions fairly for amateur teams with penalty shootout. Free, unlimited players, 2026 latest 3D stadium. Fun way to determine GK to ST roles!'
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
