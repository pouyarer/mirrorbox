import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      className={`
        p-2 rounded-xl transition-all duration-300 border
        ${isDark 
          ? 'bg-white/5 border-white/10 text-cyan-400 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
          : 'bg-white border-slate-200 text-orange-500 shadow-sm hover:shadow-md'
        }
      `}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;