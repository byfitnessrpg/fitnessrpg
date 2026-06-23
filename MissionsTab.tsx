import React, { useState } from 'react';
import { Exercise, UserProfileState, WeeklyMission, SpecialMission } from '../types';
import { EXERCISES, WEEKLY_MISSIONS, SPECIAL_MISSIONS } from '../data';
import ExerciseVisualizer from './ExerciseVisualizer';
import { ChevronDown, ChevronUp, Star, Shield, Trophy, Flame, Play, Check, CircleDot, Award } from 'lucide-react';

interface Props {
  state: UserProfileState;
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
}

export default function MissionsTab({ state, onStartExercise, scaledTarget }: Props) {
  const [subTab, setSubTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getWeeklyProgress = (mId: string): number => {
    switch (mId) {
      case 'w1': return state.weekDaysTraining;
      case 'w2': return state.weekFlexoes;
      case 'w3': return state.weekCardio;
      case 'w4': return state.weekConsistency;
      default: return 0;
    }
  };

  const checkSpecialComplete = (mId: string): boolean => {
    switch (mId) {
      case 's1': return state.totalMissions >= 1;
      case 's2': return state.earlyBird;
      case 's3': return state.trioPerfect;
      case 's4': return state.streak >= 7;
      case 's5': return state.totalMissions >= 100;
      default: return false;
    }
  };

  return (
    <div className="w-full flex flex-col pb-24 animate-fade-in">
      {/* Title */}
      <div className="px-4 pt-4 mb-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          ⚔️ Missões
        </h2>
        <p className="text-xs text-slate-400">Escolha o seu próximo desafio fitness</p>
      </div>

      {/* Pill Filters */}
      <div className="flex gap-2 px-4 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSubTab('daily')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            subTab === 'daily'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          📅 Missões Diárias
        </button>
        <button
          onClick={() => setSubTab('weekly')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            subTab === 'weekly'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          🗓️ Semanais
        </button>
        <button
          onClick={() => setSubTab('special')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
            subTab === 'special'
              ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20'
              : 'bg-brand-card border-brand-border text-slate-400 hover:text-slate-200'
          }`}
        >
          ⭐ Especiais
        </button>
      </div>

      {/* Lists Content */}
      <div className="px-4 space-y-4">
        
        {/* DAILY SUB TAB */}
        {subTab === 'daily' && 
          EXERCISES.map((ex) => {
            const isDone = state.completedToday.includes(ex.id);
            const isExpanded = expandedId === ex.id;
            const target = scaledTarget(ex);

            return (
              <div
                key={ex.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isDone 
                    ? 'bg-brand-border/10 border-brand-emerald/20 opacity-70' 
                    : isExpanded 
                      ? 'bg-brand-card/90 border-brand-purple shadow-xl' 
                      : 'bg-brand-card border-brand-border hover:border-brand-purple/40 shadow-sm'
                }`}
              >
                {/* Header card action bar */}
                <div
                  onClick={() => toggleExpand(ex.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-xl bg-brand-bg/60 border border-brand-border/80 flex items-center justify-center text-xl">
                      {ex.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        {ex.name}
                        {isDone && <Check className="w-4 h-4 text-brand-emerald" />}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {target} {ex.unit} · {ex.sets} séries
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20 uppercase">
                      +{ex.xp} XP
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="border-t border-brand-border/60 bg-brand-bg/40 p-4 space-y-4">
                    {/* Visualizer & Muscle list split */}
                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-between">
                      
                      {/* Interactive Visualizer SVG */}
                      <div className="w-full flex justify-center">
                        <ExerciseVisualizer pose={ex.pose} mColor={ex.mColor} isAnimating={!isDone} />
                      </div>

                      {/* Muscle Groups card */}
                      <div className="w-full space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Músculos Ativados
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {ex.muscles.map((muscle) => (
                            <span
                              key={muscle}
                              className="text-xxs font-semibold px-2 py-0.5 rounded-full bg-brand-border text-slate-300 border border-brand-border/80"
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>

                        {/* Difficulties */}
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Dificuldade Ajustada
                          </span>
                          <span className="text-xxs font-extrabold uppercase bg-brand-gold/15 text-brand-gold border border-brand-gold/25 px-2.5 py-0.5 rounded-full inline-block">
                            {ex.diff}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Execution Steps */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Como Executar Corretamente
                      </span>
                      <ol className="space-y-2">
                        {ex.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed items-start">
                            <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple-light flex items-center justify-center font-bold text-[9px] shrink-0 border border-brand-purple/30 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Launch Action */}
                    {!isDone && (
                      <button
                        onClick={() => onStartExercise(ex.id)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/10"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Iniciar Missão 💪
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        }

        {/* WEEKLY SUB TAB */}
        {subTab === 'weekly' && 
          WEEKLY_MISSIONS.map((m) => {
            const isDone = state.completedWeekly.includes(m.id);
            const currentVal = getWeeklyProgress(m.id);
            const pct = Math.min(100, Math.round((currentVal / m.total) * 100));

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl bg-brand-card border shadow-sm ${
                  isDone 
                    ? 'border-brand-emerald/30 bg-brand-emerald/5 opacity-80' 
                    : 'border-brand-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                      {m.title}
                      {isDone && <Check className="w-4 h-4 text-brand-emerald" />}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20">
                    {m.diff}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Progresso: <strong className="text-slate-200">{currentVal}</strong> / {m.total}</span>
                    <span className="text-brand-gold font-bold">+{m.xp} XP</span>
                  </div>

                  <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden border border-brand-border p-[1px]">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-brand-emerald' : 'bg-brand-purple'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        }

        {/* SPECIAL SUB TAB */}
        {subTab === 'special' && 
          SPECIAL_MISSIONS.map((m) => {
            const isDone = checkSpecialComplete(m.id);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl bg-brand-card border flex items-center justify-between gap-4 ${
                  isDone 
                    ? 'border-brand-emerald/30 bg-brand-emerald/5 opacity-80' 
                    : 'border-brand-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDone 
                      ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald' 
                      : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple-light'
                  }`}>
                    {isDone ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                      {m.title}
                      {isDone && <span className="text-[10px] font-black bg-brand-emerald/20 text-brand-emerald px-1.5 py-0.5 rounded-full">ATIVADO</span>}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-brand-gold font-extrabold text-sm block">+{m.xp}</span>
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">XP</span>
                </div>
              </div>
            );
          })
        }

      </div>
    </div>
  );
}
