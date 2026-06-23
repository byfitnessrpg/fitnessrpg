import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { EXERCISES, WEEKLY_MISSIONS, SPECIAL_MISSIONS, ACHIEVEMENTS } from './data';
import { Exercise, UserProfileState } from './types';
import AuthScreen from './components/AuthScreen';
import HomeTab from './components/HomeTab';
import MissionsTab from './components/MissionsTab';
import AchievementsTab from './components/AchievementsTab';
import RankingTab from './components/RankingTab';
import ProfileTab from './components/ProfileTab';
import Confetti from './components/Confetti';
import { 
  Home, 
  Sword, 
  Trophy, 
  BarChart3, 
  User, 
  Flame, 
  ArrowLeft, 
  Play, 
  Plus, 
  SkipForward, 
  Sparkles,
  WifiOff,
  Bell,
  CheckCircle,
  X
} from 'lucide-react';

const DEFAULT_STATE: UserProfileState = {
  level: 1,
  xp: 0,
  totalXP: 0,
  streak: 0,
  lastTrainingDate: null,
  totalMissions: 0,
  completedToday: [],
  weekDaysTraining: 0,
  weekFlexoes: 0,
  weekCardio: 0,
  weekConsistency: 0,
  totalFlexoes: 0,
  totalAgacham: 0,
  totalPrancha: 0,
  maxDayMissions: 0,
  maxConsecutive: 0,
  consecutiveRun: 0,
  completedWeekly: [],
  completedSpecial: [],
  unlockedAchievements: [],
  earlyBird: false,
  trioPerfect: false,
  todayCategories: [],
  moedas: 0
};

