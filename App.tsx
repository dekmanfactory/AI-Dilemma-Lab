import React, { useState, useEffect } from 'react';
import { scenarios } from './data/scenarios';
import { Scenario, Choice, SimulationResult, UserStats } from './types';
import { analyzeDecision } from './services/geminiService';
import { ICONS, PERSPECTIVE_LABELS, LEVEL_TITLES } from './constants';
import { BrainCircuit, Trophy } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// --- Sub-components (Internal for single file req, normally separated) ---

const BlockButton: React.FC<{
  color: 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}> = ({ color, onClick, children, className = '', disabled = false }) => {
  const colorClasses = {
    blue: 'bg-blue-600 border-blue-800 hover:bg-blue-500',
    purple: 'bg-purple-600 border-purple-800 hover:bg-purple-500',
    emerald: 'bg-emerald-600 border-emerald-800 hover:bg-emerald-500',
    amber: 'bg-amber-600 border-amber-800 hover:bg-amber-500',
    slate: 'bg-slate-700 border-slate-900 hover:bg-slate-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-4 rounded-lg font-bold text-white text-left
        border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1
        transition-all duration-100 ease-in-out
        flex items-center gap-3 w-full
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 rounded-full bg-inherit shadow-inner hidden md:block" />
      {children}
    </button>
  );
};

