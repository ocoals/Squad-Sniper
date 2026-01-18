import React, { forwardRef } from 'react';
import { Player } from '../types';
import { Shirt, HelpCircle } from 'lucide-react';

interface JerseyProps {
  player: Player;
  isHit: boolean;
  isFocused: boolean;
  showDebugHitbox?: boolean;
  floatDelay?: number;
  mysteryMode?: boolean; // Hide role information
}

export const Jersey = forwardRef<HTMLDivElement, JerseyProps>(({
  player,
  isHit,
  isFocused,
  showDebugHitbox = false,
  floatDelay = 0,
  mysteryMode = true
}, ref) => {

  // Generate random display number for mystery mode
  const mysteryNumber = React.useMemo(() => Math.floor(Math.random() * 99) + 1, []);

  return (
    <div
      ref={ref}
      className={`
        relative flex flex-col items-center justify-end transition-all duration-300 origin-center
        ${isHit ? 'animate-explode-pop' : 'animate-float-bob'}
        ${isFocused && !isHit ? 'scale-125 z-40 brightness-125' : 'scale-100'}
      `}
      style={{
        animationDelay: `${floatDelay}s`,
      }}
    >
      {/* Selection Arrow indicator over head */}
      {isFocused && !isHit && (
        <div className="absolute -top-12 animate-bounce text-neon-blue z-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 24L0 0H24L12 24Z" />
          </svg>
        </div>
      )}

      {/* Name Tag - Mystery Mode shows "?" */}
      <div className={`
        mb-2 px-3 py-1 rounded-sm text-xs font-black tracking-widest uppercase
        transition-colors duration-300
        ${isFocused ? 'bg-neon-blue text-black shadow-[0_0_10px_#00f3ff]' : 'bg-black/60 text-white/70 backdrop-blur-sm'}
      `}>
        {mysteryMode ? (
          <span className="flex items-center gap-1">
            <HelpCircle size={12} />
            ???
          </span>
        ) : (
          player.shortRole || player.name
        )}
      </div>

      {/* Jersey Body */}
      <div className="relative group">
        {/* Glow behind jersey */}
        {isFocused && (
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse"></div>
        )}

        <Shirt
          size={110}
          className={`
            ${player.color.replace('bg-', 'text-')} 
            fill-current drop-shadow-2xl
            transition-all duration-300
          `}
          style={{
            filter: isFocused ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
          }}
          strokeWidth={1}
        />

        {/* Number - Mystery Mode shows random number */}
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/90 font-display text-3xl font-bold tracking-tighter" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {mysteryMode ? '?' : player.number}
        </span>
      </div>

      {/* Debug Hitbox */}
      {showDebugHitbox && (
        <div className="absolute inset-0 border-2 border-dashed border-lime-400 pointer-events-none z-50" />
      )}

      {/* Realistic Ground Shadow */}
      {!isHit && (
        <div className={`
            h-3 bg-black/80 rounded-[100%] blur-sm mt-[-5px] transition-all duration-300
            ${isFocused ? 'w-24 opacity-80' : 'w-20 opacity-50'}
        `} />
      )}
    </div>
  );
});

Jersey.displayName = 'Jersey';
