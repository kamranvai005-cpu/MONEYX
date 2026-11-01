import React, { useEffect, useRef, useState } from 'react';
import { BinaryCandle, BinaryPair, BinaryTrade, ResultPopupData } from '../types';

export const BINARY_PAIRS: BinaryPair[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin OTC',
    category: 'Crypto',
    payout: 96,
    basePrice: 89420.5,
    decimals: 2,
    volatility: 18.5,
    change24h: 3.42,
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar OTC',
    category: 'Forex',
    payout: 94,
    basePrice: 1.08462,
    decimals: 5,
    volatility: 0.00018,
    change24h: 0.64,
  },
  {
    symbol: 'GOLD/USD',
    name: 'Spot Gold XAU OTC',
    category: 'Commodity',
    payout: 95,
    basePrice: 2748.4,
    decimals: 2,
    volatility: 0.85,
    change24h: 1.28,
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum OTC',
    category: 'Crypto',
    payout: 93,
    basePrice: 3142.75,
    decimals: 2,
    volatility: 2.1,
    change24h: -1.15,
  },
  {
    symbol: 'GBP/JPY',
    name: 'Pound / Yen OTC',
    category: 'Forex',
    payout: 92,
    basePrice: 198.425,
    decimals: 3,
    volatility: 0.035,
    change24h: 0.89,
  },
];

interface BinaryTradingViewProps {
  balance: number;
  isRefreshing: boolean;
  onRefreshBalance: () => void;
  onNavigateHome: () => void;
  onOpenRules: () => void;
  binaryTrades: BinaryTrade[];
  onPlaceBinaryTrade: (trade: Omit<BinaryTrade, 'id' | 'status' | 'profit' | 'createdAt'>) => boolean;
  onSettleBinaryTrade: (tradeId: string, exitPrice: number) => void;
  onShowToast: (msg: string) => void;
  onShowResultPopup: (data: ResultPopupData) => void;
}

