import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Shield, Sparkles, User, Lock, ArrowRight, Activity } from 'lucide-react';

interface Props {
  onAuthSuccess: (sessionUser: any) => void;
  onPlayOffline: () => void;
}

export default function AuthScreen({ onAuthSuccess, onPlayOffline }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Por favor, preencha todos os campos.', isError: true });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({ text: `Erro ao entrar: ${error.message}`, isError: true });
      } else if (data?.user) {
        onAuthSuccess(data.user);
      }
    } catch (err: any) {
      setMessage({ text: 'Ocorreu um erro ao conectar ao servidor.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Por favor, preencha todos os campos.', isError: true });
      return;
    }
    if (password.length < 6) {
      setMessage({ text: 'A senha deve conter no mínimo 6 caracteres.', isError: true });
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage({ text: `Erro ao cadastrar: ${error.message}`, isError: true });
      } else {
        setMessage({
          text: 'Cadastro realizado com sucesso! Se você não logar automaticamente, use os campos para entrar.',
          isError: false,
        });
      }
    } catch (err: any) {
      setMessage({ text: 'Ocorreu um erro ao tentar cadastrar.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-height-screen w-full flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden bg-brand-bg">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8 relative z-10 border border-brand-border shadow-2xl flex flex-col">
        
        {/* Game Badge / Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-gold flex items-center justify-center shadow-lg shadow-brand-purple/20 mb-3 animate-pulse-slow">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white glow-purple">
            Fitness<span className="text-brand-gold">RPG</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2 text-center max-w-[280px]">
            Sua jornada fitness gamificada! Treine, ganhe XP, suba de nível e mude de vida.
          </p>
        </div>

        {/* Auth form */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
              E-mail do Guerreiro
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="nome@guerreiro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-bg/60 border border-brand-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-bg/60 border border-brand-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                message.isError
                  ? 'bg-brand-rose/10 border-brand-rose/30 text-brand-rose'
                  : 'bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple/80 hover:from-brand-purple-light hover:to-brand-purple text-white font-bold text-sm shadow-lg shadow-brand-purple/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar na Arena <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl border border-brand-purple/50 bg-transparent text-brand-purple-light hover:bg-brand-purple/10 font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              Criar Nova Conta de Herói
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-[1px] bg-brand-border/60" />
          <span className="px-3 text-xxs font-mono text-slate-500 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-[1px] bg-brand-border/60" />
        </div>

        {/* Offline Play */}
        <button
          onClick={onPlayOffline}
          className="w-full py-3 px-4 rounded-xl bg-brand-border/40 hover:bg-brand-border/70 border border-brand-border/80 text-slate-300 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Continuar Offline (Salvar no Navegador)
        </button>

        {/* Info Tip */}
        <div className="mt-6 text-xxs text-slate-500 text-center flex items-center justify-center gap-1.5 border-t border-brand-border/30 pt-4">
          <Shield className="w-3.5 h-3.5 text-brand-emerald" /> Conexão protegida e dados salvos com segurança.
        </div>
      </div>
    </div>
  );
}
