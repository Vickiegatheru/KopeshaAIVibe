import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../services/geminiService';

interface ScoreDisplayProps {
  result: AnalysisResult;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ result }) => {
  const data = [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score },
  ];

  const COLORS = ['var(--color-primary)', 'var(--color-surface-container-high)'];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-primary';
    return 'text-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Top Tier Hustler';
    if (score >= 50) return 'Steady Vibe';
    return 'Needs More Vibe';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 font-body"
      role="region"
      aria-label="Credit Analysis Results"
    >
      <div className="glass-card p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-xl flex flex-col items-center text-center transition-colors">
        <div className="relative w-64 h-64" aria-label={`Credit score: ${result.score} out of 100`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                startAngle={225}
                endAngle={-45}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    cornerRadius={10} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
            <span className={`text-6xl font-black tracking-tighter font-headline ${getScoreColor(result.score)}`}>
              {result.score}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/60 mt-1 font-label">
              Credit Score
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className={`text-2xl font-extrabold font-headline ${getScoreColor(result.score)}`}>
            {getScoreLabel(result.score)}
          </h3>
        </div>
      </div>

      <div className="bg-surface-container-highest dark:bg-gray-800 text-on-surface p-8 rounded-[2.5rem] relative overflow-hidden shadow-lg transition-colors border border-outline-variant/10">
        <span className="material-symbols-outlined absolute top-4 right-4 text-on-surface/10 text-7xl -rotate-12 select-none" aria-hidden="true">format_quote</span>
        <div className="relative z-10">
          <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-label">The Vibe Check</h4>
          <p className="text-xl font-medium italic leading-relaxed font-body">
            "{result.vibeCheck}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-success-container/10 p-6 rounded-3xl border border-success/10 transition-colors">
          <h4 className="text-success font-bold mb-4 flex items-center gap-2 font-headline">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            Green Flags
          </h4>
          <ul className="space-y-3 font-body">
            {result.greenFlags.map((flag, i) => (
              <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" aria-hidden="true" />
                {flag}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-error-container/10 p-6 rounded-3xl border border-error/10 transition-colors">
          <h4 className="text-error font-bold mb-4 flex items-center gap-2 font-headline">
            <span className="material-symbols-outlined text-xl">cancel</span>
            Red Flags
          </h4>
          <ul className="space-y-3 font-body">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="text-sm text-on-surface-variant flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" aria-hidden="true" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