function generateInitialCandles(pair: BinaryPair, count = 42): BinaryCandle[] {
  const candles: BinaryCandle[] = [];
  let price = pair.basePrice;
  const now = Math.floor(Date.now() / 1000);
  for (let i = count; i >= 1; i--) {
    const open = price;
    const delta1 = (Math.random() - 0.495) * pair.volatility;
    const delta2 = (Math.random() - 0.495) * pair.volatility;
    const close = Number((open + delta1).toFixed(pair.decimals));
    const high = Number((Math.max(open, close) + Math.abs(delta2) * 0.85).toFixed(pair.decimals));
    const low = Number((Math.min(open, close) - Math.abs(delta2) * 0.85).toFixed(pair.decimals));
    candles.push({
      time: now - i * 3,
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return candles;
}

export const BinaryTradingView: React.FC<BinaryTradingViewProps> = ({
  balance,
  isRefreshing,
  onRefreshBalance,
  onNavigateHome,
  onOpenRules,
  binaryTrades,
  onPlaceBinaryTrade,
  onSettleBinaryTrade,
  onShowToast,
  onShowResultPopup,
}) => {
  const [selectedPair, setSelectedPair] = useState<BinaryPair>(BINARY_PAIRS[0]);
  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [durationSec, setDurationSec] = useState<number>(15);
  const [tradeAmount, setTradeAmount] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'signals'>('active');
  const [bullSentiment, setBullSentiment] = useState<number>(62);
  const [rsiValue, setRsiValue] = useState<number>(56.4);
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Store candles per symbol so switching pairs is seamless
  const candlesMapRef = useRef<Record<string, BinaryCandle[]>>({});
  const currentPriceMapRef = useRef<Record<string, number>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize candles for all pairs once
  useEffect(() => {
    BINARY_PAIRS.forEach((p) => {
      if (!candlesMapRef.current[p.symbol]) {
        const init = generateInitialCandles(p, 44);
        candlesMapRef.current[p.symbol] = init;
        currentPriceMapRef.current[p.symbol] = init[init.length - 1].close;
      }
    });
  }, []);

  const currentPrice =
    currentPriceMapRef.current[selectedPair.symbol] ?? selectedPair.basePrice;

  // Tick simulation & trade settlement loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setNowMs(now);
      const sec = Math.floor(now / 1000);

      BINARY_PAIRS.forEach((pair) => {
        const list = candlesMapRef.current[pair.symbol];
        if (!list || list.length === 0) return;

        const last = list[list.length - 1];
        // Slight mean-reverting random walk
        const drift = (pair.basePrice - last.close) * 0.015;
        const shock = (Math.random() - 0.498) * pair.volatility * 0.55;
        const nextPrice = Number(
          Math.max(pair.basePrice * 0.5, last.close + drift + shock).toFixed(pair.decimals)
        );
        currentPriceMapRef.current[pair.symbol] = nextPrice;

        // Every 3 seconds start a new candle
        if (sec - last.time >= 3) {
          list.push({
            time: sec,
            open: last.close,
            high: Math.max(last.close, nextPrice),
            low: Math.min(last.close, nextPrice),
            close: nextPrice,
          });
          if (list.length > 50) list.shift();
        } else {
          last.close = nextPrice;
          if (nextPrice > last.high) last.high = nextPrice;
          if (nextPrice < last.low) last.low = nextPrice;
        }
      });

      // Update sentiment & RSI smoothly
      setBullSentiment((prev) => {
        const next = prev + (Math.random() - 0.495) * 3;
        return Math.min(88, Math.max(18, Math.round(next)));
      });
      setRsiValue((prev) => {
        const next = prev + (Math.random() - 0.5) * 2.2;
        return Number(Math.min(82, Math.max(22, next)).toFixed(1));
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Check for expired open trades and settle them
  useEffect(() => {
    const openTrades = binaryTrades.filter((t) => t.status === 'OPEN');
    if (openTrades.length === 0) return;

    openTrades.forEach((trade) => {
      if (nowMs >= trade.endTime) {
        const liveExit =
          currentPriceMapRef.current[trade.symbol] ?? trade.entryPrice;
        // Ensure non-tie slight tick if identical
        const pairObj =
          BINARY_PAIRS.find((p) => p.symbol === trade.symbol) || BINARY_PAIRS[0];
        let finalExit = liveExit;
        if (finalExit === trade.entryPrice) {
          const minStep = Math.pow(10, -pairObj.decimals);
          finalExit = Number(
            (
              finalExit +
              (Math.random() > 0.48 ? minStep : -minStep)
            ).toFixed(pairObj.decimals)
          );
        }

        const isWin =
          (trade.direction === 'CALL' && finalExit > trade.entryPrice) ||
          (trade.direction === 'PUT' && finalExit < trade.entryPrice);
        const totalReturn = isWin
          ? Number((trade.amount * (1 + trade.payoutPercent / 100)).toFixed(2))
          : 0;

        onSettleBinaryTrade(trade.id, finalExit);
        onShowResultPopup({
          mode: 'Binary',
          periodOrPair: `${trade.symbol} (${trade.direction === 'CALL' ? 'UP ↑' : 'DOWN ↓'})`,
          resultText: `${finalExit.toFixed(pairObj.decimals)}`,
          winAmount: totalReturn,
          isWin,
        });
      }
    });
  }, [nowMs, binaryTrades, onSettleBinaryTrade, onShowResultPopup]);

  // Draw the interactive Candlestick / Area Chart on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Dark institutional chart background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#071318');
    bgGrad.addColorStop(1, '#0b1924');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const candles = (candlesMapRef.current[selectedPair.symbol] || []).slice(-34);
    if (candles.length === 0) return;

    const padTop = 24;
    const padBottom = 24;
    const padRight = 68;
    const plotW = width - padRight;
    const plotH = height - padTop - padBottom;

    let minP = Infinity;
    let maxP = -Infinity;
    candles.forEach((c) => {
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
    });

    // Include open trade entry prices in range so entry lines are always visible
    const openForPair = binaryTrades.filter(
      (t) => t.status === 'OPEN' && t.symbol === selectedPair.symbol
    );
    openForPair.forEach((t) => {
      if (t.entryPrice < minP) minP = t.entryPrice;
      if (t.entryPrice > maxP) maxP = t.entryPrice;
    });

    const range = Math.max(maxP - minP, selectedPair.volatility * 0.5);
    minP -= range * 0.12;
    maxP += range * 0.12;
    const fullRange = maxP - minP || 1;

    const priceToY = (p: number) =>
      padTop + plotH - ((p - minP) / fullRange) * plotH;

    // Subtle Grid Lines & Price Axis Labels
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const y = padTop + (plotH / gridSteps) * i;
      const val = maxP - (fullRange / gridSteps) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(plotW, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(selectedPair.decimals), plotW + 6, y + 3);
    }

    // Vertical time grid lines
    const stepX = plotW / candles.length;
    for (let i = 4; i < candles.length; i += 8) {
      const x = i * stepX + stepX / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    if (chartType === 'area') {
      // Smooth glowing Area Chart
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = idx * stepX + stepX / 2;
        const y = priceToY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Fill gradient under line
      const lastX = (candles.length - 1) * stepX + stepX / 2;
      ctx.lineTo(lastX, height);
      ctx.lineTo(stepX / 2, height);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, padTop, 0, height);
      areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.34)');
      areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();
    } else {
      // Candlesticks + EMA(7) line
      const candleWidth = Math.max(4, Math.min(10, stepX * 0.62));
      candles.forEach((c, idx) => {
        const x = idx * stepX + stepX / 2;
        const isBull = c.close >= c.open;
        const color = isBull ? '#10b981' : '#ef4444';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, priceToY(c.high));
        ctx.lineTo(x, priceToY(c.low));
        ctx.stroke();

        // Body
        const yOpen = priceToY(c.open);
        const yClose = priceToY(c.close);
        const top = Math.min(yOpen, yClose);
        const bodyH = Math.max(2.5, Math.abs(yClose - yOpen));
        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);
      });

      // EMA overlay curve
      ctx.beginPath();
      let ema = candles[0].close;
      const k = 2 / (7 + 1);
      candles.forEach((c, idx) => {
        ema = c.close * k + ema * (1 - k);
        const x = idx * stepX + stepX / 2;
        const y = priceToY(ema);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // Draw Active Trade Entry Lines
    openForPair.forEach((trade) => {
      const yEntry = priceToY(trade.entryPrice);
      const isCall = trade.direction === 'CALL';
      const lineColor = isCall ? '#10b981' : '#ef4444';
      const secLeft = Math.max(0, Math.ceil((trade.endTime - nowMs) / 1000));

      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, yEntry);
      ctx.lineTo(plotW, yEntry);
      ctx.stroke();
      ctx.restore();

      // Entry tag badge on left of chart
      const label = `${isCall ? '▲ UP' : '▼ DOWN'} ৳${trade.amount} • ${secLeft}s`;
      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      const textW = ctx.measureText(label).width + 12;
      ctx.fillStyle = lineColor;
      ctx.beginPath();
      ctx.roundRect(8, yEntry - 10, textW, 20, 5);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, 14, yEntry + 3.5);
    });

    // Current Live Price Laser Line & Right Tag
    const lastCandle = candles[candles.length - 1];
    const yNow = priceToY(lastCandle.close);
    const lastX = (candles.length - 1) * stepX + stepX / 2;

    ctx.save();
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, yNow);
    ctx.lineTo(plotW, yNow);
    ctx.stroke();
    ctx.restore();

    // Glowing pulse dot on current price
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(lastX, yNow, 4, 0, Math.PI * 2);
    ctx.fill();

    // Price badge on right axis
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(plotW + 2, yNow - 10, padRight - 4, 20, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.fillText(
      lastCandle.close.toFixed(selectedPair.decimals),
      plotW + 6,
      yNow + 3.5
    );
  }, [selectedPair, chartType, nowMs, binaryTrades]);

  const handleExecuteTrade = (direction: 'CALL' | 'PUT') => {
    if (tradeAmount <= 0) {
      onShowToast('Please enter a valid investment amount');
      return;
    }
    if (tradeAmount > balance) {
      onShowToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }

    const start = Date.now();
    const entry =
      currentPriceMapRef.current[selectedPair.symbol] ?? selectedPair.basePrice;

    const ok = onPlaceBinaryTrade({
      symbol: selectedPair.symbol,
      direction,
      amount: tradeAmount,
      payoutPercent: selectedPair.payout,
      entryPrice: entry,
      durationSec,
      startTime: start,
      endTime: start + durationSec * 1000,
    });

    if (ok) {
      onShowToast(
        `${direction === 'CALL' ? 'UP ↑' : 'DOWN ↓'} Trade Placed on ${selectedPair.symbol} @ ${entry.toFixed(selectedPair.decimals)}`
      );
    }
  };

  const openTrades = binaryTrades.filter((t) => t.status === 'OPEN');
  const settledTrades = binaryTrades.filter((t) => t.status !== 'OPEN');
  const potentialReturn = (
    tradeAmount *
    (1 + selectedPair.payout / 100)
  ).toFixed(2);

  return (
    <div className="view-animate pb-20">
      {/* Sticky Top Header matching FM CLUB */}
      <header
        className="h-16 px-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-white flex items-center justify-center w-9 h-9 rounded-full active:bg-white/15 cursor-pointer"
            aria-label="Back to Home"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <div className="text-lg font-black tracking-wide uppercase leading-none">
              FM BINARY PRO
            </div>
            <div className="text-[11px] text-emerald-100 font-medium mt-0.5">
              Live OTC Binary Options
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
            <span className="text-xs font-semibold text-emerald-100">BDT</span>
            <span className="text-base font-extrabold font-mono-num">
              {balance.toFixed(2)}
            </span>
            <img
              src="https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/1000035090-removebg-preview.png"
              alt="Refresh"
              onClick={onRefreshBalance}
              className={`w-4 h-4 ml-1 cursor-pointer brightness-0 invert ${
                isRefreshing ? 'refresh-spin' : ''
              }`}
            />
          </div>
        </div>
      </header>

      <div className="p-3.5 space-y-3">
        {/* Asset Pair Selector Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {BINARY_PAIRS.map((pair) => {
            const isSelected = pair.symbol === selectedPair.symbol;
            return (
              <button
                key={pair.symbol}
                onClick={() => setSelectedPair(pair)}
                className={`shrink-0 px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold tracking-tight">
                    {pair.symbol}
                  </div>
                  <div
                    className={`text-[10px] font-medium ${
                      isSelected ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {pair.category}
                  </div>
                </div>
                <span
                  className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  +{pair.payout}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Chart & Telemetry Card */}
        <section className="bg-white rounded-[18px] p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
          {/* Top Pair Info & Chart Controls */}
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  {selectedPair.symbol}
                </span>
                <span
                  className={`text-xs font-bold ${
                    selectedPair.change24h >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-500'
                  }`}
                >
                  {selectedPair.change24h >= 0 ? '+' : ''}
                  {selectedPair.change24h}%
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {selectedPair.name} · Payout{' '}
                <b className="text-emerald-600">+{selectedPair.payout}%</b>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                    chartType === 'candles'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Candles
                </button>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                    chartType === 'area'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Area
                </button>
              </div>
              <button
                onClick={onOpenRules}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold cursor-pointer"
              >
                Rules
              </button>
            </div>
          </div>

          {/* Live Sentiment Ratio Bar */}
          <div className="mb-2.5">
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-emerald-600">
                ▲ Buyers {bullSentiment}%
              </span>
              <span className="text-slate-400 font-mono-num">
                RSI(14): {rsiValue}
              </span>
              <span className="text-rose-500">
                {100 - bullSentiment}% Sellers ▼
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-rose-500 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${bullSentiment}%` }}
              />
            </div>
          </div>

          {/* Interactive Real-Time Chart Canvas */}
          <div className="relative w-full h-[225px] rounded-xl overflow-hidden bg-[#071318] border border-slate-800">
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Overlay Live Price Pill */}
            <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs border border-slate-700/70 rounded-lg px-2.5 py-1 flex items-center gap-2 pointer-events-none">
              <span className="text-[11px] text-slate-400 font-semibold">
                Spot:
              </span>
              <span className="text-xs font-extrabold text-white font-mono-num">
                {currentPrice.toFixed(selectedPair.decimals)}
              </span>
            </div>
          </div>

          {/* Expiration & Amount Controls */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            {/* Expiration Selector */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                Expiration Time
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDurationSec(sec)}
                    className={`h-8 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                      durationSec === sec
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Return Box */}
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">
                  Profit (+{selectedPair.payout}%)
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  Instant
                </span>
              </div>
              <div className="text-lg font-black text-emerald-700 font-mono-num leading-tight">
                ৳{potentialReturn}
              </div>
            </div>
          </div>

          {/* Investment Amount Input & Presets */}
          <div className="mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">
                Investment (BDT)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setTradeAmount((prev) => Math.max(10, prev - 50))
                  }
                  className="w-8 h-7 rounded-md bg-white border border-slate-300 font-extrabold text-slate-700 cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min={10}
                  value={tradeAmount}
                  onChange={(e) =>
                    setTradeAmount(Math.max(1, Number(e.target.value) || 0))
                  }
                  className="w-24 h-7 bg-white border border-slate-300 rounded-md text-center font-extrabold text-sm text-slate-900 font-mono-num"
                />
                <button
                  onClick={() => setTradeAmount((prev) => prev + 50)}
                  className="w-8 h-7 rounded-md bg-white border border-slate-300 font-extrabold text-slate-700 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {[20, 50, 100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTradeAmount(amt)}
                  className={`h-7 rounded-md text-xs font-bold cursor-pointer transition-colors ${
                    tradeAmount === amt
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {amt >= 1000 ? `${amt / 1000}K` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* CALL (UP) & PUT (DOWN) Execution Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-3.5">
            <button
              onClick={() => handleExecuteTrade('CALL')}
              className="h-16 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-extrabold shadow-[0_4px_0_#047857] flex flex-col items-center justify-center cursor-pointer transition-transform"
            >
              <div className="flex items-center gap-1.5 text-lg leading-none">
                <span>CALL · UP</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M7 17L17 7M17 7H8M17 7V16" />
                </svg>
              </div>
              <span className="text-xs font-semibold opacity-95 mt-1">
                ওপরে (Payout +{selectedPair.payout}%)
              </span>
            </button>

            <button
              onClick={() => handleExecuteTrade('PUT')}
              className="h-16 rounded-xl bg-rose-500 hover:bg-rose-600 active:translate-y-0.5 text-white font-extrabold shadow-[0_4px_0_#be123c] flex flex-col items-center justify-center cursor-pointer transition-transform"
            >
              <div className="flex items-center gap-1.5 text-lg leading-none">
                <span>PUT · DOWN</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M7 7L17 17M17 17H8M17 17V8" />
                </svg>
              </div>
              <span className="text-xs font-semibold opacity-95 mt-1">
                নিচে (Payout +{selectedPair.payout}%)
              </span>
            </button>
          </div>
        </section>

        {/* Bottom Tabs Card: Active Positions / Trade History / Market Signals */}
        <section className="bg-white rounded-[18px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="grid grid-cols-3 border-b border-slate-100 h-12">
            <button
              onClick={() => setActiveTab('active')}
              className={`text-sm font-bold relative cursor-pointer ${
                activeTab === 'active'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500'
              }`}
            >
              Active ({openTrades.length})
              {activeTab === 'active' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`text-sm font-bold relative cursor-pointer ${
                activeTab === 'history'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500'
              }`}
            >
              History ({settledTrades.length})
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`text-sm font-bold relative cursor-pointer ${
                activeTab === 'signals'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500'
              }`}
            >
              Signals
              {activeTab === 'signals' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab 1: Active Open Positions */}
          {activeTab === 'active' && (
            <div className="p-3.5">
              {openTrades.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  No active binary trades right now. Choose CALL (UP) or PUT
                  (DOWN) above to start trading!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {openTrades.map((trade) => {
                    const pairObj =
                      BINARY_PAIRS.find((p) => p.symbol === trade.symbol) ||
                      BINARY_PAIRS[0];
                    const liveP =
                      currentPriceMapRef.current[trade.symbol] ??
                      trade.entryPrice;
                    const isWinningNow =
                      (trade.direction === 'CALL' &&
                        liveP > trade.entryPrice) ||
                      (trade.direction === 'PUT' && liveP < trade.entryPrice);
                    const secLeft = Math.max(
                      0,
                      Math.ceil((trade.endTime - nowMs) / 1000)
                    );
                    const pct = Math.min(
                      100,
                      Math.max(
                        0,
                        ((nowMs - trade.startTime) /
                          (trade.durationSec * 1000)) *
                          100
                      )
                    );

                    return (
                      <div
                        key={trade.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-extrabold text-white ${
                                trade.direction === 'CALL'
                                  ? 'bg-emerald-500'
                                  : 'bg-rose-500'
                              }`}
                            >
                              {trade.direction === 'CALL' ? '▲ UP' : '▼ DOWN'}
                            </span>
                            <span className="font-extrabold text-sm text-slate-900">
                              {trade.symbol}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-slate-700 font-mono-num">
                            {secLeft}s left
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-mono-num">
                          <span>
                            Entry: {trade.entryPrice.toFixed(pairObj.decimals)}
                          </span>
                          <span>
                            Current: {liveP.toFixed(pairObj.decimals)}
                          </span>
                          <span
                            className={`font-extrabold ${
                              isWinningNow
                                ? 'text-emerald-600'
                                : 'text-rose-500'
                            }`}
                          >
                            {isWinningNow
                              ? `+৳${(
                                  trade.amount *
                                  (1 + trade.payoutPercent / 100)
                                ).toFixed(2)}`
                              : `-৳${trade.amount.toFixed(2)}`}
                          </span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full transition-all duration-200 ${
                              isWinningNow ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Settled Binary Trade History */}
          {activeTab === 'history' && (
            <div className="p-3.5">
              {settledTrades.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  No completed binary trades yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {settledTrades.slice(0, 20).map((t) => {
                    const pairObj =
                      BINARY_PAIRS.find((p) => p.symbol === t.symbol) ||
                      BINARY_PAIRS[0];
                    const isWin = t.status === 'WIN';
                    return (
                      <div
                        key={t.id}
                        className="py-2.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-extrabold ${
                                t.direction === 'CALL'
                                  ? 'text-emerald-600'
                                  : 'text-rose-500'
                              }`}
                            >
                              {t.direction === 'CALL' ? '▲ CALL' : '▼ PUT'}
                            </span>
                            <span className="text-sm font-extrabold text-slate-800">
                              {t.symbol}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({t.durationSec}s)
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono-num mt-0.5">
                            {t.entryPrice.toFixed(pairObj.decimals)} →{' '}
                            {t.exitPrice?.toFixed(pairObj.decimals)} ·{' '}
                            {t.createdAt}
                          </div>
                        </div>

                        <div className="text-right font-mono-num">
                          <div
                            className={`text-sm font-extrabold ${
                              isWin ? 'text-emerald-600' : 'text-rose-500'
                            }`}
                          >
                            {isWin
                              ? `+৳${t.profit.toFixed(2)}`
                              : `-৳${t.amount.toFixed(2)}`}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Bet ৳{t.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Live Technical Signals */}
          {activeTab === 'signals' && (
            <div className="p-3.5 space-y-2">
              {BINARY_PAIRS.map((p) => {
                const live = currentPriceMapRef.current[p.symbol] ?? p.basePrice;
                const isBuy = live >= p.basePrice;
                return (
                  <div
                    key={p.symbol}
                    onClick={() => setSelectedPair(p)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:border-emerald-300"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-800">
                        {p.symbol}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-num">
                        Spot: {live.toFixed(p.decimals)} · Payout +{p.payout}%
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                          isBuy
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isBuy ? 'STRONG CALL ↑' : 'STRONG PUT ↓'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
