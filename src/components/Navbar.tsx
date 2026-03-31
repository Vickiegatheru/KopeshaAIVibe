import React from 'react';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const user = auth.currentUser;
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-background/70 dark:bg-inverse-surface/70 backdrop-blur-3xl z-50 transition-colors">
      <div className="flex items-center gap-3">
        {user && (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shrink-0">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
            )}
          </div>
        )}
        <span className="text-2xl font-black bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent font-headline tracking-tight">
          KopeshaVibe
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors active:scale-95 duration-200 text-primary dark:text-primary-container"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-white/10 transition-colors active:scale-95 duration-200 text-primary dark:text-primary-container">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
};
