import React from 'react';
import { signInWithGoogle } from '../firebase';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="mb-8 inline-flex p-4 bg-primary-container/30 dark:bg-primary-container/10 rounded-3xl text-primary transition-colors">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>wallet</span>
        </div>
        
        <h2 className="text-4xl font-extrabold text-on-surface dark:text-white mb-4 tracking-tight font-headline">
          Unlock Your Hustle's <span className="text-primary">Credit Vibe</span>
        </h2>
        
        <p className="text-on-surface-variant dark:text-gray-400 mb-10 text-lg leading-relaxed font-body">
          The first AI-driven financial passport for the Kenyan hustle economy. 
          Turn your M-Pesa history into a credit score that banks can't ignore.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-10 text-left font-body">
          <div className="flex items-start gap-3 p-4 bg-surface-container-low dark:bg-gray-900 rounded-2xl border border-outline-variant/10 shadow-sm transition-colors">
            <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-white">Secure Analysis</h4>
              <p className="text-sm text-on-surface-variant dark:text-gray-400">Your data is analyzed privately by Gemini AI.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-surface-container-low dark:bg-gray-900 rounded-2xl border border-outline-variant/10 shadow-sm transition-colors">
            <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
              <span className="material-symbols-outlined text-xl">bolt</span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface dark:text-white">Instant Results</h4>
              <p className="text-sm text-on-surface-variant dark:text-gray-400">Get your score and "Vibe Check" in seconds.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full py-5 px-6 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-headline font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
        
        <p className="mt-6 text-xs text-on-surface-variant/60 uppercase tracking-[0.2em] font-bold font-label">
          Trusted by 10,000+ Hustlers
        </p>
      </motion.div>
    </div>
  );
};
