import { useState } from 'react';
import { 
  X, BookOpen, Terminal, Shield, Layers, Search, 
  Archive, Copy, Check, ChevronRight, Server, AlertTriangle 
} from 'lucide-react';

const CodeBlock = ({ cmd }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-2">
      <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-400"/> : <Copy className="w-3 h-3"/>}
        </button>
      </div>
      <pre className="bg-[#1e293b] text-slate-300 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-white/10 shadow-inner">
        <code>{cmd}</code>
      </pre>
    </div>
  );
};

// کامپوننت کمکی برای نمایش تمیز هر دستور
const CommandItem = ({ cmd, desc, isRoot, isDark }) => (
  <div className={`p-3 rounded-xl border mb-3 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
    <div className="flex justify-between items-center mb-1">
      <code className="text-cyan-500 font-bold text-xs">{cmd.split(' ')[0]} <span className={isDark ? "text-slate-300" : "text-slate-600"}>{cmd.substring(cmd.indexOf(' ') + 1)}</span></code>
      {isRoot && (
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-bold tracking-wider">
          ROOT
        </span>
      )}
    </div>
    <p className="text-[11px] opacity-70">{desc}</p>
  </div>
);

const SectionTitle = ({ icon: Icon, title, colorClass }) => (
  <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${colorClass}`}>
    <Icon className="w-6 h-6" />
    {title}
  </h2>
);

const DocsModal = ({ isOpen, onClose, isDark }) => {
  const [activeTab, setActiveTab] = useState('start');

  if (!isOpen) return null;

  const tabs = [
    { id: 'start', label: 'Getting Started', icon: BookOpen },
    { id: 'cli', label: 'CLI Reference', icon: Terminal },
    { id: 'features', label: 'Core Features', icon: Server },
    { id: 'gui', label: 'GUI Guide', icon: Layers },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'start':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <SectionTitle icon={BookOpen} title="Welcome to MirrorBox v2" colorClass="text-cyan-500" />
              <p className="text-sm leading-relaxed opacity-80 mb-4">
                MirrorBox is an enterprise-grade Docker wrapper designed to bypass sanctions seamlessly. 
                It routes traffic through high-speed mirrors and secures internal container networks.
              </p>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'} flex gap-3`}>
                 <div className="mt-1"><Shield className="w-5 h-5 text-cyan-500"/></div>
                 <div>
                   <h4 className="font-bold text-sm mb-1">Why MirrorBox?</h4>
                   <p className="text-xs opacity-70">Fixes 403 Forbidden errors instantly without complex VPN configs.</p>
                 </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-sm">Quick Usage</h3>
              <p className="text-xs opacity-70 mb-2">Simply replace <code className="bg-slate-500/20 px-1 rounded">docker</code> with <code className="bg-cyan-500/20 px-1 rounded text-cyan-500">mirrorbox</code>:</p>
              <CodeBlock cmd="mirrorbox run -d -p 80:80 nginx:alpine" />
            </div>
          </div>
        );

      case 'cli':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div>
               <SectionTitle icon={Terminal} title="Full Command Reference" colorClass="text-purple-500" />
               <p className="text-sm opacity-80 mb-4">MirrorBox CLI is split into management commands and docker proxy commands.</p>
             </div>

             {/* Group 1: Management */}
             <div>
               <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-pink-400">
                 <Shield className="w-4 h-4"/> Management & Config
               </h3>
               <CommandItem isDark={isDark} isRoot cmd="mirrorbox setup" desc="Configures Docker Daemon with Mirrors & DNS. (Recommended)" />
               <CommandItem isDark={isDark} isRoot cmd="mirrorbox unsetup" desc="Restores original Docker configuration." />
               <CommandItem isDark={isDark} cmd="mirrorbox open" desc="Launches this graphical dashboard." />
             </div>

             {/* Group 2: Tools */}
             <div>
               <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-amber-400">
                 <Search className="w-4 h-4"/> Power Tools
               </h3>
               <CommandItem isDark={isDark} cmd="mirrorbox search <image>" desc="Searches for an image across all available mirrors." />
               <CommandItem isDark={isDark} cmd="mirrorbox compose <cmd>" desc="Wrapper for docker-compose (up, down, logs, etc)." />
             </div>

             {/* Group 3: Proxy */}
             <div>
               <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-cyan-400">
                 <Terminal className="w-4 h-4"/> Docker Proxy
               </h3>
               <p className="text-xs opacity-60 mb-2 italic">Use these just like standard docker commands:</p>
               <CommandItem isDark={isDark} cmd="mirrorbox pull <image>" desc="Smart Pull: Finds best mirror & downloads." />
               <CommandItem isDark={isDark} cmd="mirrorbox run <args>" desc="Smart Run: Injects mirrors, keeps flags (-d, -p)." />
               <CommandItem isDark={isDark} cmd="mirrorbox <any_command>" desc="Pass-through: Executes any other docker command (ps, logs)." />
             </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <SectionTitle icon={Server} title="Core Architectures" colorClass="text-amber-500" />
             <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                   <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-2"><Terminal className="w-4 h-4"/> Smart Proxy Mode</h3>
                   <p className="text-xs leading-relaxed opacity-70">Intercepts commands on-the-fly. Modifies image URL only, preserving all other flags.</p>
                </div>
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                   <h3 className="font-bold text-indigo-400 flex items-center gap-2 mb-2"><Shield className="w-4 h-4"/> System-Wide Mode</h3>
                   <p className="text-xs leading-relaxed opacity-70">Injects mirrors and DNS directly into <code className="bg-slate-500/20 px-1 rounded">daemon.json</code>.</p>
                </div>
             </div>
          </div>
        );
        
      case 'gui':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <SectionTitle icon={Layers} title="GUI Features" colorClass="text-pink-500" />
             <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                   <Search className="w-8 h-8 text-purple-400"/>
                   <h4 className="font-bold text-sm">Image Search</h4>
                </div>
                <div className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                   <Archive className="w-8 h-8 text-amber-400"/>
                   <h4 className="font-bold text-sm">Local Cache</h4>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl flex overflow-hidden border transition-all ${isDark ? 'bg-[#0f172a] border-white/10 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className={`w-64 border-r p-6 flex flex-col gap-2 ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
          <div className="mb-6 px-2">
            <h2 className="font-bold text-lg tracking-tight">Documentation</h2>
            <p className="text-xs opacity-50">v2.0 Enterprise</p>
          </div>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id ? (isDark ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-white text-cyan-600 shadow-sm border border-slate-200') : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <div className="mt-auto pt-6 border-t border-white/5">
             <button onClick={onClose} className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors">Close Docs</button>
          </div>
        </div>
        <div className="flex-grow p-8 overflow-y-auto custom-scrollbar relative">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors opacity-50 hover:opacity-100"><X className="w-5 h-5" /></button>
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DocsModal;