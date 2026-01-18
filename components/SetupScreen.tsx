import React, { useState } from 'react';
import { Player } from '../types';
import { Play, Plus, Trash2, Users, Target, UserPlus } from 'lucide-react';
import { COLORS, APP_NAME, ROLE_DEFINITIONS, EXTRA_ROLE_DEFINITIONS } from '../constants';

interface SetupScreenProps {
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
    onStart: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ players, onPlayersChange, onStart }) => {
    const [newName, setNewName] = useState('');

    const handleAddPlayer = () => {
        if (!newName.trim()) return;

        const newPlayer: Player = {
            id: Date.now().toString(),
            name: newName.trim(),
            role: '',
            number: 0,
            color: COLORS[players.length % COLORS.length],
        };

        onPlayersChange([...players, newPlayer]);
        setNewName('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddPlayer();
        }
    };

    const removePlayer = (id: string) => {
        onPlayersChange(players.filter(p => p.id !== id));
    };

    const totalRolesAvailable = ROLE_DEFINITIONS.length + EXTRA_ROLE_DEFINITIONS.length;
    const isExtraPlayers = players.length > ROLE_DEFINITIONS.length;

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden stadium-bg">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/70 z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-transparent to-black/80 z-0"></div>

            <div className="max-w-4xl w-full z-10 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column: Title & Info */}
                <div className="flex flex-col justify-center text-left space-y-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono mb-2 rounded tracking-widest">
                            🎯 DRAFT MODE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white tracking-tighter leading-none drop-shadow-lg mb-2">
                            {APP_NAME.split(' ')[0]}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                {APP_NAME.split(' ')[1]}
                            </span>
                        </h1>
                        <p className="text-gray-400 max-w-sm border-l-2 border-red-500 pl-4 text-sm">
                            Assign roles by shooting targets. Each shot eliminates one role. Add unlimited players!
                        </p>
                    </div>

                    <div className="hidden md:flex flex-col gap-2 mt-8 opacity-70">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {players.slice(0, 5).map((p) => (
                                    <div key={p.id} className={`w-10 h-10 rounded-full ${p.color} border-2 border-black flex items-center justify-center text-white text-xs font-bold`}>
                                        {p.name[0]}
                                    </div>
                                ))}
                                {players.length > 5 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-black flex items-center justify-center text-white text-xs">
                                        +{players.length - 5}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                                {players.length} PLAYERS LOADED
                            </div>
                        </div>
                        {isExtraPlayers && (
                            <div className="text-xs text-amber-400 font-mono flex items-center gap-1">
                                <UserPlus size={12} />
                                {players.length - ROLE_DEFINITIONS.length} bench/staff roles will be added
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Interactive Glass Panel */}
                <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col h-[600px]">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <Target className="text-red-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-wide">SQUAD ROSTER</h3>
                                <p className="text-xs text-gray-400">{players.length} players • No limit!</p>
                            </div>
                        </div>
                        {players.length > ROLE_DEFINITIONS.length && (
                            <div className="px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-xs font-mono">
                                +{players.length - ROLE_DEFINITIONS.length} EXTRA
                            </div>
                        )}
                    </div>

                    {/* List - Fixed height with scroll */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-4 pr-2 min-h-0" style={{ maxHeight: '320px' }}>
                        {players.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 border-2 border-dashed border-gray-700 rounded-xl py-8">
                                <Users size={48} className="mb-2" />
                                <p>Add players to begin</p>
                            </div>
                        )}
                        {players.map((player, idx) => (
                            <div key={player.id} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${player.color} shadow-lg flex items-center justify-center font-display text-lg text-white`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{player.name}</div>
                                        <div className={`text-xs font-mono ${idx >= ROLE_DEFINITIONS.length ? 'text-amber-500' : 'text-gray-500'}`}>
                                            {idx >= ROLE_DEFINITIONS.length ? 'BENCH/STAFF' : 'STARTING XI'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePlayer(player.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-full transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="bg-black/40 p-1 rounded-2xl mb-4 border border-white/10 flex items-center">
                        <input
                            type="text"
                            placeholder="Enter player name..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-transparent border-none text-white px-4 py-3 flex-1 focus:outline-none placeholder-gray-600 text-sm font-bold"
                        />
                        <button
                            onClick={handleAddPlayer}
                            disabled={!newName.trim()}
                            className="m-1 p-3 bg-red-500 hover:bg-red-400 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onStart}
                        disabled={players.length < 2}
                        className={`
                  w-full py-4 rounded-xl font-display text-lg tracking-wider uppercase
                  transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${players.length < 2
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-white/5'
                                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400'}
                `}
                    >
                        <span className="flex items-center justify-center gap-3">
                            <span>🎯</span>
                            <span>Start Draft</span>
                            <span className="text-white/70">({players.length})</span>
                            <Play size={16} fill="currentColor" className="ml-1" />
                        </span>
                    </button>

                </div>
            </div>
        </div>
    );
};
