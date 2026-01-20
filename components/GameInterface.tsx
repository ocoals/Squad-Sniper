import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player } from '../types';
import { Jersey } from './Jersey';
import { Volume2, VolumeX, ArrowLeft, Target, Gamepad2, Crosshair, Timer, AlertTriangle, Trophy, CheckCircle, Zap, Globe, BookOpen, X } from 'lucide-react';
import { SHOT_CLOCK_SECONDS, APP_NAME, generateRolesForPlayerCount, ROLE_MISSIONS, COLORS, Language, TRANSLATIONS } from '../constants';
import { playBeep, shuffleArray } from '../utils/audio';

interface GameInterfaceProps {
  players: Player[];
  onBack: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

interface TargetState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  floatDelay: number;
}

interface RoleDefinition {
  shortName: string;
  fullName: string;
  number: number;
  color: string;
}

interface AssignedPlayer {
  player: Player;
  role: RoleDefinition;
}

const DEBUG_HITBOX = false;
const SCOPE_SPEED_NORMAL = 0.9;
const SCOPE_SPEED_PRECISION = 0.45;
const TARGET_SPEED_MIN = 0.08;
const TARGET_SPEED_MAX = 0.18;

export const GameInterface: React.FC<GameInterfaceProps> = ({ players, onBack, language, onLanguageChange }) => {
  // Generate roles dynamically based on player count and custom roles
  const initialRoles = useMemo(() => generateRolesForPlayerCount(players.length, players), [players]);

  // Randomize jersey colors so position can't be guessed
  const shuffledColors = useMemo(() => shuffleArray([...COLORS]), []);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(true);
  const t = TRANSLATIONS[language];

  // Korean font class
  const fontClass = language === 'ko' ? "font-['Noto_Sans_KR']" : 'font-sans';

  // Game state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [availableRoles, setAvailableRoles] = useState<RoleDefinition[]>(initialRoles);
  const [assignedPlayers, setAssignedPlayers] = useState<AssignedPlayer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle player order so they don't appear sequentially by number (e.g. 1 -> 2 -> 3...)
  // But each player still keeps their predetermined role based on their original index
  const shuffledIndices = useMemo(() => shuffleArray(Array.from({ length: players.length }, (_, i) => i)), [players.length]);

  // Shooting state
  const [isShooting, setIsShooting] = useState(false);
  const [scopePos, setScopePos] = useState({ x: 50, y: 40 });
  const [isPrecisionMode, setIsPrecisionMode] = useState(false);
  const [ballState, setBallState] = useState({ visible: false, targetX: 0, targetY: 0 });
  const [showFlash, setShowFlash] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [targetStates, setTargetStates] = useState<TargetState[]>([]);

  // Current result
  const [currentResult, setCurrentResult] = useState<AssignedPlayer | null>(null);
  const [isPanicFire, setIsPanicFire] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(SHOT_CLOCK_SECONDS);

  // Refs
  const keysPressed = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const jerseyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scopeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();
  const lastTickRef = useRef<number>(SHOT_CLOCK_SECONDS);

  const currentPlayer = players[shuffledIndices[currentPlayerIndex]]; // Use shuffled index
  const remainingPlayers = players.length - currentPlayerIndex;

  // Initialize target positions
  useEffect(() => {
    const initialStates: TargetState[] = availableRoles.map(() => ({
      x: 10 + Math.random() * 80,
      y: 12 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 2 * TARGET_SPEED_MAX,
      vy: (Math.random() - 0.5) * 2 * TARGET_SPEED_MAX,
      floatDelay: Math.random() * 2,
    }));
    setTargetStates(initialStates);
  }, [availableRoles.length]);

  // Check for auto-finish (1 role left = auto assign to all remaining players)
  useEffect(() => {
    if (availableRoles.length === 1 && remainingPlayers >= 1 && !currentResult && !isComplete) {
      // Auto-assign last role to all remaining players
      const lastRole = availableRoles[0];
      const remainingPlayersList = players.slice(currentPlayerIndex);

      const newAssignments: AssignedPlayer[] = remainingPlayersList.map(p => ({
        player: p,
        role: lastRole
      }));

      setAssignedPlayers(prev => [...prev, ...newAssignments]);
      setAvailableRoles([]);
      setIsComplete(true);
      if (soundEnabled) playBeep('hit');
    }
  }, [availableRoles, remainingPlayers, currentResult, isComplete, currentPlayerIndex, players, soundEnabled]);

  // Timer countdown - paused during tutorial
  useEffect(() => {
    if (currentResult || isShooting || isComplete || showTutorial) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 0.1);

        if (soundEnabled && Math.floor(newTime) < Math.floor(lastTickRef.current)) {
          playBeep('tick');
          lastTickRef.current = newTime;
        }

        if (newTime <= 0 && !isShooting) {
          setIsPanicFire(true);
          if (soundEnabled) playBeep('timeup');
          setTimeout(() => handleRandomShot(), 100);
        }

        return newTime;
      });
    }, 100);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentResult, isShooting, isComplete, soundEnabled, showTutorial]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key === 'Shift') setIsPrecisionMode(true);
      if ((e.key === ' ' || e.key === 'Enter') && !isShooting && !currentResult && !isComplete) {
        e.preventDefault();
        handleShoot();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
      if (e.key === 'Shift') setIsPrecisionMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShooting, currentResult, isComplete]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (currentResult || isComplete) return;

    const speed = isPrecisionMode ? SCOPE_SPEED_PRECISION : SCOPE_SPEED_NORMAL;
    if (!isShooting) {
      setScopePos(prev => {
        let x = prev.x, y = prev.y;
        if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) x -= speed;
        if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) x += speed;
        if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) y -= speed;
        if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) y += speed;
        return { x: Math.max(8, Math.min(92, x)), y: Math.max(10, Math.min(70, y)) };
      });
    }

    setTargetStates(prev => prev.map(t => {
      let x = t.x + t.vx, y = t.y + t.vy, vx = t.vx, vy = t.vy;
      if (x <= 5 || x >= 95) { vx *= -1; x = Math.max(5, Math.min(95, x)); }
      if (y <= 10 || y >= 65) { vy *= -1; y = Math.max(10, Math.min(65, y)); }
      if (Math.random() < 0.002) {
        const mag = TARGET_SPEED_MIN + Math.random() * (TARGET_SPEED_MAX - TARGET_SPEED_MIN);
        vx = (Math.random() - 0.5) * 2 * mag;
        vy = (Math.random() - 0.5) * 2 * mag;
      }
      return { ...t, x, y, vx, vy };
    }));

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isShooting, currentResult, isComplete, isPrecisionMode]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [gameLoop]);

  // Get hit role index
  const getHitRoleIndex = useCallback((): number => {
    if (!scopeRef.current) return -1;
    const scopeRect = scopeRef.current.getBoundingClientRect();
    const cx = scopeRect.left + scopeRect.width / 2;
    const cy = scopeRect.top + scopeRect.height / 2;

    for (let i = 0; i < jerseyRefs.current.length; i++) {
      const el = jerseyRefs.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
          return i;
        }
      }
    }
    return -1;
  }, []);

  // Random shot (timeout) - still assigns the player's predetermined role
  const handleRandomShot = useCallback(() => {
    if (isShooting || availableRoles.length === 0) return;
    setIsShooting(true);
    if (soundEnabled) playBeep('shoot');

    setTimeout(() => {
      // Assign the player's predetermined role (same as normal shot)
      const actualPlayerIndex = shuffledIndices[currentPlayerIndex];
      const playerRole = initialRoles[actualPlayerIndex];

      const assignment: AssignedPlayer = { player: currentPlayer, role: playerRole };
      setCurrentResult(assignment);
      setAssignedPlayers(prev => [...prev, assignment]);
      setAvailableRoles(prev => prev.filter(r => r.shortName !== playerRole.shortName));

      if (soundEnabled) playBeep('hit');
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
    }, 300);
  }, [isShooting, availableRoles, currentPlayer, currentPlayerIndex, shuffledIndices, initialRoles, soundEnabled]);

  // Normal shot - ONLY works when targeting a jersey
  const handleShoot = useCallback(() => {
    if (isShooting || availableRoles.length === 0) return;

    // Check if we're actually targeting a jersey
    const hitIdx = getHitRoleIndex();
    if (hitIdx < 0 || hitIdx >= availableRoles.length) {
      // Not targeting any jersey - play miss sound and do nothing
      if (soundEnabled) playBeep('miss');
      return;
    }

    setIsShooting(true);
    if (soundEnabled) playBeep('shoot');

    const scopeRect = scopeRef.current?.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (scopeRect && containerRect) {
      setBallState({
        visible: true,
        targetX: scopeRect.left + scopeRect.width / 2 - containerRect.left,
        targetY: scopeRect.top + scopeRect.height / 2 - containerRect.top
      });
    }

    setTimeout(() => {
      // Assign the player's predetermined role based on their index (not the jersey they shot)
      const actualPlayerIndex = shuffledIndices[currentPlayerIndex];
      const playerRole = initialRoles[actualPlayerIndex];

      const assignment: AssignedPlayer = { player: currentPlayer, role: playerRole };
      setCurrentResult(assignment);
      setAssignedPlayers(prev => [...prev, assignment]);

      // Remove the role we just assigned from available (for display purposes)
      setAvailableRoles(prev => prev.filter(r => r.shortName !== playerRole.shortName));

      if (soundEnabled) playBeep('hit');
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 100);
      setBallState(prev => ({ ...prev, visible: false }));
    }, 400);
  }, [isShooting, getHitRoleIndex, availableRoles, currentPlayer, currentPlayerIndex, initialRoles, soundEnabled]);

  // Next player
  const handleNextPlayer = () => {
    if (currentPlayerIndex + 1 >= players.length || availableRoles.length === 0) {
      setIsComplete(true);
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setCurrentResult(null);
      setIsShooting(false);
      setIsPanicFire(false);
      setTimeLeft(SHOT_CLOCK_SECONDS);
      lastTickRef.current = SHOT_CLOCK_SECONDS;
      setScopePos({ x: 50, y: 40 });
    }
  };

  // Currently targeted role
  const currentTargetIdx = useMemo(() => {
    if (isShooting || currentResult || isComplete) return -1;
    return getHitRoleIndex();
  }, [scopePos, targetStates, isShooting, currentResult, isComplete, getHitRoleIndex]);

  const timerColor = timeLeft <= 3 ? 'text-red-500' : timeLeft <= 5 ? 'text-yellow-400' : 'text-white';

  // Squad Complete Screen
  if (isComplete) {
    return (
      <div className="relative w-full h-screen overflow-hidden font-sans select-none bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">{t.squadComplete}</h1>
          <p className="text-gray-400 mb-8">{assignedPlayers.length} {t.rolesAssigned}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8 px-4">
            {assignedPlayers.map((ap, i) => (
              <div key={i} className={`${ap.role.color} p-4 rounded-xl text-white text-center`}>
                <div className="text-2xl font-display">{ap.role.shortName}</div>
                <div className="text-sm opacity-80">{ap.player.name}</div>
                {(ap.player.customMission || ROLE_MISSIONS[ap.role.shortName]) && (
                  <div className="text-xs mt-2 opacity-70">
                    {ap.player.customMission || ROLE_MISSIONS[ap.role.shortName]?.[language] || ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={onBack} className="px-10 py-4 bg-neon-blue text-black font-bold text-lg uppercase rounded-full hover:bg-white transition-all">
            {t.backToSetup}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden font-sans select-none stadium-bg" tabIndex={0}>
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div className="vignette z-10"></div>
      <div className={`absolute inset-0 bg-red-500 pointer-events-none z-[100] transition-opacity duration-100 ${showFlash ? 'opacity-40' : 'opacity-0'}`} />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-display italic text-white tracking-tighter">
            {APP_NAME}
          </h1>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="px-2 py-1 bg-red-500/30 rounded border border-red-500/50 text-red-400 text-xs font-mono">
              DRAFTING: <span className="text-white font-bold">{currentPlayer?.name}</span>
            </div>
            <div className="text-gray-500 text-xs font-mono">
              {remainingPlayers} left • {availableRoles.length} roles
            </div>
          </div>
        </div>

        {/* Timer */}
        {!currentResult && (
          <div className="flex flex-col items-center">
            <div className={`text-4xl md:text-6xl font-display ${timerColor} ${timeLeft <= 3 ? 'animate-pulse' : ''}`}>
              {timeLeft.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Timer size={10} /> SHOT CLOCK
            </div>
          </div>
        )}

        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => setShowTutorial(true)} className="w-9 h-9 flex items-center justify-center bg-black/40 border border-white/20 rounded-full text-white/80">
            <BookOpen size={16} />
          </button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-9 h-9 flex items-center justify-center bg-black/40 border border-white/20 rounded-full text-white/80">
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button onClick={onBack} className="px-3 h-9 flex items-center gap-1 bg-red-600/80 rounded-full text-white text-xs font-bold uppercase">
            <ArrowLeft size={12} /> {t.exit}
          </button>
        </div>
      </div>

      {/* Tutorial Modal - SQUAD SNIPER Brand */}
      {showTutorial && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.15),transparent_70%)]" />

          {/* Modal Container */}
          <div className="relative w-full max-w-md mx-6">
            {/* Red glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-orange-500/30 via-red-500/20 to-transparent rounded-2xl blur-xl" />

            <div className="relative bg-gray-900/95 rounded-2xl border border-white/10 overflow-hidden">
              {/* Header Section */}
              <div className="relative px-8 pt-8 pb-6 border-b border-white/10">

                {/* Brand Logo Style Title */}
                <div className="flex flex-col items-start">
                  <h1 className="font-display text-4xl tracking-tight">
                    <span className="text-white">SQUAD</span>
                  </h1>
                  <h1 className="font-display text-4xl tracking-tight -mt-1">
                    <span className="text-orange-500">SNIPER</span>
                  </h1>
                </div>
              </div>

              {/* Instructions Section */}
              <div className={`px-8 py-6 ${language === 'ko' ? "font-['Noto_Sans_KR']" : 'font-sans'}`}>
                <div className="space-y-4">
                  {[
                    { icon: '🎮', text: t.tutorial.step1 },
                    { icon: '🎯', text: t.tutorial.step2 },
                    { icon: '⏱️', text: t.tutorial.step3 },
                    { icon: '❌', text: t.tutorial.step4 },
                    { icon: '⚡', text: t.tutorial.step5 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                      <p className="text-white/90 text-base leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Tip */}
                <div className="mt-6 px-4 py-3 bg-orange-500/10 border-l-2 border-orange-500 rounded-r-lg">
                  <p className="text-orange-200/90 text-sm">
                    {t.tutorial.tip}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-8 pb-8">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-lg uppercase rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                >
                  {t.tutorial.start}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Random Assignment Toast */}
      {isPanicFire && currentResult && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[90]">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl font-bold text-base flex items-center gap-3 shadow-xl shadow-red-500/30">
            <AlertTriangle size={22} /> {t.randomAssignment}
          </div>
        </div>
      )}

      {/* Available Roles as Targets */}
      {!currentResult && (
        <div className="absolute inset-0 z-20">
          {availableRoles.map((role, idx) => {
            const state = targetStates[idx];
            if (!state) return null;
            return (
              <div key={role.shortName} ref={el => { jerseyRefs.current[idx] = el; }} className="absolute transition-transform duration-100"
                style={{ top: `${state.y}%`, left: `${state.x}%`, transform: 'translate(-50%, -50%)' }}>
                <Jersey
                  player={{ id: role.shortName, name: '???', role: '', number: 0, color: shuffledColors[idx % shuffledColors.length] }}
                  isHit={false}
                  isFocused={currentTargetIdx === idx}
                  showDebugHitbox={DEBUG_HITBOX}
                  floatDelay={state.floatDelay}
                  mysteryMode={true}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Scope */}
      {!currentResult && (
        <div ref={scopeRef} className="absolute z-30 pointer-events-none" style={{ left: `${scopePos.x}%`, top: `${scopePos.y}%`, transform: 'translate(-50%, -50%)' }}>
          <div className={`relative flex items-center justify-center transition-all duration-150 ${isPrecisionMode ? 'w-24 h-24 border-[3px] border-lime-400 rounded shadow-[0_0_30px_rgba(132,204,22,0.7)]' : currentTargetIdx >= 0 ? 'w-32 h-32 border-2 border-green-400 rounded-lg shadow-[0_0_40px_rgba(0,255,0,0.6)]' : 'w-32 h-32 border-2 border-red-500 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.6)]'}`}>
            <div className={`absolute w-full h-[2px] top-1/2 -translate-y-1/2 ${isPrecisionMode ? 'bg-lime-400' : currentTargetIdx >= 0 ? 'bg-green-400/70' : 'bg-red-500/70'}`}></div>
            <div className={`absolute h-full w-[2px] left-1/2 -translate-x-1/2 ${isPrecisionMode ? 'bg-lime-400' : currentTargetIdx >= 0 ? 'bg-green-400/70' : 'bg-red-500/70'}`}></div>
            {isPrecisionMode ? <div className="w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div> : <Target className={currentTargetIdx >= 0 ? 'text-green-400' : 'text-red-500 animate-ping opacity-40'} size={36} />}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className={`px-3 py-1 rounded font-mono text-xs font-bold ${isPrecisionMode ? 'bg-lime-600 text-white' : currentTargetIdx >= 0 ? 'bg-green-600 text-white' : 'bg-black/70 text-gray-400'}`}>
                {isPrecisionMode ? '🔬 PRECISION' : currentTargetIdx >= 0 ? '🎯 LOCKED' : '⭕ SCANNING'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ball */}
      {ballState.visible && (
        <div className="absolute z-40 transition-all duration-400" style={{ left: ballState.targetX, top: ballState.targetY, transform: 'translate(-50%, -50%) scale(0.3) rotate(720deg)' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg" alt="Ball" className="w-20 h-20" />
        </div>
      )}

      {/* Shoot Button */}
      {!currentResult && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button onClick={handleShoot} disabled={isShooting}
            className={`px-10 py-4 rounded-full font-display text-xl uppercase transition-all ${isShooting ? 'bg-gray-700 text-gray-500' : currentTargetIdx >= 0 ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-[0_0_40px_rgba(0,255,0,0.6)] border-2 border-green-400' : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.6)] border-2 border-red-400'}`}>
            {isShooting ? 'FIRING...' : '🎯 SHOOT'}
          </button>
        </div>
      )}

      {/* Result Modal */}
      {currentResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
          <div className="flex flex-col items-center text-center">
            <div className="text-yellow-500 text-xs font-mono tracking-[0.4em] uppercase mb-4 opacity-80">
              ⚽ ROLE ASSIGNED ⚽
            </div>
            <div className={`text-[6rem] md:text-[10rem] font-display leading-none mb-2 ${currentResult.role.color.includes('yellow') ? 'text-yellow-400' :
              currentResult.role.color.includes('gray') ? 'text-gray-300' :
                currentResult.role.color.includes('red') ? 'text-red-400' :
                  currentResult.role.color.includes('blue') ? 'text-blue-400' :
                    currentResult.role.color.includes('green') ? 'text-green-400' :
                      currentResult.role.color.includes('purple') ? 'text-purple-400' :
                        currentResult.role.color.includes('cyan') ? 'text-cyan-400' :
                          currentResult.role.color.includes('teal') ? 'text-teal-400' :
                            currentResult.role.color.includes('indigo') ? 'text-indigo-400' : 'text-white'
              }`} style={{ textShadow: '0 0 60px currentColor' }}>
              {currentResult.role.shortName}
            </div>
            <div className="text-xl text-gray-300 mb-4">{currentResult.role.fullName}</div>

            {/* Mission Display - Premium */}
            {(currentResult.player.customMission || ROLE_MISSIONS[currentResult.role.shortName]) && (
              <div className="mb-6 px-8 py-5 bg-gray-800/80 border border-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-orange-400 text-xs font-mono tracking-[0.2em] uppercase mb-3 flex items-center gap-2 justify-center">
                  <Zap size={14} /> {t.mission}
                </div>
                <div className={`text-white text-xl font-bold ${language === 'ko' ? "font-['Noto_Sans_KR']" : ''}`}>
                  {currentResult.player.customMission ||
                    (ROLE_MISSIONS[currentResult.role.shortName]?.[language]?.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() || '')}
                </div>
              </div>
            )}

            <div className="w-24 h-[1px] bg-gray-600 mb-4"></div>
            <div className="text-gray-500 text-sm">Assigned to</div>
            <div className="text-white text-2xl font-bold flex items-center gap-2 mt-1">
              <CheckCircle className="text-green-400" size={20} />
              {currentResult.player.name}
            </div>

            <button onClick={handleNextPlayer} className="mt-8 px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold text-lg uppercase rounded-xl transition-all shadow-lg">
              {remainingPlayers <= 1 ? 'Finish Draft' : 'Next Player'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
