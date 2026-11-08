import { useState } from 'react';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const generateProblem = (actionType, mode) => {
  let ops = [];
  if (mode === 'easy') {
    ops = ['add', 'sub'];
  } else if (mode === 'hard') {
    ops = actionType === 'place' ? ['hard_mul', 'hard_div'] : ['linear'];
  } else {
    const placeOps = ['add', 'sub', 'mul'];
    const removeOps = ['div', 'pow', 'sqrt'];
    ops = actionType === 'place' ? placeOps : removeOps;
  }
  
  const type = ops[Math.floor(Math.random() * ops.length)];
  
  let q = '', a = 0;
  
  switch(type) {
    case 'add': {
      const n1 = Math.floor(Math.random() * 50) + 1;
      const n2 = Math.floor(Math.random() * 50) + 1;
      q = `${n1} + ${n2}`; a = n1 + n2; break;
    }
    case 'sub': {
      const s1 = Math.floor(Math.random() * 50) + 20;
      const s2 = Math.floor(Math.random() * 20) + 1;
      q = `${s1} - ${s2}`; a = s1 - s2; break;
    }
    case 'mul': {
      const m1 = Math.floor(Math.random() * 12) + 1;
      const m2 = Math.floor(Math.random() * 12) + 1;
      q = `${m1} × ${m2}`; a = m1 * m2; break;
    }
    case 'div': {
      const d2 = Math.floor(Math.random() * 12) + 1;
      const ans = Math.floor(Math.random() * 12) + 1;
      const d1 = d2 * ans;
      q = `${d1} ÷ ${d2}`; a = ans; break;
    }
    case 'pow': {
      const base = Math.floor(Math.random() * 12) + 2;
      const exp = base > 5 ? 2 : (Math.floor(Math.random() * 2) + 2);
      q = `${base}^${exp}`; a = Math.pow(base, exp); break;
    }
    case 'sqrt': {
      const sqAns = Math.floor(Math.random() * 15) + 1;
      const sqVal = sqAns * sqAns;
      q = `√${sqVal}`; a = sqAns; break;
    }
    case 'hard_mul': {
      const hm1 = Math.floor(Math.random() * 90) + 10;
      const hm2 = Math.floor(Math.random() * 90) + 10;
      q = `${hm1} × ${hm2}`; a = hm1 * hm2; break;
    }
    case 'hard_div': {
      const hd2 = Math.floor(Math.random() * 90) + 10;
      const hans = Math.floor(Math.random() * 90) + 10;
      const hd1 = hd2 * hans;
      q = `${hd1} ÷ ${hd2}`; a = hans; break;
    }
    case 'linear': {
      const coef = Math.floor(Math.random() * 11) + 2; 
      const xVal = Math.floor(Math.random() * 20) + 1;
      const constant = Math.floor(Math.random() * 50) + 1;
      const isAdd = Math.random() > 0.5;
      const result = isAdd ? (coef * xVal + constant) : (coef * xVal - constant);
      const opStr = isAdd ? '+' : '-';
      q = `${coef}y ${opStr} ${constant} = ${result}`; a = xVal; break;
    }
    default:
      q = '1 + 1'; a = 2;
  }
  return { q, a };
};

