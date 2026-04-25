import React, { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // Node settings
    const nodeCount = Math.floor((w * h) / 15000); // Responsive count
    const nodes = [];
    const maxConnectionDist = 140;
    const cursorRadius = 200;
    
    // Mouse state
    let mouseX = w / 2;
    let mouseY = h / 2;
    let hasMouse = false;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.5 + 0.5
      });
    }

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      hasMouse = true;
    };
    const onLeave = () => { hasMouse = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    
    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      // Update & Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce edges
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        // Mouse interaction (repel slightly or attract)
        if (hasMouse) {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < cursorRadius) {
            // Magnetic effect towards cursor
            const force = (cursorRadius - dist) / cursorRadius;
            node.vx += (dx / dist) * force * 0.05;
            node.vy += (dy / dist) * force * 0.05;
          }
        }

        // Friction limits infinite speed buildup
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Base wandering speed
        const speed = Math.sqrt(node.vx*node.vx + node.vy*node.vy);
        if (speed < 0.2) {
           node.vx += (Math.random()-0.5)*0.1;
           node.vy += (Math.random()-0.5)*0.1;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fill();

        // Check connections
        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const dx = node.x - node2.x;
          const dy = node.y - node2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            const opacity = 1 - (dist / maxConnectionDist);
            ctx.strokeStyle = `rgba(0, 255, 157, ${opacity * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        
        // Draw connection to cursor if close
        if (hasMouse) {
          const distCursor = Math.sqrt((mouseX - node.x)**2 + (mouseY - node.y)**2);
          if (distCursor < cursorRadius) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseX, mouseY);
            const opacity = 1 - (distCursor / cursorRadius);
            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}
      aria-hidden="true"
    />
  );
}
