import React, { useEffect, useRef, useState } from 'react';
import { ResultPopupData, WingoBet, WingoResult } from '../types';

const VIDEO_BIG = 'https://pub-8f7f45da1f9a4bff9621e0805f0516a4.r2.dev/wingobig.mp4';
const VIDEO_SMALL = 'https://pub-8f7f45da1f9a4bff9621e0805f0516a4.r2.dev/wingosmall.mp4';

export function formatPeriodId(p: number): string {
  const d = new Date(p * 30 * 1000);
  return (
    '' +
    d.getUTCFullYear() +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0') +
    String(p).slice(-6)
  );
}

export function getNumberColor(num: number): WingoResult['color_result'] {
  if (num === 0) return 'Red+Violet';
  if (num === 5) return 'Green+Violet';
  return num % 2 === 0 ? 'Red' : 'Green';
}

interface WingoTradingViewProps {
  balance: number;
  isRefreshing: boolean;
  onRefreshBalance: () => void;
  onNavigateHome: () => void;
  onOpenRules: () => void;
  wingoHistory: WingoResult[];
  wingoBets: WingoBet[];
  onOpenBetModal: (choice: string, presetMult?: number) => void;
  onResolvePeriod: (result: WingoResult) => void;
  onShowToast: (msg: string) => void;
  onShowResultPopup: (data: ResultPopupData) => void;
  initialSubTab?: 'history' | 'chart' | 'my';
  forcedResult?: number | null;
}

