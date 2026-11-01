import React, { useState } from 'react';
import {
  BinaryTrade,
  BonusRecord,
  ModalType,
  ResultPopupData,
  TransactionRecord,
  UserProfile,
  WingoBet,
} from '../types';

interface BetSheetProps {
  isOpen: boolean;
  choice: string;
  initialMult: number;
  onClose: () => void;
  onConfirm: (choice: string, totalAmount: number, mult: number) => void;
}

export const BetConfirmationSheet: React.FC<BetSheetProps> = ({
  isOpen,
  choice,
  initialMult,
  onClose,
  onConfirm,
}) => {
  const [baseAmt, setBaseAmt] = useState<number>(10);
  const [mult, setMult] = useState<number>(initialMult || 1);

  React.useEffect(() => {
    if (isOpen) {
      setMult(initialMult || 1);
    }
  }, [isOpen, initialMult]);

  if (!isOpen) return null;

  const total = Number((baseAmt * mult).toFixed(2));
  const pillColor =
    choice === 'Big'
      ? 'bg-amber-500'
      : choice === 'Small'
      ? 'bg-blue-500'
      : choice === 'Green'
      ? 'bg-emerald-500'
      : choice === 'Violet'
      ? 'bg-violet-500'
      : 'bg-rose-500';

  return (
    <div
      className="fixed inset-0 bg-black/65 z-50 flex items-end justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-t-3xl overflow-hidden animate-sheet-up">
        <div className="p-5 space-y-3.5">
          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-slate-500 font-semibold">
              Choice
            </span>
            <div
              className={`px-5 py-1.5 rounded-md text-white font-bold text-[15px] ${pillColor}`}
            >
              {choice}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-slate-500 font-semibold">
              Amount
            </span>
            <div className="flex gap-2 flex-1">
              {[1, 10, 100, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBaseAmt(amt)}
                  className={`flex-1 h-[38px] border rounded-md text-sm font-bold cursor-pointer transition-colors ${
                    baseAmt === amt
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {amt === 1000 ? '1K' : amt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-slate-500 font-semibold">
              Multiple
            </span>
            <div className="flex items-center flex-1 border border-slate-300 rounded-md overflow-hidden">
              <button
                onClick={() => setMult((m) => Math.max(1, m - 1))}
                className="w-10 h-[38px] bg-slate-50 text-xl text-slate-600 font-bold cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={mult}
                min={1}
                onChange={(e) =>
                  setMult(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="flex-1 border-none text-center text-base font-bold font-mono-num"
              />
              <button
                onClick={() => setMult((m) => m + 1)}
                className="w-10 h-[38px] bg-slate-50 text-xl text-slate-600 font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[54px]">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-500 font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(choice, total, mult)}
            className="flex-[2] text-white text-base font-extrabold cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            }}
          >
            Total BDT <span className="font-mono-num">{total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ResultPopupModalProps {
  data: ResultPopupData | null;
  onClose: () => void;
}

export const ResultPopupModal: React.FC<ResultPopupModalProps> = ({
  data,
  onClose,
}) => {
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-[320px] p-6 text-center animate-zoom-in shadow-2xl">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
          {data.mode === 'Binary' ? 'FM Binary Pro Result' : 'FM Trade Go Result'}
        </div>
        {data.isWin ? (
          <div>
            <div className="text-[15px] font-bold text-emerald-500">
              Congratulations! Trade Win
            </div>
            <div className="text-[38px] font-black text-emerald-500 my-2 font-mono-num">
              +৳{data.winAmount.toFixed(2)}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl font-extrabold text-slate-800 my-3">
              No Win This Round
            </div>
          </div>
        )}

        <div className="text-[13px] text-slate-500 mb-5 bg-slate-50 py-2 px-3 rounded-xl border border-slate-100">
          <div>
            Target: <b className="text-slate-800">{data.periodOrPair}</b>
          </div>
          <div className="mt-0.5">
            Outcome: <b className="text-emerald-600">{data.resultText}</b>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-full bg-emerald-500 text-white font-bold cursor-pointer shadow-md shadow-emerald-500/20"
        >
          Continue Trading
        </button>
      </div>
    </div>
  );
};

interface FeatureModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  balance: number;
  profile: UserProfile;
  onUpdateProfile: (p: Partial<UserProfile>) => void;
  onDeposit: (
    method: TransactionRecord['method'],
    amount: number,
    account: string,
    trxId: string,
    paymentID?: string,
    orderID?: string
  ) => void;
  onWithdraw: (method: TransactionRecord['method'], amount: number, account: string) => boolean;
  onClaimBonus: (title: string, amount: number) => void;
  transactions: TransactionRecord[];
  bonuses: BonusRecord[];
  binaryTrades: BinaryTrade[];
  wingoBets: WingoBet[];
  onShowToast: (msg: string) => void;
  onResetSession: () => void;
}

interface BkashCreateState {
  paymentID: string;
  createTime: string;
  orgName: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export const FeatureModals: React.FC<FeatureModalsProps> = ({
  activeModal,
  onClose,
  balance,
  profile,
  onUpdateProfile,
  onDeposit,
  onWithdraw,
  onClaimBonus,
  transactions,
  bonuses,
  binaryTrades,
  wingoBets,
  onShowToast,
  onResetSession,
}) => {
  const [payMethod, setPayMethod] = useState<TransactionRecord['method']>('bKash');
  const [depAmount, setDepAmount] = useState<number>(1000);
  const [depPhone, setDepPhone] = useState<string>('01770618575');
  const [depTrxId, setDepTrxId] = useState<string>('');

  // bKash Gateway Checkout Flow States
  const [bkashTab, setBkashTab] = useState<'gateway' | 'manual'>('gateway');
  const [bkashStep, setBkashStep] = useState<'idle' | 'wallet' | 'otp' | 'pin' | 'success'>('idle');
  const [bkashLoading, setBkashLoading] = useState<boolean>(false);
  const [bkashSession, setBkashSession] = useState<BkashCreateState | null>(null);
  const [bkashOtp, setBkashOtp] = useState<string>('123456');
  const [bkashPin, setBkashPin] = useState<string>('12121');
  const [bkashExecutedTrx, setBkashExecutedTrx] = useState<string>('');
  const [bkashQueryResult, setBkashQueryResult] = useState<Record<string, string> | null>(null);

  const [withAmount, setWithAmount] = useState<number>(500);
  const [withAccount, setWithAccount] = useState<string>('');

  const [giftCode, setGiftCode] = useState<string>('');
  const [editName, setEditName] = useState<string>(profile.nickname);
  const [supportMsg, setSupportMsg] = useState<string>('');

  const handleStartBkashGateway = async () => {
    if (depAmount < 100) {
      onShowToast('Minimum deposit is BDT 100');
      return;
    }
    setBkashLoading(true);
    try {
      const orderID = `ORD${Math.floor(1000000 + Math.random() * 9000000)}`;
      const res = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depAmount,
          orderID,
          intent: 'sale',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.errorMessage) {
        onShowToast(data.errorMessage || 'Failed to initiate bKash payment');
        setBkashLoading(false);
        return;
      }
      setBkashSession(data);
      setBkashStep('wallet');
    } catch {
      onShowToast('Network error starting bKash Gateway');
    } finally {
      setBkashLoading(false);
    }
  };

  const handleExecuteBkashPayment = async () => {
    if (!bkashSession) return;
    if (bkashPin.trim().length < 4) {
      onShowToast('Please enter your 5-digit bKash PIN');
      return;
    }
    setBkashLoading(true);
    try {
      const res = await fetch('/api/bkash/execute-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentID: bkashSession.paymentID,
          customerMsisdn: depPhone,
          amount: depAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.errorMessage) {
        onShowToast(data.errorMessage || 'Failed to execute bKash payment');
        setBkashLoading(false);
        return;
      }
      const finalTrxId = data.trxID || `BKA${Math.floor(100000 + Math.random() * 900000)}`;
      setBkashExecutedTrx(finalTrxId);
      setBkashStep('success');
      onDeposit(
        'bKash',
        Number(data.amount || depAmount),
        depPhone,
        finalTrxId,
        data.paymentID || bkashSession.paymentID,
        data.merchantInvoiceNumber || bkashSession.merchantInvoiceNumber
      );
    } catch {
      onShowToast('Error executing bKash payment');
    } finally {
      setBkashLoading(false);
    }
  };

  const handleSearchBkashTrx = async () => {
    if (!depTrxId.trim()) {
      onShowToast('Please enter a bKash TrxID to verify');
      return;
    }
    if (depAmount < 100) {
      onShowToast('Minimum deposit is BDT 100');
      return;
    }
    setBkashLoading(true);
    try {
      const res = await fetch(
        `/api/bkash/search-transaction/${encodeURIComponent(depTrxId.trim())}`
      );
      const data = await res.json();
      onDeposit(
        'bKash',
        depAmount,
        data.customerMsisdn || depPhone,
        data.trxID || depTrxId.trim().toUpperCase()
      );
      setDepTrxId('');
      onClose();
    } catch {
      onShowToast('Could not verify TrxID');
    } finally {
      setBkashLoading(false);
    }
  };

  const handleQueryGatewayRecord = async (t: TransactionRecord) => {
    try {
      const endpoint = t.paymentID
        ? `/api/bkash/query-payment/${encodeURIComponent(t.paymentID)}`
        : `/api/bkash/search-transaction/${encodeURIComponent(t.trxId)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setBkashQueryResult(data);
    } catch {
      onShowToast('Unable to query bKash gateway');
    }
  };

  if (!activeModal) return null;

  const totalTrades = binaryTrades.length + wingoBets.length;
  const totalWins =
    binaryTrades.filter((t) => t.status === 'WIN').length +
    wingoBets.filter((b) => b.status === 'Win').length;
  const winRate =
    totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/65 z-50 flex items-end justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setBkashStep('idle');
          setBkashQueryResult(null);
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[480px] max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl p-5 animate-sheet-up">
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* 1. WALLET MODAL */}
        {activeModal === 'wallet' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                FM CLUB Wallet Overview
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            <div
              className="p-4 rounded-2xl text-white mb-4"
              style={{
                background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
              }}
            >
              <div className="text-xs opacity-90 font-semibold">
                Available Trading Balance
              </div>
              <div className="text-3xl font-black font-mono-num mt-1">
                BDT {balance.toFixed(2)}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20 text-xs">
                <div>
                  Total Trades: <b>{totalTrades}</b>
                </div>
                <div>
                  Win Rate: <b>{winRate}%</b>
                </div>
                <div>
                  VIP Level: <b>VIP {profile.vipLevel}</b>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Binary Trades</div>
                <div className="text-lg font-extrabold text-slate-900 font-mono-num">
                  {binaryTrades.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">WinGo 30s Trades</div>
                <div className="text-lg font-extrabold text-slate-900 font-mono-num">
                  {wingoBets.length}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClaimBonus('Practice Reload Bonus', 1000);
                onClose();
              }}
              className="w-full h-11 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200 cursor-pointer"
            >
              + Instant Top-Up ৳1,000 Practice Credit
            </button>
          </div>
        )}

        {/* 2. DEPOSIT MODAL */}
        {activeModal === 'deposit' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Instant Deposit Portal
              </h3>
              <button
                onClick={() => {
                  setBkashStep('idle');
                  onClose();
                }}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="text-xs font-bold text-slate-500 mb-2">
              Select Payment Channel
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {(['bKash', 'Nagad', 'Rocket', 'USDT (TRC20)'] as const).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setPayMethod(m);
                      setBkashStep('idle');
                    }}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold cursor-pointer transition-colors ${
                      payMethod === m
                        ? m === 'bKash'
                          ? 'bg-[#E2136E] text-white border-[#E2136E]'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                )
              )}
            </div>

            {payMethod === 'bKash' && bkashStep !== 'idle' && bkashSession ? (
              /* INTERACTIVE BKASH CHECKOUT GATEWAY SCREEN */
              <div className="rounded-2xl overflow-hidden border border-[#E2136E]/30 shadow-lg mb-2">
                {/* bKash Official Pink Header */}
                <div className="bg-[#E2136E] text-white p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-bold opacity-90">
                      bKash Checkout Gateway · v1.2.0-beta
                    </div>
                    <div className="text-lg font-black mt-0.5">
                      {bkashSession.orgName}
                    </div>
                  </div>
                  <div className="text-right font-mono-num">
                    <div className="text-[11px] opacity-85">Amount</div>
                    <div className="text-xl font-black">
                      ৳{bkashSession.amount}
                    </div>
                  </div>
                </div>

                {/* Invoice & Payment ID Bar */}
                <div className="bg-pink-50/80 px-4 py-2 border-b border-pink-100 flex justify-between text-[11px] text-slate-600 font-mono-num">
                  <span>Invoice: {bkashSession.merchantInvoiceNumber}</span>
                  <span>PayID: {bkashSession.paymentID}</span>
                </div>

                <div className="p-4 bg-white">
                  {bkashStep === 'wallet' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter your bKash Account Number
                      </div>
                      <input
                        type="text"
                        value={depPhone}
                        onChange={(e) => setDepPhone(e.target.value)}
                        placeholder="e.g. 01770618575"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 focus:border-[#E2136E] text-center text-base font-bold font-mono-num"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <span>Sandbox Test Wallet: 01770618575</span>
                        <button
                          type="button"
                          onClick={() => setDepPhone('01770618575')}
                          className="text-[#E2136E] font-extrabold cursor-pointer"
                        >
                          Use Test No
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setBkashStep('idle')}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (depPhone.trim().length < 11) {
                              onShowToast('Enter valid 11-digit bKash number');
                              return;
                            }
                            setBkashStep('otp');
                          }}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer"
                        >
                          Proceed to OTP ›
                        </button>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'otp' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter 6-Digit Verification Code sent to {depPhone}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={bkashOtp}
                        onChange={(e) => setBkashOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 focus:border-[#E2136E] text-center text-lg tracking-widest font-bold font-mono-num"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <span>Sandbox OTP: 123456</span>
                        <button
                          type="button"
                          onClick={() => setBkashOtp('123456')}
                          className="text-[#E2136E] font-extrabold cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setBkashStep('wallet')}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (bkashOtp.trim().length < 4) {
                              onShowToast('Please enter valid OTP code');
                              return;
                            }
                            setBkashStep('pin');
                          }}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer"
                        >
                          Verify OTP ›
                        </button>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'pin' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter your 5-Digit bKash PIN to Execute Payment
                      </div>
                      <input
                        type="password"
                        maxLength={5}
                        value={bkashPin}
                        onChange={(e) => setBkashPin(e.target.value)}
                        placeholder="•••••"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 focus:border-[#E2136E] text-center text-xl tracking-widest font-bold font-mono-num"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <span>Sandbox PIN: 12121</span>
                        <button
                          type="button"
                          onClick={() => setBkashPin('12121')}
                          className="text-[#E2136E] font-extrabold cursor-pointer"
                        >
                          Auto-Fill
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setBkashStep('otp')}
                          disabled={bkashLoading}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteBkashPayment}
                          disabled={bkashLoading}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer disabled:opacity-60"
                        >
                          {bkashLoading
                            ? 'Executing Payment...'
                            : `Confirm ৳${bkashSession.amount}`}
                        </button>
                      </div>
                    </div>
                  )}

                  {bkashStep === 'success' && (
                    <div className="text-center space-y-3 py-1">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-black text-xl">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          bKash Payment Executed Successfully!
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono-num">
                          TrxID: <b className="text-[#E2136E]">{bkashExecutedTrx}</b> · PayID: {bkashSession.paymentID}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBkashStep('idle');
                          setBkashSession(null);
                          onClose();
                        }}
                        className="w-full h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-xs cursor-pointer"
                      >
                        Done (Credited BDT {bkashSession.amount})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {payMethod === 'bKash' && (
                  <div className="mb-3 p-2.5 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-extrabold text-[#E2136E]">
                        bKash Checkout Gateway Active
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono-num">
                        checkout.sandbox.bka.sh/v1.2.0-beta
                      </div>
                    </div>
                    <div className="flex bg-white rounded-lg p-0.5 border border-pink-200 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBkashTab('gateway')}
                        className={`px-2 py-1 rounded-md cursor-pointer ${
                          bkashTab === 'gateway'
                            ? 'bg-[#E2136E] text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Auto Checkout
                      </button>
                      <button
                        type="button"
                        onClick={() => setBkashTab('manual')}
                        className={`px-2 py-1 rounded-md cursor-pointer ${
                          bkashTab === 'manual'
                            ? 'bg-[#E2136E] text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        TrxID Verify
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs font-bold text-slate-500 mb-2">
                  Deposit Amount (BDT)
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepAmount(amt)}
                      className={`h-9 rounded-lg border text-xs font-extrabold font-mono-num cursor-pointer ${
                        depAmount === amt
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5 mb-4">
                  <input
                    type="number"
                    value={depAmount}
                    onChange={(e) => setDepAmount(Number(e.target.value) || 0)}
                    placeholder="Enter Amount (BDT)"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold font-mono-num"
                  />
                  <input
                    type="text"
                    value={depPhone}
                    onChange={(e) => setDepPhone(e.target.value)}
                    placeholder="Sender Account / Wallet Number"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                  {(payMethod !== 'bKash' || bkashTab === 'manual') && (
                    <input
                      type="text"
                      value={depTrxId}
                      onChange={(e) => setDepTrxId(e.target.value)}
                      placeholder="Transaction ID (e.g. BKA928172X)"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  )}
                </div>

                {payMethod === 'bKash' && bkashTab === 'gateway' ? (
                  <button
                    onClick={handleStartBkashGateway}
                    disabled={bkashLoading}
                    className="w-full h-12 rounded-xl text-white font-extrabold text-base cursor-pointer bg-[#E2136E] hover:bg-[#c91061] transition-colors disabled:opacity-60 shadow-md shadow-[#E2136E]/25"
                  >
                    {bkashLoading
                      ? 'Connecting bKash Gateway...'
                      : `Pay with bKash Gateway · BDT ${depAmount.toFixed(2)}`}
                  </button>
                ) : payMethod === 'bKash' && bkashTab === 'manual' ? (
                  <button
                    onClick={handleSearchBkashTrx}
                    disabled={bkashLoading}
                    className="w-full h-12 rounded-xl text-white font-extrabold text-base cursor-pointer bg-[#E2136E] hover:bg-[#c91061] transition-colors disabled:opacity-60"
                  >
                    {bkashLoading
                      ? 'Searching bKash TrxID...'
                      : `Verify bKash TrxID · BDT ${depAmount.toFixed(2)}`}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (depAmount < 100) {
                        onShowToast('Minimum deposit is BDT 100');
                        return;
                      }
                      onDeposit(
                        payMethod,
                        depAmount,
                        depPhone,
                        depTrxId ||
                          `TRX${Math.floor(100000 + Math.random() * 900000)}`
                      );
                      setDepTrxId('');
                      onClose();
                    }}
                    className="w-full h-12 rounded-xl text-white font-extrabold text-base cursor-pointer"
                    style={{
                      background:
                        'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    }}
                  >
                    Confirm Deposit BDT {depAmount.toFixed(2)}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* 3. WITHDRAW MODAL */}
        {activeModal === 'withdraw' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Fast Cashout Portal
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 mb-3 flex justify-between">
              <span>Withdrawable Balance:</span>
              <b className="font-mono-num">BDT {balance.toFixed(2)}</b>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {(['bKash', 'Nagad', 'Rocket', 'USDT (TRC20)'] as const).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold cursor-pointer ${
                      payMethod === m
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                )
              )}
            </div>

            <div className="space-y-2.5 mb-4">
              <input
                type="text"
                value={withAccount}
                onChange={(e) => setWithAccount(e.target.value)}
                placeholder={`Enter ${payMethod} Account Number`}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold"
              />
              <input
                type="number"
                value={withAmount}
                onChange={(e) => setWithAmount(Number(e.target.value) || 0)}
                placeholder="Withdrawal Amount (BDT)"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold font-mono-num"
              />
            </div>

            <button
              onClick={() => {
                if (!withAccount.trim()) {
                  onShowToast('Please enter your receiving account number');
                  return;
                }
                const ok = onWithdraw(payMethod, withAmount, withAccount);
                if (ok) {
                  setWithAccount('');
                  onClose();
                }
              }}
              className="w-full h-12 rounded-xl text-white font-extrabold text-base cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              }}
            >
              Withdraw BDT {withAmount.toFixed(2)}
            </button>
          </div>
        )}

        {/* 4. VIP CLUB MODAL */}
        {activeModal === 'vip' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                FM CLUB VIP Privileges
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-2.5 mb-4">
              {[
                { lvl: 1, rebate: '0.5%', bonus: 188, req: 'Active Member' },
                { lvl: 2, rebate: '0.8%', bonus: 588, req: '৳10,000 Turnover' },
                { lvl: 3, rebate: '1.2%', bonus: 1888, req: '৳50,000 Turnover' },
              ].map((v) => (
                <div
                  key={v.lvl}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    profile.vipLevel === v.lvl
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">
                      VIP {v.lvl} · Trade Rebate {v.rebate}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requirement: {v.req}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClaimBonus(`VIP ${v.lvl} Daily Rebate`, v.bonus);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
                  >
                    Claim ৳{v.bonus}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. UNIFIED TRADE RECORD MODAL */}
        {activeModal === 'trades_record' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                All Trading Records (Binary & WinGo)
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            {binaryTrades.length === 0 && wingoBets.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No trades recorded yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {binaryTrades.map((bt) => (
                  <div
                    key={bt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-emerald-700">
                        [BINARY] {bt.symbol} · {bt.direction}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {bt.createdAt}
                      </div>
                    </div>
                    <div className="text-right font-mono-num">
                      <div
                        className={`text-sm font-extrabold ${
                          bt.status === 'WIN'
                            ? 'text-emerald-600'
                            : bt.status === 'LOSE'
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {bt.status === 'WIN'
                          ? `+৳${bt.profit.toFixed(2)}`
                          : bt.status}
                      </div>
                      <div className="text-xs text-slate-500">
                        Bet ৳{bt.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                {wingoBets.map((wb) => (
                  <div
                    key={wb.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">
                        [TRADING] {wb.choice} ({wb.period})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {wb.createdAt}
                      </div>
                    </div>
                    <div className="text-right font-mono-num">
                      <div
                        className={`text-sm font-extrabold ${
                          wb.status === 'Win'
                            ? 'text-emerald-600'
                            : wb.status === 'Lose'
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {wb.status === 'Win'
                          ? `+৳${wb.winAmount.toFixed(2)}`
                          : wb.status}
                      </div>
                      <div className="text-xs text-slate-500">
                        Bet ৳{wb.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. BONUS HISTORY MODAL */}
        {activeModal === 'bonus_record' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                Bonus & Reward History
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            {bonuses.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No bonus claims yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bonuses.map((b) => (
                  <div
                    key={b.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {b.title}
                      </div>
                      <div className="text-xs text-slate-400">{b.createdAt}</div>
                    </div>
                    <div className="text-sm font-extrabold text-emerald-600 font-mono-num">
                      +BDT {b.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. DEPOSIT / WITHDRAWAL RECORDS */}
        {(activeModal === 'deposit_record' ||
          activeModal === 'withdraw_record') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-slate-900">
                {activeModal === 'deposit_record'
                  ? 'Deposit Logs'
                  : 'Withdrawal Logs'}
              </h3>
              <button
                onClick={() => {
                  setBkashQueryResult(null);
                  onClose();
                }}
                className="text-slate-400 font-bold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>

            {bkashQueryResult && (
              <div className="mb-3 p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs font-mono-num">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-[#E2136E]">
                    bKash Gateway Query Result
                  </span>
                  <button
                    onClick={() => setBkashQueryResult(null)}
                    className="text-slate-400 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-[11px] text-slate-700 space-y-0.5">
                  <div>
                    Status: <b>{String(bkashQueryResult.transactionStatus || 'Completed')}</b>
                  </div>
                  {bkashQueryResult.paymentId && (
                    <div>Payment ID: {String(bkashQueryResult.paymentId)}</div>
                  )}
                  {bkashQueryResult.trxID && (
                    <div>TrxID: {String(bkashQueryResult.trxID)}</div>
                  )}
                  {bkashQueryResult.amount && (
                    <div>
                      Amount: {String(bkashQueryResult.amount)}{' '}
                      {String(bkashQueryResult.currency || 'BDT')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {transactions.filter((t) =>
              activeModal === 'deposit_record'
                ? t.type === 'Deposit'
                : t.type === 'Withdraw'
            ).length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No transaction records found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions
                  .filter((t) =>
                    activeModal === 'deposit_record'
                      ? t.type === 'Deposit'
                      : t.type === 'Withdraw'
                  )
                  .map((t) => (
                    <div
                      key={t.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <span>
                            {t.method} · {t.account}
                          </span>
                          {t.method === 'bKash' && (
                            <button
                              type="button"
                              onClick={() => handleQueryGatewayRecord(t)}
                              className="px-2 py-0.5 rounded bg-pink-50 text-[#E2136E] border border-pink-200 text-[10px] font-extrabold cursor-pointer"
                            >
                              Verify Gateway
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono-num">
                          {t.trxId}
                          {t.paymentID ? ` · ${t.paymentID}` : ''} · {t.createdAt}
                        </div>
                      </div>
                      <div className="text-right font-mono-num">
                        <div className="text-sm font-extrabold text-slate-900">
                          BDT {t.amount.toFixed(2)}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600">
                          {t.status}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* 8. INVITE FRIENDS */}
        {activeModal === 'invite' && (
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Invite Friends & Earn Commission
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Share your exclusive FM CLUB referral link and earn instant 2.5%
              commission on every Binary & WinGo trade placed by your friends.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono-num text-xs font-bold text-slate-700 mb-4 flex justify-between items-center">
              <span>https://fmclub.pro/?ref={profile.uid}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `https://fmclub.pro/?ref=${profile.uid}`
                  );
                  onShowToast('Referral Link Copied!');
                }}
                className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs font-bold cursor-pointer"
              >
                Copy
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* 9. DAILY GIFTS / PROMO CODE */}
        {activeModal === 'gifts' && (
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Daily Gift Code Redemption
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Enter promo code <b>FM2026</b> or click Daily Check-in below to
              receive instant trading credit.
            </p>
            <input
              type="text"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
              placeholder="Enter Gift Code (e.g. FM2026)"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClaimBonus('Daily Check-In Gift', 250);
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-amber-500 text-white font-extrabold text-sm cursor-pointer"
              >
                Daily Check-In (+৳250)
              </button>
              <button
                onClick={() => {
                  if (!giftCode.trim()) {
                    onShowToast('Please enter a gift code');
                    return;
                  }
                  onClaimBonus(`Promo Code (${giftCode.toUpperCase()})`, 500);
                  setGiftCode('');
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-emerald-600 text-white font-extrabold text-sm cursor-pointer"
              >
                Redeem Code
              </button>
            </div>
          </div>
        )}

        {/* 10. CUSTOMER SERVICE */}
        {activeModal === 'support' && (
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              24/7 FM CLUB Official Support
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Our dedicated VIP support desk responds within 2 minutes for
              Deposits, Withdrawals, and Trading queries.
            </p>
            <textarea
              rows={3}
              value={supportMsg}
              onChange={(e) => setSupportMsg(e.target.value)}
              placeholder="Describe your question or transaction ID..."
              className="w-full p-3 rounded-xl border border-slate-300 text-sm mb-3"
            />
            <button
              onClick={() => {
                onShowToast('Support ticket submitted! Agent notified.');
                setSupportMsg('');
                onClose();
              }}
              className="w-full h-11 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
            >
              Send Message to Support
            </button>
          </div>
        )}

        {/* 11. PROFILE EDIT */}
        {activeModal === 'profile' && (
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-3">
              Edit Member Profile
            </h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Member Nickname"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold mb-3"
            />
            <button
              onClick={() => {
                if (editName.trim()) {
                  onUpdateProfile({ nickname: editName.trim() });
                  onShowToast('Profile Updated!');
                }
                onClose();
              }}
              className="w-full h-11 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* 12. WINGO RULES */}
        {activeModal === 'rules_wingo' && (
          <div>
            <h3 className="mt-0 text-lg font-extrabold text-emerald-600 mb-2">
              FM CLUB — WinGo 30s Rules
            </h3>
            <p className="text-[13px] leading-relaxed text-slate-600">
              1 issue every 30 seconds. 25 seconds to place trade, 5 seconds
              draw time.
              <br />
              <br />• <b>Select Big:</b> If number is 5, 6, 7, 8, 9 (Payout
              x1.96)
              <br />• <b>Select Small:</b> If number is 0, 1, 2, 3, 4 (Payout
              x1.96)
              <br />• <b>Color Rules:</b> Number 0 is Red+Violet, 5 is
              Green+Violet, evens are Red, odds are Green.
            </p>
            <button
              onClick={onClose}
              className="w-full h-[46px] rounded-full bg-emerald-500 text-white font-bold mt-4 cursor-pointer"
            >
              Got It
            </button>
          </div>
        )}

        {/* 13. BINARY TRADING RULES */}
        {activeModal === 'rules_binary' && (
          <div>
            <h3 className="mt-0 text-lg font-extrabold text-emerald-600 mb-2">
              FM CLUB — Binary Options Rules
            </h3>
            <p className="text-[13px] leading-relaxed text-slate-600">
              Trade real-time OTC price movements with fixed high payouts up to
              +96%.
              <br />
              <br />• <b>CALL / UP (ওপরে ↑):</b> Win if the exit price at
              expiration is <b>higher</b> than your entry spot price.
              <br />• <b>PUT / DOWN (নিচে ↓):</b> Win if the exit price at
              expiration is <b>lower</b> than your entry spot price.
              <br />• <b>Expiration Times:</b> Choose 10s, 15s, 30s, or 60s
              instant settlement.
            </p>
            <button
              onClick={onClose}
              className="w-full h-[46px] rounded-full bg-emerald-500 text-white font-bold mt-4 cursor-pointer"
            >
              Got It
            </button>
          </div>
        )}

        {/* 14. LOGOUT / RESET SESSION */}
        {activeModal === 'logout' && (
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Reset Demo Session or Log Out?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              You can reset your demo trading balance back to BDT 5,000.00 or
              continue with your current account.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetSession();
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-rose-500 text-white font-bold text-sm cursor-pointer"
              >
                Reset Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