const ScenarioCard: React.FC<{ scenario: Scenario; onClick: () => void; completed: boolean }> = ({ scenario, onClick, completed }) => (
  <div 
    onClick={onClick}
    className={`
      bg-slate-800 rounded-xl p-6 border-2 border-slate-700 hover:border-blue-500 cursor-pointer transition-all
      hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group relative overflow-hidden
    `}
  >
    {completed && (
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
        완료됨
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <span className={`
        text-xs font-bold px-2 py-1 rounded
        ${scenario.difficulty === 'BEGINNER' ? 'bg-emerald-900 text-emerald-300' : 
          scenario.difficulty === 'INTERMEDIATE' ? 'bg-amber-900 text-amber-300' : 'bg-red-900 text-red-300'}
      `}>
        {scenario.difficulty}
      </span>
      <span className="text-slate-400">{ICONS.Brain}</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400">{scenario.title}</h3>
    <p className="text-slate-400 text-sm line-clamp-2">{scenario.description}</p>
    <div className="mt-4 flex flex-wrap gap-2">
      {scenario.learningPoints.slice(0, 2).map((pt, i) => (
        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
          #{pt}
        </span>
      ))}
    </div>
  </div>
);

// --- Main Views ---

const HomeView: React.FC<{ 
  onStart: (s: Scenario) => void, 
  history: SimulationResult[] 
}> = ({ onStart, history }) => {
  const completedIds = new Set(history.map(h => h.scenarioId));
  const progress = Math.round((completedIds.size / scenarios.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight">
          AI 딜레마 랩
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          인공지능 개발자가 되어 복잡한 윤리적 딜레마를 해결하세요.<br/>
          당신의 선택이 미래 사회의 알고리즘을 결정합니다.
        </p>
      </header>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 max-w-4xl mx-auto backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-300 font-bold">나의 진척도</span>
          <span className="text-blue-400 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-12">
        {scenarios.map(scenario => (
          <ScenarioCard 
            key={scenario.id} 
            scenario={scenario} 
            onClick={() => onStart(scenario)}
            completed={completedIds.has(scenario.id)}
          />
        ))}
      </div>
    </div>
  );
};

const SimulationView: React.FC<{
  scenario: Scenario;
  onChoice: (choice: Choice) => void;
  onBack: () => void;
}> = ({ scenario, onChoice, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <button onClick={onBack} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2">
        ← 돌아가기
      </button>

      {/* Scenario Block */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl mb-8">
        <div className="h-64 md:h-80 w-full relative">
          <img src={scenario.imageUrl} alt={scenario.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent flex flex-col justify-end p-8">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">
              {scenario.category}
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">{scenario.title}</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="flex gap-4 mb-6">
            <div className="w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              {scenario.description}
            </p>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-2">
            <h4 className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-2">
              {ICONS.Book} 학습 포인트
            </h4>
            <div className="flex flex-wrap gap-2">
              {scenario.learningPoints.map((pt, i) => (
                <span key={i} className="text-xs bg-slate-700 text-emerald-400 px-2 py-1 rounded">
                  {pt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Choice Blocks */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          {ICONS.Gavel} 어떤 결정을 내리시겠습니까?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenario.choices.map((choice, idx) => (
            <BlockButton 
              key={choice.id} 
              color={idx === 0 ? 'blue' : 'purple'} 
              onClick={() => onChoice(choice)}
              className="h-full"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-xs opacity-70 font-mono">CODE: {choice.id}</span>
                <span className="text-lg">{choice.text}</span>
              </div>
            </BlockButton>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalysisView: React.FC<{
  scenario: Scenario;
  choice: Choice;
  onHome: () => void;
}> = ({ scenario, choice, onHome }) => {
  const [loading, setLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<{
    analysis: string;
    discussionQuestions: string[];
    keyEthicalConcepts: string[];
  } | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const result = await analyzeDecision(scenario, choice);
      setAnalysisResult(result);
      setLoading(false);
    };
    fetchAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          {ICONS.Brain} 시뮬레이션 결과 분석
        </h2>
      </div>

      {/* Summary Block */}
      <div className="bg-slate-800 rounded-xl p-6 border-l-8 border-emerald-500 mb-8 shadow-lg">
        <h3 className="text-slate-400 text-sm font-bold uppercase mb-1">당신의 선택</h3>
        <p className="text-2xl font-bold text-white mb-4">"{choice.text}"</p>
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <p className="text-emerald-400 font-medium">결과: {choice.consequenceSummary}</p>
        </div>
      </div>

      {/* AI Analysis Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse">AI가 당신의 윤리적 결정을 분석 중입니다...</p>
              </div>
            ) : (
              <>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-purple-400">✦</span> AI 윤리 해설
                </h3>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line mb-6">
                  {analysisResult?.analysis}
                </p>
                
                <div className="bg-slate-900 rounded-lg p-4">
                   <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase">토론해보기</h4>
                   <ul className="space-y-3">
                     {analysisResult?.discussionQuestions.map((q, i) => (
                       <li key={i} className="flex gap-3 text-slate-300 text-sm">
                         <span className="text-blue-500 font-bold">Q{i+1}.</span>
                         {q}
                       </li>
                     ))}
                   </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats/Badge Block */}
        <div className="space-y-6">
           <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
             <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">윤리적 관점 분석</h4>
             <div className="flex flex-col gap-4 items-center justify-center py-4">
               <div className={`
                 w-24 h-24 rounded-full flex items-center justify-center border-4
                 ${choice.perspective === 'UTILITARIANISM' ? 'border-blue-500 text-blue-400' : 'border-purple-500 text-purple-400'}
               `}>
                 {ICONS.Scale}
               </div>
               <div className="text-center">
                 <p className="text-white font-bold text-lg">{PERSPECTIVE_LABELS[choice.perspective]}</p>
                 <p className="text-slate-400 text-xs mt-1">에 기반한 결정입니다.</p>
               </div>
             </div>
           </div>

           {!loading && (
             <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
               <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">핵심 개념</h4>
               <div className="flex flex-wrap gap-2">
                 {analysisResult?.keyEthicalConcepts.map((tag, i) => (
                   <span key={i} className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-xs font-bold border border-slate-600">
                     #{tag}
                   </span>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <BlockButton color="emerald" onClick={onHome} className="w-auto px-12">
           다음 시나리오로 이동
        </BlockButton>
      </div>
    </div>
  );
};

// --- App Container ---

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'SIMULATION' | 'ANALYSIS'>('HOME');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);

  // Simple persisted storage logic could go here

  const handleStartScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setView('SIMULATION');
  };

  const handleChoice = (choice: Choice) => {
    setUserChoice(choice);
    if (activeScenario) {
      const result: SimulationResult = {
        scenarioId: activeScenario.id,
        choiceId: choice.id,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, result]);
    }
    setView('ANALYSIS');
  };

  const calculateStats = () => {
    const stats = {
      UTILITARIANISM: 0,
      DEONTOLOGY: 0,
      VIRTUE_ETHICS: 0,
      JUSTICE: 0,
      CARE_ETHICS: 0
    };
    
    history.forEach(h => {
      const s = scenarios.find(sc => sc.id === h.scenarioId);
      const c = s?.choices.find(ch => ch.id === h.choiceId);
      if (c) {
        // @ts-ignore
        stats[c.perspective] = (stats[c.perspective] || 0) + 1;
      }
    });

    return Object.entries(stats).map(([name, value]) => ({
      name: PERSPECTIVE_LABELS[name] || name,
      value
    })).filter(item => item.value > 0);
  };

  const chartData = calculateStats();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-12">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('HOME')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <BrainCircuit className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">AI 딜레마 랩</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-300">
                  Lv.{Math.floor(history.length / 3) + 1} {LEVEL_TITLES[Math.min(Math.floor(history.length / 3), LEVEL_TITLES.length - 1)]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {view === 'HOME' && (
          <>
            <HomeView onStart={handleStartScenario} history={history} />
            
            {/* Simple Dashboard in Home for overview */}
            {history.length > 0 && (
              <div className="mt-12 max-w-4xl mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  {ICONS.Scale} 나의 윤리적 성향 분석
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'SIMULATION' && activeScenario && (
          <SimulationView 
            scenario={activeScenario} 
            onChoice={handleChoice} 
            onBack={() => setView('HOME')}
          />
        )}

        {view === 'ANALYSIS' && activeScenario && userChoice && (
          <AnalysisView 
            scenario={activeScenario} 
            choice={userChoice} 
            onHome={() => setView('HOME')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 AI Dilemma Lab. Education Purpose Only.</p>
        <p className="mt-2">Powered by Gemini API & React</p>
      </footer>
    </div>
  );
};

export default App;