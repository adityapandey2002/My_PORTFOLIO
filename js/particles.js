/* Canvas-based Particle Network Background */
const ParticleNetwork = (() => {
  let canvas, ctx, particles = [], animId;
  const config = {
    count: 80,
    maxDist: 140,
    speed: 0.35,
    colors: { node: '#00d4ff', line: 'rgba(0,212,255,', glow: '#7c3aed' }
  };

  function init() {
    canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    createParticles();
    animate();
    window.addEventListener('resize', resize);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        r: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        isHub: Math.random() < 0.1, // 10% are hub nodes
        color: Math.random() < 0.15 ? '#7c3aed' : '#00d4ff'
      });
    }
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.maxDist) {
          const alpha = (1 - dist / config.maxDist) * 0.25;
          const grad = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          grad.addColorStop(0, `rgba(0,212,255,${alpha})`);
          grad.addColorStop(1, `rgba(124,58,237,${alpha})`);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.pulse += 0.03;
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      p.x = Math.max(0, Math.min(canvas.width, p.x));
      p.y = Math.max(0, Math.min(canvas.height, p.y));

      const pulseR = p.r + Math.sin(p.pulse) * 0.8;

      // Outer glow ring for hub nodes
      if (p.isHub) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,0.04)`;
        ctx.fill();
      }

      // Glow halo
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 4);
      gradient.addColorStop(0, p.color + 'cc');
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  }

  return { init, destroy };
})();