export const WingoTradingView: React.FC<WingoTradingViewProps> = ({
  balance,
  isRefreshing,
  onRefreshBalance,
  onNavigateHome,
  onOpenRules,
  wingoHistory,
  wingoBets,
  onOpenBetModal,
  onResolvePeriod,
  onShowToast,
  initialSubTab = 'history',
  forcedResult = null,
}) => {
  const [currentPeriod, setCurrentPeriod] = useState<number>(() =>
    Math.floor(Date.now() / 1000 / 30)
  );
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'history' | 'chart' | 'my'>(
    initialSubTab
  );
  const [histPage, setHistPage] = useState<number>(1);
  const [showNumberInTopBalls, setShowNumberInTopBalls] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredDrawRef = useRef<number>(0);
  const blobBigRef = useRef<string | null>(null);
  const blobSmallRef = useRef<string | null>(null);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);

  // Preload video blobs for zero-lag draw playback
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(VIDEO_BIG)
        .then((r) => r.blob())
        .catch(() => null),
      fetch(VIDEO_SMALL)
        .then((r) => r.blob())
        .catch(() => null),
    ]).then(([b1, b2]) => {
      if (!active) return;
      if (b1) blobBigRef.current = URL.createObjectURL(b1);
      if (b2) blobSmallRef.current = URL.createObjectURL(b2);
    });
    return () => {
      active = false;
    };
  }, []);

  // 30-second synchronized game clock
  useEffect(() => {
    const timer = setInterval(() => {
      const nowSec = Date.now() / 1000;
      const p = Math.floor(nowSec / 30);
      const rem = Math.ceil(30 - (nowSec % 30));

      setCurrentPeriod((prev) => {
        if (prev !== p) {
          return p;
        }
        return prev;
      });
      setSecondsRemaining(rem);

      if (rem <= 5 && hasTriggeredDrawRef.current !== p) {
        hasTriggeredDrawRef.current = p;
        triggerDrawSequence(p);
      }
    }, 150);

    return () => clearInterval(timer);
  });

  const triggerDrawSequence = async (periodToResolve: number) => {
    setIsDrawing(true);

    // Generate authentic draw outcome (0-9) or use Admin forcedResult
    const drawnNum =
      forcedResult !== null && forcedResult !== undefined
        ? forcedResult
        : Math.floor(Math.random() * 10);
    const isBig = drawnNum >= 5;
    const sizeResult: 'Big' | 'Small' = isBig ? 'Big' : 'Small';
    const colorResult = getNumberColor(drawnNum);

    const videoEl = videoRef.current;
    if (videoEl) {
      const src = isBig
        ? blobBigRef.current || VIDEO_BIG
        : blobSmallRef.current || VIDEO_SMALL;
      videoEl.src = src;
      videoEl.currentTime = 0;
      videoEl.muted = isMuted;
      videoEl.playbackRate = 2.15;
      videoEl.play().catch(() => {});
    }

    await new Promise((r) => setTimeout(r, 4500));

    if (videoEl) {
      videoEl.pause();
    }

    const newResult: WingoResult = {
      period: formatPeriodId(periodToResolve),
      periodNum: periodToResolve,
      number_result: drawnNum,
      size_result: sizeResult,
      color_result: colorResult,
      timestamp: new Date().toLocaleTimeString(),
    };

    onResolvePeriod(newResult);
    setIsDrawing(false);
  };

  const isBettingLocked = secondsRemaining <= 5 || isDrawing;
  const totalPages = Math.max(1, Math.ceil(wingoHistory.length / 10));
  const paginatedHistory = wingoHistory.slice(
    (histPage - 1) * 10,
    histPage * 10
  );

  const handleQuickBet = (type: string) => {
    if (isBettingLocked) {
      onShowToast('No trading allowed during 5s draw countdown');
      return;
    }
    if (type === 'Random') {
      const randChoice = Math.random() > 0.5 ? 'Big' : 'Small';
      onOpenBetModal(randChoice, 1);
    } else {
      const mult = parseInt(type.replace('x', ''), 10) || 1;
      onOpenBetModal('Big', mult);
    }
  };

  return (
    <div className="view-animate pb-20">
      {/* Sticky Game Header */}
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
              width="28"
              height="28"
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
          <div className="text-[22px] font-black tracking-wide uppercase">
            FM CLUB
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xl font-extrabold font-mono-num">
          <span>
            BDT <span>{balance.toFixed(2)}</span>
          </span>
          <img
            src="https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/1000035090-removebg-preview.png"
            className={`w-[22px] h-[22px] ml-1.5 cursor-pointer brightness-0 invert opacity-90 hover:opacity-100 ${
              isRefreshing ? 'refresh-spin' : ''
            }`}
            alt="Refresh"
            onClick={onRefreshBalance}
          />
        </div>
      </header>

      <div className="p-3.5 space-y-3.5">
        {/* Top Recent Draw Results */}
        <section className="bg-white rounded-2xl p-3.5 relative shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 mb-2.5 pr-14">
            <span className="text-sm font-bold text-slate-600">
              Recent Draw Results
            </span>
            <button
              onClick={() => setShowNumberInTopBalls((v) => !v)}
              className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded cursor-pointer"
            >
              {showNumberInTopBalls ? 'Show B/S' : 'Show 0-9'}
            </button>
          </div>

          <div className="grid grid-cols-10 gap-1">
            {wingoHistory.slice(0, 10).map((r) => {
              const c = r.color_result.toLowerCase();
              const ballClass = c.includes('violet')
                ? r.number_result === 0
                  ? 'ball-red-violet'
                  : 'ball-violet'
                : c.includes('red')
                ? 'ball-red'
                : 'ball-green';

              return (
                <div key={r.period} className={`res-ball ${ballClass}`}>
                  {showNumberInTopBalls
                    ? r.number_result
                    : r.size_result === 'Big'
                    ? 'B'
                    : 'S'}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              if (videoRef.current) videoRef.current.muted = next;
              onShowToast(next ? 'Draw Sound Muted' : 'Draw Sound Enabled');
            }}
            className="absolute right-0 top-0 w-[58px] h-9 bg-emerald-100 rounded-tr-2xl rounded-bl-[20px] flex items-center justify-center cursor-pointer"
            style={{ color: isMuted ? '#94a3b8' : '#059669' }}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </section>

        {/* Current Period & Video Box */}
        <section className="bg-white rounded-[18px] p-4 relative shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-3">
            <div className="text-[13px] text-slate-600">
              Period:{' '}
              <b className="text-slate-900 font-bold font-mono-num">
                {formatPeriodId(currentPeriod)}
              </b>
            </div>
            <button
              onClick={onOpenRules}
              className="absolute top-0 right-0 text-white text-xs font-bold px-3.5 py-1.5 rounded-tr-[18px] rounded-bl-[18px] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
              }}
            >
              Rules
            </button>
          </div>

          <div
            className={`h-[38px] rounded-lg flex items-center justify-center text-base font-extrabold font-mono-num transition-colors ${
              secondsRemaining <= 5
                ? 'bg-rose-50 border border-rose-200 text-rose-600'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
            }`}
          >
            Time remaining 00:
            {secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
          </div>

          {/* Video Simulation Viewport */}
          <div className="w-full h-[190px] my-3.5 rounded-xl overflow-hidden bg-black relative">
            <video
              ref={videoRef}
              muted={isMuted}
              playsInline
              preload="auto"
              src={`${VIDEO_BIG}#t=0.0`}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 z-10" />
            {secondsRemaining <= 5 && (
              <div className="absolute top-2.5 right-2.5 z-20 bg-rose-600/90 text-white text-xs font-extrabold px-2.5 py-1 rounded-full font-mono-num shadow-md">
                Drawing... 0{secondsRemaining}s
              </div>
            )}
          </div>

          {/* Color Bet Row (Green / Violet / Red) */}
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            <button
              disabled={isBettingLocked}
              onClick={() => onOpenBetModal('Green', 1)}
              className={`h-10 rounded-xl text-white font-extrabold text-sm bg-emerald-500 shadow-[0_3px_0_#059669] active:translate-y-0.5 cursor-pointer flex items-center justify-between px-3 ${
                isBettingLocked ? 'opacity-55 cursor-not-allowed' : ''
              }`}
            >
              <span>Green</span>
              <span className="text-xs opacity-90">x2</span>
            </button>
            <button
              disabled={isBettingLocked}
              onClick={() => onOpenBetModal('Violet', 1)}
              className={`h-10 rounded-xl text-white font-extrabold text-sm bg-violet-500 shadow-[0_3px_0_#6d28d9] active:translate-y-0.5 cursor-pointer flex items-center justify-between px-3 ${
                isBettingLocked ? 'opacity-55 cursor-not-allowed' : ''
              }`}
            >
              <span>Violet</span>
              <span className="text-xs opacity-90">x4.5</span>
            </button>
            <button
              disabled={isBettingLocked}
              onClick={() => onOpenBetModal('Red', 1)}
              className={`h-10 rounded-xl text-white font-extrabold text-sm bg-rose-500 shadow-[0_3px_0_#dc2626] active:translate-y-0.5 cursor-pointer flex items-center justify-between px-3 ${
                isBettingLocked ? 'opacity-55 cursor-not-allowed' : ''
              }`}
            >
              <span>Red</span>
              <span className="text-xs opacity-90">x2</span>
            </button>
          </div>

          {/* Big / Small Primary Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              disabled={isBettingLocked}
              onClick={() => onOpenBetModal('Big', 1)}
              className={`h-16 rounded-xl text-white text-xl font-extrabold bg-amber-500 shadow-[0_4px_0_#d97706] active:translate-y-0.5 flex flex-col items-center justify-center cursor-pointer transition-transform ${
                isBettingLocked ? 'opacity-55 cursor-not-allowed' : ''
              }`}
            >
              Big <span className="text-[13px] font-medium opacity-95">x1.96</span>
            </button>
            <button
              disabled={isBettingLocked}
              onClick={() => onOpenBetModal('Small', 1)}
              className={`h-16 rounded-xl text-white text-xl font-extrabold bg-blue-500 shadow-[0_4px_0_#2563eb] active:translate-y-0.5 flex flex-col items-center justify-center cursor-pointer transition-transform ${
                isBettingLocked ? 'opacity-55 cursor-not-allowed' : ''
              }`}
            >
              Small{' '}
              <span className="text-[13px] font-medium opacity-95">x1.96</span>
            </button>
          </div>

          {/* Quick Multiplier Grid */}
          <div
            className="grid gap-1.5 mt-3"
            style={{ gridTemplateColumns: '1.3fr repeat(6, 1fr)' }}
          >
            {['Random', 'x1', 'x5', 'x10', 'x20', 'x50', 'x100'].map((m) => (
              <button
                key={m}
                disabled={isBettingLocked}
                onClick={() => handleQuickBet(m)}
                className="h-[42px] bg-white border border-slate-300 rounded-md text-[13px] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 active:bg-emerald-50 cursor-pointer"
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {/* History / Trends / My Bets Card */}
        <section className="bg-white rounded-[18px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-3 border-b border-slate-100 h-[52px]">
            <button
              onClick={() => setActiveTab('history')}
              className={`text-[15px] cursor-pointer relative ${
                activeTab === 'history'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 font-semibold'
              }`}
            >
              History
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`text-[15px] cursor-pointer relative ${
                activeTab === 'chart'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 font-semibold'
              }`}
            >
              Trends
              {activeTab === 'chart' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`text-[15px] cursor-pointer relative ${
                activeTab === 'my'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 font-semibold'
              }`}
            >
              My Bets ({wingoBets.length})
              {activeTab === 'my' && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[3px] bg-emerald-500 rounded-t-sm" />
              )}
            </button>
          </div>

          {/* Tab 1: Game History */}
          {activeTab === 'history' && (
            <div>
              <div
                className="grid items-center text-center h-[46px] text-[13px] font-bold text-slate-600 bg-slate-50"
                style={{ gridTemplateColumns: '1.8fr 0.8fr 1.2fr 0.8fr' }}
              >
                <span>Period</span>
                <span>Number</span>
                <span>Size</span>
                <span>Color</span>
              </div>

              <div>
                {paginatedHistory.map((r) => {
                  const cl = r.color_result.toLowerCase();
                  const numColor = cl.includes('violet')
                    ? 'text-violet-500'
                    : cl.includes('red')
                    ? 'text-rose-500'
                    : 'text-emerald-500';

                  return (
                    <div
                      key={r.period}
                      className="grid items-center text-center min-h-[52px] border-t border-slate-100 text-sm"
                      style={{
                        gridTemplateColumns: '1.8fr 0.8fr 1.2fr 0.8fr',
                      }}
                    >
                      <span className="font-mono-num text-xs font-semibold text-slate-700">
                        {r.period}
                      </span>
                      <span
                        className={`text-xl font-extrabold font-mono-num ${numColor}`}
                      >
                        {r.number_result}
                      </span>
                      <span
                        className={`font-bold ${
                          r.size_result === 'Big'
                            ? 'text-amber-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {r.size_result}
                      </span>
                      <div className="flex items-center justify-center gap-1">
                        {cl.includes('green') && (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        )}
                        {cl.includes('red') && (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
                        )}
                        {cl.includes('violet') && (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-6 p-4 border-t border-slate-100">
                <button
                  onClick={() => setHistPage((p) => Math.max(1, p - 1))}
                  disabled={histPage <= 1}
                  className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center cursor-pointer ${
                    histPage > 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  ‹
                </button>
                <span className="text-sm font-bold font-mono-num">
                  {histPage}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setHistPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={histPage >= totalPages}
                  className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center cursor-pointer ${
                    histPage < totalPages
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Trends Matrix */}
          {activeTab === 'chart' && (
            <div className="p-3.5">
              {/* Summary Ratio */}
              <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600">
                  Big:{' '}
                  {
                    wingoHistory
                      .slice(0, 20)
                      .filter((x) => x.size_result === 'Big').length
                  }
                  /20
                </span>
                <span className="text-slate-400">Last 20 Draws Matrix</span>
                <span className="text-blue-600">
                  Small:{' '}
                  {
                    wingoHistory
                      .slice(0, 20)
                      .filter((x) => x.size_result === 'Small').length
                  }
                  /20
                </span>
              </div>

              <div className="space-y-2">
                {wingoHistory.slice(0, 12).map((r) => (
                  <div
                    key={r.period}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs"
                  >
                    <span className="font-mono-num text-slate-500 font-semibold">
                      {r.period.slice(-6)}
                    </span>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                        const hit = r.number_result === n;
                        return (
                          <span
                            key={n}
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-num text-[11px] font-bold ${
                              hit
                                ? n >= 5
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-blue-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {n}
                          </span>
                        );
                      })}
                    </div>
                    <span
                      className={`w-6 text-right font-extrabold ${
                        r.size_result === 'Big'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }`}
                    >
                      {r.size_result === 'Big' ? 'B' : 'S'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: My Bets */}
          {activeTab === 'my' && (
            <div className="p-3.5">
              {wingoBets.length === 0 ? (
                <div className="text-center text-slate-400 py-6 text-sm font-medium">
                  No trade history found
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {wingoBets.slice(0, 25).map((b) => {
                    const isWin = b.status === 'Win';
                    const isLose = b.status === 'Lose';
                    const color = isWin
                      ? '#10b981'
                      : isLose
                      ? '#ef4444'
                      : '#f59e0b';
                    return (
                      <div
                        key={b.id}
                        className="flex justify-between items-center py-2.5"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-800">
                            {b.choice}{' '}
                            <span className="text-xs text-slate-400 font-mono-num">
                              ({b.period})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {b.createdAt}
                            {b.resultSize
                              ? ` · Result: ${b.resultNumber} (${b.resultSize})`
                              : ' · Waiting for draw...'}
                          </div>
                        </div>

                        <div className="text-right font-mono-num">
                          <div
                            className="font-extrabold text-sm"
                            style={{ color }}
                          >
                            {isWin
                              ? `+BDT ${b.winAmount.toFixed(2)}`
                              : b.status}
                          </div>
                          <div className="text-xs font-bold text-slate-600">
                            Bet BDT {b.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