export default function App() {
  const [sessionUser, setSessionUser] = useState<any | null>(null);
  const [playOffline, setPlayOffline] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'missions' | 'achievements' | 'ranking' | 'profile'>('home');
  const [state, setState] = useState<UserProfileState>({ ...DEFAULT_STATE });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  // Active Exercise Overlay States
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Countdown Rest Period States
  const [restCountdown, setRestCountdown] = useState<number | null>(null);

  // Gamified animation and popup states
  const [toast, setToast] = useState<{ message: string; type: 'default' | 'success' | 'gold' } | null>(null);
  const [levelUpNum, setLevelUpNum] = useState<number | null>(null);
  const [achievementFlash, setAchievementFlash] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Ref timers
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for Supabase Authentication state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load user game state when user connects or toggles offline mode
  useEffect(() => {
    async function loadGameState() {
      // 1. If logged in to Supabase, sync from cloud profile
      if (sessionUser) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .single();

          if (error && error.code === 'PGRST116') {
            // Profile row does not exist, bootstrap one
            const newProfile = {
              id: sessionUser.id,
              nome: sessionUser.email ? sessionUser.email.split('@')[0] : 'Guerreiro',
              xp: 0,
              nivel: 1,
              moedas: 0,
              streak: 0,
              total_missions: 0,
              max_day_missions: 0,
              last_training_date: null
            };

            await supabase.from('profiles').insert([newProfile]);
            
            // Re-merge with offline data as fallback if available
            const savedLocal = localStorage.getItem('fitnessRPG_state');
            const initial = savedLocal ? JSON.parse(savedLocal) : DEFAULT_STATE;
            setState({ ...initial, level: 1, xp: 0, totalXP: 0, streak: 0 });
          } else if (profile) {
            // Found Supabase profile. Let's merge standard sub-stats from local storage for local richness
            const savedLocal = localStorage.getItem(`fitnessRPG_state_${sessionUser.id}`);
            const localObj = savedLocal ? JSON.parse(savedLocal) : DEFAULT_STATE;

            setState({
              ...localObj,
              level: profile.nivel || 1,
              xp: profile.xp || 0,
              streak: profile.streak || 0,
              totalMissions: profile.total_missions || 0,
              maxDayMissions: profile.max_day_missions || 0,
              lastTrainingDate: profile.last_training_date || null,
              totalXP: profile.xp || localObj.totalXP || 0
            });
          }
        } catch (err) {
          console.error('Error loading Supabase data:', err);
          loadLocalFallback();
        }
      } else {
        // 2. Offline Mode State
        loadLocalFallback();
      }
    }

    function loadLocalFallback() {
      const saved = localStorage.getItem('fitnessRPG_state');
      if (saved) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(saved) });
      } else {
        setState({ ...DEFAULT_STATE });
      }
    }

    loadGameState();
  }, [sessionUser, playOffline]);

  // Save State securely whenever state mutations occur
  const saveState = async (updatedState: UserProfileState) => {
    setState(updatedState);

    // Save to LocalStorage always (offline-first resilient approach)
    if (sessionUser) {
      localStorage.setItem(`fitnessRPG_state_${sessionUser.id}`, JSON.stringify(updatedState));
      
      // Save/Sync to Supabase Cloud profiles table
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: sessionUser.id,
            xp: updatedState.xp,
            nivel: updatedState.level,
            moedas: updatedState.moedas || 0,
            streak: updatedState.streak || 0,
            total_missions: updatedState.totalMissions || 0,
            max_day_missions: updatedState.maxDayMissions || 0,
            last_training_date: updatedState.lastTrainingDate
          });
      } catch (err) {
        console.error('Failed to sync to Supabase clouds:', err);
      }
    } else {
      localStorage.setItem('fitnessRPG_state', JSON.stringify(updatedState));
    }
  };

  // Check Daily Streak or Reset on Component Mount/State loaded
  useEffect(() => {
    if (!state.lastTrainingDate) return;
    
    const todayStr = new Date().toDateString();
    if (state.lastTrainingDate !== todayStr) {
      // Check if they trained yesterday to maintain streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (state.lastTrainingDate !== yesterdayStr && state.lastTrainingDate !== todayStr) {
        // Reset streak if more than 24h passed without any activity
        const updated = { ...state, streak: 0, completedToday: [], todayCategories: [] };
        saveState(updated);
      } else {
        // It's a new day, so reset today's specific completions but maintain streak
        const updated = {
          ...state,
          completedToday: [],
          todayCategories: [],
          earlyBird: false,
          trioPerfect: false
        };
        saveState(updated);
      }
    }
  }, [state.lastTrainingDate]);

  // Helper XP functions
  const xpForLevel = (lv: number) => {
    return Math.floor(100 * Math.pow(lv, 1.5));
  };

  const scaledTarget = (ex: Exercise) => {
    const factor = Math.min(1, state.totalMissions / 50);
    const range = ex.max - ex.base;
    return Math.floor(ex.base + range * factor);
  };

  // Interactive Rep Addition or Timer Increments
  const handleAddRep = () => {
    if (!activeExercise) return;
    const target = scaledTarget(activeExercise);
    const newVal = currentReps + 1;
    setCurrentReps(newVal);

    if (newVal >= target) {
      handleFinishSet();
    }
  };

  // Timer runner logic
  const handleStartTimer = () => {
    if (timerRunning) {
      // Pause
      setTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      // Play
      setTimerRunning(true);
      const target = scaledTarget(activeExercise!);
      
      timerIntervalRef.current = setInterval(() => {
        setCurrentReps((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= target) {
            clearInterval(timerIntervalRef.current!);
            setTimerRunning(false);
            handleFinishSet();
            return target;
          }
          return nextVal;
        });
      }, 1000);
    }
  };

  // Finishes the active set
  const handleFinishSet = () => {
    if (!activeExercise) return;
    
    if (currentSet < activeExercise.sets) {
      // Rest timer start
      setRestCountdown(30);
      restIntervalRef.current = setInterval(() => {
        setRestCountdown((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(restIntervalRef.current!);
            handleSkipRest();
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      // Completed last set of the exercise!
      handleCompleteExercise();
    }
  };

  // Skip the rest timer between sets
  const handleSkipRest = () => {
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    setRestCountdown(null);
    setCurrentReps(0);
    setCurrentSet((prev) => prev + 1);
  };

  // Completes the whole exercise and awards rewards
  const handleCompleteExercise = () => {
    if (!activeExercise) return;
    const ex = activeExercise;
    
    // Close overlays
    setActiveExercise(null);
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);

    const todayStr = new Date().toDateString();
    const currentHour = new Date().getHours();

    const isFirstTimeToday = !state.completedToday.includes(ex.id);
    const updatedCompletedToday = isFirstTimeToday 
      ? [...state.completedToday, ex.id]
      : state.completedToday;

    // Check streak updates
    let updatedStreak = state.streak;
    if (state.lastTrainingDate !== todayStr) {
      updatedStreak = state.streak === 0 ? 1 : state.streak + 1;
    }

    // Build categories tracked
    const updatedTodayCategories = state.todayCategories.includes(ex.cat)
      ? state.todayCategories
      : [...state.todayCategories, ex.cat];

    const isTrioPerfectNow = updatedTodayCategories.length >= 3;
    const isEarlyBirdNow = state.earlyBird || currentHour < 9;

    // Incremented stats
    const flexoesDelta = ex.id === 'd1' ? scaledTarget(ex) : 0;
    const agachamDelta = ex.id === 'd2' ? scaledTarget(ex) : 0;
    const pranchaDelta = ex.id === 'd3' ? scaledTarget(ex) : 0;

    let updatedMissionsCount = state.totalMissions + 1;
    let consecutiveRunDelta = state.consecutiveRun + 1;
    let maxConsecutiveNow = Math.max(state.maxConsecutive, consecutiveRunDelta);

    // Calculate XP Level addition
    let currentXP = state.xp + ex.xp;
    let currentTotalXP = state.totalXP + ex.xp;
    let currentLevel = state.level;
    let xpLimit = xpForLevel(currentLevel);
    let didLevelUp = false;

    while (currentXP >= xpLimit) {
      currentXP -= xpLimit;
      currentLevel += 1;
      xpLimit = xpForLevel(currentLevel);
      didLevelUp = true;
    }

    // Construct the next profile state
    let nextState: UserProfileState = {
      ...state,
      level: currentLevel,
      xp: currentXP,
      totalXP: currentTotalXP,
      streak: updatedStreak,
      lastTrainingDate: todayStr,
      totalMissions: updatedMissionsCount,
      completedToday: updatedCompletedToday,
      totalFlexoes: state.totalFlexoes + flexoesDelta,
      totalAgacham: state.totalAgacham + agachamDelta,
      totalPrancha: state.totalPrancha + pranchaDelta,
      consecutiveRun: consecutiveRunDelta,
      maxConsecutive: maxConsecutiveNow,
      maxDayMissions: Math.max(state.maxDayMissions, updatedCompletedToday.length),
      todayCategories: updatedTodayCategories,
      earlyBird: isEarlyBirdNow,
      trioPerfect: isTrioPerfectNow
    };

    // Calculate Week status
    if (isFirstTimeToday) {
      nextState.weekDaysTraining = Math.min(7, state.weekDaysTraining + 1);
    }
    if (ex.id === 'd1') {
      nextState.weekFlexoes += flexoesDelta;
    }
    if (ex.cat === 'cardio') {
      nextState.weekCardio += 1;
    }
    if (updatedCompletedToday.length >= 3) {
      nextState.weekConsistency = Math.min(3, state.weekConsistency + 1);
    }

    // CHECK WEEKLY MISSIONS COMPLETED
    const newCompletedWeekly = [...state.completedWeekly];
    WEEKLY_MISSIONS.forEach(m => {
      if (!newCompletedWeekly.includes(m.id)) {
        let metricVal = 0;
        if (m.id === 'w1') metricVal = nextState.weekDaysTraining;
        if (m.id === 'w2') metricVal = nextState.weekFlexoes;
        if (m.id === 'w3') metricVal = nextState.weekCardio;
        if (m.id === 'w4') metricVal = nextState.weekConsistency;

        if (metricVal >= m.total) {
          newCompletedWeekly.push(m.id);
          // Award XP
          nextState.xp += m.xp;
          nextState.totalXP += m.xp;
          while (nextState.xp >= xpForLevel(nextState.level)) {
            nextState.xp -= xpForLevel(nextState.level);
            nextState.level += 1;
            didLevelUp = true;
          }
          triggerToast(`🏆 Missão semanal "${m.title}" completa! +${m.xp} XP`, 'gold');
        }
      }
    });
    nextState.completedWeekly = newCompletedWeekly;

    // CHECK SPECIAL MISSIONS COMPLETED
    const newCompletedSpecial = [...state.completedSpecial];
    SPECIAL_MISSIONS.forEach(m => {
      if (!newCompletedSpecial.includes(m.id)) {
        let check = false;
        if (m.id === 's1') check = nextState.totalMissions >= 1;
        if (m.id === 's2') check = nextState.earlyBird;
        if (m.id === 's3') check = nextState.trioPerfect;
        if (m.id === 's4') check = nextState.streak >= 7;
        if (m.id === 's5') check = nextState.totalMissions >= 100;

        if (check) {
          newCompletedSpecial.push(m.id);
          // Award XP
          nextState.xp += m.xp;
          nextState.totalXP += m.xp;
          while (nextState.xp >= xpForLevel(nextState.level)) {
            nextState.xp -= xpForLevel(nextState.level);
            nextState.level += 1;
            didLevelUp = true;
          }
          triggerToast(`⭐ Missão especial "${m.title}" completa! +${m.xp} XP`, 'gold');
        }
      }
    });
    nextState.completedSpecial = newCompletedSpecial;

    // CHECK ACHIEVEMENT UNLOCKS
    const newUnlockedAchievements = [...state.unlockedAchievements];
    let flashedAchName: string | null = null;
    
    ACHIEVEMENTS.forEach(a => {
      if (!newUnlockedAchievements.includes(a.id)) {
        let isEligible = false;
        if (a.id === 'a1') isEligible = nextState.totalMissions >= 1;
        if (a.id === 'a2') isEligible = nextState.totalMissions >= 10;
        if (a.id === 'a3') isEligible = nextState.totalMissions >= 25;
        if (a.id === 'a4') isEligible = nextState.totalMissions >= 50;
        if (a.id === 'a5') isEligible = nextState.totalMissions >= 100;
        if (a.id === 'a6') isEligible = nextState.streak >= 3;
        if (a.id === 'a7') isEligible = nextState.streak >= 7;
        if (a.id === 'a8') isEligible = nextState.streak >= 30;
        if (a.id === 'a9') isEligible = nextState.level >= 5;
        if (a.id === 'a10') isEligible = nextState.level >= 10;
        if (a.id === 'a11') isEligible = nextState.level >= 25;
        if (a.id === 'a12') isEligible = nextState.level >= 50;
        if (a.id === 'a13') isEligible = nextState.totalFlexoes >= 200;
        if (a.id === 'a14') isEligible = nextState.totalAgacham >= 300;
        if (a.id === 'a15') isEligible = nextState.totalPrancha >= 600;
        if (a.id === 'a16') isEligible = nextState.maxDayMissions >= 5;
        if (a.id === 'a17') isEligible = nextState.maxConsecutive >= 10;
        if (a.id === 'a18') isEligible = nextState.level >= 50 && nextState.totalMissions >= 200;

        if (isEligible) {
          newUnlockedAchievements.push(a.id);
          flashedAchName = a.title;
        }
      }
    });
    nextState.unlockedAchievements = newUnlockedAchievements;

    // Trigger updates
    saveState(nextState);
    triggerToast(`✅ ${ex.name} completo! +${ex.xp} XP`, 'success');
    setConfettiActive(true);

    if (flashedAchName) {
      setAchievementFlash(flashedAchName);
      setTimeout(() => setAchievementFlash(null), 3500);
    }

    if (didLevelUp) {
      setTimeout(() => {
        setLevelUpNum(currentLevel);
      }, 700);
    }
  };

  // Triggers beautiful toast messages
  const triggerToast = (msg: string, type: 'default' | 'success' | 'gold' = 'default') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Start an exercise
  const handleStartExercise = (id: string) => {
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) return;
    
    // Reset values
    setActiveExercise(ex);
    setCurrentSet(1);
    setCurrentReps(0);
    setTimerRunning(false);
  };

  // Close active exercise screen overlay
  const handleCloseExercise = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    setActiveExercise(null);
    setTimerRunning(false);
  };

  // Logout of Supabase
  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      await supabase.auth.signOut();
      setPlayOffline(false);
      setState({ ...DEFAULT_STATE });
      triggerToast('Sessão encerrada com sucesso.');
    }
  };

  // Reset Progress with dynamic confirmations
  const handleResetProgress = () => {
    if (window.confirm('RESETAR PROGRESSO? Esta ação apagará todas as suas conquistas, nível e histórico de treino. Deseja continuar?')) {
      if (window.confirm('ÚLTIMO AVISO: Confirmar exclusão irreversível dos dados?')) {
        saveState({ ...DEFAULT_STATE });
        triggerToast('Histórico redefinido para o nível 1!');
      }
    }
  };

  // Render the currently selected tab panel
  const renderSelectedTab = () => {
    const xpNeeded = xpForLevel(state.level);
    
    switch (currentTab) {
      case 'home':
        return (
          <HomeTab
            state={state}
            exercises={EXERCISES}
            xpNeeded={xpNeeded}
            scaledTarget={scaledTarget}
            onStartExercise={handleStartExercise}
          />
        );
      case 'missions':
        return (
          <MissionsTab
            state={state}
            scaledTarget={scaledTarget}
            onStartExercise={handleStartExercise}
          />
        );
      case 'achievements':
        return <AchievementsTab state={state} />;
      case 'ranking':
        return <RankingTab state={state} />;
      case 'profile':
        return (
          <ProfileTab
            state={state}
            userEmail={sessionUser?.email ?? null}
            xpNeeded={xpNeeded}
            onLogout={handleLogout}
            onResetProgress={handleResetProgress}
          />
        );
      default:
        return null;
    }
  };

  // Render Authentication screen if no session and not in offline playmode
  if (!sessionUser && !playOffline) {
    return (
      <AuthScreen
        onAuthSuccess={(user) => {
          setSessionUser(user);
          triggerToast('Conectado à arena com sucesso!', 'success');
        }}
        onPlayOffline={() => {
          setPlayOffline(true);
          triggerToast('Modo offline ativado! Treinando localmente.', 'default');
        }}
      />
    );
  }

  const xpNeededForActive = activeExercise ? xpForLevel(state.level) : 0;
  const activeTarget = activeExercise ? scaledTarget(activeExercise) : 0;
  const activeProgressPct = activeExercise ? Math.min(100, Math.round((currentReps / activeTarget) * 100)) : 0;

  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col justify-between selection:bg-brand-purple selection:text-white">
      
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-brand-rose text-white text-xs font-bold py-2 px-4 flex items-center justify-center gap-2 z-50 shrink-0 border-b border-brand-rose/20 animate-pulse">
          <WifiOff className="w-4 h-4" /> Você está desconectado! O FitnessRPG salvará suas conquistas localmente.
        </div>
      )}

      {/* Confetti particles anchor */}
      <Confetti active={confettiActive} />

      {/* Main viewport centered container */}
      <main className="w-full max-w-lg mx-auto flex-1 flex flex-col relative bg-brand-bg md:border-x md:border-brand-border/60 shadow-2xl">
        
        {/* Active tab content view */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderSelectedTab()}
        </div>

        {/* BOTTOM NAVIGATION TAB BAR */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-brand-card/95 border-t border-brand-border/80 backdrop-blur-md flex items-center justify-around z-40 max-w-lg mx-auto md:border-x md:border-brand-border/60">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all cursor-pointer ${
              currentTab === 'home' ? 'text-brand-purple-light scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
          </button>

          <button
            onClick={() => setCurrentTab('missions')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all cursor-pointer ${
              currentTab === 'missions' ? 'text-brand-purple-light scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sword className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Missões</span>
          </button>

          <button
            onClick={() => setCurrentTab('achievements')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all cursor-pointer ${
              currentTab === 'achievements' ? 'text-brand-purple-light scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mural</span>
          </button>

          <button
            onClick={() => setCurrentTab('ranking')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all cursor-pointer ${
              currentTab === 'ranking' ? 'text-brand-purple-light scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Leader</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all cursor-pointer ${
              currentTab === 'profile' ? 'text-brand-purple-light scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </button>
        </nav>

        {/* ACTIVE EXERCISE FULLSCREEN OVERLAY PORTAL */}
        {activeExercise && (
          <div className="fixed inset-0 z-50 bg-brand-bg flex flex-col justify-between overflow-y-auto max-w-lg mx-auto md:border-x md:border-brand-border/60 shadow-2xl animate-fade-in pb-8">
            
            {/* Overlay Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border/60">
              <button
                onClick={handleCloseExercise}
                className="w-10 h-10 rounded-full border border-brand-border bg-brand-card hover:bg-brand-border/40 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xxs font-mono font-bold uppercase text-brand-purple-light tracking-widest block">
                  Missão Ativa
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {activeExercise.icon} {activeExercise.name}
                </span>
              </div>
              <span className="text-xs font-mono font-extrabold text-brand-gold bg-brand-gold/15 border border-brand-gold/25 px-2.5 py-1 rounded-full uppercase shrink-0">
                Série {currentSet} de {activeExercise.sets}
              </span>
            </div>

            {/* Main Action Zone containing current exercise step model */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
              
              {/* Dynamic Animated Vector Avatar */}
              <div className="w-full flex justify-center">
                <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-brand-purple/20 via-transparent to-brand-gold/20">
                  <div className="p-4 bg-brand-card/40 rounded-[22px] border border-brand-border">
                    <svg viewBox="0 0 200 170" className="w-52 h-44 filter drop-shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                      {/* Standard animated heads/nodes */}
                      <circle cx="100" cy="45" r="14" fill="#e2e8f0" />
                      <line x1="100" y1="59" x2="100" y2="100" stroke="#e2e8f0" strokeWidth="5" />
                      
                      {/* Dynamic hands / feet animating based on type */}
                      <g className="animate-bounce origin-bottom">
                        <line 
                          x1="100" 
                          y1="75" 
                          x2={activeExercise.type === 'reps' ? "65" : "75"} 
                          y2="90" 
                          stroke={activeExercise.mColor} 
                          strokeWidth="5" 
                          strokeLinecap="round" 
                        />
                        <line 
                          x1="100" 
                          y1="75" 
                          x2={activeExercise.type === 'reps' ? "135" : "125"} 
                          y2="90" 
                          stroke={activeExercise.mColor} 
                          strokeWidth="5" 
                          strokeLinecap="round" 
                        />
                        <line x1="100" y1="100" x2="80" y2="140" stroke="#e2e8f0" strokeWidth="5" />
                        <line x1="100" y1="100" x2="120" y2="140" stroke="#e2e8f0" strokeWidth="5" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Central Concentric Ring rep tracker */}
              <div className="relative w-48 h-48 flex flex-col items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    className="stroke-brand-border/40 fill-none"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke={activeExercise.mColor}
                    strokeWidth="12"
                    className="fill-none"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - currentReps / activeTarget)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
                  />
                </svg>

                {/* Counter metrics inside ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-black text-white glow-purple select-none">
                    {currentReps}
                  </span>
                  <span className="text-xxs font-mono text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                    de {activeTarget} {activeExercise.unit}
                  </span>
                </div>
              </div>

              {/* Progress Bar Footer for set complete */}
              <div className="w-full max-w-sm px-6">
                <div className="flex items-center justify-between text-xxs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                  <span>Série concluída</span>
                  <span>{activeProgressPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-brand-card rounded-full p-[2px] border border-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${activeProgressPct}%`,
                      backgroundColor: activeExercise.mColor 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actions Panel Bottom */}
            <div className="p-6 space-y-4 border-t border-brand-border/40 bg-brand-card/30">
              
              {/* Instructions steps drawer */}
              <div className="p-4 rounded-2xl bg-brand-card border border-brand-border/60">
                <span className="text-[10px] font-bold text-brand-purple-light uppercase tracking-widest block mb-2">
                  Dica de Postura do Mestre
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activeExercise.steps[currentReps % activeExercise.steps.length]}
                </p>
              </div>

              {/* Primary Interaction Button */}
              {activeExercise.type === 'reps' ? (
                <button
                  onClick={handleAddRep}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-purple-light hover:from-brand-purple-light hover:to-brand-purple text-white font-extrabold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-purple/20 border border-brand-purple/20"
                >
                  <Plus className="w-6 h-6 stroke-[3px]" /> REPETIÇÃO FEITA!
                </button>
              ) : (
                <button
                  onClick={handleStartTimer}
                  className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border ${
                    timerRunning
                      ? 'bg-brand-rose border-brand-rose/20 hover:bg-brand-rose/80 text-white'
                      : 'bg-brand-emerald border-brand-emerald/20 hover:bg-brand-emerald/80 text-white shadow-lg shadow-brand-emerald/10'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" /> {timerRunning ? 'PAUSAR CONTADOR' : 'INICIAR TIMER'}
                </button>
              )}
            </div>

            {/* REST TIME PERIOD PANEL (MODAL TRANSITION PORTAL) */}
            {restCountdown !== null && (
              <div className="fixed inset-0 z-[60] bg-brand-bg/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto md:border-x md:border-brand-border/60 shadow-2xl animate-fade-in">
                
                <div className="space-y-1 mb-8">
                  <span className="w-14 h-14 rounded-2xl bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 flex items-center justify-center mx-auto mb-3 animate-bounce">
                    <Flame className="w-7 h-7 fill-current" />
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">Descanse um pouco!</h3>
                  <p className="text-xs text-slate-400">Excelente série. Prepare-se para a próxima série.</p>
                </div>

                {/* Giant Countdown Clock */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      className="stroke-brand-border/50 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      className="stroke-brand-emerald fill-none"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 68}
                      strokeDashoffset={2 * Math.PI * 68 * (1 - restCountdown / 30)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute text-5xl font-black text-brand-emerald font-mono">
                    {restCountdown}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={handleSkipRest}
                  className="px-6 py-3.5 rounded-xl border border-brand-emerald/40 hover:border-brand-emerald text-brand-emerald hover:bg-brand-emerald/5 font-extrabold text-xs tracking-wider uppercase transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  Pular Descanso <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* GAMIFIED LEVEL UP SCREEN OVERLAY MODAL */}
      {levelUpNum !== null && (
        <div className="fixed inset-0 bg-brand-bg/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-center p-6 max-w-lg mx-auto md:border-x md:border-brand-border/60 shadow-2xl">
          <div className="space-y-6 max-w-xs animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-purple to-brand-gold text-white text-5xl flex items-center justify-center mx-auto shadow-xl shadow-brand-purple/20 animate-bounce">
              ⭐
            </div>

            <div className="space-y-2">
              <h3 className="text-4xl font-black tracking-tight bg-gradient-to-r from-brand-purple-light to-brand-gold bg-clip-text text-transparent uppercase">
                LEVEL UP!
              </h3>
              <p className="text-xs text-slate-400 font-medium">Você atingiu um novo patamar de disciplina!</p>
            </div>

            {/* Level stats card */}
            <div className="p-6 bg-brand-card border border-brand-purple/40 rounded-3xl">
              <div className="text-slate-400 text-xs font-mono uppercase tracking-widest">Nível Anterior</div>
              <div className="text-2xl font-bold text-slate-500 line-through">{levelUpNum - 1}</div>
              
              <div className="h-[1px] bg-brand-border/60 my-3" />

              <div className="text-brand-gold text-xs font-mono uppercase tracking-widest font-black">Novo Nível</div>
              <div className="text-6xl font-black text-brand-gold glow-gold mt-1 leading-none">{levelUpNum}</div>
            </div>

            <button
              onClick={() => {
                setLevelUpNum(null);
                setConfettiActive(false);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Continuar Jornada ⚔
            </button>
          </div>
        </div>
      )}

      {/* ACHIEVEMENT FLASH BANNER (FLOATING TOAST TOP BAR) */}
      {achievementFlash && (
        <div className="fixed top-4 left-4 right-4 z-[99] max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-r from-[#064e3b] to-[#065f46] border border-brand-emerald/50 shadow-2xl flex items-center gap-3 animate-slide-up">
          <span className="w-10 h-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-2xl shrink-0 border border-brand-emerald/20">
            🏆
          </span>
          <div>
            <span className="text-[10px] text-brand-emerald font-black uppercase tracking-widest block leading-none">
              CONQUISTA DESBLOQUEADA!
            </span>
            <span className="text-sm font-extrabold text-white block mt-1 leading-tight">
              {achievementFlash}
            </span>
          </div>
        </div>
      )}

      {/* FLOATING SYSTEM TOAST MESSAGE */}
      {toast && (
        <div className="fixed bottom-20 left-4 right-4 z-[99] max-w-sm mx-auto pointer-events-none animate-scale-in">
          <div className={`p-4 rounded-xl border shadow-xl flex items-center gap-2.5 ${
            toast.type === 'success' 
              ? 'bg-[#064e3b]/90 border-brand-emerald/40 text-brand-emerald-light' 
              : toast.type === 'gold'
                ? 'bg-[#1e1b15]/90 border-brand-gold/40 text-brand-gold'
                : 'bg-brand-card/90 border-brand-border text-slate-100'
          }`}>
            <Bell className="w-4 h-4 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}
