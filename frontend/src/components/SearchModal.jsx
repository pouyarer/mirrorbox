import { useState } from 'react';
import { X, Search, CheckCircle, XCircle } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    setResults(null);
    try {
      const res = await window.pywebview.api.search_image(query);
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl p-6 border transition-all
        bg-white border-slate-200 text-slate-800
        dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-200
      ">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5"/>
        </button>
        
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white text-slate-800">
          <Search className="text-cyan-500"/> Search Image
        </h2>

        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            className="flex-grow rounded-xl px-4 py-2 outline-none border transition-all
              bg-slate-50 border-slate-200 focus:border-cyan-500 text-slate-800 placeholder:text-slate-400
              dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-cyan-500 dark:placeholder:text-slate-500
            "
            placeholder="e.g. nginx:latest"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          <button 
            onClick={handleSearch}
            disabled={searching}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
          >
            {searching ? "..." : "Find"}
          </button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {results && results.map((r, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg border transition-colors
              bg-slate-50 border-slate-200
              dark:bg-white/5 dark:border-white/5
            ">
              <span className="font-mono text-sm opacity-80">{r.mirror}</span>
              {r.available ? (
                 <span className="flex items-center gap-1 text-green-500 text-xs font-bold"><CheckCircle className="w-4 h-4"/> FOUND</span>
              ) : (
                 <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-4 h-4"/> MISSING</span>
              )}
            </div>
          ))}
          {results && results.length === 0 && (
            <div className="text-center text-sm opacity-50 py-4">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;  