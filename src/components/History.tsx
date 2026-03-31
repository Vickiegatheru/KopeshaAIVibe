import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { CreditAnalysis } from '../types';
import { motion } from 'motion/react';
import { HistorySkeleton } from './Skeleton';

export const History: React.FC = () => {
  const [analyses, setAnalyses] = useState<CreditAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'analyses'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CreditAnalysis[];
      setAnalyses(docs);
      setLoading(false);
    }, (error) => {
      console.error("History fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-12 font-body">
      <h3 className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest mb-6 flex items-center gap-2 font-label">
        <span className="material-symbols-outlined text-base">history</span>
        Recent Vibe History
      </h3>
      
      {loading ? (
        <HistorySkeleton />
      ) : analyses.length === 0 ? (
        <div className="text-center p-8 glass-card rounded-2xl border border-dashed border-outline-variant/20 transition-colors">
          <p className="text-xs text-on-surface-variant/60 font-medium">No history yet. Run your first vibe check!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <motion.div 
              key={analysis.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between shadow-sm transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg font-headline ${
                  analysis.score >= 80 ? 'bg-success/10 text-success' : 
                  analysis.score >= 50 ? 'bg-primary/10 text-primary' : 
                  'bg-error/10 text-error'
                }`}>
                  {analysis.score}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface dark:text-white line-clamp-1 font-headline">{analysis.vibeCheck}</p>
                  <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/60 font-medium font-label">
                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                    {analysis.createdAt?.toDate().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
