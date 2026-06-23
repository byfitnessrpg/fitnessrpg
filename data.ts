import { Exercise, WeeklyMission, SpecialMission, Achievement } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'd1', name: 'Guerreiro das Flexões', icon: '💪',
    base: 12, max: 40, sets: 2, unit: 'flexões', type: 'reps', cat: 'força',
    muscles: ['Peito', 'Tríceps', 'Ombros'], pose: 'pushup',
    mColor: '#ef4444', xp: 65, diff: 'Fácil',
    steps: ['Deite de bruços com as mãos na largura dos ombros', 'Mantenha o corpo reto como uma prancha', 'Desça o peito até quase tocar o chão', 'Empurre com força para subir', 'Respire fundo em cada repetição']
  },
  {
    id: 'd2', name: 'Pernas de Aço', icon: '🦵',
    base: 15, max: 50, sets: 2, unit: 'agachamentos', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Panturrilha'], pose: 'squat',
    mColor: '#ef4444', xp: 60, diff: 'Fácil',
    steps: ['Fique em pé com os pés na largura dos ombros', 'Aponte os pés levemente para fora', 'Desça como se fosse sentar em uma cadeira', 'Mantenha os joelhos alinhados com os pés', 'Suba empurrando o chão com os calcanhares']
  },
  {
    id: 'd3', name: 'Núcleo de Ferro', icon: '🔥',
    base: 20, max: 90, sets: 2, unit: 'segundos', type: 'timer', cat: 'core',
    muscles: ['Core', 'Abdômen', 'Lombar'], pose: 'plank',
    mColor: '#f59e0b', xp: 70, diff: 'Médio',
    steps: ['Apoie nos antebraços e pontas dos pés', 'Mantenha o corpo em linha reta da cabeça ao calcanhar', 'Contraia o abdômen com força', 'Não deixe o quadril subir ou descer', 'Respire normalmente e mantenha a posição']
  },
  {
    id: 'd4', name: 'Coração Forte', icon: '⚡',
    base: 20, max: 60, sets: 2, unit: 'polichinelos', type: 'reps', cat: 'cardio',
    muscles: ['Corpo todo', 'Cardio'], pose: 'jumpingjack',
    mColor: '#00aaff', xp: 60, diff: 'Fácil',
    steps: ['Fique em pé com os pés juntos e braços ao lado', 'Pule abrindo as pernas e levantando os braços', 'Palmas se encontram acima da cabeça', 'Volte à posição inicial pulando', 'Mantenha um ritmo constante e controlado']
  },
  {
    id: 'd5', name: 'Abdômen de Guerreiro', icon: '🎯',
    base: 15, max: 50, sets: 2, unit: 'abdominais', type: 'reps', cat: 'core',
    muscles: ['Abdômen', 'Core'], pose: 'crunch',
    mColor: '#f59e0b', xp: 60, diff: 'Fácil',
    steps: ['Deite de costas com os joelhos dobrados', 'Mãos atrás da cabeça sem puxar o pescoço', 'Contraia o abdômen para levantar os ombros', 'Não suba completamente — foque no core', 'Desça devagar controlando o movimento']
  },
  {
    id: 'd6', name: 'Afundo Poderoso', icon: '🦶',
    base: 10, max: 30, sets: 2, unit: 'afundos (cada perna)', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Isquiotibial'], pose: 'lunge',
    mColor: '#ef4444', xp: 65, diff: 'Médio',
    steps: ['Fique em pé com os pés juntos', 'Dê um passo largo para frente', 'Desça o joelho traseiro em direção ao chão', 'Mantenha o joelho da frente acima do tornozelo', 'Suba e alterne as pernas']
  },
  {
    id: 'd7', name: 'Elevação de Quadril', icon: '🍑',
    base: 15, max: 40, sets: 2, unit: 'elevações', type: 'reps', cat: 'força',
    muscles: ['Glúteos', 'Isquiotibial', 'Lombar'], pose: 'glute',
    mColor: '#ef4444', xp: 60, diff: 'Fácil',
    steps: ['Deite de costas com os joelhos dobrados', 'Pés apoiados no chão na largura dos ombros', 'Empurre os quadris para cima contraindo os glúteos', 'Mantenha por 1 segundo no topo', 'Desça devagar sem encostar no chão']
  },
  {
    id: 'd8', name: 'Tríceps em Casa', icon: '🪑',
    base: 10, max: 30, sets: 2, unit: 'mergulhos', type: 'reps', cat: 'força',
    muscles: ['Tríceps', 'Ombros'], pose: 'dip',
    mColor: '#ef4444', xp: 65, diff: 'Médio',
    steps: ['Use uma cadeira ou superfície estável', 'Mãos na borda com os dedos apontando para frente', 'Escorregue o corpo para frente da cadeira', 'Desça dobrando os cotovelos a 90°', 'Empurre para subir usando os tríceps']
  }
];

export const WEEKLY_MISSIONS: WeeklyMission[] = [
  { id: 'w1', title: 'Semana do Guerreiro', desc: 'Treine pelo menos 5 dias esta semana', xp: 500, diff: 'Épico', total: 5 },
  { id: 'w2', title: 'Rei das Flexões', desc: 'Acumule 60 flexões esta semana', xp: 350, diff: 'Difícil', total: 60 },
  { id: 'w3', title: 'Cardio Consistente', desc: 'Complete 4 missões de cardio esta semana', xp: 400, diff: 'Difícil', total: 4 },
  { id: 'w4', title: 'Mestre da Consistência', desc: 'Complete 3 missões por dia em 3 dias', xp: 550, diff: 'Épico', total: 3 }
];

