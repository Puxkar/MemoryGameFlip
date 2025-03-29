import { useState, useEffect } from "react";

const emojiIcons = [
  "😀", "😂", "🥰", "🤩", "😎", "😍", "😀", "😂", "🥰", "🤩", "😎", "😍",
  "😜", "😇", "🤖", "👻", "🎃", "😺", "😜", "😇", "🤖", "👻", "🎃", "😺", "🐶"
];
<h1>✨ Brain Boost Challenge ✨</h1>


export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    resetGame();
    const storedScores = JSON.parse(localStorage.getItem("highScores")) || [];
    setHighScores(storedScores);
  }, []);

  useEffect(() => {
    if (matched.length === emojiIcons.length) {
      setGameCompleted(true);
      updateHighScores(score);
    }
  }, [matched]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || showAll) return;
  
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
  
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second]);
        setScore((prev) => prev + 10);
        setTimeout(() => setFlipped([]), 500); // ✅ Reset flipped after a match
      } else {
        setTimeout(() => setFlipped([]), 1000);
        setScore((prev) => Math.max(prev - 5, 0));
      }
    }
  };
  

  const updateHighScores = (newScore) => {
    const updatedScores = [...highScores, newScore].sort((a, b) => b - a).slice(0, 5);
    setHighScores(updatedScores);
    localStorage.setItem("highScores", JSON.stringify(updatedScores));
  };

  const resetGame = () => {
    setCards(shuffleArray([...emojiIcons]));
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setShowAll(true);
    setGameCompleted(false);
    setTimeout(() => setShowAll(false), 5000);
  };

  return (
    <div className="container">
      <h1>Memory Match</h1>
      <p>Score: {score}</p>

      <div className="scoreboard">
        <h2>🏆 High Scores</h2>
        <ul>
          {highScores.map((s, i) => (
            <li key={i}>{i + 1}. {s} pts</li>
          ))}
        </ul>
      </div>

      {gameCompleted ? (
        <div className="game-over">
          <h2>All Done! 🎉</h2>
          <button onClick={resetGame}>Restart Game</button>
        </div>
      ) : (
        <div className="game-board">
          {cards.map((icon, index) => (
            <div
              key={index}
              className={`card ${flipped.includes(index) || matched.includes(index) || showAll ? "flipped" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {(flipped.includes(index) || matched.includes(index) || showAll) && icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}