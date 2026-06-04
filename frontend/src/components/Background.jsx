import React, { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class definition
    class Particle {
      constructor(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.15;
      }

      update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce at boundaries
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }

      draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(168, 85, 247, ${this.alpha})`; // Purple glow
        c.shadowBlur = 4;
        c.shadowColor = '#a855f7';
        c.fill();
        c.shadowBlur = 0; // Reset shadow for line draws
      }
    }

    // Initialize particles
    const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    const particles = Array.from(
      { length: particleCount },
      () => new Particle(window.innerWidth, window.innerHeight)
    );

    // Animation loop
    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.update(width, height);
        p.draw(ctx);
      });

      // Draw neural connections (lines between close particles)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue connecting lines
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-[#020617] pointer-events-none">
      {/* 1. Cinematic Animated Glowing Background Orbs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px] top-[-10%] left-[-10%] animate-float"
        style={{ animationDuration: '12s' }}
      />
      <div 
        className="absolute w-[700px] h-[700px] rounded-full bg-purple-600/8 blur-[160px] bottom-[-20%] right-[-10%] animate-float-slow"
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/6 blur-[120px] top-[30%] right-[20%] animate-float"
        style={{ animationDuration: '15s', animationDelay: '-4s' }}
      />

      {/* 2. Cybernetic Scroll-moving Grid overlay */}
      <div className="absolute inset-0 ai-grid-background opacity-[0.6] animate-grid-move pointer-events-none" />

      {/* 3. Neural canvas particle layer */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />

      {/* 4. Radial Vignette for cinema atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020617_90%)] opacity-85 pointer-events-none" />
    </div>
  );
}
