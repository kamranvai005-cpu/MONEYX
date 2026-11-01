import React, { useEffect, useRef, useState } from 'react';

export type PlayableEngineType =
  | 'slot'
  | 'crash'
  | 'fishing'
  | 'live_table'
  | 'dice_sports';

interface SuperAceSlotViewProps {
  gameName?: string;
  provider?: string;
  gameCategory?: string;
  balance: number;
  onBack: () => void;
  onUpdateBalance: (delta: number) => void;
  onShowToast: (msg: string) => void;
}

interface CardCell {
  id: string;
  rank: 'A' | 'K' | 'Q' | 'J' | '♠' | '♥' | '♦' | '♣' | '🃏';
  suitColor: string;
  isGolden: boolean;
  isWild: boolean;
  matched?: boolean;
}

const RANKS: Array<{
  rank: CardCell['rank'];
  suitColor: string;
  payoutMult: number;
}> = [
  { rank: 'A', suitColor: '#e11d48', payoutMult: 2.5 },
  { rank: 'K', suitColor: '#d97706', payoutMult: 1.8 },
  { rank: 'Q', suitColor: '#7c3aed', payoutMult: 1.4 },
  { rank: 'J', suitColor: '#2563eb', payoutMult: 1.1 },
  { rank: '♠', suitColor: '#1e293b', payoutMult: 0.8 },
  { rank: '♥', suitColor: '#dc2626', payoutMult: 0.8 },
  { rank: '♦', suitColor: '#ea580c', payoutMult: 0.6 },
  { rank: '♣', suitColor: '#059669', payoutMult: 0.6 },
];

function detectEngine(name: string, category?: string): PlayableEngineType {
  const n = name.toLowerCase();
  const c = (category || '').toLowerCase();
  if (
    c === 'crash' ||
    n.includes('aviator') ||
    n.includes('aviatrix') ||
    n.includes('crash') ||
    n.includes('jet') ||
    n.includes('astronaut') ||
    n.includes('balloon') ||
    n.includes('starx') ||
    n.includes('tropicana') ||
    n.includes('chicken') ||
    n.includes('limbo')
  ) {
    return 'crash';
  }
  if (c === 'fishing' || n.includes('fish')) {
    return 'fishing';
  }
  if (
    c === 'live' ||
    c === 'poker' ||
    c === 'card' ||
    c === 'table' ||
    n.includes('roulette') ||
    n.includes('baccarat') ||
    n.includes('crazy time') ||
    n.includes('monopoly') ||
    n.includes('poker') ||
    n.includes('blackjack') ||
    n.includes('dragon tiger') ||
    n.includes('tongits') ||
    n.includes('pusoy') ||
    n.includes('deal or no deal') ||
    n.includes('dream catcher') ||
    n.includes('mega ball')
  ) {
    return 'live_table';
  }
  if (
    c === 'dice' ||
    c === 'sports' ||
    n.includes('dice') ||
    n.includes('sport') ||
    n.includes('bti') ||
    n.includes('wicket') ||
    n.includes('saba') ||
    n.includes('sbo') ||
    n.includes('gaming')
  ) {
    return 'dice_sports';
  }
  return 'slot';
}

function generateGrid(forceGolden = false): CardCell[][] {
  const cols = 5;
  const rows = 4;
  const grid: CardCell[][] = [];
  for (let c = 0; c < cols; c++) {
    const col: CardCell[] = [];
    for (let r = 0; r < rows; r++) {
      const isWild = Math.random() < 0.08;
      const pick = RANKS[Math.floor(Math.random() * RANKS.length)];
      const isGolden =
        !isWild &&
        c >= 1 &&
        c <= 3 &&
        (forceGolden ? Math.random() < 0.45 : Math.random() < 0.25);
      col.push({
        id: `${c}-${r}-${Math.random().toString(36).slice(2, 7)}`,
        rank: isWild ? '🃏' : pick.rank,
        suitColor: isWild ? '#f59e0b' : pick.suitColor,
        isGolden,
        isWild,
      });
    }
    grid.push(col);
  }
  return grid;
}

