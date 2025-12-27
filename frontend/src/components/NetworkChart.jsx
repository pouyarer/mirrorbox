import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const NetworkChart = ({ data, isDark }) => {
  return (
    <div className={`w-full h-full rounded-3xl border backdrop-blur-sm transition-colors overflow-hidden flex flex-col
      ${isDark ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-white border-slate-200 shadow-sm'}
    `}>
      
      <div className="p-6 pb-0 mb-2 z-10">
        <h3 className={`text-lg font-bold flex items-center gap-2 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"/>
          Live Network Latency
        </h3>
        <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>REAL-TIME MIRROR RESPONSE TIME</p>
      </div>

      <div className="flex-grow w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#0891b2', fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="latency" 
              stroke="#06b6d4" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLatency)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkChart;