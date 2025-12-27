const ActionCard = ({ title, description, icon: Icon, actionLabel, onAction, colorClass = "text-cyan-400", bgClass = "bg-cyan-500/20" }) => {
  return (
    <div className="group relative p-6 rounded-3xl transition-all duration-300 overflow-hidden backdrop-blur-sm border 
      bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1
      dark:bg-white/[0.03] dark:border-white/[0.05] dark:hover:bg-white/[0.05] dark:shadow-none dark:hover:translate-y-0
    ">
      {/* Background Glow (Only visible in Dark Mode) */}
      <div className="hidden dark:block absolute -right-10 -top-10 w-32 h-32 bg-current opacity-5 blur-[60px] rounded-full pointer-events-none text-white group-hover:opacity-10 transition-opacity" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon Container */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-black/5 dark:shadow-black/20 ${bgClass} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{title}</h3>
        
        {/* Description */}
        <p className="text-sm leading-relaxed mb-6 flex-grow font-light text-slate-600 dark:text-slate-400">
          {description}
        </p>
        
        {/* Button */}
        <button 
          onClick={onAction}
          className={`w-full py-3 px-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 active:scale-95
            bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300
            dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 dark:group-hover:border-white/20
          `}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default ActionCard;