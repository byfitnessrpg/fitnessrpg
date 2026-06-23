import React from 'react';
import { UserProfileState } from '../types';
import { ACHIEVEMENTS } from '../data';
import { Lock, Trophy, Award, CheckCircle } from 'lucide-react';

interface Props {
  state: UserProfileState;
}

export default function AchievementsTab({ state }: Props) {
  const unlockedCount = state.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const pct = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

  return (
    <div className="w-full flex flex-col pb-24 animate-fade-in">
      {/* Header Banner */}
      <div className="px-4 pt-4 mb-5">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          🏆 Conquistas
        </h2>
        <p className="text-xs text-slate-400">Alcance marcos lendários para ganhar medalhas</p>
      </div>

      {/* Experience Tracker Header */}
      <div className="mx-4 p-5 rounded-3xl bg-brand-card border border-brand-border mb-6">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-slate-400 font-medium">Conquistas Desbloqueadas:</span>
          <span className="text-brand-gold font-extrabold font-mono text-sm">
            {unlockedCount} / {totalCount}
          </span>
        </div>

        <div className="w-full h-3 bg-brand-bg rounded-full p-[2px] border border-brand-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-purple to-brand-gold rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-2.5">
          {pct}% Concluído do Mural do Campeão
        </p>
      </div>

      {/* Grid of Achievements */}
      <div className="px-4 grid grid-cols-2 gap-3.5">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = state.unlockedAchievements.includes(a.id);

          return (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 relative ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#1b1932]/70 to-brand-card border-brand-gold/50 shadow-md shadow-brand-gold/5 scale-100'
                  : 'bg-brand-card/40 border-brand-border/60 opacity-50 scale-98'
              }`}
            >
              {/* Floating lock badge for locked */}
              {!isUnlocked && (
                <div className="absolute top-2.5 right-2.5 text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Achievement Emoji with background circle */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-3 border ${
                  isUnlocked
                    ? 'bg-brand-gold/15 border-brand-gold/30 shadow-inner scale-110 animate-pulse-slow'
                    : 'bg-brand-bg/50 border-brand-border text-slate-600'
                }`}
              >
                {isUnlocked ? a.icon : '🔒'}
              </div>

              {/* Achievement Meta */}
              <div className="space-y-1">
                <h4
                  className={`font-bold text-xs tracking-tight ${
                    isUnlocked ? 'text-slate-100' : 'text-slate-400'
                  }`}
                >
                  {a.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed px-1">
                  {a.desc}
                </p>
              </div>

              {/* Unlock Badge Indicator */}
              <div className="mt-3.5 w-full">
                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full border border-brand-gold/20">
                    <CheckCircle className="w-2.5 h-2.5" /> Desbloqueado
                  </span>
                ) : (
                  <span className="inline-block text-[9px] font-bold uppercase text-slate-500 bg-brand-border px-2 py-0.5 rounded-full">
                    Bloqueado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative footer notes */}
      <div className="px-4 py-6 text-center text-xxs font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
        ⚔️ Treine todos os dias para erguer seu legado
      </div>
    </div>
  );
}
