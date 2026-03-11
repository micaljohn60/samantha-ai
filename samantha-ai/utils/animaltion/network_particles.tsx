"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Cube {
  x: number;
  y: number;
  delay: number;
  size: number;
}

export default function NeonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: any = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particles
    const numParticles = 50;
    const maxDistance = 150;
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    // Neon cubes
    const cubes: Cube[] = [
      { x: 0.45 * width, y: 0.8 * height, delay: 0, size: 8 },
      { x: 0.25 * width, y: 0.4 * height, delay: 2, size: 10 },
      { x: 0.75 * width, y: 0.5 * height, delay: 4, size: 12 },
      { x: 0.9 * width, y: 0.1 * height, delay: 6, size: 8 },
      { x: 0.1 * width, y: 0.85 * height, delay: 8, size: 10 },
      { x: 0.5 * width, y: 0.1 * height, delay: 10, size: 8 },
    ];

    let startTime = Date.now();

    function animate() {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Move & draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
      });

      // Draw particle connections
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,255,${1 - dist / maxDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw neon cubes with trail
      //   cubes.forEach((cube) => {
      //     const t = (elapsed - cube.delay) % 12; // cycle 12s
      //     if (t < 0) return;

      //     const scale = Math.min((t / 12) * 20, 20);
      //     const angle = t * 80; // rotation
      //     ctx.save();
      //     ctx.translate(cube.x, cube.y);
      //     ctx.rotate((angle * Math.PI) / 180);
      //     ctx.beginPath();
      //     ctx.rect(-scale / 2, -scale / 2, scale, scale);
      //     ctx.strokeStyle = "#ff00ff";
      //     ctx.lineWidth = 1.5;
      //     ctx.shadowBlur = 10;
      //     ctx.shadowColor = "#ff00ff";
      //     ctx.stroke();
      //     ctx.restore();
      //   });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
}