export const SPECIAL_MISSIONS: SpecialMission[] = [
  { id: 's1', title: 'Despertar do Herói', desc: 'Complete sua primeira missão', xp: 50, diff: 'Iniciante' },
  { id: 's2', title: 'Madrugador', desc: 'Complete uma missão antes das 9h', xp: 150, diff: 'Especial' },
  { id: 's3', title: 'Trio Perfeito', desc: 'Complete missões de 3 categorias hoje', xp: 200, diff: 'Especial' },
  { id: 's4', title: 'Imparável', desc: '7 dias seguidos treinando', xp: 700, diff: 'Lendário' },
  { id: 's5', title: 'Centurião Total', desc: '100 missões concluídas', xp: 1000, diff: 'Lendário' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', icon: '🌟', title: 'Primeira Missão', desc: 'Complete 1 missão' },
  { id: 'a2', icon: '💪', title: 'Em Forma', desc: 'Complete 10 missões' },
  { id: 'a3', icon: '🎯', title: 'Dedicado', desc: 'Complete 25 missões' },
  { id: 'a4', icon: '⚔️', title: 'Guerreiro', desc: 'Complete 50 missões' },
  { id: 'a5', icon: '💯', title: '100 Missões', desc: 'Complete 100 missões' },
  { id: 'a6', icon: '🔥', title: '3 Dias Seguidos', desc: 'Streak de 3 dias' },
  { id: 'a7', icon: '🗓️', title: '7 Dias Seguidos', desc: 'Streak de 7 dias' },
  { id: 'a8', icon: '🏆', title: 'Mês Perfeito', desc: 'Streak de 30 dias' },
  { id: 'a9', icon: '⭐', title: 'Nível 5', desc: 'Alcance o nível 5' },
  { id: 'a10', icon: '🌠', title: 'Nível 10', desc: 'Alcance o nível 10' },
  { id: 'a11', icon: '💎', title: 'Nível 25', desc: 'Alcance o nível 25' },
  { id: 'a12', icon: '👑', title: 'Nível 50', desc: 'Alcance o nível 50' },
  { id: 'a13', icon: '💥', title: 'Mestre das Flexões', desc: '200 flexões totais' },
  { id: 'a14', icon: '🦾', title: 'Pernas de Titânio', desc: '300 agachamentos totais' },
  { id: 'a15', icon: '🛡️', title: 'Guardião do Core', desc: '600s de prancha total' },
  { id: 'a16', icon: '🧠', title: 'Guerreiro da Disciplina', desc: '5 missões em um dia' },
  { id: 'a17', icon: '📈', title: 'Progressão Real', desc: '10 missões seguidas concluídas' },
  { id: 'a18', icon: '🌈', title: 'Lendário', desc: 'Nível 50 e 200 missões' }
];

export const MOCK_RANKINGS = {
  regional: [
    { name: 'Bruno Lima', avatar: '🦁', level: 8, xp: 3200 },
    { name: 'Carla Mendes', avatar: '🐯', level: 7, xp: 2800 },
    { name: 'Diego Costa', avatar: '🦊', level: 6, xp: 2400 },
    { name: 'Fernanda Reis', avatar: '🐺', level: 5, xp: 1900 },
    { name: 'Gabriel Souza', avatar: '🦅', level: 4, xp: 1500 },
    { name: 'Helena Martins', avatar: '🦋', level: 3, xp: 1100 },
    { name: 'Igor Ferreira', avatar: '🐉', level: 2, xp: 700 },
    { name: 'Julia Santos', avatar: '🦄', level: 1, xp: 300 }
  ],
  nacional: [
    { name: 'André Oliveira', avatar: '🔥', level: 15, xp: 8500 },
    { name: 'Beatriz Cruz', avatar: '⚡', level: 12, xp: 6200 },
    { name: 'Carlos Neto', avatar: '💎', level: 10, xp: 5100 },
    { name: 'Daniela Pires', avatar: '🌟', level: 9, xp: 4300 },
    { name: 'Eduardo Alves', avatar: '🏆', level: 8, xp: 3800 },
    { name: 'Flavia Rocha', avatar: '🎯', level: 7, xp: 3100 },
    { name: 'Gustavo Lima', avatar: '⚔️', level: 6, xp: 2500 },
    { name: 'Ingrid Vale', avatar: '🛡️', level: 5, xp: 1800 }
  ],
  mundial: [
    { name: 'Alex Storm', avatar: '🌪️', level: 50, xp: 85000 },
    { name: 'Maria Fuerte', avatar: '💥', level: 42, xp: 62000 },
    { name: 'Kai Thunder', avatar: '⚡', level: 35, xp: 48000 },
    { name: 'Yuki Blade', avatar: '🗡️', level: 28, xp: 35000 },
    { name: 'Camila Power', avatar: '💪', level: 22, xp: 25000 },
    { name: 'Ruan Force', avatar: '🔥', level: 18, xp: 18000 },
    { name: 'Priya Wins', avatar: '🏆', level: 15, xp: 12000 },
    { name: 'Luca Speed', avatar: '💨', level: 10, xp: 7000 }
  ]
};
