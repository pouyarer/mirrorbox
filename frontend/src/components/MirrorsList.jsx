import { RefreshCw, Activity } from 'lucide-react';

const MirrorsList = ({ mirrors, loading, onRefresh, isDark }) => {
  return (
    <div className={`p-6 rounded-3xl h-full border backdrop-blur-sm transition-colors overflow-hidden relative flex flex-col
      ${isDark ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}
    `}>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <Activity className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>Mirror Status</h3>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading} 
          className={`p-2.5 rounded-xl border transition-all active:scale-95 
            ${isDark 
              ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/20' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'}
          `}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 relative z-10 overflow-y-auto pr-2 custom-scrollbar flex-grow">
        {mirrors.length === 0 ? (
          <div className="text-center py-10 text-slate-400 italic text-sm">
            Waiting for check...
          </div>
        ) : (
          mirrors.map((m, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group
              ${isDark 
                ? 'bg-black/20 border-white/5 hover:border-white/10' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'} // کارت های لایت مد سفید/طوسی
            `}>
              <span className={`text-sm font-mono font-bold truncate max-w-[180px] transition-colors
                ${isDark ? 'text-slate-300 group-hover:text-cyan-200' : 'text-slate-700 group-hover:text-cyan-700'}
              `}>
                {m.name.replace('https://', '')}
              </span>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {m.latency === Number.POSITIVE_INFINITY ? '---' : `${m.latency}ms`}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wide border
                  ${m.status.includes('Online') 
                    ? (isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-100 text-green-700 border-green-200')
                    : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-100 text-red-700 border-red-200')
                  }
                `}>
                  {m.status.includes('Online') ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MirrorsList;