function RulesSection({ title, color, children }) {
  return (
    <section className="mb-5">
      <h3 className={`${color} font-bold uppercase tracking-widest text-sm mb-2 drop-shadow-[0_0_5px_currentColor]`}>{title}</h3>
      <div className="text-gray-300 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function HowToPlay({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.35)] rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-purple-500/30">
          <h2 className="text-xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">How to Play</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white text-2xl leading-none px-2">×</button>
        </div>

        <div className="overflow-y-auto px-5 py-4 text-left">
          <RulesSection title="The Goal" color="text-cyan-400">
            <p>Get three of your marks in a row (across, down or diagonal). X always goes first, and players take turns on the same device.</p>
          </RulesSection>

          <RulesSection title="Your Turn" color="text-cyan-400">
            <p>Each turn you do <span className="text-white font-bold">one</span> of two things:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-cyan-400 font-bold">Claim:</span> tap an empty square to place your mark.</li>
              <li><span className="text-red-400 font-bold">Sabotage:</span> tap one of your opponent's marks (it glows red) to try to erase it.</li>
            </ul>
            <p>Either way, you'll usually have to solve a math problem first. Type the answer on the keypad and hit <span className="text-pink-400 font-bold">Execute</span>.</p>
            <p>Tapping your own mark does nothing except earn you some trash talk. You still get your turn.</p>
          </RulesSection>

          <RulesSection title="Get It Wrong?" color="text-pink-500">
            <p>A wrong answer means your mark lands on a <span className="text-white font-bold">random empty square</span> instead. That happens even if you were trying to sabotage, and the opponent's mark stays put.</p>
            <p>If the board has no empty squares, your turn is simply wasted.</p>
          </RulesSection>

          <RulesSection title="The Referee" color="text-yellow-400">
            <p>The ref punishes two kinds of behavior. It counts what you <em>try</em> to do, whether or not you answer correctly.</p>
            <p><span className="text-yellow-300 font-bold">Petty tug-of-war:</span> you claim a square, your opponent sabotages that same square, and you go right back to claim it again. <span className="text-red-400 font-bold">Every mark on the board gets scrambled</span> into random squares.</p>
            <p><span className="text-yellow-300 font-bold">Too bloodthirsty:</span> you try to sabotage on <span className="text-white font-bold">4 of your turns in a row</span>. <span className="text-red-400 font-bold">All of your own marks get scrambled</span> to random empty squares. Your opponent's marks stay where they are.</p>
            <p>A scramble never creates a winning line, and after a penalty the ref's count starts over. To stay safe, never sabotage more than 3 turns in a row.</p>
          </RulesSection>

          <RulesSection title="Game Modes" color="text-purple-400">
            <ul className="space-y-2">
              <li><span className="text-cyan-400 font-bold">Traditional:</span> classic tic-tac-toe. No math and no sabotage.</li>
              <li><span className="text-green-400 font-bold">Easy:</span> claiming is free. Sabotage takes a simple addition or subtraction problem.</li>
              <li><span className="text-yellow-400 font-bold">Normal:</span> claim with addition, subtraction or times tables. Sabotage with division, powers or square roots.</li>
              <li><span className="text-red-400 font-bold">Hard:</span> claim with two-digit multiplication or division. Sabotage by solving an equation for y.</li>
            </ul>
          </RulesSection>
        </div>

        <div className="px-5 pb-5 pt-3 border-t border-purple-500/30">
          <button onClick={onClose} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all">Got It</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [gameMode, setGameMode] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [activeProblem, setActiveProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('Game start. Try not to embarrass yourself.');
  const [intentHistory, setIntentHistory] = useState([]);
  const [showRules, setShowRules] = useState(false);

  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleNumpadClick = (val) => {
    if (val === 'del') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else {
      setUserAnswer(prev => prev + val);
    }
  };

  const checkWinner = (squares) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  const isBoardFull = (squares) => squares.every(cell => cell !== null);
  const winInfo = checkWinner(board);
  const winner = winInfo ? winInfo.player : null;
  const winningLine = winInfo ? winInfo.line : [];
  const isDraw = !winner && isBoardFull(board);

  const getSabotageStreak = (player) => {
    const playerActions = intentHistory.filter(h => h.player === player);
    let streak = 0;
    for (let i = playerActions.length - 1; i >= 0; i--) {
      if (playerActions[i].actionType === 'remove') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const xStreak = getSabotageStreak('X');
  const oStreak = getSabotageStreak('O');

  const handleCellClick = (index) => {
    if (winner || activeProblem) return;
    
    const cellValue = board[index];

    if (gameMode === 'traditional') {
      if (cellValue !== null) return;
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setXIsNext(!xIsNext);
      setMessage('');
      return;
    }
    
    if (cellValue === currentPlayer) {
      setMessage("That's your own mark. Are you blind, or just strategically inept?");
      return;
    }
    
    const actionType = cellValue === null ? 'place' : 'remove';

    if (gameMode === 'easy' && actionType === 'place') {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      finishTurn(newBoard, { player: currentPlayer, actionType, targetIndex: index }, `Placed without math. Standard easy mode.`);
      return;
    }
    
    const problem = generateProblem(actionType, gameMode);
    
    setActiveProblem({ 
      ...problem, 
      targetIndex: index, 
      player: currentPlayer,
      actionType 
    });
    setUserAnswer('');
  };

  const scrambleBoard = (currentBoard, type, targetPlayer = null) => {
    let attempts = 0;
    let validBoard = null;

    while (attempts < 1000) {
      let tempBoard = [...currentBoard];
      let piecesToMove = [];
      let availableSlots = [];

      if (type === 'global') {
        for (let i = 0; i < 9; i++) {
          if (tempBoard[i] !== null) {
            piecesToMove.push(tempBoard[i]);
            tempBoard[i] = null;
          }
        }
        availableSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      } else if (type === 'player') {
        for (let i = 0; i < 9; i++) {
          if (tempBoard[i] === targetPlayer) {
            piecesToMove.push(tempBoard[i]);
            tempBoard[i] = null;
          }
        }
        for (let i = 0; i < 9; i++) {
          if (tempBoard[i] === null) {
            availableSlots.push(i);
          }
        }
      }

      availableSlots.sort(() => Math.random() - 0.5);

      for (let i = 0; i < piecesToMove.length; i++) {
        tempBoard[availableSlots[i]] = piecesToMove[i];
      }

      if (!checkWinner(tempBoard)) {
        validBoard = tempBoard;
        break;
      }
      attempts++;
    }

    return validBoard || currentBoard; 
  };

  const handleAnswerSubmit = (e) => {
    if (e) e.preventDefault();
    if (!activeProblem) return;

    const parsedAnswer = parseFloat(userAnswer);
    let newBoard = [...board];
    const { player, targetIndex, actionType, a: correctAnswer } = activeProblem;
    let turnMessage = '';

    if (parsedAnswer === correctAnswer) {
      if (actionType === 'place') {
        newBoard[targetIndex] = player;
        turnMessage = `Passable arithmetic. ${player} placed.`;
      } else {
        newBoard[targetIndex] = null;
        turnMessage = `Target annihilated. Opponent's mark removed.`;
      }
    } else {
      const emptyIndices = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
      if (emptyIndices.length > 0) {
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[randomIndex] = player;
        turnMessage = `Wrong. The answer was ${correctAnswer}. Placed randomly as punishment.`;
      } else {
        turnMessage = `Wrong. Answer was ${correctAnswer}. Board full, turn wasted. Pathetic.`;
      }
    }

    finishTurn(newBoard, { player, actionType, targetIndex }, turnMessage);
  };

  const finishTurn = (boardAfterMove, currentIntent, baseMessage) => {
    let newBoard = boardAfterMove;
    let turnMessage = baseMessage;
    const { player } = currentIntent;
    const newHistory = [...intentHistory, currentIntent];
    let penaltyTriggered = false;

    if (newHistory.length >= 3) {
      const last3 = newHistory.slice(-3);
      const p1 = last3[0];
      const p2 = last3[1];
      const p3 = last3[2];
      
      if (
        p1.actionType === 'place' && p2.actionType === 'remove' && p3.actionType === 'place' &&
        p1.targetIndex === p2.targetIndex && p2.targetIndex === p3.targetIndex &&
        p1.player === p3.player && p1.player !== p2.player
      ) {
        newBoard = scrambleBoard(newBoard, 'global');
        turnMessage = "Ref warning: Petty tug-of-war detected. ALL MARKS SCRAMBLED.";
        penaltyTriggered = true;
      }
    }

    if (!penaltyTriggered) {
      const playerHistory = newHistory.filter(h => h.player === player);
      if (playerHistory.length >= 4) {
        const last4 = playerHistory.slice(-4);
        if (last4.every(h => h.actionType === 'remove')) {
          newBoard = scrambleBoard(newBoard, 'player', player);
          turnMessage = `Ref warning: Too bloodthirsty, ${player}. YOUR MARKS SCRAMBLED.`;
          penaltyTriggered = true;
        }
      }
    }

    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setActiveProblem(null);
    setMessage(turnMessage);
    setIntentHistory(penaltyTriggered ? [] : newHistory);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setActiveProblem(null);
    setMessage(gameMode === 'traditional' ? 'Game reset.' : 'Game reset. Try to use your brain this time.');
    setIntentHistory([]);
  };

  const renderCell = (index) => {
    const value = board[index];
    const isX = value === 'X';
    const isO = value === 'O';
    const isEmpty = value === null;
    const isOpponent = value && value !== currentPlayer;
    const isWinningCell = winningLine.includes(index);
    
    let cellStyle = "relative w-24 h-24 sm:w-32 sm:h-32 border-2 flex items-center justify-center text-5xl sm:text-7xl font-bold transition-all duration-200 backdrop-blur-sm group ";
    
    if (isWinningCell) {
      cellStyle += isX
        ? "border-cyan-400 bg-cyan-950/60 shadow-[0_0_25px_rgba(34,211,238,0.6),inset_0_0_15px_rgba(34,211,238,0.3)] scale-[1.03] z-10 cursor-default "
        : "border-pink-500 bg-pink-950/60 shadow-[0_0_25px_rgba(236,72,153,0.6),inset_0_0_15px_rgba(236,72,153,0.3)] scale-[1.03] z-10 cursor-default ";
    } else if (isEmpty && !winner) {
      cellStyle += "border-purple-600/50 bg-black/40 hover:bg-purple-900/40 cursor-pointer ";
    } else if (isOpponent && !winner && gameMode !== 'traditional') {
      cellStyle += "border-red-600/50 bg-red-950/20 hover:bg-red-900/60 hover:border-red-500 cursor-pointer ";
    } else {
      cellStyle += `border-purple-600/50 bg-black/40 cursor-not-allowed ${winner ? 'opacity-40' : ''} `;
    }

    let textStyle = "";
    if (isX) textStyle = "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]";
    if (isO) textStyle = "text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]";

    return (
      <div key={index} className={cellStyle} onClick={() => handleCellClick(index)}>
        <span className={`${textStyle} transition-opacity ${isOpponent && !winner && gameMode !== 'traditional' ? 'opacity-100 sm:group-hover:opacity-30' : ''}`}>
          {value}
        </span>
        {isOpponent && !winner && gameMode !== 'traditional' && (
          <span className="absolute inset-0 flex items-center justify-center text-red-500 opacity-0 sm:group-hover:opacity-100 text-4xl drop-shadow-[0_0_10px_rgba(239,68,68,1)] pointer-events-none">
            ☠
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 font-mono overflow-hidden relative selection:bg-purple-500/30">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {!gameMode ? (
        <div className="z-10 flex flex-col items-center w-full max-w-sm space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] tracking-tighter uppercase text-center leading-tight">
            Sabotage<br/>Tic-Tac-Toe
          </h1>
          <button onClick={() => {setGameMode('traditional'); resetGame();}} className="w-full bg-black/50 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-900/50 font-bold py-4 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">Traditional Game</button>
          <button onClick={() => {setGameMode('easy'); resetGame();}} className="w-full bg-black/50 border-2 border-green-500 text-green-400 hover:bg-green-900/50 font-bold py-4 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,199,89,0.2)] hover:shadow-[0_0_25px_rgba(34,199,89,0.5)]">Easy Game</button>
          <button onClick={() => {setGameMode('normal'); resetGame();}} className="w-full bg-black/50 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-900/50 font-bold py-4 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]">Normal Game</button>
          <button onClick={() => {setGameMode('hard'); resetGame();}} className="w-full bg-black/50 border-2 border-red-500 text-red-400 hover:bg-red-900/50 font-bold py-4 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">Hard Game</button>
          <button onClick={() => setShowRules(true)} className="w-full mt-2 bg-black/50 border-2 border-purple-500 text-purple-300 hover:bg-purple-900/50 font-bold py-3 rounded uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">? How to Play</button>
        </div>
      ) : (
      <div className="z-10 flex flex-col items-center w-full max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] tracking-tighter uppercase text-center">
          Sabotage-Tac-Toe
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <button onClick={() => setShowRules(true)} className="px-3.5 py-1 rounded-full border border-purple-500/60 text-purple-300 text-xs uppercase tracking-widest hover:bg-purple-900/40 transition-all">? How to Play</button>
          <button onClick={resetGame} className="px-3.5 py-1 rounded-full border border-cyan-500/60 text-cyan-300 text-xs uppercase tracking-widest hover:bg-cyan-900/40 transition-all">↺ Restart</button>
          <button onClick={() => { setGameMode(null); resetGame(); }} className="px-3.5 py-1 rounded-full border border-gray-500/60 text-gray-300 text-xs uppercase tracking-widest hover:bg-gray-800/60 transition-all">☰ Menu</button>
        </div>

        <div className="h-8 mb-2 text-center text-sm sm:text-base text-gray-300 flex items-center justify-center">
          {winner ? (
             <span className={`font-bold ${winner === 'X' ? 'text-cyan-400' : 'text-pink-500'} drop-shadow-[0_0_8px_currentColor]`}>
               {winner} SURVIVED. THE OTHER GUY IS DEAD TO US.
             </span>
          ) : isDraw ? (
             <span className="text-yellow-400 font-bold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">IT'S A DRAW. YOU BOTH FAILED.</span>
          ) : (
            <span className="opacity-80">
              Turn: <span className={`font-bold ${currentPlayer === 'X' ? 'text-cyan-400' : 'text-pink-500'} drop-shadow-[0_0_5px_currentColor]`}>{currentPlayer}</span>
            </span>
          )}
        </div>

        {gameMode !== 'traditional' && (
          <div className="flex items-center justify-center gap-6 mb-4 text-xs uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-1.5" title="Consecutive sabotage attempts (4 triggers scramble penalty)">
              <span className="text-cyan-400 font-bold">X</span>
              <span className="text-[10px] text-gray-500">Sabotage:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(step => (
                  <span
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      xStreak >= step
                        ? (xStreak === 3 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]')
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5" title="Consecutive sabotage attempts (4 triggers scramble penalty)">
              <span className="text-pink-500 font-bold">O</span>
              <span className="text-[10px] text-gray-500">Sabotage:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(step => (
                  <span
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      oStreak >= step
                        ? (oStreak === 3 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.6)]')
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 rounded-xl bg-gray-900/80 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => renderCell(i))}
        </div>

        <div className="h-12 mt-6 text-center w-full px-4 flex items-center justify-center">
          {message && <p className="text-sm sm:text-base text-gray-400">{message}</p>}
        </div>

        {(winner || isDraw) && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <button 
              onClick={resetGame}
              className="w-full sm:w-auto px-6 py-3 rounded border-2 border-purple-500 text-purple-400 font-bold tracking-widest hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all uppercase"
            >
              Insert Coin (Restart)
            </button>
            <button 
              onClick={() => { setGameMode(null); resetGame(); }}
              className="w-full sm:w-auto px-6 py-3 rounded border-2 border-gray-500 text-gray-400 font-bold tracking-widest hover:bg-gray-500 hover:text-white hover:shadow-[0_0_20px_rgba(107,114,128,0.6)] transition-all uppercase"
            >
              Main Menu
            </button>
          </div>
        )}
      </div>
      )}

      {showRules && <HowToPlay onClose={() => setShowRules(false)} />}

      {activeProblem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
          <div className={`bg-gray-900 border ${activeProblem.actionType === 'remove' ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.3)]'} p-6 sm:p-8 rounded-2xl max-w-sm w-full text-center flex flex-col items-center`}>
            <h2 className={`${activeProblem.actionType === 'remove' ? 'text-red-500' : 'text-cyan-400'} text-lg sm:text-xl mb-2 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_currentColor]`}>
              {activeProblem.actionType === 'remove' ? 'Vaporize Target' : 'Claim Territory'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              Player {activeProblem.player}, solve this to {activeProblem.actionType === 'remove' ? 'destroy' : 'place'} the mark. Fail, and suffer random placement.
            </p>
            
            <div className="text-4xl sm:text-5xl font-black text-white mb-4 sm:mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {activeProblem.q}
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <div className="w-full bg-black border-2 border-pink-500 rounded p-3 text-center text-2xl text-white shadow-[0_0_10px_rgba(236,72,153,0.3)] min-h-[3.5rem] flex items-center justify-center tracking-widest">
                {userAnswer || <span className="text-gray-600">?</span>}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleNumpadClick(num.toString())}
                    className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold py-3 rounded text-xl border border-gray-600/50 active:bg-cyan-900 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNumpadClick('-')}
                  className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold py-3 rounded text-xl border border-gray-600/50 active:bg-cyan-900 transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('0')}
                  className="bg-gray-800 hover:bg-gray-700 text-cyan-400 font-bold py-3 rounded text-xl border border-gray-600/50 active:bg-cyan-900 transition-colors"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleNumpadClick('del')}
                  className="bg-gray-800 hover:bg-gray-700 text-red-400 font-bold py-3 rounded text-lg border border-gray-600/50 active:bg-red-900 transition-colors"
                >
                  DEL
                </button>
              </div>

              <button 
                onClick={handleAnswerSubmit}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.5)] active:scale-95 transition-all mt-2"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
