import React from 'react';
import { UserProfileState } from '../types';
import { Award, Zap, Flame, Star, Target, Sparkles, LogOut, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  state: UserProfileState;
  userEmail: string | null;
  xpNeeded: number;
  onLogout: () => void;
  onResetProgress: () => void;
}

export default function ProfileTab({ state, userEmail, xpNeeded, onLogout, onResetProgress }: Props) {
  const pct = Math.min(100, (state.xp / xpNeeded) * 100);
  const circumference = 2 * Math.PI * 44; // r=44
  const offset = circumference * (1 - pct / 100);

  // Determine Rank Name based on Level
  const getRankInfo = () => {
    if (state.level < 5) return { name: 'Bronze III', colorClass: 'from-amber-700 to-amber-900 border-amber-600/30 text-amber-500' };
    if (state.level < 10) return { name: 'Prata II', colorClass: 'from-slate-400 to-slate-600 border-slate-500/30 text-slate-300' };
    if (state.level < 20) return { name: 'Ouro Elite', colorClass: 'from-brand-gold to-yellow-600 border-brand-gold/30 text-brand-gold glow-gold' };
    if (state.level < 35) return { name: 'Diamante V', colorClass: 'from-brand-purple to-indigo-600 border-brand-purple/30 text-brand-purple-light' };
    return { name: 'Lendário', colorClass: 'from-purple-600 via-pink-600 to-brand-gold border-pink-500/30 text-yellow-300' };
  };

  const rank = getRankInfo();
  const displayName = userEmail ? userEmail.split('@')[0] : 'Guerreiro Local';

  return (
    <div className="w-full flex flex-col pb-24 animate-fade-in">
      {/* Title */}
      <div className="px-4 pt-4 mb-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          👤 Perfil do Herói
        </h2>
        <p className="text-xs text-slate-400 font-medium">Histórico, estatísticas e gerenciamento</p>
      </div>

      {/* Header Profile Info Panel with Ring */}
      <div className="flex flex-col items-center text-center p-6 bg-brand-card/60 border-y border-brand-border/60 relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Dynamic Level Radial Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-3">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="56"
              cy="56"
              r="44"
              className="stroke-brand-border fill-none"
              strokeWidth="7"
            />
            {/* Progress ring with gradient */}
            <circle
              cx="56"
              cy="56"
              r="44"
              stroke="url(#profileGrad)"
              strokeWidth="7"
              className="fill-none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            <defs>
              <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Level text inside */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white leading-none">{state.level}</span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase mt-1">Nível</span>
          </div>
        </div>

        {/* Name and Rank */}
        <h3 className="text-lg font-bold text-white tracking-wide">{displayName}</h3>
        {userEmail && <p className="text-xxs text-slate-500 font-mono mt-0.5">{userEmail}</p>}

        <span className={`mt-3 px-4 py-1.5 rounded-full border bg-gradient-to-r ${rank.colorClass} text-xs font-black uppercase tracking-wider shadow-sm`}>
          {rank.name}
        </span>
        
        <p className="text-xxs text-slate-400 font-mono mt-3 uppercase tracking-wider">
          {state.xp} / {xpNeeded} XP para o próximo nível
        </p>
      </div>

      {/* Grid of Achievements and Stats */}
      <div className="px-4 mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5 ml-1 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-brand-purple-light" /> Atributos & Estatísticas
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-brand-purple-light leading-none">{state.totalMissions}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Missões Concluídas</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-brand-gold leading-none flex items-center gap-1">
              {state.streak} <Flame className="w-5 h-5 fill-current text-brand-gold animate-bounce" />
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Dias Seguidos</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-base font-black text-slate-100 leading-none truncate">
              {state.totalXP.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">XP Acumulado</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-brand-emerald leading-none">{state.unlockedAchievements.length}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Conquistas Mural</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-slate-200 leading-none">{state.totalFlexoes}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Flexões Totais</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-slate-200 leading-none">{state.totalAgacham}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Agachamentos</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-slate-200 leading-none">
              {Math.floor(state.totalPrancha / 60)} min
            </span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Tempo de Prancha</span>
          </div>

          <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col justify-between">
            <span className="text-2xl font-black text-slate-200 leading-none">{state.maxDayMissions}</span>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1.5">Melhor Dia (Missions)</span>
          </div>
        </div>
      </div>

      {/* Control Buttons (Logout & Reset) */}
      <div className="px-4 space-y-3">
        {userEmail && (
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 rounded-xl border border-brand-rose/40 bg-brand-rose/5 hover:bg-brand-rose/10 text-brand-rose font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sair da Conta do Guerreiro
          </button>
        )}

        <button
          onClick={onResetProgress}
          className="w-full py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-transparent text-slate-400 hover:text-slate-200 font-medium text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Resetar Todo o Progresso
        </button>
      </div>

      {/* Verified Shield Footer */}
      <div className="mt-8 text-center flex items-center justify-center gap-1.5 opacity-40 text-xxs font-mono uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4 text-brand-emerald" /> Guardado na Nuvem FitnessRPG
      </div>
    </div>
  );
}
