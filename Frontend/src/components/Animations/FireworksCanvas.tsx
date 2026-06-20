"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

export const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { festivalMode } = useApp();

  useEffect(() => {
    if (!festivalMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track window resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;

      constructor(x: number, y: number, hue: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 2; // slight upward drift
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        // Festive colors (gold, red, green, silver, purple)
        this.color = `hsla(${hue}, 100%, 60%, `;
        this.size = Math.random() * 2 + 1.5;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ")";
        // Add gold/red glow shadow
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color + "1)";
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.vx *= 0.98; // friction
        this.vy += 0.05; // gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
    }

    // Rocket class
    class Rocket {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      hue: number;
      distanceToTarget: number;
      distanceTraveled: number;
      coordinates: [number, number][];
      coordinateCount: number;

      constructor(sx: number, sy: number, tx: number, ty: number, hue: number) {
        this.x = sx;
        this.y = sy;
        this.tx = tx;
        this.ty = ty;
        this.hue = hue;
        
        // Calculate velocities
        const angle = Math.atan2(ty - sy, tx - sx);
        const speed = Math.random() * 6 + 10;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      update() {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.x += this.vx;
        this.y += this.vy;

        this.distanceTraveled = Math.hypot(this.x - this.coordinates[this.coordinates.length - 1][0], this.y - this.coordinates[this.coordinates.length - 1][1]);
        // If rocket has hit its target height, return false so we explode it
        if (this.vy >= 0 || this.y <= this.ty) {
          return false;
        }
        return true;
      }
    }

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const createExplosion = (x: number, y: number, hue: number) => {
      const particleCount = Math.floor(Math.random() * 50) + 40;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, hue));
      }
    };

    // Auto launcher timer
    let ticks = 0;

    const loop = () => {
      if (!ctx) return;
      
      // Request another animation frame
      animationId = requestAnimationFrame(loop);

      // Create trailing opacity effect for motion blur
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // Auto launch rocket
      ticks++;
      if (ticks % 60 === 0 && rockets.length < 5) {
        const startX = Math.random() * (width - 200) + 100;
        const startY = height;
        const targetX = Math.random() * (width - 200) + 100;
        const targetY = Math.random() * (height / 2);
        // Golden hues (30-50), Red/Crimson (0 or 360), Emerald Green (120), Purple (270)
        const hues = [35, 45, 0, 120, 280, 340];
        const randomHue = hues[Math.floor(Math.random() * hues.length)];
        rockets.push(new Rocket(startX, startY, targetX, targetY, randomHue));
      }

      // Update and draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.draw();
        const alive = rocket.update();
        if (!alive) {
          createExplosion(rocket.x, rocket.y, rocket.hue);
          rockets.splice(i, 1);
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.draw();
        p.update();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    // Trigger explosion on user click
    const handleCanvasClick = (e: MouseEvent) => {
      const hues = [35, 45, 0, 120, 280, 340];
      const randomHue = hues[Math.floor(Math.random() * hues.length)];
      
      // Create a rocket shooting from bottom center to the click coordinates
      const startX = width / 2;
      const startY = height;
      const targetX = e.clientX;
      const targetY = e.clientY;
      
      rockets.push(new Rocket(startX, startY, targetX, targetY, randomHue));
    };

    canvas.addEventListener("click", handleCanvasClick);
    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
      }
      cancelAnimationFrame(animationId);
    };
  }, [festivalMode]);

  if (!festivalMode) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0 opacity-40 select-none no-print"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
