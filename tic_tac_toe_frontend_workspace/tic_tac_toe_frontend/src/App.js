import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette
const COLORS = {
  primary: "#1a73e8",
  accent: "#34a853",
  secondary: "#ffffff",
  boardBg: "#f8faff",
  cellBorder: "#d3e3fd",
  x: "#1a73e8",
  o: "#34a853",
  draw: "#9e9e9e",
};

/**
 * PUBLIC_INTERFACE
 * Square for the Tic Tac Toe board
 */
function Square({ value, onClick, animate }) {
  return (
    <button
      className={`ttt-square${animate ? " animate" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      tabIndex={value ? -1 : 0}
      disabled={!!value}
      type="button"
    >
      <span
        className={`ttt-symbol${
          value === "X"
            ? " ttt-x"
            : value === "O"
            ? " ttt-o"
            : ""
        }`}
      >
        {value}
      </span>
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main Game Component
 */
function App() {
  // 'X' always starts
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check for winner after every move
  useEffect(() => {
    setWinner(getWinner(board));
    if (lastMove !== -1) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 180);
      return () => clearTimeout(timer);
    }
  }, [board, lastMove]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return;
    const next = board.slice();
    next[idx] = isX ? "X" : "O";
    setBoard(next);
    setIsX((x) => !x);
    setLastMove(idx);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
    setLastMove(-1);
  }

  // Status message
  const status = winner
    ? winner === "draw"
      ? "It's a draw!"
      : `Winner: ${winner}`
    : `Next move: ${isX ? "X" : "O"}`;

  // PUBLIC_INTERFACE
  return (
    <div className="ttt-app-root">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-board-container">
        <Board
          board={board}
          onCellClick={handleClick}
          lastMove={lastMove}
          isAnimating={isAnimating}
          winLine={winner && winner !== "draw" ? getWinLine(board) : null}
        />
      </div>
      <div className="ttt-status-controls">
        <div
          className={`ttt-status${winner ? " ttt-status-finished" : ""}`}
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
        <button
          className="ttt-reset-btn"
          onClick={handleRestart}
          aria-label="Restart game"
        >
          Restart
        </button>
      </div>
      <footer className="ttt-footer">
        <span style={{ color: COLORS.primary, fontWeight: 600 }}>React Tic Tac Toe</span>
        <span style={{ color: "#606060", fontSize: "0.85rem" }}> | Modern &amp; Minimal</span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board rendering all 9 squares + highlights
 */
function Board({ board, onCellClick, lastMove, isAnimating, winLine }) {
  function isWinCell(idx) {
    return winLine && winLine.includes(idx);
  }
  return (
    <div className="ttt-board" aria-label="Tic Tac Toe board">
      {board.map((v, i) => (
        <Square
          key={i}
          value={v}
          onClick={() => onCellClick(i)}
          animate={i === lastMove && isAnimating}
        >
          {v}
        </Square>
      ))}
      {winLine && (
        <WinLine winLine={winLine} />
      )}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Draw an SVG winning line overlay
 */
function WinLine({ winLine }) {
  // Map indices to board cells
  function cellCenter(idx) {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    const s = 100 / 3;
    return [col * s + s / 2, row * s + s / 2];
  }
  const [start, end] = [cellCenter(winLine[0]), cellCenter(winLine[2])];
  return (
    <svg className="ttt-win-line" viewBox="0 0 100 100" aria-hidden="true">
      <line
        x1={start[0]}
        y1={start[1]}
        x2={end[0]}
        y2={end[1]}
        stroke={COLORS.accent}
        strokeWidth="5"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 5px #34a85388)" }}
      />
    </svg>
  );
}

/**
 * PUBLIC_INTERFACE
 * Returns "X", "O", "draw", or null for ongoing.
 */
function getWinner(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diagonals
  ];
  for (const [a, b1, c] of lines) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c])
      return b[a];
  }
  if (b.every(Boolean)) return "draw";
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Returns win line indices, or null if no winner
 */
function getWinLine(b) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const triplet of lines) {
    const [a, b1, c] = triplet;
    if (b[a] && b[a] === b[b1] && b[a] === b[c])
      return triplet;
  }
  return null;
}

export default App;
