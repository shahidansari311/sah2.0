import { useEffect, useRef } from 'react';

export default function ParticleBackground({ darkMode }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Nodes
    const nodes = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Orbs
    const orbs = [
      { xRatio: 0.15, yRatio: 0.25, r: 380, color: darkMode ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.04)', speedX: 0.0008, speedY: 0.0005, phaseX: 0, phaseY: 1 },
      { xRatio: 0.85, yRatio: 0.55, r: 320, color: darkMode ? 'rgba(34,211,238,0.05)' : 'rgba(34,211,238,0.03)', speedX: 0.0006, speedY: 0.0009, phaseX: 2, phaseY: 0 },
      { xRatio: 0.5, yRatio: 0.75, r: 420, color: darkMode ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.02)', speedX: 0.0005, speedY: 0.0007, phaseX: 1, phaseY: 3 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;

      // Draw gradient orbs
      orbs.forEach((orb) => {
        const ox = (orb.xRatio * W) + Math.sin(t * orb.speedX * 100 + orb.phaseX) * 80;
        const oy = (orb.yRatio * H) + Math.cos(t * orb.speedY * 100 + orb.phaseY) * 60;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.18;
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.fillStyle = `rgba(59,130,246,${n.opacity * 0.7})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // Pulse ring on some nodes
        if (n.r > 1.4) {
          ctx.strokeStyle = `rgba(34,211,238,${n.opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          const pRad = n.r + 3 + Math.sin(t * 3 + n.x) * 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pRad, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: darkMode ? 1 : 0.6,
        transition: 'opacity 0.5s',
      }}
    />
  );
}
