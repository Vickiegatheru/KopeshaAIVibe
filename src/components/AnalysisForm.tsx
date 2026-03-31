import React, { useState } from 'react';
import { analyzeMPesaData, AnalysisResult } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalysisComplete }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSampleData = () => {
    const sample = `Confirmed. You have received Ksh15,000.00 from JOHN DOE 0712345678 on 15/3/24 at 10:30 AM. New M-PESA balance is Ksh18,450.00.
Confirmed. Ksh2,500.00 paid to KPLC. Transaction code SKL092K on 16/3/24 at 2:15 PM.
Confirmed. Ksh500.00 paid to M-PESA FULIZA. Transaction code SKM123J on 17/3/24 at 8:00 AM.
Confirmed. You have received Ksh8,000.00 from MAMA MBOGA SUPPLIES on 18/3/24 at 4:30 PM.
Confirmed. Ksh3,000.00 paid to NAIVAS SUPERMARKET. Transaction code SKN456L on 19/3/24 at 6:45 PM.`;
    setInput(sample);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please paste some M-Pesa data first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeMPesaData(input);
      
      // Save to Firestore
      if (auth.currentUser) {
        const analysisRef = await addDoc(collection(db, 'analyses'), {
          uid: auth.currentUser.uid,
          score: result.score,
          vibeCheck: result.vibeCheck,
          greenFlags: result.greenFlags,
          redFlags: result.redFlags,
          rawInput: input,
          createdAt: serverTimestamp()
        });

        // Update user profile
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          latestScore: result.score,
          vibeCheck: result.vibeCheck,
          updatedAt: serverTimestamp()
        });
      }

      onAnalysisComplete(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('quota')) {
        setError('AI quota exceeded. Please try again in a few minutes.');
      } else {
        setError('Analysis failed. Make sure you pasted M-Pesa transaction text.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm mb-8 transition-colors font-body">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2 font-headline">
          <span className="material-symbols-outlined text-primary">sms</span>
          Paste M-Pesa SMS Logs
        </h3>
        <button 
          onClick={handleSampleData}
          type="button"
          className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-wider focus:outline-none focus:underline font-label"
          aria-label="Load sample M-Pesa SMS data"
        >
          Use Sample SMS
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your M-Pesa SMS messages or transaction history here...'
            className="w-full h-48 p-5 bg-surface-container-lowest dark:bg-gray-800 border border-outline-variant/20 dark:border-gray-700 rounded-3xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none dark:text-gray-200 font-body"
            aria-label="M-Pesa transaction text input"
            disabled={isLoading}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-4 right-4 p-3 bg-error-container text-on-error-container rounded-xl flex items-center gap-2 text-xs font-medium border border-error/10"
              >
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full mt-6 py-4 bg-primary text-on-primary rounded-full font-headline font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Analyzing Vibe...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">analytics</span>
              Run Vibe Check
            </>
          )}
        </button>
      </form>
    </div>
  );
};
