import { useState, useEffect, useRef } from 'react';
import { Zone } from '../../types';

interface CesiumLiveMapProps {
  className?: string;
  /** Live/sim zones overlaid as risk bubbles on the MapLibre surface */
  zones?: Zone[];
  feed?: 'live' | 'simulate';
}

export const CesiumLiveMap = ({ className, zones, feed = 'live' }: CesiumLiveMapProps) => {
  const [underground, setUnderground] = useState(false);
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(()=>{ setKey(k=>k+1); }, [underground]);

  // Push zone bubbles into the MapLibre iframe (surface view only)
  useEffect(()=>{
    if(underground || !zones || zones.length===0) return;
    const payload = {
      type:'FLOODGUARD_ZONES',
      feed,
      zones: zones.map(z=>({
        id: z.id, code: z.code,
        lat: z.coordinates.lat, lng: z.coordinates.lng,
        riskLevel: z.riskLevel,
        floodProbability: z.floodProbability,
        estimatedDepthCm: z.estimatedDepthCm,
      })),
    };
    const send = ()=>{ try{ iframeRef.current?.contentWindow?.postMessage(payload,'*'); }catch{/*noop*/} };
    send();
    // re-send after iframe (re)loads so no update is lost
    const t1=setTimeout(send,1200);
    const t2=setTimeout(send,3500);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  },[zones, feed, underground, key]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      {!underground ? (
        <iframe ref={iframeRef} key={`map-${key}`} src="/chennai-map.html" className="w-full h-full border-0" title="Chennai MapLibre" />
      ) : (
        <iframe key={`ug-${key}`} src="/underground.html" className="w-full h-full border-0" title="Cesium Underground" />
      )}
      {zones && zones.length > 0 && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${feed==='live' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/40'}`}>
            {feed==='live' ? '● LIVE FEED' : '● SIM FEED'}
          </span>
        </div>
      )}
      <button onClick={()=>setUnderground(!underground)} className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-cyan-500 text-white text-xs font-mono font-bold shadow-lg hover:bg-cyan-400 transition">
        {underground ? 'SURFACE' : 'UNDERGROUND'}
      </button>
    </div>
  );
};
