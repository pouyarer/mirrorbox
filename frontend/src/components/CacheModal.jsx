import { useState, useEffect } from 'react';
import { X, Archive, Trash2, Save, HardDrive } from 'lucide-react';

const CacheModal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [imageToSave, setImageToSave] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadFiles = async () => {
    if (!window.pywebview) return;
    const list = await window.pywebview.api.get_cache_list();
    setFiles(list);
  };

  useEffect(() => {
    if (isOpen) loadFiles();
  }, [isOpen]);

  const handleDelete = async (filename) => {
    if(!confirm("Delete this cache file?")) return;
    setLoading(true);
    const newList = await window.pywebview.api.delete_cache_item(filename);
    setFiles(newList);
    setLoading(false);
  };

  const handleSaveToCache = async () => {
    if (!imageToSave) return;
    setLoading(true);
    setMsg("Saving... (This may take a while)");
    try {
        const res = await window.pywebview.api.save_image_to_cache(imageToSave);
        setMsg(res.message);
        loadFiles();
    } catch (e) {
        setMsg("Error: " + e);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 border transition-all flex flex-col max-h-[85vh]
        bg-white border-slate-200 text-slate-800
        dark:bg-[#0f172a] dark:border-white/10 dark:text-slate-200
      ">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-5 h-5"/></button>
        
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white text-slate-800">
          <Archive className="text-amber-500"/> Local Cache Manager
        </h2>

        {/* Save Section */}
        <div className="flex gap-2 mb-6 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
            <input 
                type="text" 
                className="flex-grow bg-transparent outline-none text-sm placeholder:text-slate-400 dark:text-white"
                placeholder="Image to save (e.g. nginx:latest)"
                value={imageToSave}
                onChange={(e) => setImageToSave(e.target.value)}
            />
            <button 
                onClick={handleSaveToCache}
                disabled={loading}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
                <Save className="w-4 h-4"/> {loading ? "Processing..." : "Save to Cache"}
            </button>
        </div>
        {msg && <p className="text-xs text-center mb-4 text-cyan-500 animate-pulse">{msg}</p>}

        {/* List Section */}
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {files.length === 0 ? (
                <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                    <HardDrive className="w-10 h-10 stroke-1"/>
                    <p>Cache is empty.</p>
                </div>
            ) : (
                files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border transition-colors bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                <Archive className="w-4 h-4"/>
                            </div>
                            <div>
                                <p className="font-mono text-sm font-bold">{file.filename}</p>
                                <p className="text-xs opacity-50">{file.size_mb} MB</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(file.filename)}
                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete from disk"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </div>
                ))
            )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 text-xs opacity-50 text-center">
            Files are stored in ~/.mirrorbox/cache
        </div>
      </div>
    </div>
  );
};

export default CacheModal;