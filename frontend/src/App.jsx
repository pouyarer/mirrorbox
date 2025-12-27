import { useState, useEffect } from 'react'
import { Terminal, Download, BookOpen, Heart, Globe, Search, Layers, Archive, Wifi, WifiOff, X } from 'lucide-react'
import Header from './components/Header'
import ActionCard from './components/ActionCard'
import MirrorsList from './components/MirrorsList'
import NetworkChart from './components/NetworkChart'
import DocsModal from './components/DocsModal'
import ThemeToggle from './components/ThemeToggle'
import SearchModal from './components/SearchModal'
import CacheModal from './components/CacheModal'

const StatusToast = ({ message, onClose, isDark }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-4 transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 border
      ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'}
    `}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4"/>
      </button>
    </div>
  );
};

function App() {
  const [isDark, setIsDark] = useState(true)
  const [statusMsg, setStatusMsg] = useState("") 
  const [isOnline, setIsOnline] = useState(true) 
  const [mirrors, setMirrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState([])
  const [isPyWebView, setIsPyWebView] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showCache, setShowCache] = useState(false)

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 4000);
  }

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  useEffect(() => {
    const checkConnection = () => {
      if (window.pywebview) {
        setIsPyWebView(true)
        showStatus("System Ready")
        handleCheckMirrors()
      }
    }
    window.addEventListener('pywebviewready', checkConnection)
    if(window.pywebview) checkConnection()
    return () => window.removeEventListener('pywebviewready', checkConnection)
  }, [])

  useEffect(() => {
    if (!isPyWebView) return;
    const interval = setInterval(async () => {
      try {
        const stats = await window.pywebview.api.get_network_stats()
        
        if (stats.latency === 0) setIsOnline(false);
        else setIsOnline(true);

        setChartData(prev => {
          const newData = [...prev, stats]
          if (newData.length > 20) newData.shift()
          return newData
        })
      } catch (e) {
        setIsOnline(false);
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [isPyWebView])

  const handleCheckMirrors = async () => {
    if (!window.pywebview) return
    setLoading(true)
    try {
      const results = await window.pywebview.api.check_mirrors()
      setMirrors(results)
    } catch (e) { showStatus("Sync Error") } 
    finally { setLoading(false) }
  }

  const handlePullTest = async () => {
    if (!window.pywebview) return
    showStatus("🚀 Pulling Alpine... (Check Terminal for details)")
    const res = await window.pywebview.api.pull_image("alpine:latest")
    showStatus(res.message)
  }

  const handleCompose = async () => {
    if (!window.pywebview) return;
    try {
        const filePath = await window.pywebview.api.select_compose_file();
        if (filePath) {
            showStatus("Running Compose...");
            const res = await window.pywebview.api.run_compose(filePath);
            showStatus(res.success ? "✅ Compose Started" : "❌ Compose Failed");
            if (!res.success) alert(res.message);
        }
    } catch (e) {
        showStatus("Error: " + e);
    }
  }

  const openLink = (url) => {
    if (window.pywebview) window.pywebview.api.open_external_link(url)
    else window.open(url, '_blank')
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-cyan-500/30 p-8 flex justify-center overflow-x-hidden ${isDark ? 'bg-[#0a0a0c] text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-700 ${isDark ? 'bg-blue-900/10' : 'bg-blue-300/30'}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-700 ${isDark ? 'bg-purple-900/10' : 'bg-purple-300/30'}`} />
      </div>

      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center">
        
        {/* --- HEADER --- */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
           <Header />
           <div className="flex items-center gap-4 bg-white/5 p-2 pr-4 rounded-2xl backdrop-blur-sm border border-white/5 shadow-sm">
             
             <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 transition-all border hidden sm:flex 
               ${isOnline 
                  ? (isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-100 border-green-200 text-green-700') 
                  : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-200 text-red-600')
               }`}>
               {isOnline ? <Wifi className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>}
               {isOnline ? 'ONLINE' : 'OFFLINE'}
             </div>

             <div className="w-px h-6 bg-current opacity-10 hidden sm:block"></div>
             <button onClick={() => openLink('https://pay.oxapay.com/14009511')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-pink-500/30 active:scale-95 text-white ${isDark ? 'bg-gradient-to-r from-pink-600 to-rose-600' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Support</span>
             </button>
             <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
           </div>
        </div>

        {/* --- ACTION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full mb-8">
            <ActionCard 
                title="Smart Proxy" 
                icon={Terminal} 
                description="CLI Commands" 
                actionLabel="Test Pull" 
                onAction={handlePullTest}
                bgClass={isDark ? "bg-cyan-500/20" : "bg-cyan-100"}
                colorClass={isDark ? "text-cyan-400" : "text-cyan-600"}
            />
            <ActionCard 
                title="Image Search" 
                icon={Search} 
                description="Find images" 
                actionLabel="Search Now" 
                onAction={() => setShowSearch(true)}
                bgClass={isDark ? "bg-purple-500/20" : "bg-purple-100"}
                colorClass={isDark ? "text-purple-400" : "text-purple-600"}
            />
            
            <ActionCard 
               title="Local Cache" 
               icon={Archive} 
               description="Offline Storage" 
               actionLabel="Manage Files" 
               onAction={() => setShowCache(true)}
               bgClass={isDark ? "bg-amber-500/20" : "bg-amber-100"}
               colorClass={isDark ? "text-amber-400" : "text-amber-600"}
            />

            <ActionCard 
                title="Docker Compose" 
                icon={Layers} 
                description="Run projects" 
                actionLabel="Select File" 
                onAction={handleCompose}
                bgClass={isDark ? "bg-orange-500/20" : "bg-orange-100"}
                colorClass={isDark ? "text-orange-400" : "text-orange-600"}
            />
            <ActionCard 
                title="Daemon Config" 
                icon={Download} 
                description="Root Setup" 
                actionLabel="Setup Info" 
                onAction={() => showStatus("Use CLI: sudo mirrorbox setup")}
                bgClass={isDark ? "bg-indigo-500/20" : "bg-indigo-100"}
                colorClass={isDark ? "text-indigo-400" : "text-indigo-600"}
            />
        </div>

        {/* --- DASHBOARD --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-grow h-[300px]">
              <NetworkChart data={chartData} isDark={isDark} />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-grow h-[220px]"> 
               <MirrorsList mirrors={mirrors} loading={loading} onRefresh={handleCheckMirrors} isDark={isDark} />
            </div>
            <div onClick={() => setShowDocs(true)} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Documentation</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Learn commands & setup</p>
                </div>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className={`w-full pt-6 pb-2 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm transition-colors mt-auto ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
           <div className="flex items-center gap-2 pl-2">
             <span className="opacity-70">Powered By</span>
             <span className={`font-bold tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Testeto</span>
           </div>
           <div onClick={() => openLink('https://pouyarezapour.ir')} className="group flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 pr-2">
             <div className={`p-1.5 rounded-full transition-colors ${isDark ? 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white' : 'bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white'}`}>
               <Globe className="w-3.5 h-3.5" />
             </div>
             <span className={`font-medium border-b border-transparent group-hover:border-current transition-all ${isDark ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-600 group-hover:text-cyan-600'}`}>
               Pouya Rezapour
             </span>
           </div>
        </footer>

      </div>

      {/* --- MODALS & TOAST --- */}
      <StatusToast message={statusMsg} onClose={() => setStatusMsg("")} isDark={isDark} />
      
      <CacheModal isOpen={showCache} onClose={() => setShowCache(false)} />
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <DocsModal isOpen={showDocs} onClose={() => setShowDocs(false)} isDark={isDark} />
    </div>
  )
}

export default App