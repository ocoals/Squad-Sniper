import React, { useState } from 'react';
import { Player } from '../types';
import { Play, Plus, Trash2, Users, Target, UserPlus, Globe, ChevronDown, Crosshair, Trophy } from 'lucide-react';
import { COLORS, APP_NAME, ROLE_DEFINITIONS, EXTRA_ROLE_DEFINITIONS, Language, TRANSLATIONS } from '../constants';

interface SetupScreenProps {
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
    onStart: () => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ players, onPlayersChange, onStart, language, onLanguageChange }) => {
    const [newName, setNewName] = useState('');
    const t = TRANSLATIONS[language];

    const handleAddPlayer = () => {
        if (!newName.trim()) return;

        const newPlayer: Player = {
            id: Date.now().toString(),
            name: newName.trim(),
            role: '',
            number: 0,
            color: COLORS[players.length % COLORS.length],
            customRole: players.length >= ROLE_DEFINITIONS.length ? EXTRA_ROLE_DEFINITIONS[0]?.shortName : undefined,
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

    const handleRoleChange = (playerId: string, roleShortName: string) => {
        onPlayersChange(players.map(p =>
            p.id === playerId ? { ...p, customRole: roleShortName } : p
        ));
    };

    const handleMissionChange = (playerId: string, mission: string) => {
        onPlayersChange(players.map(p =>
            p.id === playerId ? { ...p, customMission: mission } : p
        ));
    };

    const totalRolesAvailable = ROLE_DEFINITIONS.length + EXTRA_ROLE_DEFINITIONS.length;
    const isExtraPlayers = players.length > ROLE_DEFINITIONS.length;

    return (
        <div className="w-full flex flex-col items-center p-4 pb-32 relative z-10">
            <div className="stadium-bg-overlay"></div>
            {/* Main Content Area */}
            <div className="max-w-4xl w-full z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 md:mt-20">

                {/* Left Column: Title & Info */}
                <div className="flex flex-col justify-center text-left space-y-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="inline-block px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono rounded tracking-widest">
                                {t.setup.subtitle}
                            </span>
                            {/* Language Toggle - Near Title */}
                            <div className="flex">
                                <button
                                    onClick={() => onLanguageChange('en')}
                                    className={`px-3 py-1 text-xs font-bold transition-all rounded-l-md border ${language === 'en' ? 'bg-orange-500 text-white border-orange-500' : 'bg-black/50 text-gray-400 border-gray-600 hover:text-white'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => onLanguageChange('ko')}
                                    className={`px-3 py-1 text-xs font-bold transition-all rounded-r-md border-t border-r border-b ${language === 'ko' ? 'bg-orange-500 text-white border-orange-500' : 'bg-black/50 text-gray-400 border-gray-600 hover:text-white'}`}
                                >
                                    KO
                                </button>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display text-white tracking-tighter leading-none drop-shadow-lg mb-2">
                            {APP_NAME.split(' ')[0]}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                                {APP_NAME.split(' ')[1]}
                            </span>
                        </h1>
                        <p className="text-gray-400 max-w-sm border-l-2 border-red-500 pl-4 text-sm">
                            {t.setup.description}
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
                                {players.length} {t.setup.playersLoaded}
                            </div>
                        </div>
                        {isExtraPlayers && (
                            <div className="text-xs text-amber-400 font-mono flex items-center gap-1">
                                <UserPlus size={12} />
                                {players.length - ROLE_DEFINITIONS.length} {t.setup.benchNote}
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
                                <h3 className="font-bold text-white tracking-wide">{t.setup.rosterTitle}</h3>
                                <p className="text-xs text-gray-400">{players.length} {t.setup.playerLimit}</p>
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
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-10 h-10 rounded-lg ${player.color} shadow-lg flex items-center justify-center font-display text-lg text-white flex-shrink-0`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-white text-sm truncate">{player.name}</div>
                                        {idx >= ROLE_DEFINITIONS.length ? (
                                            <select
                                                value={player.customRole || EXTRA_ROLE_DEFINITIONS[0]?.shortName}
                                                onChange={(e) => handleRoleChange(player.id, e.target.value)}
                                                className="mt-1 w-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
                                            >
                                                {EXTRA_ROLE_DEFINITIONS.map(role => (
                                                    <option key={role.shortName} value={role.shortName} className="bg-gray-900 text-white">
                                                        {role.shortName} - {role.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="text-xs font-mono text-gray-500">{t.setup.startingXI}</div>
                                        )}
                                        {/* Custom Mission Input */}
                                        <input
                                            type="text"
                                            placeholder={t.setup.missionPlaceholder}
                                            value={player.customMission || ''}
                                            onChange={(e) => handleMissionChange(player.id, e.target.value)}
                                            className="mt-1 w-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-purple-400 placeholder-purple-400/50"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePlayer(player.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-full transition ml-2 flex-shrink-0"
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
                            placeholder={t.setup.inputPlaceholder}
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
                            <span>{t.startDraft.split(' ')[0]}</span>
                            <span>{t.startDraft.split(' ').slice(1).join(' ')}</span>
                            <span className="text-white/70">({players.length})</span>
                            <Play size={16} fill="currentColor" className="ml-1" />
                        </span>
                    </button>

                </div>
            </div>

            {/* Extra Content Section for AdSense Compliance */}
            <div className="max-w-4xl w-full z-10 mt-24 mb-12 space-y-16">

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="space-y-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                            <Users className="text-red-400" size={24} />
                        </div>
                        <h4 className="text-white font-bold text-lg">{t.setup.buildSquadTitle}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{t.setup.buildSquadDesc}</p>
                    </div>
                    <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                            <Crosshair className="text-orange-400" size={24} />
                        </div>
                        <h4 className="text-white font-bold text-lg">{t.setup.shootoutTitle}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{t.setup.shootoutDesc}</p>
                    </div>
                    <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                            <Trophy className="text-purple-400" size={24} />
                        </div>
                        <h4 className="text-white font-bold text-lg">{t.setup.missionsTitle}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{t.setup.missionsDesc}</p>
                    </div>
                </div>

                {/* FAQ / Detailed Info */}
                <div className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Globe size={24} className="text-red-500" />
                        {t.setup.faqTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-2">
                            <h5 className="text-red-400 font-bold">{t.setup.faq1Q}</h5>
                            <p className="text-gray-400 text-sm">{t.setup.faq1A}</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-red-400 font-bold">{t.setup.faq2Q}</h5>
                            <p className="text-gray-400 text-sm">{t.setup.faq2A}</p>
                        </div>
                        <div className="space-y-2 border-t border-white/10 pt-6">
                            <h5 className="text-red-400 font-bold">{t.setup.faq3Q}</h5>
                            <p className="text-gray-400 text-sm">{t.setup.faq3A}</p>
                        </div>
                        <div className="space-y-2 border-t border-white/10 pt-6">
                            <h5 className="text-red-400 font-bold">{t.setup.faq4Q}</h5>
                            <p className="text-gray-400 text-sm">{t.setup.faq4A}</p>
                        </div>
                    </div>
                </div>

                {/* Simple Footer */}
                <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
                    <div className="text-sm text-gray-400">
                        © 2026 {APP_NAME}. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-xs font-bold tracking-widest uppercase">
                        <a href="/privacy.html" className="hover:text-red-500 transition-colors">{t.setup.privacyPolicy}</a>
                        <a href="/terms.html" className="hover:text-red-500 transition-colors">{t.setup.termsOfService}</a>
                        <a href={`mailto:support@squadsniper.com?subject=[${APP_NAME}] Support Request`} className="hover:text-red-500 transition-colors">{t.setup.contactSupport}</a>
                    </div>
                </footer>

            </div>
        </div>
    );
};
