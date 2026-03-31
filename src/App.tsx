import React, { useState, useEffect, useRef } from 'react';
import { auth, db, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { AnalysisForm } from './components/AnalysisForm';
import { ScoreDisplay } from './components/ScoreDisplay';
import { History } from './components/History';
import { AnalysisResult } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';

type View = 'home' | 'analyze' | 'insights' | 'profile';

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState<View>('home');
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToHistory = () => {
    setActiveView('home');
    setTimeout(() => {
      historyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-inverse-surface flex items-center justify-center transition-colors">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-8">
            <section className="space-y-2">
              <h1 className="text-3xl font-extrabold font-headline tracking-tight text-primary">Habari!</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">Ready for a <span className="text-secondary font-bold">Vibe Check?</span> Your credit story starts here.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-lg shadow-[0_4px_24px_rgba(4,105,73,0.04)] relative overflow-hidden flex flex-col items-center dark:bg-gray-900 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-8xl">bolt</span>
                </div>
                <h2 className="text-primary font-bold font-headline text-xl mb-6">Your Credit Vibe</h2>
                <div className="relative w-64 h-32 overflow-hidden">
                  <div className="vibe-meter-gradient w-64 h-64 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-primary-dim origin-bottom rotate-[45deg] transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-lg"></div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-5xl font-black font-headline text-primary">72</span>
                  <p className="text-secondary font-bold uppercase tracking-widest text-xs mt-1">Excellent Vibe</p>
                </div>
                <div className="mt-8 w-full flex gap-4">
                  <button 
                    onClick={() => setActiveView('analyze')}
                    className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">analytics</span> Check My Vibe
                  </button>
                </div>
              </div>

              <button 
                onClick={scrollToHistory}
                className="bg-secondary-container p-6 rounded-lg flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all text-left"
              >
                <span className="material-symbols-outlined text-secondary text-3xl mb-4">history</span>
                <div>
                  <h3 className="font-headline font-bold text-on-secondary-container">Past Vibe History</h3>
                  <p className="text-on-secondary-container/70 text-sm">See how your hustle has grown</p>
                </div>
              </button>
              <button 
                onClick={() => setActiveView('insights')}
                className="bg-surface-container-high p-6 rounded-lg flex flex-col justify-between group cursor-pointer hover:shadow-md transition-all dark:bg-gray-800 text-left"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-4">insights</span>
                <div>
                  <h3 className="font-headline font-bold text-on-surface dark:text-white">Vibe Tips</h3>
                  <p className="text-on-surface-variant text-sm dark:text-gray-400">Boost your score with AI insights</p>
                </div>
              </button>
            </div>

            <div ref={historyRef}>
              <History />
            </div>
          </div>
        );
      case 'analyze':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-headline font-extrabold text-3xl text-primary leading-tight mb-3">Feed the AI Vibe.</h1>
              <p className="text-on-surface-variant font-medium dark:text-gray-400">Power up your credit score by pasting your latest transaction logs below.</p>
            </div>
            <AnalysisForm onAnalysisComplete={(res) => {
              setCurrentResult(res);
              setActiveView('insights');
            }} />
          </div>
        );
      case 'insights':
        return currentResult ? (
          <ScoreDisplay result={currentResult} />
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">analytics</span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface dark:text-white mb-2">No Analysis Yet</h3>
            <p className="text-on-surface-variant dark:text-gray-400 mb-8">Run a vibe check to see your insights.</p>
            <button 
              onClick={() => setActiveView('analyze')}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg"
            >
              Start Analysis
            </button>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm flex flex-col items-center text-center dark:bg-gray-900 transition-colors">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container mb-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-white">{user?.displayName}</h2>
              <p className="text-on-surface-variant dark:text-gray-400 mb-6">{user?.email}</p>
              <button 
                onClick={() => logout()}
                className="bg-error-container text-on-error-container px-8 py-3 rounded-full font-bold flex items-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span> Logout
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-inverse-surface font-body text-on-surface antialiased transition-colors">
      <Navbar onProfileClick={() => setActiveView('profile')} />
      
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {!user ? (
          <Auth />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {user && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-background/70 dark:bg-inverse-surface/70 backdrop-blur-3xl rounded-t-[2rem] shadow-[0_-4px_24px_rgba(4,105,73,0.04)] transition-colors">
          <button 
            onClick={() => setActiveView('home')}
            className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 duration-300 ease-out ${
              activeView === 'home' 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 mb-2 scale-110 shadow-lg' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            {activeView !== 'home' && <span className="font-label font-semibold text-[10px] uppercase tracking-widest mt-1">Home</span>}
          </button>

          <button 
            onClick={() => setActiveView('analyze')}
            className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 duration-300 ease-out ${
              activeView === 'analyze' 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 mb-2 scale-110 shadow-lg' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'analyze' ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
            {activeView !== 'analyze' && <span className="font-label font-semibold text-[10px] uppercase tracking-widest mt-1">Analyze</span>}
          </button>

          <button 
            onClick={() => setActiveView('insights')}
            className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 duration-300 ease-out ${
              activeView === 'insights' 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 mb-2 scale-110 shadow-lg' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'insights' ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
            {activeView !== 'insights' && <span className="font-label font-semibold text-[10px] uppercase tracking-widest mt-1">Insights</span>}
          </button>

          <button 
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 duration-300 ease-out ${
              activeView === 'profile' 
                ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-full p-3 mb-2 scale-110 shadow-lg' 
                : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
            {activeView !== 'profile' && <span className="font-label font-semibold text-[10px] uppercase tracking-widest mt-1">Profile</span>}
          </button>
        </nav>
      )}
    </div>
  );
}
