import React, { useEffect, useRef, useState } from 'react';
import ReactGlobe from 'react-globe.gl';

const CITIES = [
  { code: 'AMD', name: 'Ahmedabad', lat: 23.03, lon: 72.58, color: '#00ff9d', size: 1.5, offset: 'translate(10px, -50%)' },
  { code: 'YHZ', name: 'Halifax', lat: 44.65, lon: -63.59, color: '#ffab00', size: 0.8, offset: 'translate(10px, -150%)' },
  { code: 'YUL', name: 'Montréal', lat: 45.51, lon: -73.56, color: '#ffab00', size: 0.8, offset: 'translate(10px, -50%)' },
  { code: 'YYZ', name: 'Toronto', lat: 43.65, lon: -79.38, color: '#00e5ff', size: 2, offset: 'translate(10px, 50%)' },
];

const ARCS = [
  { startLat: 23.03, startLng: 72.58, endLat: 44.65, endLng: -63.59, color: ['#00ff9d', '#ffab00'] },
  { startLat: 44.65, startLng: -63.59, endLat: 45.51, endLng: -73.56, color: ['#ffab00', '#ffab00'] },
  { startLat: 45.51, startLng: -73.56, endLat: 43.65, endLng: -79.38, color: ['#ffab00', '#00e5ff'] }
];

export default function Globe({ activeCity }) {
  const containerRef = useRef();
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
         const { width, height } = entries[0].contentRect;
         setDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;
    
    if (activeCity) {
      const city = CITIES.find(c => c.code === activeCity);
      if (city) {
        globeEl.current.pointOfView({ lat: city.lat, lng: city.lon, altitude: 1.8 }, 1500);
        globeEl.current.controls().autoRotate = false;
      }
    } else {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableDamping = true;
      globeEl.current.pointOfView({ lat: 35, lng: -40, altitude: 2.2 }, 2000);
    }
  }, [dimensions.width, activeCity]); // Re-run if canvas mounts or city changes

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px', 
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {dimensions.width > 0 && (
         <ReactGlobe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            
            // Textures for realistic look
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            
            // Atmosphere and environment
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#00e5ff"
            atmosphereAltitude={0.15}
            
            // Rings for cities
            ringsData={CITIES}
            ringLat="lat"
            ringLng="lon"
            ringColor={(d) => d.color}
            ringMaxRadius={(d) => d.size * 2}
            ringPropagationSpeed={1}
            ringRepeatPeriod={800}

            // Arcs tracing the journey
            arcsData={ARCS}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={2500}
            arcAltitude={0.2}
            arcStroke={1.5}

            // High-end HTML Labels for place names
            htmlElementsData={CITIES}
            htmlLat="lat"
            htmlLng="lon"
            htmlElement={(d) => {
              const el = document.createElement('div');
              el.innerHTML = `
                <div style="
                  color: #fff; 
                  font-family: 'Inter', sans-serif; 
                  font-size: 13px; 
                  font-weight: 500; 
                  text-shadow: 0 0 10px ${d.color}, 0 0 20px ${d.color}; 
                  display: flex; 
                  align-items: center; 
                  gap: 6px; 
                  pointer-events: none; 
                  transform: ${d.offset || 'translate(10px, -50%)'}; 
                  opacity: 0.95; 
                  background: rgba(13, 34, 54, 0.7); 
                  padding: 4px 8px; 
                  border-radius: 6px; 
                  border-left: 2px solid ${d.color};
                  backdrop-filter: blur(4px);
                  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                  white-space: nowrap;
                ">
                  ${d.name}
                </div>
              `;
              return el;
            }}
         />
      )}
    </div>
  );
}
