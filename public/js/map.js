// Chennai 5x5 pilot — corridor hierarchical | Layer1 dots, Layer2 pipes
const map = new maplibregl.Map({
  container:'map',
  style:{
    version:8,
    sources:{
      dark:{type:'raster', tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'], tileSize:256, maxzoom:16, attribution:'ESRI Dark Gray • CMWSSB'},
      ref:{type:'raster', tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'], tileSize:256, maxzoom:16},
      esri:{type:'raster', tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize:256, maxzoom:19}
    },
    layers:[
      {id:'dark', type:'raster', source:'dark', paint:{'raster-opacity':0}},
      {id:'esri', type:'raster', source:'esri', paint:{'raster-opacity':0.98}},
      {id:'ref', type:'raster', source:'ref', paint:{'raster-opacity':0}}
    ]
  },
  center: (typeof CHENNAI_CENTER!=='undefined'? CHENNAI_CENTER : [80.24,13.06]),
  zoom: 14.2, pitch: 60, bearing: 0, maxPitch: 85, minPitch: 0, minZoom: 2, maxZoom: 17,
  antialias:true, dragRotate:true, touchZoomRotate:true, touchPitch:true, renderWorldCopies:true
});
map.addControl(new maplibregl.NavigationControl({showCompass:true, visualizePitch:true}), 'bottom-right');
setInterval(()=>{ const el=document.getElementById('clock'); if(el) el.textContent=new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); },1000);
map.on('load', ()=>{
  const drainFeatures = DRAINAGE_NETWORK.map(d=>({type:'Feature', properties:{id:d.id, mm:d.mm, thickness: d.mm>=1200?4 : d.mm>=700?2.8 : d.mm>=350?1.8 : d.mm>=200?1 : 0.6}, geometry:{type:'LineString', coordinates:d.coords}}));
  map.addSource('drains',{type:'geojson', data:{type:'FeatureCollection', features:drainFeatures}});
  map.addLayer({id:'drains-glow', type:'line', source:'drains', layout:{visibility:'none'}, paint:{'line-color':'#38bdf8','line-width':['*',['get','thickness'],2.2],'line-opacity':0.16,'line-blur':4}});
  map.addLayer({id:'drains-core', type:'line', source:'drains', layout:{visibility:'none'}, paint:{'line-color':['case',['>=',['get','mm'],1200],'#0369a1',['>=',['get','mm'],700],'#0284c7',['>=',['get','mm'],350],'#0ea5e9',['>=',['get','mm'],200],'#60a5fa','#93c5fd'],'line-width':['get','thickness'],'line-opacity':0.95}});
  if(typeof INFERRED_NETWORK!=='undefined'){
    const infFeatures = INFERRED_NETWORK.map(f=>({type:'Feature', properties:{id:f.id, sewer_type:f.sewer_type, connection_confidence:f.connection_confidence, sewer_type_confidence:f.sewer_type_confidence, thickness:f.thickness}, geometry:{type:'LineString', coordinates:f.coords}}));
    map.addSource('inferred',{type:'geojson', data:{type:'FeatureCollection', features:infFeatures}});
    map.addLayer({id:'inferred-glow', type:'line', source:'inferred', layout:{visibility:'none'}, paint:{'line-color':'#38bdf8','line-width':['*',['get','thickness'],2],'line-opacity':0.12,'line-blur':3}});
    map.addLayer({id:'inferred-core', type:'line', source:'inferred', layout:{visibility:'none'}, paint:{'line-color':['match',['get','sewer_type'],'trunk/main','#0284c7','secondary/collector','#0ea5e9','local/branch','#60a5fa','lateral/house','#93c5fd','#60a5fa'],'line-width':['get','thickness'],'line-opacity':['*',['get','connection_confidence'],0.9],'line-dasharray':[3,3]}});
  }
  const mhFeatures = (typeof MANHOLES!=='undefined'? MANHOLES:[]).map(m=>({type:'Feature', properties:{id:m.id}, geometry:{type:'Point', coordinates:m.coords}}));
  map.addSource('manholes',{type:'geojson', data:{type:'FeatureCollection', features:mhFeatures}});
  map.addLayer({id:'manholes-glow', type:'circle', source:'manholes', paint:{'circle-radius':6,'circle-color':'#0ea5e9','circle-blur':0.7,'circle-opacity':0.35}});
  map.addLayer({id:'manholes-core', type:'circle', source:'manholes', paint:{'circle-radius':2.8,'circle-color':'#38bdf8','circle-stroke-color':'#e0f2fe','circle-stroke-width':1,'circle-opacity':1}});
  const inletFeatures = JUNCTION_NODES.map(j=>({type:'Feature', properties:{id:j.id}, geometry:{type:'Point', coordinates:j.coords}}));
  map.addSource('inlets',{type:'geojson', data:{type:'FeatureCollection', features:inletFeatures}});
  map.addLayer({id:'inlets-glow', type:'circle', source:'inlets', paint:{'circle-radius':7,'circle-color':'#22d3ee','circle-blur':0.6,'circle-opacity':0.28}});
  map.addLayer({id:'inlets-core', type:'circle', source:'inlets', paint:{'circle-radius':3.2,'circle-color':'#22d3ee','circle-stroke-color':'#ecfeff','circle-stroke-width':1,'circle-opacity':1}});
  // previous heatmap — near manholes, red low (6m) → blue high (24m)
  const heatFeatures = MANHOLES.map(m=>{
    const elev=m.elevation||10;
    let risk='low';
    if(elev<=8) risk='critical';
    else if(elev<=11) risk='high';
    else if(elev<=15) risk='moderate';
    else if(elev<=19) risk='low';
    else risk='safe';
    const w = risk==='critical'?1 : risk==='high'?0.75 : risk==='moderate'?0.5 : risk==='low'?0.35 : 0.2;
    return {type:'Feature', properties:{weight:w}, geometry:{type:'Point', coordinates:m.coords}};
  });
  map.addSource('dem-heat',{type:'geojson', data:{type:'FeatureCollection', features:heatFeatures}});
  map.addLayer({id:'dem-heat', type:'heatmap', source:'dem-heat', layout:{visibility:'none'}, paint:{
    'heatmap-weight':['get','weight'],
    'heatmap-intensity':2.2,
    'heatmap-color':['interpolate',['linear'],['heatmap-density'],0,'rgba(0,0,0,0)',0.15,'#10b981',0.3,'#60a5fa',0.5,'#f59e0b',0.7,'#ef4444',0.9,'#991b1b',1,'#7f1d1d'],
    'heatmap-radius':['interpolate',['exponential',2],['zoom'],10,4,12,10,14,32,16,90,17,170],
    'heatmap-opacity':0.58
  }});
  // hover DEM per grid / manhole — use hit layer for heatmap
  let hoverPopup=null;
  map.on('mousemove', e=>{
    const feats=map.queryRenderedFeatures(e.point, {layers:['dem-heat']});
    if(feats.length){
      const p=feats[0].properties;
      const html=`<div style="font:11px JetBrains Mono">${p.risk||''} • ${p.elev?Math.round(p.elev)+'m':''}</div>`;
      if(!hoverPopup) hoverPopup=new maplibregl.Popup({closeButton:false, closeOnClick:false});
      hoverPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
    } else if(hoverPopup){ hoverPopup.remove(); hoverPopup=null; }
  });
  // click + hover with black font
  ['manholes-core','inlets-core','drains-core','inferred-core'].forEach(l=>{
    map.on('click', l, e=>{
      const f=e.features[0]; const p=f.properties;
      let elev='';
      if(l.includes('manhole')){
        const m=MANHOLES.find(x=>x.id===p.id);
        if(m && m.elevation) elev=` • ${m.elevation}m DEM`;
      }
      let html=`<div style="font:11px JetBrains Mono;color:#000">${p.id}${elev}`;
      if(p.sewer_type) html+=` • ${p.sewer_type}<br>conn ${p.connection_confidence} • type ${p.sewer_type_confidence}`;
      else if(p.mm) html+=` • ${p.mm}mm`;
      html+=`</div>`;
      new maplibregl.Popup({closeButton:false}).setLngLat(e.lngLat).setHTML(html).addTo(map);
    });
    map.on('mouseenter', l, (e)=>{
      const f=e.features[0];
      if(l.includes('manhole')){
        const m=MANHOLES.find(x=>x.id===f.properties.id);
        if(m){
          const html=`<div style="font:11px JetBrains Mono;color:#000">${m.id} • ${m.elevation}m • ${m.elevation<=8?'critical':m.elevation<=11?'high':m.elevation<=15?'moderate':'low'}</div>`;
          if(!window._hoverPop) window._hoverPop=new maplibregl.Popup({closeButton:false, closeOnClick:false});
          window._hoverPop.setLngLat(e.lngLat).setHTML(html).addTo(map);
        }
      }
    });
    map.on('mouseleave', l, ()=>{ if(window._hoverPop) window._hoverPop.remove(); });
    map.on('mouseenter', l, ()=> map.getCanvas().style.cursor='pointer');
    map.on('mouseleave', l, ()=> map.getCanvas().style.cursor='');
  });
});
let isDark=false;
function toggleTheme(){
  isDark=!isDark;
  const b=document.getElementById('darkToggle');
  if(isDark){
    map.setPaintProperty('dark','raster-opacity',1);
    map.setPaintProperty('esri','raster-opacity',0.14);
    map.setPaintProperty('ref','raster-opacity',0.9);
    b.innerHTML='<i class="ph ph-moon"></i>';
    b.className='h-7 px-3 rounded-full bg-white text-zinc-900 text-[11px] font-mono font-semibold flex items-center gap-1.5';
  } else {
    map.setPaintProperty('dark','raster-opacity',0);
    map.setPaintProperty('esri','raster-opacity',0.98);
    map.setPaintProperty('ref','raster-opacity',0);
    b.innerHTML='<i class="ph ph-sun"></i>';
    b.className='h-7 px-3 rounded-full bg-sky-500 text-white text-[11px] font-mono font-semibold flex items-center gap-1.5';
  }
}
window.toggleTheme=toggleTheme;
let isLayer2=false;
function toggleLayer(){
  isLayer2=!isLayer2;
  const b=document.getElementById('layerToggle');
  const vis=isLayer2?'visible':'none';
  if(map.getLayer('drains-core')){ map.setLayoutProperty('drains-core','visibility',vis); map.setLayoutProperty('drains-glow','visibility',vis); }
  if(map.getLayer('inferred-core')){ map.setLayoutProperty('inferred-core','visibility',vis); map.setLayoutProperty('inferred-glow','visibility',vis); }
  b.textContent=isLayer2?'LAYER 2':'LAYER 1';
  b.className=isLayer2?'h-7 px-3 rounded-full bg-sky-500 text-white text-[11px] font-mono font-semibold':'h-7 px-3 rounded-full bg-zinc-800 text-zinc-300 border border-white/10 text-[11px] font-mono font-semibold';
  const darkBtn=document.getElementById('darkToggle');
  if(isLayer2){
    map.setPaintProperty('dark','raster-opacity',1);
    map.setPaintProperty('esri','raster-opacity',0.14);
    map.setPaintProperty('ref','raster-opacity',0.9);
    isDark=true;
    if(darkBtn){ darkBtn.innerHTML='<i class="ph ph-moon"></i>'; darkBtn.className='h-7 px-3 rounded-full bg-white text-zinc-900 text-[11px] font-mono font-semibold flex items-center gap-1.5'; }
  } else {
    map.setPaintProperty('dark','raster-opacity',0);
    map.setPaintProperty('esri','raster-opacity',0.98);
    map.setPaintProperty('ref','raster-opacity',0);
    isDark=false;
    if(darkBtn){ darkBtn.innerHTML='<i class="ph ph-sun"></i>'; darkBtn.className='h-7 px-3 rounded-full bg-sky-500 text-white text-[11px] font-mono font-semibold flex items-center gap-1.5'; }
  }
}
window.toggleLayer=toggleLayer;
let heatOn=false;
function toggleHeat(){
  heatOn=!heatOn;
  const b=document.getElementById('heatToggle');
  if(map.getLayer('dem-heat')) map.setLayoutProperty('dem-heat','visibility', heatOn?'visible':'none');
  const manVis = heatOn ? 'none' : 'visible';
  ['manholes-core','manholes-glow','inlets-core','inlets-glow'].forEach(id=>{ if(map.getLayer(id)) map.setLayoutProperty(id,'visibility', manVis); });
  if(b){ b.textContent=heatOn?'HEAT ON':'HEAT OFF'; b.className=heatOn?'h-7 px-3 rounded-full bg-red-500 text-white text-[11px] font-mono font-semibold':'h-7 px-3 rounded-full bg-zinc-800 text-zinc-300 border border-white/10 text-[11px] font-mono font-semibold'; }
}
window.toggleHeat=toggleHeat;

// ---- FloodGuard LIVE overlay: risk bubbles pushed from the React shell ----
// Message: {type:'FLOODGUARD_ZONES', feed:'live'|'simulate',
//           zones:[{id,code,lat,lng,riskLevel,floodProbability,estimatedDepthCm}]}
let _liveZoneCache = null;
function _riskColor(r){ return r==='critical'?'#ef4444':r==='high'?'#f97316':r==='moderate'?'#f59e0b':'#10b981'; }
function _applyLiveZones(zones){
  try{
    if(!map.getSource('live-zones')){
      map.addSource('live-zones',{type:'geojson',data:{type:'FeatureCollection',features:[]}});
      map.addLayer({id:'live-zones-glow',type:'circle',source:'live-zones',paint:{'circle-radius':18,'circle-color':['match',['get','risk'],'critical','#ef4444','high','#f97316','moderate','#f59e0b','#10b981'],'circle-blur':0.85,'circle-opacity':0.35}});
      map.addLayer({id:'live-zones-core',type:'circle',source:'live-zones',paint:{'circle-radius':8,'circle-color':['match',['get','risk'],'critical','#ef4444','high','#f97316','moderate','#f59e0b','#10b981'],'circle-stroke-color':'#ffffff','circle-stroke-width':1.5}});
      map.addLayer({id:'live-zones-label',type:'symbol',source:'live-zones',layout:{'text-field':['concat',['get','code'],' ',['get','prob'],'%'],'text-size':11,'text-offset':[0,-1.6],'text-font':['Open Sans Bold']},paint:{'text-color':'#ffffff','text-halo-color':'#000000','text-halo-width':1.5}});
      map.on('click','live-zones-core',e=>{
        const p=e.features[0].properties;
        new maplibregl.Popup({closeButton:false}).setLngLat(e.lngLat)
          .setHTML(`<div style="font:11px JetBrains Mono;color:#000">${p.code} • ${p.risk} • ${p.prob}% • ${p.depth}cm</div>`).addTo(map);
      });
    }
    const feats=(zones||[]).filter(z=>z && typeof z.lat==='number' && typeof z.lng==='number').map(z=>({
      type:'Feature',
      properties:{id:z.id,code:z.code,risk:z.riskLevel,prob:Math.round(z.floodProbability),depth:Math.round(z.estimatedDepthCm)},
      geometry:{type:'Point',coordinates:[z.lng,z.lat]}
    }));
    map.getSource('live-zones').setData({type:'FeatureCollection',features:feats});
  }catch(err){ /* style not ready yet — retry on next message */ }
}
window.addEventListener('message', ev=>{
  const d=ev && ev.data;
  if(!d || d.type!=='FLOODGUARD_ZONES' || !Array.isArray(d.zones)) return;
  _liveZoneCache=d.zones;
  if(map.loaded()) _applyLiveZones(d.zones);
  else { let n=0; const t=setInterval(()=>{ if(map.loaded()||++n>20){clearInterval(t); if(map.loaded()) _applyLiveZones(_liveZoneCache);} },500); }
});
