import React from 'react';
import { Exercise, UserProfileState } from '../types';
import { Flame, Star, Trophy, CheckCircle2, ChevronRight, Activity, Award } from 'lucide-react';

interface Props {
  state: UserProfileState;
  exercises: Exercise[];
  xpNeeded: number;
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
}

export default function HomeTab({ state, exercises, xpNeeded, onStartExercise, scaledTarget }: Props) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  
  const pct = Math.min(100, Math.round((state.xp / xpNeeded) * 100));
  const todayExercises = exercises.filter(e => !state.completedToday.includes(e.id));
  const completedExercises = exercises.filter(e => state.completedToday.includes(e.id));

  return (
    <div className="w-full flex flex-col space-y-6 pb-24 animate-fade-in">
      {/* Header section with profile overview */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">{greeting}, Guerreiro! 👋</span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">FitnessRPG</h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-gold flex items-center justify-center border border-brand-border shadow-md text-xl relative">
          ⚔️
          {state.streak > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand-rose text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
              <Flame className="w-2.5 h-2.5 fill-current text-white" />
              {state.streak}
            </span>
          )}
        </div>
      </div>

      {/* Main Experience Tracker Card */}
      <div className="mx-4 p-5 rounded-3xl bg-gradient-to-br from-[#1a1040]/80 to-brand-card border border-brand-purple/40 shadow-xl shadow-brand-purple/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-brand-gold/15 text-brand-gold p-1.5 rounded-xl border border-brand-gold/20">
              <Star className="w-4 h-4 fill-current text-brand-gold" />
            </span>
            <span className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Nível {state.level}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            <span className="text-brand-gold font-bold">{state.xp}</span> / <span className="text-slate-300 font-bold">{xpNeeded}</span> XP
          </span>
        </div>

        {/* Experience Bar */}
        <div className="w-full h-3 bg-brand-bg rounded-full p-[2px] border border-brand-border overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-gold rounded-full transition-all duration-700 ease-out shadow-inner"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Level footer metrics */}
        <div className="flex justify-between items-center mt-3 text-xxs font-mono text-slate-500 uppercase tracking-widest">
          <span>{pct}% concluído</span>
          <span>Mais {xpNeeded - state.xp} XP para subir</span>
        </div>
      </div>

      {/* Streak Fire Banner */}
      {state.streak > 0 ? (
        <div className="mx-4 p-4 rounded-2xl bg-gradient-to-r from-brand-gold/10 to-transparent border border-brand-gold/20 flex items-center gap-3 animate-pulse-slow">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold border border-brand-gold/30">
            <Flame className="w-5 h-5 fill-current text-brand-gold" />
          </div>
          <div>
            <div className="text-sm font-bold text-brand-gold flex items-center gap-1.5">
              Sequência Ativa: {state.streak} {state.streak === 1 ? 'Dia' : 'Dias'}!
            </div>
            <div className="text-xs text-slate-400">Você está mantendo a disciplina acesa. Continue assim!</div>
          </div>
        </div>
      ) : (
        <div className="mx-4 p-4 rounded-2xl bg-brand-border/20 border border-brand-border/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-border/40 flex items-center justify-center text-slate-400">
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-300">Inicie sua sequência!</div>
            <div className="text-xs text-slate-500">Complete qualquer missão hoje para começar seu streak.</div>
          </div>
        </div>
      )}

      {/* Missions Header Row */}
      <div className="px-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-wide uppercase">Missões de Hoje</h3>
          <p className="text-xs text-slate-400 font-medium">Complete exercícios para acumular XP</p>
        </div>
        <span className="text-xs font-mono font-bold bg-brand-card border border-brand-border px-3 py-1 rounded-full text-brand-purple-light">
          {state.completedToday.length} / {exercises.length}
        </span>
      </div>

      {/* Active & Pending Missions Grid */}
      <div className="px-4 space-y-3">
        {todayExercises.map(ex => {
          const target = scaledTarget(ex);
          return (
            <button
              key={ex.id}
              onClick={() => onStartExercise(ex.id)}
              className="w-full text-left flex items-center justify-between p-4 bg-brand-card hover:bg-brand-card/80 border border-brand-border hover:border-brand-purple/40 rounded-2xl transition-all duration-200 group active:scale-98 shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-12 h-12 rounded-xl bg-brand-bg/60 border border-brand-border/80 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {ex.icon}
                </span>
                <div>
                  <h4 className="font-bold text-slate-100 group-hover:text-white transition-colors text-sm">
                    {ex.name}
                  </h4>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    {target} {ex.unit} · {ex.sets} séries
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span 
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase" 
                      style={{ backgroundColor: `${ex.mColor}15`, color: ex.mColor }}
                    >
                      {ex.cat}
                    </span>
                    <span className="text-[9px] font-mono font-semibold bg-brand-border text-slate-400 px-2 py-0.5 rounded-full uppercase">
                      {ex.diff}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 pl-2">
                <div className="text-right">
                  <span className="text-brand-gold font-extrabold font-mono text-sm">+{ex.xp}</span>
                  <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">XP</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-purple-light group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}

        {/* Completed Today list */}
        {completedExercises.map(ex => (
          <div
            key={ex.id}
            className="w-full flex items-center justify-between p-4 bg-brand-border/10 border border-brand-emerald/20 rounded-2xl opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <span className="w-12 h-12 rounded-xl bg-brand-bg/40 border border-brand-border flex items-center justify-center text-2xl grayscale">
                {ex.icon}
              </span>
              <div>
                <h4 className="font-bold text-slate-300 text-sm line-through decoration-slate-500">
                  {ex.name}
                </h4>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Concluído ✓
                </div>
              </div>
            </div>

            <span className="text-brand-emerald flex items-center justify-center bg-brand-emerald/10 border border-brand-emerald/20 p-2 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
        ))}

        {/* Complete Trophy State */}
        {state.completedToday.length === exercises.length && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-brand-card to-brand-card/40 border border-brand-gold/30 text-center space-y-3.5 relative overflow-hidden shadow-xl shadow-brand-gold/5">
            <div className="absolute top-0 left-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="w-14 h-14 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/20 flex items-center justify-center mx-auto animate-bounce mt-2">
              <Trophy className="w-7 h-7" />
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-100 text-base">Todos os Desafios Concluídos!</h4>
              <p className="text-xs text-slate-400 max-w-[280px] mx-auto mt-1 leading-relaxed">
                Você superou todas as missões diárias de hoje e provou ser um verdadeiro herói. Volte amanhã para novos combates!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
