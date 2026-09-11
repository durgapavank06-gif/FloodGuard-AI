import { useState, useEffect } from 'react';
export const CesiumLiveMap = ({ className }: { className?: string }) => {
  const [underground, setUnderground] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(()=>{ setKey(k=>k+1); }, [underground]);
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      {!underground ? (
        <iframe key={`map-${key}`} src="/chennai-map.html" className="w-full h-full border-0" title="Chennai MapLibre" />
      ) : (
        <iframe key={`ug-${key}`} src="/underground.html" className="w-full h-full border-0" title="Cesium Underground" />
      )}
      <button onClick={()=>setUnderground(!underground)} className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-cyan-500 text-white text-xs font-mono font-bold shadow-lg hover:bg-cyan-400 transition">
        {underground ? 'SURFACE' : 'UNDERGROUND'}
      </button>
    </div>
  );
};
