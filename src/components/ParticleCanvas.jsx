import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ darkMode }) {
  const ref = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;
    const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
    resize(); window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4, op: Math.random() * 0.4 + 0.15,
    }));

    const orbs = [
      { rx: 0.12, ry: 0.22, r: 420, c: 'rgba(59,130,246,', sx: 0.8, sy: 0.5, px: 0, py: 1, a: 0.07 },
      { rx: 0.88, ry: 0.6,  r: 360, c: 'rgba(34,211,238,',  sx: 0.6, sy: 0.9, px: 2, py: 0, a: 0.05 },
      { rx: 0.5,  ry: 0.8,  r: 480, c: 'rgba(139,92,246,', sx: 0.5, sy: 0.7, px: 1, py: 3, a: 0.04 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H); t += 0.008;
      orbs.forEach(o => {
        const ox = o.rx * W + Math.sin(t * o.sx + o.px) * 90;
        const oy = o.ry * H + Math.cos(t * o.sy + o.py) * 70;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, o.c + o.a + ')'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, o.r, 0, Math.PI * 2); ctx.fill();
      });
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if(n.x<0||n.x>W) n.vx*=-1; if(n.y<0||n.y>H) n.vy*=-1; });
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) {
        const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<170){ ctx.strokeStyle=`rgba(59,130,246,${0.15*(1-d/170)})`; ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
      }
      nodes.forEach(n => { ctx.fillStyle=`rgba(59,130,246,${n.op})`; ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill(); });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [darkMode]);

  return <canvas ref={ref} id="particle-canvas" style={{ opacity: darkMode ? 1 : 0.5, transition: 'opacity 0.5s' }} />;
}