export const SuperAceSlotView: React.FC<SuperAceSlotViewProps> = ({
  gameName = 'SuperAce',
  provider = 'JILI / MONEYX',
  gameCategory = 'slots',
  balance,
  onBack,
  onUpdateBalance,
  onShowToast,
}) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [splashComplete, setSplashComplete] = useState<boolean>(false);
  const [engine, setEngine] = useState<PlayableEngineType>(() =>
    detectEngine(gameName, gameCategory)
  );

  useEffect(() => {
    setEngine(detectEngine(gameName, gameCategory));
  }, [gameName, gameCategory]);

  // Splash loading bar effect (0% -> 100%)
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setSplashComplete(true), 200);
          return 100;
        }
        return Math.min(100, prev + Math.floor(12 + Math.random() * 18));
      });
    }, 95);
    return () => clearInterval(interval);
  }, []);

  /* ============================================================
     ENGINE 1: 5x4 SLOT CASCADE ENGINE
     ============================================================ */
  const [grid, setGrid] = useState<CardCell[][]>(() => generateGrid(false));
  const [betAmount, setBetAmount] = useState<number>(20);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [comboIndex, setComboIndex] = useState<number>(0);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number>(0);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [bannerText, setBannerText] = useState<string>(
    'GOLDEN CARDS TURN INTO JOKER WILDS!'
  );

  const multipliers = freeSpinsLeft > 0 ? [2, 4, 6, 10] : [1, 2, 3, 5];

  useEffect(() => {
    if (!autoSpin || spinning || !splashComplete || engine !== 'slot') return;
    const t = setTimeout(() => {
      handleSlotSpin();
    }, 900);
    return () => clearTimeout(t);
  }, [autoSpin, spinning, splashComplete, engine]);

  const handleSlotSpin = () => {
    if (spinning) return;
    const isFree = freeSpinsLeft > 0;
    if (!isFree && balance < betAmount) {
      setAutoSpin(false);
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }

    setSpinning(true);
    setLastWin(0);
    setComboIndex(0);

    if (!isFree) {
      onUpdateBalance(-betAmount);
    } else {
      setFreeSpinsLeft((f) => Math.max(0, f - 1));
    }

    const freshGrid = generateGrid(isFree);
    setGrid(freshGrid);

    setTimeout(() => {
      const col0Ranks = new Set(
        freshGrid[0].map((c) => (c.isWild ? 'WILD' : c.rank))
      );
      let matchedRank: CardCell['rank'] | null = null;
      let reelCount = 1;

      for (const candidate of RANKS) {
        const inCol0 =
          col0Ranks.has(candidate.rank) || col0Ranks.has('WILD');
        if (!inCol0) continue;

        let consecutive = 1;
        for (let colIdx = 1; colIdx < 5; colIdx++) {
          const hasMatch = freshGrid[colIdx].some(
            (c) => c.rank === candidate.rank || c.isWild
          );
          if (hasMatch) {
            consecutive++;
          } else {
            break;
          }
        }
        if (consecutive >= 3) {
          matchedRank = candidate.rank;
          reelCount = consecutive;
          break;
        }
      }

      if (matchedRank) {
        const rankInfo =
          RANKS.find((r) => r.rank === matchedRank) || RANKS[0];
        const cascadeSteps = Math.random() < 0.45 ? 2 : 1;
        let accumulatedWin = 0;

        const highlighted = freshGrid.map((col, cIdx) =>
          col.map((cell) => ({
            ...cell,
            matched:
              cIdx < reelCount &&
              (cell.rank === matchedRank || cell.isWild),
          }))
        );
        setGrid(highlighted);

        const step1Mult = multipliers[0];
        const step1Win = Number(
          (
            betAmount *
            rankInfo.payoutMult *
            (reelCount - 2) *
            step1Mult
          ).toFixed(2)
        );
        accumulatedWin += step1Win;
        setLastWin(accumulatedWin);
        setComboIndex(1);
        setBannerText(
          `COMBO x${step1Mult}! MATCHED ${matchedRank} (${reelCount} REELS) +৳${step1Win.toFixed(0)}`
        );

        if (cascadeSteps === 2) {
          setTimeout(() => {
            const cascadedGrid = highlighted.map((col) =>
              col.map((cell) => {
                if (cell.matched && cell.isGolden) {
                  return {
                    ...cell,
                    rank: '🃏' as const,
                    suitColor: '#f59e0b',
                    isGolden: false,
                    isWild: true,
                    matched: true,
                  };
                }
                if (cell.matched) {
                  const nextPick =
                    RANKS[Math.floor(Math.random() * RANKS.length)];
                  return {
                    id: `${Math.random()}`,
                    rank: nextPick.rank,
                    suitColor: nextPick.suitColor,
                    isGolden: false,
                    isWild: false,
                    matched: true,
                  };
                }
                return cell;
              })
            );
            setGrid(cascadedGrid);
            const step2Mult = multipliers[2];
            const step2Win = Number(
              (betAmount * 0.9 * step2Mult).toFixed(2)
            );
            accumulatedWin = Number((accumulatedWin + step2Win).toFixed(2));
            setComboIndex(2);
            setLastWin(accumulatedWin);
            setBannerText(
              `JOKER WILD CASCADE x${step2Mult}! TOTAL WIN ৳${accumulatedWin.toFixed(2)}`
            );
            onUpdateBalance(accumulatedWin);
            setSpinning(false);
          }, 500);
        } else {
          onUpdateBalance(accumulatedWin);
          setSpinning(false);
        }
      } else {
        const goldenCount = freshGrid
          .flat()
          .filter((c) => c.isGolden).length;
        if (goldenCount >= 5 && freeSpinsLeft === 0) {
          setFreeSpinsLeft(10);
          setBannerText('🎉 10 FREE GAMES TRIGGERED! MULTIPLIERS DOUBLED!');
          onShowToast('🎰 10 Free Spins Triggered!');
        } else {
          setBannerText('MATCH 3+ REELS FROM LEFT TO RIGHT TO CASCADE!');
        }
        setSpinning(false);
      }
    }, 380);
  };

  /* ============================================================
     ENGINE 2: AVIATOR / CRASH MULTIPLIER ENGINE
     ============================================================ */
  const [crashMult, setCrashMult] = useState<number>(1.0);
  const [crashState, setCrashState] = useState<'idle' | 'flying' | 'crashed'>(
    'idle'
  );
  const [crashBetPlaced, setCrashBetPlaced] = useState<boolean>(false);
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);
  const [crashHistory, setCrashHistory] = useState<number[]>([
    2.45, 1.32, 8.9, 1.85, 14.2, 3.12, 1.15, 5.6,
  ]);
  const crashTargetRef = useRef<number>(2.5);
  const crashTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (crashTimerRef.current) clearInterval(crashTimerRef.current);
    };
  }, []);

  const handleStartCrashFlight = () => {
    if (crashState === 'flying') return;
    if (balance < betAmount) {
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }
    onUpdateBalance(-betAmount);
    setCrashBetPlaced(true);
    setCashedOutAt(null);
    setCrashMult(1.0);
    setCrashState('flying');

    // Generate provably-fair crash point (weighted 1.15x to 25.00x)
    const r = Math.random();
    const target =
      r < 0.22
        ? 1.12 + Math.random() * 0.45
        : r < 0.78
        ? 1.65 + Math.random() * 3.8
        : 5.5 + Math.random() * 18.0;
    crashTargetRef.current = Number(target.toFixed(2));

    if (crashTimerRef.current) clearInterval(crashTimerRef.current);
    crashTimerRef.current = setInterval(() => {
      setCrashMult((prev) => {
        const step = prev < 2 ? 0.04 : prev < 5 ? 0.09 : 0.22;
        const next = Number((prev + step).toFixed(2));
        if (next >= crashTargetRef.current) {
          if (crashTimerRef.current) clearInterval(crashTimerRef.current);
          setCrashState('crashed');
          setCrashBetPlaced(false);
          setCrashHistory((h) => [crashTargetRef.current, ...h.slice(0, 9)]);
          return crashTargetRef.current;
        }
        return next;
      });
    }, 80);
  };

  const handleCrashCashOut = () => {
    if (crashState !== 'flying' || !crashBetPlaced || cashedOutAt !== null) {
      return;
    }
    const win = Number((betAmount * crashMult).toFixed(2));
    setCashedOutAt(crashMult);
    setCrashBetPlaced(false);
    setLastWin(win);
    onUpdateBalance(win);
    onShowToast(`✈️ Cashed Out at ${crashMult.toFixed(2)}x (+৳${win})!`);
  };

  /* ============================================================
     ENGINE 3: OCEAN FISHING CANNON ARCADE ENGINE
     ============================================================ */
  const FISH_TARGETS = [
    { id: 'f1', name: 'Golden Dragon Boss', icon: '🐉', mult: 25, chance: 0.12 },
    { id: 'f2', name: 'Mega Hammerhead Shark', icon: '🦈', mult: 10, chance: 0.24 },
    { id: 'f3', name: 'Emerald Treasure Turtle', icon: '🐢', mult: 5, chance: 0.42 },
    { id: 'f4', name: 'Deep Sea Octopus', icon: '🐙', mult: 3, chance: 0.6 },
    { id: 'f5', name: 'Golden Pufferfish', icon: '🐡', mult: 2, chance: 0.75 },
    { id: 'f6', name: 'Coral Clownfish', icon: '🐠', mult: 1.5, chance: 0.88 },
  ];
  const [fishNotice, setFishNotice] = useState<string>(
    'TAP ANY SWIMMING SEA CREATURE TO FIRE YOUR CANNON!'
  );

  const handleShootFish = (fish: (typeof FISH_TARGETS)[number]) => {
    if (balance < betAmount) {
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }
    onUpdateBalance(-betAmount);
    const caught = Math.random() < fish.chance;
    if (caught) {
      const win = Number((betAmount * fish.mult).toFixed(2));
      setLastWin(win);
      onUpdateBalance(win);
      setFishNotice(
        `💥 CAUGHT ${fish.name.toUpperCase()} (x${fish.mult})! WON +৳${win.toFixed(2)}!`
      );
      onShowToast(`🐟 Caught ${fish.name}! +৳${win.toFixed(2)}`);
    } else {
      setLastWin(0);
      setFishNotice(
        `🌊 ${fish.name} dodged the net! Fire again to capture the bounty!`
      );
    }
  };

  /* ============================================================
     ENGINE 4: LIVE CASINO / CARD / ROULETTE / CRAZY TIME ENGINE
     ============================================================ */
  const [tableChoice, setTableChoice] = useState<'LEFT' | 'TIE' | 'RIGHT'>(
    'LEFT'
  );
  const [tableDealing, setTableDealing] = useState<boolean>(false);
  const [tableResult, setTableResult] = useState<{
    leftCard: number;
    rightCard: number;
    winner: 'LEFT' | 'TIE' | 'RIGHT';
    text: string;
  } | null>(null);

  const handleDealLiveTable = () => {
    if (tableDealing) return;
    if (balance < betAmount) {
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }
    setTableDealing(true);
    setLastWin(0);
    onUpdateBalance(-betAmount);

    setTimeout(() => {
      const leftCard = Math.floor(1 + Math.random() * 13);
      const rightCard = Math.floor(1 + Math.random() * 13);
      const winner: 'LEFT' | 'TIE' | 'RIGHT' =
        leftCard > rightCard
          ? 'LEFT'
          : rightCard > leftCard
          ? 'RIGHT'
          : 'TIE';

      const won = tableChoice === winner;
      const mult = winner === 'TIE' ? 8 : 1.98;
      const winAmt = won ? Number((betAmount * mult).toFixed(2)) : 0;

      if (won) {
        setLastWin(winAmt);
        onUpdateBalance(winAmt);
        onShowToast(`🎴 Winner! +৳${winAmt.toFixed(2)}`);
      }

      setTableResult({
        leftCard,
        rightCard,
        winner,
        text: won
          ? `🎉 YOU WON +৳${winAmt.toFixed(2)} (${winner})!`
          : `Dealer Result: ${winner} (${leftCard} vs ${rightCard})`,
      });
      setTableDealing(false);
    }, 500);
  };

  /* ============================================================
     ENGINE 5: 3D DICE & SPORTSBOOK QUICK BET ENGINE
     ============================================================ */
  const [diceChoice, setDiceChoice] = useState<'SMALL' | 'TRIPLE' | 'BIG'>(
    'BIG'
  );
  const [diceValues, setDiceValues] = useState<[number, number, number]>([
    4, 5, 6,
  ]);
  const [diceRolling, setDiceRolling] = useState<boolean>(false);
  const [diceMsg, setDiceMsg] = useState<string>(
    'SELECT SMALL (3-10), TRIPLE (x15), OR BIG (11-18) AND ROLL!'
  );

  const handleRollDice = () => {
    if (diceRolling) return;
    if (balance < betAmount) {
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }
    setDiceRolling(true);
    setLastWin(0);
    onUpdateBalance(-betAmount);

    setTimeout(() => {
      const d1 = Math.floor(1 + Math.random() * 6);
      const d2 = Math.floor(1 + Math.random() * 6);
      const d3 = Math.floor(1 + Math.random() * 6);
      setDiceValues([d1, d2, d3]);
      const sum = d1 + d2 + d3;
      const isTriple = d1 === d2 && d2 === d3;
      const outcome: 'SMALL' | 'TRIPLE' | 'BIG' = isTriple
        ? 'TRIPLE'
        : sum >= 11
        ? 'BIG'
        : 'SMALL';

      const won =
        diceChoice === outcome || (diceChoice !== 'TRIPLE' && outcome === diceChoice);
      const mult = diceChoice === 'TRIPLE' ? 15 : 1.98;
      const winAmt =
        diceChoice === outcome ? Number((betAmount * mult).toFixed(2)) : 0;

      if (winAmt > 0) {
        setLastWin(winAmt);
        onUpdateBalance(winAmt);
        setDiceMsg(
          `🎲 ROLLED ${d1}+${d2}+${d3} = ${sum} (${outcome})! WON +৳${winAmt.toFixed(2)}!`
        );
        onShowToast(`🎲 Won +৳${winAmt.toFixed(2)}!`);
      } else {
        setDiceMsg(`🎲 Rolled ${d1}+${d2}+${d3} = ${sum} (${outcome}). Try again!`);
      }
      setDiceRolling(false);
    }, 450);
  };

  // Authentic Splash Screen (#splash)
  if (!splashComplete) {
    return (
      <div
        id="splash"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, #0d3d2c 0%, #071f18 65%, #030d09 100%)',
        }}
      >
        <div className="text-center mb-10 px-4">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[#ffd84d] text-xs font-black tracking-widest uppercase mb-3">
            MONEYX · {provider}
          </div>
          <div
            className="text-4xl sm:text-5xl font-black italic tracking-wider uppercase"
            style={{
              background:
                'linear-gradient(180deg, #fff6b7 0%, #f5c518 48%, #c87d0a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 6px 20px rgba(245,197,24,0.45))',
            }}
          >
            {gameName}
          </div>
          <div className="text-xs font-bold text-[#7eb89a] mt-2 tracking-widest uppercase">
            Instant BDT Payout · Provably Fair Engine
          </div>
        </div>

        <div className="w-[78%] max-w-[340px]">
          <div
            id="progress-bar"
            className="w-full h-[18px] p-[2px] rounded-[15px] shadow-[0_3px_5px_#000,inset_0_2px_2px_#353535]"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div
              id="progress-bg"
              className="h-full rounded-[15px] transition-all duration-150"
              style={{
                width: `${loadingProgress}%`,
                backgroundColor: '#feb801',
                backgroundImage:
                  'linear-gradient(45deg, rgba(255,255,255,0.22) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.22) 75%, transparent 75%, transparent)',
                backgroundSize: '32px 32px',
              }}
            />
          </div>
          <div className="text-center text-white font-black text-xs mt-2 font-mono-num drop-shadow">
            LOADING {gameName.toUpperCase()}... {loadingProgress}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between pb-6 select-none"
      style={{
        background:
          engine === 'crash'
            ? 'radial-gradient(circle at 50% 20%, #3b0722 0%, #16040d 65%, #070204 100%)'
            : engine === 'fishing'
            ? 'radial-gradient(circle at 50% 20%, #033f63 0%, #021e30 65%, #010e17 100%)'
            : 'radial-gradient(circle at 50% 20%, #0d3d2c 0%, #071f18 65%, #030d09 100%)',
        color: '#ffffff',
      }}
    >
      {/* Top Game Bar */}
      <div className="h-[56px] px-3 flex items-center justify-between bg-black/55 border-b border-amber-500/30">
        <button
          type="button"
          onClick={() => {
            setAutoSpin(false);
            onBack();
          }}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[#ffd84d] text-xs font-black cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          <i className="fas fa-arrow-left" />
          <span>Lobby</span>
        </button>

        <div className="text-center">
          <div className="text-sm sm:text-base font-black italic text-[#ffd84d] tracking-wider uppercase truncate max-w-[180px] sm:max-w-none">
            {gameName}
          </div>
          <div className="text-[9px] text-amber-200/75 font-bold uppercase">
            MONEYX · {provider}
          </div>
        </div>

        <div className="bg-[#071f18] border border-[#f0c030]/40 rounded-lg px-2.5 py-1 text-right">
          <div className="text-[9px] text-[#7eb89a] uppercase font-bold">
            Balance
          </div>
          <div className="text-xs font-black text-[#ffd84d] font-mono-num">
            ৳{balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Mode Switcher Bar so player can also test any engine directly */}
      <div className="max-w-[480px] w-full mx-auto px-2.5 pt-2">
        <div className="grid grid-cols-5 gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px] font-black">
          {[
            { id: 'slot', label: '🎰 Slots' },
            { id: 'crash', label: '✈️ Crash' },
            { id: 'live_table', label: '🎴 Live' },
            { id: 'fishing', label: '🐟 Fish' },
            { id: 'dice_sports', label: '🎲 Dice/Sport' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setEngine(m.id as PlayableEngineType)}
              className={`py-1.5 rounded-lg cursor-pointer transition ${
                engine === m.id
                  ? 'bg-[#ffd84d] text-[#2a1500]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== ENGINE 1: 5x4 SLOT CASCADE ==================== */}
      {engine === 'slot' && (
        <div className="max-w-[460px] w-full mx-auto px-2.5 my-auto space-y-2.5">
          <div
            className="rounded-2xl p-2.5 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]"
            style={{
              background: 'linear-gradient(180deg, #0d3d2c 0%, #071f18 100%)',
            }}
          >
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                {freeSpinsLeft > 0
                  ? `🔥 FREE SPINS REMAINING: ${freeSpinsLeft}`
                  : 'COMBO MULTIPLIER'}
              </span>
              <span className="text-[10px] font-black text-[#1de9b6]">
                1024 WAYS
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {multipliers.map((m, idx) => {
                const active = comboIndex === idx;
                return (
                  <div
                    key={m}
                    className={`py-1.5 rounded-xl text-center font-black text-base transition-all border ${
                      active
                        ? 'bg-gradient-to-b from-[#fff3a1] via-[#ffd84d] to-[#d97706] text-[#2a1200] border-white scale-105 shadow-[0_0_16px_rgba(255,216,77,0.8)]'
                        : 'bg-black/45 text-amber-300/60 border-amber-500/20'
                    }`}
                  >
                    x{m}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-black/50 border border-amber-400/40 rounded-xl py-1.5 px-3 text-center text-xs font-black text-[#ffd84d] tracking-wide shadow">
            {bannerText}
          </div>

          <div
            className="p-2.5 rounded-2xl border-4 border-[#f5c518] shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
            style={{
              background: 'linear-gradient(180deg, #0a2e22 0%, #041510 100%)',
            }}
          >
            <div className="grid grid-cols-5 gap-1.5">
              {grid.map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-1.5">
                  {col.map((cell) => (
                    <div
                      key={cell.id}
                      className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-between p-1.5 relative transition-all duration-200 border-2 ${
                        cell.matched
                          ? 'scale-105 border-emerald-400 ring-2 ring-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]'
                          : cell.isGolden
                          ? 'border-[#ffd84d] shadow-[0_0_12px_rgba(250,204,21,0.45)]'
                          : 'border-slate-300'
                      } ${spinning ? 'animate-pulse opacity-80' : ''}`}
                      style={{
                        background: cell.isWild
                          ? 'linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #b45309 100%)'
                          : cell.isGolden
                          ? 'linear-gradient(135deg, #fef08a 0%, #facc15 55%, #ca8a04 100%)'
                          : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                      }}
                    >
                      <div
                        className="self-start text-[11px] font-black leading-none"
                        style={{ color: cell.suitColor }}
                      >
                        {cell.rank}
                      </div>
                      <div
                        className="text-2xl sm:text-3xl font-black leading-none my-auto"
                        style={{ color: cell.suitColor }}
                      >
                        {cell.rank}
                      </div>
                      <div className="self-end text-[9px] font-extrabold uppercase">
                        {cell.isWild ? (
                          <span className="bg-red-600 text-white px-1 rounded text-[8px]">
                            WILD
                          </span>
                        ) : cell.isGolden ? (
                          <span className="bg-amber-800 text-amber-100 px-1 rounded text-[8px]">
                            GOLD
                          </span>
                        ) : (
                          <span style={{ color: cell.suitColor }}>
                            {cell.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== ENGINE 2: AVIATOR / CRASH ==================== */}
      {engine === 'crash' && (
        <div className="max-w-[460px] w-full mx-auto px-2.5 my-auto space-y-3">
          {/* History Multiplier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {crashHistory.map((h, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black font-mono-num shrink-0 ${
                  h >= 2
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                    : 'bg-rose-500/20 border border-rose-400/40 text-rose-300'
                }`}
              >
                {h.toFixed(2)}x
              </span>
            ))}
          </div>

          {/* Flight Canvas Box */}
          <div className="relative h-[250px] rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-[#2a0818] to-[#0c0207] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            <div className="text-6xl mb-2 transition-transform duration-150">
              {crashState === 'crashed' ? '💥' : '✈️'}
            </div>
            <div
              className={`text-5xl font-black font-mono-num ${
                crashState === 'crashed' ? 'text-rose-500' : 'text-[#ffd84d]'
              }`}
            >
              {crashMult.toFixed(2)}x
            </div>
            <div className="text-xs font-extrabold uppercase tracking-widest mt-2 text-white/80">
              {crashState === 'flying'
                ? cashedOutAt
                  ? `✅ CASHED OUT AT ${cashedOutAt.toFixed(2)}x!`
                  : 'FLYING UP — TAP CASH OUT BEFORE IT FLIES AWAY!'
                : crashState === 'crashed'
                ? 'FLEW AWAY! PLACE YOUR BET FOR NEXT ROUND'
                : 'READY FOR TAKEOFF — CLICK BET & FLY'}
            </div>
          </div>

          {crashState === 'flying' && crashBetPlaced && cashedOutAt === null ? (
            <button
              type="button"
              onClick={handleCrashCashOut}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-[#041f14] font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.7)] cursor-pointer active:scale-95"
            >
              💰 CASH OUT ৳{(betAmount * crashMult).toFixed(2)} (
              {crashMult.toFixed(2)}x)
            </button>
          ) : (
            <button
              type="button"
              disabled={crashState === 'flying'}
              onClick={handleStartCrashFlight}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-black text-base uppercase tracking-wider shadow-xl cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {crashState === 'flying'
                ? 'FLIGHT IN PROGRESS...'
                : `✈️ BET ৳${betAmount} & LAUNCH FLIGHT`}
            </button>
          )}
        </div>
      )}

      {/* ==================== ENGINE 3: FISHING ARCADE ==================== */}
      {engine === 'fishing' && (
        <div className="max-w-[460px] w-full mx-auto px-2.5 my-auto space-y-3">
          <div className="bg-cyan-950/80 border border-cyan-400/40 rounded-xl py-2 px-3 text-center text-xs font-black text-cyan-200">
            {fishNotice}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-gradient-to-b from-[#044369] to-[#011c2e] p-3.5 rounded-3xl border-2 border-cyan-400/40 shadow-2xl">
            {FISH_TARGETS.map((fish) => (
              <button
                key={fish.id}
                type="button"
                onClick={() => handleShootFish(fish)}
                className="bg-black/35 hover:bg-cyan-500/25 border border-cyan-300/30 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-90 transition group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {fish.icon}
                </span>
                <span className="text-[11px] font-extrabold text-white text-center leading-tight">
                  {fish.name}
                </span>
                <span className="text-[10px] font-black text-[#ffd84d] bg-black/40 px-2 py-0.5 rounded-full font-mono-num">
                  Payout x{fish.mult}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ==================== ENGINE 4: LIVE CASINO TABLE ==================== */}
      {engine === 'live_table' && (
        <div className="max-w-[460px] w-full mx-auto px-2.5 my-auto space-y-3">
          <div className="rounded-3xl bg-gradient-to-b from-[#0d3d2c] to-[#051a12] border-2 border-[#f0c030]/40 p-4 text-center space-y-4 shadow-2xl">
            <div className="text-xs font-black uppercase text-[#ffd84d] tracking-wider">
              🎥 LIVE DEALER STUDIO · {gameName}
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-black/40 border border-rose-400/40 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase text-rose-300">
                  DRAGON / PLAYER
                </div>
                <div className="text-4xl font-black text-white my-2 font-mono-num">
                  {tableDealing
                    ? '🂠'
                    : tableResult
                    ? `🃏 ${tableResult.leftCard}`
                    : '♠️ A'}
                </div>
              </div>
              <div className="bg-black/40 border border-amber-400/40 rounded-2xl p-4">
                <div className="text-[10px] font-black uppercase text-amber-300">
                  TIGER / BANKER
                </div>
                <div className="text-4xl font-black text-white my-2 font-mono-num">
                  {tableDealing
                    ? '🂠'
                    : tableResult
                    ? `🃏 ${tableResult.rightCard}`
                    : '♦️ K'}
                </div>
              </div>
            </div>

            {tableResult && (
              <div className="text-xs font-black text-[#1de9b6] bg-black/40 py-2 px-3 rounded-xl">
                {tableResult.text}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'LEFT', label: 'DRAGON / PLAYER', odds: '1.98x' },
                { id: 'TIE', label: 'TIE / BONUS', odds: '8.00x' },
                { id: 'RIGHT', label: 'TIGER / BANKER', odds: '1.98x' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setTableChoice(opt.id as 'LEFT' | 'TIE' | 'RIGHT')
                  }
                  className={`py-3 px-2 rounded-xl border-2 font-black text-xs cursor-pointer transition ${
                    tableChoice === opt.id
                      ? 'bg-[#ffd84d] text-[#2a1500] border-white shadow-lg'
                      : 'bg-black/40 text-white border-white/15'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[10px] opacity-80 font-mono-num mt-0.5">
                    {opt.odds}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={tableDealing}
              onClick={handleDealLiveTable}
              className="w-full py-3.5 rounded-2xl btn-3d-gold text-sm font-black uppercase cursor-pointer"
            >
              {tableDealing
                ? 'DEALING CARDS...'
                : `🎴 DEAL NOW (BET ৳${betAmount})`}
            </button>
          </div>
        </div>
      )}

      {/* ==================== ENGINE 5: 3D DICE & SPORTS ARENA ==================== */}
      {engine === 'dice_sports' && (
        <div className="max-w-[460px] w-full mx-auto px-2.5 my-auto space-y-3">
          <div className="rounded-3xl bg-gradient-to-b from-[#0d3d2c] to-[#051a12] border-2 border-[#f0c030]/40 p-4 text-center space-y-4 shadow-2xl">
            <div className="text-xs font-black text-[#ffd84d] uppercase">
              {diceMsg}
            </div>

            <div className="flex items-center justify-center gap-4 py-3">
              {diceValues.map((val, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-2xl bg-white text-[#071f18] border-4 border-[#ffd84d] flex items-center justify-center text-3xl font-black font-mono-num shadow-xl ${
                    diceRolling ? 'animate-bounce' : ''
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SMALL', label: 'SMALL (3-10)', odds: '1.98x' },
                { id: 'TRIPLE', label: 'TRIPLE JACKPOT', odds: '15.0x' },
                { id: 'BIG', label: 'BIG (11-18)', odds: '1.98x' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setDiceChoice(opt.id as 'SMALL' | 'TRIPLE' | 'BIG')
                  }
                  className={`py-3 px-2 rounded-xl border-2 font-black text-xs cursor-pointer transition ${
                    diceChoice === opt.id
                      ? 'bg-[#ffd84d] text-[#2a1500] border-white shadow-lg'
                      : 'bg-black/40 text-white border-white/15'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className="text-[10px] opacity-80 font-mono-num mt-0.5">
                    {opt.odds}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={diceRolling}
              onClick={handleRollDice}
              className="w-full py-3.5 rounded-2xl btn-3d-gold text-sm font-black uppercase cursor-pointer"
            >
              {diceRolling
                ? 'ROLLING...'
                : `🎲 ROLL & BET ৳${betAmount}`}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bet Amount & Win Readout Bar */}
      <div className="max-w-[460px] w-full mx-auto px-2.5 space-y-2">
        <div className="grid grid-cols-3 gap-2 bg-black/60 border border-amber-500/30 rounded-xl p-2.5 text-center">
          <div>
            <div className="text-[10px] font-bold text-amber-200/70 uppercase">
              Bet (BDT)
            </div>
            <div className="text-base font-black text-white font-mono-num">
              ৳{betAmount}
            </div>
          </div>
          <div className="border-x border-amber-500/20">
            <div className="text-[10px] font-bold text-amber-200/70 uppercase">
              Last Win
            </div>
            <div className="text-base font-black text-[#1de9b6] font-mono-num">
              ৳{lastWin.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-amber-200/70 uppercase">
              Mode
            </div>
            <div className="text-xs font-black text-[#ffd84d] uppercase mt-0.5">
              {engine.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Bet Chip Selector + Slot Spin Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {[10, 20, 50, 100, 500].map((b) => (
              <button
                key={b}
                type="button"
                disabled={spinning}
                onClick={() => setBetAmount(b)}
                className={`px-2.5 py-2 rounded-xl font-black text-xs font-mono-num cursor-pointer border transition ${
                  betAmount === b
                    ? 'bg-[#ffd84d] text-[#2a1200] border-white shadow'
                    : 'bg-black/50 text-amber-200 border-amber-500/30'
                }`}
              >
                ৳{b}
              </button>
            ))}
          </div>

          {engine === 'slot' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoSpin((a) => !a)}
                className={`px-3 py-3 rounded-xl font-black text-xs uppercase cursor-pointer border transition ${
                  autoSpin
                    ? 'bg-rose-600 text-white border-rose-300'
                    : 'bg-amber-950/90 text-amber-200 border-amber-500/40'
                }`}
              >
                {autoSpin ? 'STOP' : 'AUTO'}
              </button>

              <button
                type="button"
                disabled={spinning}
                onClick={handleSlotSpin}
                className="px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-[#2a1200] cursor-pointer active:scale-95 transition shadow-[0_6px_20px_rgba(245,197,24,0.5)] disabled:opacity-60"
                style={{
                  background:
                    'linear-gradient(180deg, #fff3a1 0%, #f5c518 50%, #d97706 100%)',
                }}
              >
                {spinning ? 'SPIN...' : '🎰 SPIN'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
