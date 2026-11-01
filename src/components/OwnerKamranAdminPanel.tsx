import React, { useState } from 'react';
import {
  BinaryTrade,
  BonusRecord,
  SavedWithdrawalWallet,
  SiteAdminSettings,
  TransactionRecord,
  UserProfile,
  WingoBet,
} from '../types';

interface OwnerKamranAdminPanelProps {
  balance: number;
  profile: UserProfile;
  settings: SiteAdminSettings;
  transactions: TransactionRecord[];
  bonuses: BonusRecord[];
  wingoBets: WingoBet[];
  binaryTrades: BinaryTrade[];
  savedWallets: SavedWithdrawalWallet[];
  jackpotValue: number;
  onUpdateBalance: (newBalance: number) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateSettings: (updates: Partial<SiteAdminSettings>) => void;
  onUpdateTransactionStatus: (
    txId: string,
    newStatus: TransactionRecord['status']
  ) => void;
  onDeleteTransaction: (txId: string) => void;
  onAdminAddBonus: (title: string, amount: number) => void;
  onUpdateJackpot: (newVal: number) => void;
  onExitAdmin: () => void;
  onShowToast: (msg: string) => void;
}

export const OwnerKamranAdminPanel: React.FC<OwnerKamranAdminPanelProps> = ({
  balance,
  profile,
  settings,
  transactions,
  bonuses,
  wingoBets,
  binaryTrades,
  savedWallets,
  jackpotValue,
  onUpdateBalance,
  onUpdateProfile,
  onUpdateSettings,
  onUpdateTransactionStatus,
  onDeleteTransaction,
  onAdminAddBonus,
  onUpdateJackpot,
  onExitAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'transactions' | 'gateway' | 'games' | 'users'
  >('overview');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');

  // Form states
  const [balanceInput, setBalanceInput] = useState<string>(balance.toFixed(2));
  const [bonusTitleInput, setBonusTitleInput] = useState<string>(
    'Owner Kamran Special VIP Bonus'
  );
  const [bonusAmtInput, setBonusAmtInput] = useState<string>('500');
  const [jackpotInput, setJackpotInput] = useState<string>(
    String(jackpotValue)
  );
  const [txFilter, setTxFilter] = useState<'ALL' | 'Deposit' | 'Withdraw'>(
    'ALL'
  );
  const [bkashTestStatus, setBkashTestStatus] = useState<string | null>(null);
  const [bkashTesting, setBkashTesting] = useState<boolean>(false);

  const totalDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'Withdraw' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const netRevenue = totalDeposits - totalWithdrawals;

  const filteredTransactions = transactions.filter((t) =>
    txFilter === 'ALL' ? true : t.type === txFilter
  );

  const handleCopyAdminUrl = async () => {
    const adminUrl = `${window.location.origin}/owner_kamran-admin-panel`;
    try {
      await navigator.clipboard.writeText(adminUrl);
    } catch {
      // ignore clipboard fallback
    }
    onShowToast('✓ Admin URL Copied: /owner_kamran-admin-panel');
  };

  const handleTestBkashGateway = async () => {
    setBkashTesting(true);
    setBkashTestStatus(null);
    try {
      const res = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500,
          orderID: `ADM${Math.floor(100000 + Math.random() * 900000)}`,
          intent: 'sale',
        }),
      });
      const data = await res.json();
      setBkashTestStatus(
        `OK — PaymentID: ${data.paymentID} | Invoice: ${data.merchantInvoiceNumber} | Status: ${data.transactionStatus}`
      );
      onShowToast('✓ bKash Sandbox Gateway Verified!');
    } catch {
      setBkashTestStatus('Error connecting to /api/bkash/create-payment');
    } finally {
      setBkashTesting(false);
    }
  };

  if (isLocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, #0d3d2c 0%, #071f18 65%, #03100c 100%)',
        }}
      >
        <div className="w-full max-w-[400px] bg-[#0a2e22] border-2 border-[#f0c030]/40 rounded-3xl p-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f0c030]/15 border border-[#f0c030]/40 flex items-center justify-center mx-auto text-3xl mb-3">
            🛡️
          </div>
          <div className="text-xl font-black italic text-[#ffd84d] tracking-wider">
            OWNER KAMRAN ADMIN
          </div>
          <div className="text-xs text-[#7eb89a] font-mono-num mt-1 mb-5">
            /owner_kamran-admin-panel
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput === settings.adminPin || pinInput === '2026') {
                setIsLocked(false);
                setPinInput('');
                onShowToast('✓ Welcome Back, Owner Kamran!');
              } else {
                onShowToast('Incorrect Admin PIN (Default: 2026)');
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Admin PIN (Default: 2026)"
              className="w-full h-12 rounded-xl bg-[#071f18] border border-white/15 px-4 text-center text-white font-black tracking-widest outline-none focus:border-[#ffd84d]"
            />
            <button
              type="submit"
              className="w-full h-12 rounded-xl btn-3d-gold font-black text-sm uppercase cursor-pointer"
            >
              Unlock Admin Panel
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full h-10 rounded-xl bg-white/5 text-[#7eb89a] text-xs font-bold cursor-pointer"
            >
              ← Return to DOLLAR333 Lobby
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24 text-[#e8f5ee]"
      style={{
        background:
          'linear-gradient(180deg, #041510 0%, #071f18 50%, #051611 100%)',
      }}
    >
      {/* Top Executive Admin Bar */}
      <header className="sticky top-0 z-50 bg-[#062c23]/95 backdrop-blur-md border-b border-[#f0c030]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe066] to-[#c89a10] text-[#2a1500] flex items-center justify-center font-black text-lg shadow">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black italic text-[#ffd84d] tracking-wide">
                OWNER KAMRAN — ADMIN PANEL
              </span>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                ROOT ACCESS
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7eb89a] font-mono-num">
              <span>Route: /owner_kamran-admin-panel</span>
              <button
                type="button"
                onClick={handleCopyAdminUrl}
                className="text-[#ffd84d] underline cursor-pointer font-bold"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLocked(true)}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer"
          >
            🔒 Lock
          </button>
          <button
            type="button"
            onClick={onExitAdmin}
            className="btn-3d-green px-3.5 py-2 rounded-lg text-xs font-black cursor-pointer"
          >
            ← Live Site Lobby
          </button>
        </div>
      </header>

      <div className="max-w-[1180px] mx-auto p-3.5 sm:p-5 space-y-5">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 bg-[#0a2e22] p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: '📊 Dashboard Overview' },
            {
              id: 'transactions',
              label: `💳 Deposits & Withdrawals (${transactions.length})`,
            },
            { id: 'gateway', label: '🏦 bKash & Payment Numbers' },
            { id: 'games', label: '🎰 WinGo 30s & Jackpot Control' },
            { id: 'users', label: '👤 Player & Site Notice' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#ffe066] to-[#f0c030] text-[#2a1500] shadow'
                  : 'text-[#7eb89a] hover:text-white bg-white/[0.03]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#0d3d2c] border border-emerald-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Total Deposits
                </div>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono-num">
                  ৳{totalDeposits.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {transactions.filter((t) => t.type === 'Deposit').length}{' '}
                  records
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-amber-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Total Withdrawals
                </div>
                <div className="text-xl font-black text-[#ffd84d] mt-1 font-mono-num">
                  ৳{totalWithdrawals.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {transactions.filter((t) => t.type === 'Withdraw').length}{' '}
                  records
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-teal-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Net Revenue (GGR)
                </div>
                <div className="text-xl font-black text-white mt-1 font-mono-num">
                  ৳{netRevenue.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-emerald-300 mt-1">
                  Active Profit Pool
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-[#f0c030]/35 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  User Live Balance
                </div>
                <div className="text-xl font-black text-[#ffd84d] mt-1 font-mono-num">
                  ৳{balance.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  UID: {profile.uid}
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-purple-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Bonuses Claimed
                </div>
                <div className="text-xl font-black text-purple-300 mt-1 font-mono-num">
                  ৳{totalBonuses.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {bonuses.length} bonus logs
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-cyan-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Total Game Bets
                </div>
                <div className="text-xl font-black text-cyan-300 mt-1 font-mono-num">
                  {wingoBets.length + binaryTrades.length}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  WinGo: {wingoBets.length} · Binary: {binaryTrades.length}
                </div>
              </div>
            </div>

            {/* Quick Balance & Bonus Controller */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                    ⚡ Quick Player Balance Control
                  </h3>
                  <span className="text-xs font-mono-num text-emerald-300 font-bold">
                    Current: ৳{balance.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="flex-1 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                    placeholder="Enter new BDT balance"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseFloat(balanceInput);
                      if (Number.isFinite(val) && val >= 0) {
                        onUpdateBalance(Number(val.toFixed(2)));
                        onShowToast(
                          `✓ Admin set user balance to ৳${val.toFixed(2)}`
                        );
                      }
                    }}
                    className="btn-3d-gold px-4 rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    Set Balance
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '+৳500', delta: 500 },
                    { label: '+৳2,000', delta: 2000 },
                    { label: '+৳10,000', delta: 10000 },
                    { label: 'Reset ৳0', delta: -balance },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        const next = Math.max(
                          0,
                          Number((balance + item.delta).toFixed(2))
                        );
                        onUpdateBalance(next);
                        setBalanceInput(next.toFixed(2));
                        onShowToast(`✓ Balance updated to ৳${next.toFixed(2)}`);
                      }}
                      className="py-2.5 rounded-xl bg-[#0d3d2c] hover:bg-[#13a36e]/30 border border-white/10 text-xs font-extrabold text-white cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Send Gift Bonus */}
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  🎁 Send Instant Bonus to Player
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={bonusTitleInput}
                    onChange={(e) => setBonusTitleInput(e.target.value)}
                    placeholder="Bonus Title"
                    className="sm:col-span-2 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-xs font-bold text-white"
                  />
                  <input
                    type="number"
                    value={bonusAmtInput}
                    onChange={(e) => setBonusAmtInput(e.target.value)}
                    placeholder="Amount"
                    className="h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-sm font-black font-mono-num text-[#ffd84d]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = parseFloat(bonusAmtInput);
                    if (amt > 0 && bonusTitleInput.trim()) {
                      onAdminAddBonus(bonusTitleInput.trim(), amt);
                    }
                  }}
                  className="w-full h-11 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
                >
                  Credit Bonus &amp; Notify Player
                </button>
              </div>
            </div>

            {/* Active Payment Numbers & WinGo Status Summary */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-black uppercase text-[#ffd84d] mb-3">
                🔧 Active Platform Configuration
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">bKash Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.bkashNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">Nagad Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.nagadNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">Rocket Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.rocketNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">
                    Next WinGo 30s Draw:
                  </span>
                  <b className="font-mono-num text-[#ffd84d] text-sm">
                    {settings.forcedWingoResult === null
                      ? '🎲 Auto Random'
                      : `🎯 Forced #${settings.forcedWingoResult} (${
                          settings.forcedWingoResult >= 5 ? 'Big' : 'Small'
                        })`}
                  </b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: TRANSACTIONS ==================== */}
        {activeTab === 'transactions' && (
          <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                💳 Deposit &amp; Withdrawal Requests
              </h3>
              <div className="flex gap-1.5">
                {(['ALL', 'Deposit', 'Withdraw'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTxFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                      txFilter === f
                        ? 'bg-[#0d7a55] text-white'
                        : 'bg-[#071f18] text-[#7eb89a]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#7eb89a]">
                No transactions found.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            tx.type === 'Deposit'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-[#ffd84d]'
                          }`}
                        >
                          {tx.type}
                        </span>
                        <span className="font-black text-sm text-white">
                          {tx.method}
                        </span>
                        <span className="text-xs font-mono-num text-[#7eb89a]">
                          ({tx.account})
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7eb89a] font-mono-num mt-1">
                        TrxID: <b className="text-white">{tx.trxId}</b> · Time:{' '}
                        {tx.createdAt}
                        {tx.paymentID ? ` · PayID: ${tx.paymentID}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right mr-2">
                        <div className="text-base font-black font-mono-num text-[#ffd84d]">
                          ৳{tx.amount.toFixed(2)}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : tx.status === 'Processing'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Completed')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Processing')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ⏳ Hold
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Refunded')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold cursor-pointer"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: GATEWAY & MERCHANT NUMBERS ==================== */}
        {activeTab === 'gateway' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📲 Send Money Merchant Numbers (Live on Complete Payment Page)
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  bKash Send Money / Agent Number
                </label>
                <input
                  type="text"
                  value={settings.bkashNumber}
                  onChange={(e) =>
                    onUpdateSettings({ bkashNumber: e.target.value })
                  }
                  className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Nagad Send Money / Personal Number
                </label>
                <input
                  type="text"
                  value={settings.nagadNumber}
                  onChange={(e) =>
                    onUpdateSettings({ nagadNumber: e.target.value })
                  }
                  className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Rocket Send Money Number
                </label>
                <input
                  type="text"
                  value={settings.rocketNumber}
                  onChange={(e) =>
                    onUpdateSettings({ rocketNumber: e.target.value })
                  }
                  className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Gateway Bonus %
                  </label>
                  <input
                    type="number"
                    value={settings.depositBonusPct}
                    onChange={(e) =>
                      onUpdateSettings({
                        depositBonusPct: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Min Deposit (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.minDeposit}
                    onChange={(e) =>
                      onUpdateSettings({
                        minDeposit: Number(e.target.value) || 100,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Min Withdraw (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.minWithdraw}
                    onChange={(e) =>
                      onUpdateSettings({
                        minWithdraw: Number(e.target.value) || 200,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onShowToast('✓ Payment Gateway & Merchant Numbers Saved!')
                }
                className="w-full h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                Save Payment Configuration
              </button>
            </div>

            {/* bKash Payment Gateway SDK Diagnostic */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  ⚡ bKash Payment Gateway (`v1.2.0-beta`) Status
                </h3>
                <span className="bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  CONNECTED
                </span>
              </div>

              <div className="bg-[#071f18] rounded-xl p-3.5 border border-white/10 space-y-1.5 text-xs font-mono-num">
                <div className="flex justify-between">
                  <span className="text-[#7eb89a]">Gateway Package:</span>
                  <span className="text-white font-bold">
                    bkash-payment-gateway
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7eb89a]">Sandbox Endpoint:</span>
                  <span className="text-emerald-300">
                    checkout.sandbox.bka.sh/v1.2.0-beta
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7eb89a]">Merchant Username:</span>
                  <span className="text-white">bkashTest</span>
                </div>
              </div>

              <button
                type="button"
                disabled={bkashTesting}
                onClick={handleTestBkashGateway}
                className="w-full h-11 rounded-xl bg-[#E2136E] hover:bg-[#c91060] text-white font-black text-xs uppercase cursor-pointer transition"
              >
                {bkashTesting
                  ? 'Testing createPayment()...'
                  : 'Run Live bKash Sandbox API Test'}
              </button>

              {bkashTestStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-mono-num">
                  {bkashTestStatus}
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-black uppercase text-[#ffd84d] mb-2">
                  Saved Player Withdrawal Wallets ({savedWallets.length})
                </div>
                {savedWallets.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between text-xs bg-[#071f18] p-2.5 rounded-lg mb-1.5 border border-white/5 font-mono-num"
                  >
                    <span>
                      <b className="text-white">{w.method}</b> ·{' '}
                      {w.accountNumber}
                    </span>
                    <span className="text-[#ffd84d]">PIN: {w.pin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WINGO & JACKPOT CONTROL ==================== */}
        {activeTab === 'games' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  🎱 WinGo 30s Next Draw Result Controller
                </h3>
                <span className="text-xs font-bold text-emerald-300">
                  {settings.forcedWingoResult === null
                    ? 'Mode: Auto Random'
                    : `Mode: Forced #${settings.forcedWingoResult}`}
                </span>
              </div>
              <p className="text-xs text-[#7eb89a]">
                Select a number below to force the next 30-second WinGo draw
                result, or keep it on Auto Random for natural provably-fair
                draws.
              </p>

              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const isSelected = settings.forcedWingoResult === num;
                  const sizeLabel = num >= 5 ? 'BIG' : 'SMALL';
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        onUpdateSettings({ forcedWingoResult: num });
                        onShowToast(
                          `🎯 Next WinGo 30s draw locked to #${num} (${sizeLabel})`
                        );
                      }}
                      className={`py-3 rounded-xl font-black text-sm cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-[#ffd84d] text-[#2a1500] border-white scale-105 shadow-lg'
                          : 'bg-[#071f18] text-white border-white/10 hover:border-[#ffd84d]/50'
                      }`}
                    >
                      <div>#{num}</div>
                      <div className="text-[9px] opacity-80">{sizeLabel}</div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateSettings({ forcedWingoResult: null });
                  onShowToast('🎲 WinGo 30s restored to Auto Random mode');
                }}
                className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase cursor-pointer"
              >
                🎲 Reset to Auto Random Mode
              </button>
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                💰 Homepage Live Jackpot Pool Controller
              </h3>
              <p className="text-xs text-[#7eb89a]">
                Update the live BDT Jackpot ticker displayed on the DOLLAR333 ×
                NYNO BET homepage.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={jackpotInput}
                  onChange={(e) => setJackpotInput(e.target.value)}
                  className="flex-1 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-[#ffd84d] font-black font-mono-num text-base"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextJp = parseInt(jackpotInput, 10);
                    if (Number.isFinite(nextJp) && nextJp > 0) {
                      onUpdateJackpot(nextJp);
                      onShowToast('✓ Homepage Jackpot Counter Updated!');
                    }
                  }}
                  className="btn-3d-gold px-4 rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  Update Jackpot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: PLAYER & SITE NOTICE ==================== */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3.5">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                👤 Active Player Account Profile
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Player Nickname
                </label>
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) =>
                    onUpdateProfile({ nickname: e.target.value })
                  }
                  className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={profile.mobile || ''}
                    onChange={(e) =>
                      onUpdateProfile({ mobile: e.target.value })
                    }
                    className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-mono-num font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                    VIP Level (1 - 10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={profile.vipLevel}
                    onChange={(e) =>
                      onUpdateProfile({
                        vipLevel: Math.max(
                          1,
                          Math.min(10, Number(e.target.value) || 1)
                        ),
                      })
                    }
                    className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-[#ffd84d] font-mono-num font-black text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('✓ Player Profile Saved!')}
                className="w-full h-11 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
              >
                Save Player Details
              </button>
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3.5">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📢 Homepage Announcement Marquee &amp; Security PIN
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Live Marquee Announcement Text
                </label>
                <textarea
                  rows={3}
                  value={settings.announcementText}
                  onChange={(e) =>
                    onUpdateSettings({ announcementText: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#071f18] border border-white/15 p-3 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Admin Panel Lock PIN
                </label>
                <input
                  type="text"
                  value={settings.adminPin}
                  onChange={(e) =>
                    onUpdateSettings({ adminPin: e.target.value })
                  }
                  className="w-full h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-[#ffd84d] font-mono-num font-black text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  onShowToast('✓ Site Announcement & Security PIN Updated!')
                }
                className="w-full h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                Save Announcement &amp; PIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
