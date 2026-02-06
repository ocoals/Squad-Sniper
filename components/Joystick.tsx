import React, { useRef, useState } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  size?: number;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove, size = 120 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [d, setD] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  const radius = size / 2;
  const knobSize = size * 0.4;

  const calcMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + radius;
    const centerY = rect.top + radius;

    let x = clientX - centerX;
    let y = clientY - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const maxDist = radius - knobSize / 2;

    if (distance > maxDist) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * maxDist;
      y = Math.sin(angle) * maxDist;
    }

    setD({ x, y });
    onMove(x / maxDist, y / maxDist);
  };

  const handleEnd = () => {
    activeRef.current = false;
    setActive(false);
    setD({ x: 0, y: 0 });
    onMove(0, 0);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    activeRef.current = true;
    setActive(true);
    calcMove(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (activeRef.current) {
      e.preventDefault();
      calcMove(e.clientX, e.clientY);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    handleEnd();
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-full backdrop-blur-sm transition-colors ${active ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'} border-2`}
      style={{ width: size, height: size, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* 조이스틱 노브 */}
      <div
        className={`absolute rounded-full shadow-lg transition-transform duration-75 ${active ? 'bg-blue-400' : 'bg-white/50'}`}
        style={{
          width: knobSize,
          height: knobSize,
          left: '50%',
          top: '50%',
          marginLeft: -knobSize / 2,
          marginTop: -knobSize / 2,
          transform: `translate(${d.x}px, ${d.y}px)`
        }}
      />
    </div>
  );
};
