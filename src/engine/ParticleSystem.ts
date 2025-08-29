interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  update(deltaTime: number): void {
    this.particles.forEach((particle) => {
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.life -= deltaTime;
      particle.vy += 100 * deltaTime; // Gravity
    });

    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  createExplosion(x: number, y: number, color: string = "#FF4444"): void {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 50 + Math.random() * 50;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1,
        color,
        size: 2 + Math.random() * 2,
      });
    }
  }

  createImpact(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 30;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        color: "#FFAA00",
        size: 1 + Math.random(),
      });
    }
  }

  createMuzzleFlash(x: number, y: number, targetX: number, targetY: number): void {
    const angle = Math.atan2(targetY - y, targetX - x);

    for (let i = 0; i < 3; i++) {
      const spreadAngle = angle + (Math.random() - 0.5) * 0.5;
      const speed = 80 + Math.random() * 40;

      this.particles.push({
        x,
        y,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        life: 0.1 + Math.random() * 0.1,
        maxLife: 0.2,
        color: "#FFFFAA",
        size: 1,
      });
    }
  }
}
