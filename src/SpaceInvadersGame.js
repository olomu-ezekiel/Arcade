import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function SpaceInvaders() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'gameover'

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const gameStateRef = useRef('ready');

  useEffect(() => {
    const stored = localStorage.getItem('spaceInvadersHighScore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    gameStateRef.current = 'playing';
    setScore(0);
    setLevel(1);
    setLives(3);
    setGameState('playing');
  }, []);

  const endGame = useCallback((finalScore) => {
    gameStateRef.current = 'gameover';
    setGameState('gameover');
    setHighScore(prev => {
      if (finalScore > prev) {
        localStorage.setItem('spaceInvadersHighScore', finalScore.toString());
        return finalScore;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const keys = {};
    const player = { x: 280, y: 550, width: 40, height: 30, speed: 6 };
    const bullets = [];
    const alienBullets = [];
    const aliens = [];
    const particles = [];
    const stars = [];

    let lastShot = 0;
    let alienShootTimer = 0;
    let invulnerable = false;
    let invulnerableTime = 0;
    let spawnTimer = 0;
    const maxAliens = 12;

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
      });
    }

    const spawnAlien = () => {
      if (aliens.length >= maxAliens) return;
      const rand = Math.random();
      let spawnCount = rand < 0.5 ? 1 : rand < 0.8 ? 2 : 3;

      for (let i = 0; i < spawnCount; i++) {
        if (aliens.length >= maxAliens) break;
        const types = ['fast', 'medium', 'slow'];
        const type = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (canvas.width - 60) + 10;
        const baseSpeed = type === 'fast' ? 1.2 : type === 'medium' ? 0.9 : 0.6;
        const speedMultiplier = 1 + (levelRef.current - 1) * 0.15;

        aliens.push({
          x: x,
          y: -50 - (i * 70),
          width: 35,
          height: 25,
          alive: true,
          type: type,
          speed: baseSpeed * speedMultiplier,
          color: type === 'fast' ? '#ef4444' : type === 'medium' ? '#f59e0b' : '#facc15',
          points: type === 'fast' ? 30 : type === 'medium' ? 20 : 10
        });
      }
    };

    spawnAlien();

    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const shoot = (timestamp) => {
      if (timestamp - lastShot > 300 && bullets.length < 5) {
        bullets.push({
          x: player.x + player.width / 2 - 3,
          y: player.y,
          width: 6,
          height: 15,
          speed: 8
        });
        lastShot = timestamp;
      }
    };

    const alienShoot = () => {
      const aliveAliens = aliens.filter(a => a.alive);
      if (aliveAliens.length > 0) {
        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 10,
          speed: 4
        });
      }
    };

    const createExplosion = (x, y, color) => {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 30,
          color: color
        });
      }
    };

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    const handlePlayerHit = () => {
      livesRef.current -= 1;
      setLives(livesRef.current);
      invulnerable = true;
      invulnerableTime = 0;
      createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#4ade80');

      if (livesRef.current <= 0) {
        endGame(scoreRef.current);
      }
    };

    let animationId;
    const gameLoop = (timestamp) => {
      if (gameStateRef.current !== 'playing') return;

      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // stars
      ctx.fillStyle = '#fff';
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = 0.8;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        ctx.globalAlpha = 1;
      });

      // move player
      if ((keys['arrowleft'] || keys['a']) && player.x > 0) player.x -= player.speed;
      if ((keys['arrowright'] || keys['d']) && player.x + player.width < canvas.width) player.x += player.speed;
      if (keys[' '] || keys['f']) shoot(timestamp);

      if (invulnerable) {
        invulnerableTime++;
        if (invulnerableTime > 120) {
          invulnerable = false;
          invulnerableTime = 0;
        }
      }

      // draw player
      if (!invulnerable || Math.floor(invulnerableTime / 10) % 2 === 0) {
        const gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
        gradient.addColorStop(0, '#4ade80');
        gradient.addColorStop(1, '#22c55e');
        ctx.fillStyle = gradient;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(player.x + player.width / 2, player.y - 5);
        ctx.lineTo(player.x + 10, player.y + 10);
        ctx.lineTo(player.x + player.width - 10, player.y + 10);
        ctx.fill();
      }

      // bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
      }

      // alien shooting
      alienShootTimer++;
      if (alienShootTimer > Math.max(90 - levelRef.current * 4, 40) && Math.random() < 0.2) {
        alienShoot();
        alienShootTimer = 0;
      }

      // alien bullets
      for (let i = alienBullets.length - 1; i >= 0; i--) {
        alienBullets[i].y += alienBullets[i].speed;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(alienBullets[i].x, alienBullets[i].y, alienBullets[i].width, alienBullets[i].height);

        if (alienBullets[i].y > canvas.height) {
          alienBullets.splice(i, 1);
          continue;
        }

        if (!invulnerable && checkCollision(alienBullets[i], player)) {
          alienBullets.splice(i, 1);
          handlePlayerHit();
        }
      }

      // spawn aliens
      spawnTimer++;
      const spawnDelay = Math.max(180 - levelRef.current * 8, 60);
      if (spawnTimer > spawnDelay) {
        spawnAlien();
        spawnTimer = 0;
      }

      // move aliens
      for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];
        alien.y += alien.speed;
        if (alien.y > canvas.height) { aliens.splice(i, 1); continue; }
        if (!invulnerable && checkCollision(alien, player)) { aliens.splice(i, 1); handlePlayerHit(); }
      }

      // draw aliens
      aliens.forEach((alien, index) => {
        ctx.fillStyle = alien.color;
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
      });

      // bullet-alien collisions
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (let j = aliens.length - 1; j >= 0; j--) {
          const alien = aliens[j];
          if (checkCollision(b, alien)) {
            aliens.splice(j, 1);
            bullets.splice(i, 1);
            scoreRef.current += alien.points;
            setScore(scoreRef.current);
            createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2, alien.color);
            break;
          }
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, endGame]);

  return (
    <section id="spaceinvaders" className="min-h-screen flex flex-col items-center justify-center bg-black py-8 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
        SPACE INVADERS
      </h1>

      {gameState === 'ready' && (
        <button
          onClick={startGame}
          className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg mb-6"
        >
          START GAME
        </button>
      )}

      {gameState === 'gameover' && (
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-red-600 mb-4">GAME OVER</h3>
          <p className="text-white mb-4">Final Score: {score}</p>
          <button
            onClick={startGame}
            className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg"
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        className="border-2 border-white rounded-lg" 
      />
    </section>
  );
}