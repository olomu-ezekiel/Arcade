import React, { useState, useEffect, useCallback } from 'react';
// import { ChevronRight } from 'lucide-react';

const cardsData = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameState, setGameState] = useState('ready'); // ready, playing

  // Initialize the deck
  const initializeDeck = useCallback(() => {
    const deck = [...cardsData, ...cardsData]
      .sort(() => Math.random() - 0.5)
      .map((val, idx) => ({
        id: idx,
        val,
        flipped: false,
        matched: false
      }));
    setCards(deck);
    setFirst(null);
    setSecond(null);
    setDisabled(false);
  }, []);

  // Handle card comparison
  useEffect(() => {
    if (first && second) {
      setDisabled(true);
      if (first.val === second.val) {
        setCards(prev =>
          prev.map(c =>
            c.val === first.val ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [first, second]);

  function handleCardClick(card) {
    if (disabled || card.flipped || card.matched) return;
    setCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );
    first ? setSecond(card) : setFirst(card);
  }

  function resetTurn() {
    setFirst(null);
    setSecond(null);
    setDisabled(false);
  }

  const startGame = useCallback(() => {
    initializeDeck();
    setGameState('playing');
  }, [initializeDeck]);

  return (
    <section id="memory" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          MEMORY MATRIX
        </h2>

        {/* Start Button */}
        {gameState === 'ready' && (
          <div className="flex justify-center mb-8">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
            >
              START GAME
            </button>
          </div>
        )}

        {/* Card Grid */}
        {gameState === 'playing' && (
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`w-20 h-24 flex items-center justify-center cursor-pointer border-2 border-cyan-600 rounded-lg text-2xl select-none transition-all duration-200
                  ${card.flipped || card.matched
                    ? 'bg-cyan-500 text-white scale-105'
                    : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                {card.flipped || card.matched ? card.val : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}