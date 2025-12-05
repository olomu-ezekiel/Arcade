import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function PixelRunnerGame() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);

  const gameRef = useRef({
    player: { x: 50, y: 0, width: 30, height: 30, vy: 0, jumps: 2 },
    gravity: 0.8,
    jumpStrength: -12,
    spikes: [],
    platforms: [
      { x: 0, y: 300, width: 800, height: 20 },
      { x: 250, y: 240, width: 200, height: 20 },
      { x: 550, y: 200, width: 180, height: 20 }
    ],
    gameSpeed: 5,
    ground: 300,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      player: { x: 50, y: 0, width: 30, height: 30, vy: 0, jumps: 2 },
      gravity: 0.8,
      jumpStrength: -12,
      spikes: [],
      platforms: [
        { x: 0, y: 300, width: 800, height: 20 },
        { x: 250, y: 240, width: 200, height: 20 },
        { x: 550, y: 200, width: 180, height: 20 }
      ],
      gameSpeed: 5,
      ground: 300,
    };
    setScore(0);
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const game = gameRef.current;
    let frame = 0;

    const spawnObstacleOrPlatform = () => {
      const r = Math.random();

      if (r < 0.15) {
        // Single spike
        game.spikes.push({ x: canvas.width, y: 300 - 10, width: 20, height: 20 });
      } else if (r < 0.22) {
        // Double spike
        game.spikes.push({ x: canvas.width, y: 300 - 10, width: 45, height: 20 });
      }

      // Always spawn platform more frequently
      const platformHeight = [240, 200, 160][Math.floor(Math.random() * 3)];
      game.platforms.push({ x: canvas.width, y: platformHeight, width: 140, height: 20 });

      // Small chance of spike on platform
      if (Math.random() < 0.2) {
        game.spikes.push({ x: canvas.width + 40, y: platformHeight - 10, width: 20, height: 20 });
      }
    };

    const gameLoop = setInterval(() => {
      const player = game.player;

      // Gravity
      player.vy += game.gravity;
      player.y += player.vy;

      // Platform landing
      let onPlatform = false;
      game.platforms.forEach(p => {
        if (
          player.x < p.x + p.width &&
          player.x + player.width > p.x &&
          player.y + player.height >= p.y &&
          player.y + player.height <= p.y + 10 &&
          player.vy >= 0
        ) {
          player.y = p.y - player.height;
          player.vy = 0;
          player.jumps = 2;
          onPlatform = true;
        }
      });

      // Fall death
      if (!onPlatform && player.y > canvas.height) {
        setGameState("gameover");
        return;
      }

      // Move objects
      game.platforms.forEach(p => (p.x -= game.gameSpeed));
      game.spikes.forEach(s => (s.x -= game.gameSpeed));

      // Cleanup
      game.platforms = game.platforms.filter(p => p.x + p.width > 0);
      game.spikes = game.spikes.filter(s => s.x + s.width > 0);

      if (frame % 80 === 0) spawnObstacleOrPlatform();

      // Collision
      for (let s of game.spikes) {
        if (
          player.x < s.x + s.width &&
          player.x + player.width > s.x &&
          player.y + player.height > s.y &&
          player.y < s.y + s.height
        ) {
          setGameState("gameover");
          return;
        }
      }

      // ⬇ slower difficulty increase
      if (game.gameSpeed < 12) game.gameSpeed += 0.001;

      setScore(prev => prev + 1);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Platforms
      ctx.fillStyle = "#444";
      game.platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

      // Player
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Spikes
      ctx.fillStyle = "#ef4444";
      game.spikes.forEach(s => ctx.fillRect(s.x, s.y, s.width, s.height));

      frame++;
    }, 20);

    const handleKey = e => {
      if (e.key === " " || e.key.toLowerCase() === "w") {
        if (game.player.jumps > 0) {
          game.player.vy = game.jumpStrength;
          game.player.jumps--;
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      clearInterval(gameLoop);
      window.removeEventListener("keydown", handleKey);
    };
  }, [gameState]);

  return (
  <section id="pixelrunner" className="py-20 px-4 bg-gray-900 min-h-screen flex flex-col justify-center items-center">
    <div className="text-center">
      <h2 className="text-5xl font-bold text-orange-400 mb-4">PIXEL RUNNER</h2>
      <p className="text-gray-300 mb-6">More platforms, less stress. Good luck champ 🏃🔥</p>

      <div className="flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-red-500/50 bg-gray-950 rounded-lg"
        />

        {gameState === "ready" && (
          <button
            onClick={resetGame}
            className="bg-orange-500 px-6 py-3 mt-4 rounded-lg text-white"
          >
            START RUN
          </button>
        )}

        {gameState === "gameover" && (
          <div className="text-center mt-4">
            <h3 className="text-3xl text-red-500 font-bold">GAME OVER</h3>
            <p className="text-gray-300 mb-2">Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-orange-500 px-6 py-3 rounded-lg text-white"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  </section>
);
}