import React, { useState } from 'react';
import { UserProfileState, RankingPlayer } from '../types';
import { MOCK_RANKINGS } from '../data';
import { Trophy, Compass, Landmark, Globe, Sparkles } from 'lucide-react';

interface Props {
  state: UserProfileState;
}

export default function RankingTab({ state }: Props) {
  const [scope, setScope] = useState<'regional' | 'nacional' | 'mundial'>('regional');

  // Generate dynamic ranking list combining mock data with active user state
  const getPlayers = (): RankingPlayer[] => {
    const list = [...MOCK_RANKINGS[scope]];
    const me: RankingPlayer = {
      name: 'Você',
      avatar: '⚔️',
      level: state.level,
      xp: state.totalXP,
      isMe: true
    };
    list.push(me);
    // Sort descending by XP
    return list.sort((a, b) => b.xp - a.xp);
  };

  const players = getPlayers();
  const myPosition = players.findIndex(p => p.isMe) + 1;

  return (
    <div className="w-full flex flex-col pb-24 animate-fade-in">
      {/* Title */}
      <div className="px-4 pt-4 mb-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          📊 Ranking Geral
        </h2>
        <p className="text-xs text-slate-400">Compare sua força com heróis do mundo todo</p>
      </div>

      {/* Pill Scope Filters */}
      <div className="flex gap-2 px-4 mb-5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setScope('regional')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            scope === 'regional'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> Regional
        </button>
        <button
          onClick={() => setScope('nacional')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            scope === 'nacional'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" /> Nacional
        </button>
        <button
          onClick={() => setScope('mundial')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            scope === 'mundial'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Mundial
        </button>
      </div>

      {/* User Position Overview Card */}
      <div className="mx-4 p-5 rounded-3xl bg-gradient-to-br from-[#201550] to-[#12132a] border border-brand-purple/50 text-center relative overflow-hidden shadow-xl shadow-brand-purple/5 mb-6">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-full blur-xl pointer-events-none" />
        <span className="text-xxs font-mono text-slate-400 uppercase tracking-widest block mb-1">
          Sua Posição no Ranking
        </span>
        <div className="text-5xl font-black text-brand-gold glow-gold tracking-tight">
          #{myPosition}
        </div>
        <div className="text-xs font-medium text-slate-300 mt-2">
          {state.totalXP.toLocaleString()} XP Total acumulado · Nível {state.level}
        </div>
      </div>

      {/* Leaderboard list container */}
      <div className="px-4 space-y-2.5">
        {players.map((p, idx) => {
          const rank = idx + 1;
          const isMe = p.isMe;

          // Medal representation
          let medal: React.ReactNode = `#${rank}`;
          let rankColorClass = 'text-slate-500';

          if (rank === 1) {
            medal = <span className="text-xl">🥇</span>;
            rankColorClass = 'text-brand-gold font-extrabold';
          } else if (rank === 2) {
            medal = <span className="text-xl">🥈</span>;
            rankColorClass = 'text-slate-300 font-extrabold';
          } else if (rank === 3) {
            medal = <span className="text-xl">🥉</span>;
            rankColorClass = 'text-amber-700 font-extrabold';
          }

          return (
            <div
              key={p.name + rank}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                isMe
                  ? 'bg-gradient-to-r from-brand-purple/30 to-[#12132a] border-brand-purple shadow-md shadow-brand-purple/5'
                  : 'bg-brand-card border-brand-border'
              }`}
            >
              {/* Left Rank, Avatar, Name */}
              <div className="flex items-center gap-3">
                {/* Medal/Rank Number */}
                <div className="w-8 text-center flex items-center justify-center font-mono font-bold text-sm">
                  {medal}
                </div>

                {/* Avatar Icon */}
                <span className="w-10 h-10 rounded-xl bg-brand-bg/80 border border-brand-border flex items-center justify-center text-xl shadow-inner">
                  {p.avatar}
                </span>

                {/* Player details */}
                <div>
                  <h4 className={`font-bold text-sm ${isMe ? 'text-brand-purple-light' : 'text-slate-200'}`}>
                    {p.name} {isMe && <span className="text-[9px] font-black uppercase text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded-md ml-1">VOCÊ</span>}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                    Nível {p.level}
                  </p>
                </div>
              </div>

              {/* Right total XP */}
              <div className="text-right pl-2 shrink-0">
                <span className="text-slate-200 font-bold font-mono text-xs block">
                  {p.xp.toLocaleString()}
                </span>
                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest block">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom informational note */}
      <div className="mx-4 p-4 mt-6 rounded-2xl bg-brand-border/10 border border-brand-border/20 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
        <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
          Ranking atualizado em tempo real. Seus ganhos de XP são salvos localmente e sincronizados com a nuvem do FitnessRPG ao treinar!
        </p>
      </div>
    </div>
  );
}
