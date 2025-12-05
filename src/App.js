import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Trophy, Gamepad2, Mail, ChevronRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import MemoryGame from './MemoryGame';
import PixelRunnerGame from './PixelRunnerGame'
import SpaceInvadersGame from './SpaceInvadersGame'


// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'Games', 'About', 'Leaderboard', 'Contact'];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg shadow-purple-500/20' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              STEEZE ARCADE
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-purple-400"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-sm border-t border-purple-500/20">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-purple-400 transition-colors duration-200 py-2"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDcsIDUxLCAyMzQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
            STEEZE ARCADE
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 animate-fade-in-delay">
          Play. Compete. Dominate.
        </p>
        <a
          href="#games"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70"
        >
          <span>ENTER ARENA</span>
          <ChevronRight className="w-5 h-5" />
        </a>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s backwards;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

// Game Cards Section
const GameCards = () => {
  const games = [
    {
      title: 'Snake Classic',
      description: 'Navigate the neon grid and grow your snake. How long can you survive?',
      color: 'from-green-500 to-emerald-600',
      link: '#play'
    },
    {
      title: 'Memory Matrix',
      description: 'Test your memory with this cyberpunk-themed matching game.',
      color: 'from-blue-500 to-cyan-600',
      link: '#memory'
    },
    {
      title: 'Pixel Runner',
      description: 'Run, jump, and dodge obstacles in this endless retro adventure.',
      color: 'from-orange-500 to-red-600',
      link: '#pixelrunner'
    },
    {
      title: 'Space Invaders',
      description: 'Defend Earth from waves of alien invaders in this classic remake.',
      color: 'from-purple-500 to-pink-600',
      link: '#spaceinvaders'
    }
  ];

  return (
    <section id="games" className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          GAME COLLECTION
        </h2>
        <p className="text-center text-gray-400 mb-12">Choose your challenge</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-800 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              <div className={`h-48 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{game.description}</p>
                <a
                  href={game.link}
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                >
                  Play Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Snake Game Component
const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    gridSize: 20,
    tileCount: 20
  });

  useEffect(() => {
    const stored = localStorage.getItem('snakeHighScore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameover');
    setScore(currentScore => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('snakeHighScore', currentScore.toString());
      }
      return currentScore;
    });
  }, [highScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const gameLoop = setInterval(() => {
      game.direction = game.nextDirection;

      const head = {
        x: game.snake[0].x + game.direction.x,
        y: game.snake[0].y + game.direction.y
      };

      if (head.x < 0 || head.x >= game.tileCount || head.y < 0 || head.y >= game.tileCount) {
        endGame();
        return;
      }

      if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
      }

      game.snake.unshift(head);

      if (head.x === game.food.x && head.y === game.food.y) {
        setScore(s => s + 10);
        game.food = {
          x: Math.floor(Math.random() * game.tileCount),
          y: Math.floor(Math.random() * game.tileCount)
        };
      } else {
        game.snake.pop();
      }

      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= game.tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * game.gridSize, 0);
        ctx.lineTo(i * game.gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * game.gridSize);
        ctx.lineTo(canvas.width, i * game.gridSize);
        ctx.stroke();
      }

      ctx.fillStyle = '#ec4899';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ec4899';
      ctx.fillRect(
        game.food.x * game.gridSize + 2,
        game.food.y * game.gridSize + 2,
        game.gridSize - 4,
        game.gridSize - 4
      );
      ctx.shadowBlur = 0;

      game.snake.forEach((segment, idx) => {
        const gradient = ctx.createLinearGradient(
          segment.x * game.gridSize,
          segment.y * game.gridSize,
          (segment.x + 1) * game.gridSize,
          (segment.y + 1) * game.gridSize
        );
        gradient.addColorStop(0, idx === 0 ? '#a855f7' : '#8b5cf6');
        gradient.addColorStop(1, idx === 0 ? '#8b5cf6' : '#7c3aed');
        ctx.fillStyle = gradient;
        if (idx === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#a855f7';
        }
        ctx.fillRect(
          segment.x * game.gridSize + 1,
          segment.y * game.gridSize + 1,
          game.gridSize - 2,
          game.gridSize - 2
        );
        ctx.shadowBlur = 0;
      });
    }, 100);

    const handleKeyPress = (e) => {
      const game = gameRef.current;
      const key = e.key;
      
      if (key === 'ArrowUp' && game.direction.y === 0) {
        game.nextDirection = { x: 0, y: -1 };
      } else if (key === 'ArrowDown' && game.direction.y === 0) {
        game.nextDirection = { x: 0, y: 1 };
      } else if (key === 'ArrowLeft' && game.direction.x === 0) {
        game.nextDirection = { x: -1, y: 0 };
      } else if (key === 'ArrowRight' && game.direction.x === 0) {
        game.nextDirection = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, endGame]);

  const startGame = useCallback(() => {
    gameRef.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 15, y: 15 },
      gridSize: 20,
      tileCount: 20
    };
    setScore(0);
    setGameState('playing');
  }, []);

  return (
    <section id="play" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          SNAKE CLASSIC
        </h2>
        <p className="text-gray-400 mb-8">Use arrow keys to control the snake</p>

        <div className="bg-gray-900 rounded-lg p-6 border border-purple-500/30 shadow-xl shadow-purple-500/20 inline-block">
          <div className="flex justify-between items-center mb-4 text-white">
            <div className="text-left">
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-2xl font-bold text-purple-400">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">High Score</div>
              <div className="text-2xl font-bold text-pink-400">{highScore}</div>
            </div>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border-2 border-purple-500/50 rounded-lg bg-gray-950 max-w-full h-auto"
            />
            
            {gameState === 'ready' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-lg">
                <div>
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
                  >
                    START GAME
                  </button>
                </div>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-lg">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h3>
                  <p className="text-gray-300 mb-6">Final Score: {score}</p>
                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Leaderboard Section
const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('leaderboard');
    if (stored) {
      setLeaders(JSON.parse(stored));
    } else {
      const dummyData = [
        { name: 'CYBER_NINJA', score: 850, date: '2024-12-01' },
        { name: 'PIXEL_MASTER', score: 720, date: '2024-12-02' },
        { name: 'NEON_WARRIOR', score: 650, date: '2024-12-03' },
        { name: 'GHOST_RIDER', score: 580, date: '2024-12-03' },
        { name: 'QUANTUM_ACE', score: 520, date: '2024-12-04' }
      ];
      setLeaders(dummyData);
      localStorage.setItem('leaderboard', JSON.stringify(dummyData));
    }
  }, []);

  return (
    <section id="leaderboard" className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            LEADERBOARD
          </h2>
          <p className="text-gray-400">Top Players of All Time</p>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden border border-purple-500/30 shadow-xl shadow-purple-500/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">RANK</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-purple-300">PLAYER</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-purple-300">SCORE</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-purple-300">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {leaders.map((leader, idx) => (
                  <tr key={idx} className="hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        idx === 0 ? 'bg-yellow-500 text-gray-900' :
                        idx === 1 ? 'bg-gray-400 text-gray-900' :
                        idx === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">{leader.name}</td>
                    <td className="px-6 py-4 text-right font-bold text-purple-400">{leader.score}</td>
                    <td className="px-6 py-4 text-right text-gray-400 text-sm">{leader.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          ABOUT STEEZE ARCADE
        </h2>
        <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
          <p>
            Welcome to Steeze Arcade, where classic gaming meets cyberpunk aesthetics. 
            We've reimagined timeless games with a modern, neon-infused twist.
          </p>
          <p>
            Built with cutting-edge web technologies, our platform delivers smooth, 
            responsive gameplay across all devices. Whether you're a casual player or 
            a competitive gamer, there's something here for everyone.
          </p>
          <p className="text-purple-400 font-semibold">
            Dive in, compete for the top spot, and become a legend.
          </p>
        </div>
      </div>
    </section>
  );
};

// Contact Section with EmailJS
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await emailjs.send(
        'service_4uzeuad',
        'template_insltwf',
        {
          name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        '7vUD_3jX4iPiV-6eN'
      );

      console.log('Email sent successfully:', result);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Email send failed:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <section id="contact" className="py-20 px-4 bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            GET IN TOUCH
          </h2>
          <p className="text-gray-400">Have feedback or questions? We'd love to hear from you.</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-purple-500/30 shadow-xl shadow-purple-500/20">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
                placeholder="Your name"
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors duration-200"
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="5"
                className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors duration-200 resize-none"
                placeholder="Your message..."
                disabled={loading}
              ></textarea>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || submitted}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'SENDING...' : submitted ? 'MESSAGE SENT! ✓' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-purple-500/20 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Gamepad2 className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            STEEZE ARCADE
          </span>
        </div>
        <p className="text-gray-400 mb-2">
          © 2024 Steeze Arcade. Built as a showcase project.
        </p>
        <p className="text-gray-500 text-sm">
          Crafted with React, Tailwind CSS, and passion for gaming.
        </p>
      </div>
    </footer>
  );
};

// Main App
export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <Hero />
      <GameCards />
      <SnakeGame />
      <MemoryGame/>
      <PixelRunnerGame/>
      <SpaceInvadersGame/>
      <Leaderboard />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
