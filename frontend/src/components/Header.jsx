import logo from '../assets/logo.png'; 

const Header = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
        <img 
          src={logo} 
          alt="MirrorBox Logo" 
          className="w-10 h-10 object-contain drop-shadow-md" 
        />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-slate-800 tracking-tight drop-shadow-sm transition-colors">
          MirrorBox <span className="text-cyan-500">v2</span>
        </h1>
        <p className="text-slate-400 text-xs font-bold tracking-widest mt-1 uppercase">Enterprise Docker Gateway</p>
      </div>
    </div>
  );
};

export default Header;