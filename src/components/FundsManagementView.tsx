import React, { useEffect, useState } from 'react';
import { ActiveView, ModalType, TransactionRecord } from '../types';

interface PromoOption {
  id: number;
  title: string;
  bonusPct: number;
}

const PROMO_OPTIONS: PromoOption[] = [
  { id: 0, title: 'Regular Deposit', bonusPct: 0 },
  { id: 9, title: 'সদ্য নিবন্ধিত সদস্য  50% bonus', bonusPct: 50 },
  { id: 8, title: '৩ টি ভিআইপি লাইফটাইম সুবিধা', bonusPct: 20 },
  { id: 6, title: 'Dollar333 APP ডাউনলোড করুন', bonusPct: 15 },
  { id: 5, title: 'এজেন্ট ৪ সুপার কমিশন', bonusPct: 10 },
  { id: 4, title: 'প্রথম ডিপোজিট বোনাস ১২৯%', bonusPct: 129 },
  { id: 3, title: 'বন্ধুদের আমন্ত্রণ করুন আজীবন সুবিধা', bonusPct: 25 },
];

const PRESET_AMOUNTS = [100, 200, 300, 500, 1000, 5000, 10000, 20000, 25000];

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

interface FundsManagementViewProps {
  initialTab?: 'deposit' | 'withdraw';
  balance: number;
  onBack: () => void;
  onProceedToCompletePayment?: (data: {
    method: TransactionRecord['method'];
    amount: number;
    promoTitle: string;
    promoBonusPct: number;
  }) => void;
  onSwitchToWithdrawPage?: () => void;
  onDeposit: (
    method: TransactionRecord['method'],
    amount: number,
    account: string,
    trxId: string,
    paymentID?: string,
    orderID?: string
  ) => void;
  onWithdraw: (
    method: TransactionRecord['method'],
    amount: number,
    account: string
  ) => boolean;
  onClaimBonus: (title: string, amount: number) => void;
  onShowToast: (msg: string) => void;
}

export const FundsManagementView: React.FC<FundsManagementViewProps> = ({
  initialTab = 'deposit',
  balance,
  onBack,
  onProceedToCompletePayment,
  onSwitchToWithdrawPage,
  onDeposit,
  onWithdraw,
  onClaimBonus,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>(initialTab);
  const [promoOpen, setPromoOpen] = useState<boolean>(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoOption>(
    PROMO_OPTIONS[0]
  );
  const [selectedMethod, setSelectedMethod] =
    useState<TransactionRecord['method']>('bKash');
  const [amountStr, setAmountStr] = useState<string>('1000');
  const [senderPhone, setSenderPhone] = useState<string>('01770618575');
  const [manualTrxId, setManualTrxId] = useState<string>('');

  // bKash Gateway Interactive Checkout States
  const [bkashStep, setBkashStep] = useState<
    'idle' | 'wallet' | 'otp' | 'pin' | 'success'
  >('idle');
  const [bkashLoading, setBkashLoading] = useState<boolean>(false);
  const [bkashSession, setBkashSession] = useState<BkashCreateState | null>(
    null
  );
  const [bkashOtp, setBkashOtp] = useState<string>('123456');
  const [bkashPin, setBkashPin] = useState<string>('12121');
  const [bkashExecutedTrx, setBkashExecutedTrx] = useState<string>('');

  // Withdraw states
  const [withdrawAcc, setWithdrawAcc] = useState<string>('');
  const [withdrawAmtStr, setWithdrawAmtStr] = useState<string>('500');

  const numericAmount = parseFloat(amountStr) || 0;

  const creditDepositAndBonus = (
    method: TransactionRecord['method'],
    amt: number,
    account: string,
    trxId: string,
    paymentID?: string,
    orderID?: string
  ) => {
    // 10% gateway bonus + selected promo bonus
    const gatewayBonus = Math.round(amt * 0.1);
    const promoBonus =
      selectedPromo.bonusPct > 0
        ? Math.round((amt * selectedPromo.bonusPct) / 100)
        : 0;

    onDeposit(method, amt, account, trxId, paymentID, orderID);
    if (gatewayBonus + promoBonus > 0) {
      onClaimBonus(
        `${method} +10%${
          selectedPromo.bonusPct > 0 ? ` & ${selectedPromo.title}` : ''
        }`,
        gatewayBonus + promoBonus
      );
    }
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(numericAmount) || numericAmount < 100 || numericAmount > 25000) {
      onShowToast('Deposit amount must be between ৳100 and ৳25,000');
      return;
    }

    if (onProceedToCompletePayment) {
      onProceedToCompletePayment({
        method: selectedMethod,
        amount: numericAmount,
        promoTitle: selectedPromo.title,
        promoBonusPct: selectedPromo.bonusPct,
      });
      return;
    }

    if (selectedMethod === 'bKash') {
      // Launch bKash Payment Gateway createPayment()
      setBkashLoading(true);
      try {
        const orderID = `ORD${Math.floor(1000000 + Math.random() * 9000000)}`;
        const res = await fetch('/api/bkash/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numericAmount,
            orderID,
            intent: 'sale',
          }),
        });
        const data = await res.json();
        if (!res.ok || data.errorMessage) {
          onShowToast(data.errorMessage || 'Failed to initiate bKash gateway');
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
      return;
    }

    // Nagad / Rocket / USDT manual confirmation
    const finalTrx =
      manualTrxId.trim().toUpperCase() ||
      `NGD${Math.floor(1000000 + Math.random() * 9000000)}`;
    creditDepositAndBonus(selectedMethod, numericAmount, senderPhone, finalTrx);
    setManualTrxId('');
    onBack();
  };

  const handleExecuteBkash = async () => {
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
          customerMsisdn: senderPhone,
          amount: numericAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.errorMessage) {
        onShowToast(data.errorMessage || 'Failed to execute bKash payment');
        setBkashLoading(false);
        return;
      }
      const finalTrxId =
        data.trxID || `BKA${Math.floor(100000 + Math.random() * 900000)}`;
      setBkashExecutedTrx(finalTrxId);
      setBkashStep('success');
      creditDepositAndBonus(
        'bKash',
        Number(data.amount || numericAmount),
        senderPhone,
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

  const handleSubmitWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const wAmt = parseFloat(withdrawAmtStr) || 0;
    if (!withdrawAcc.trim()) {
      onShowToast(`Please enter your ${selectedMethod} account number`);
      return;
    }
    const ok = onWithdraw(selectedMethod, wAmt, withdrawAcc.trim());
    if (ok) {
      setWithdrawAcc('');
      onBack();
    }
  };

  return (
    <div
      className="min-h-screen pb-32 text-slate-800"
      style={{
        background: '#f1f4f9',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Premium Header */}
      <div
        className="p-4 flex justify-between items-center text-white shadow-lg"
        style={{
          background: 'linear-gradient(90deg, #0e3d2c 0%, #1a5c40 100%)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center p-1 active:scale-90 transition cursor-pointer"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="font-black uppercase tracking-tighter italic text-lg">
          Funds Management
        </h1>
        <div className="text-right font-mono-num text-xs font-bold text-[#ffd84d]">
          ৳{balance.toFixed(0)}
        </div>
      </div>

      {/* Notice Container */}
      <div className="bg-white border-l-[5px] border-l-[#1de9b6] shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-lg py-3 px-4 flex items-center mt-4 mx-4 max-w-[640px] sm:mx-auto">
        <span className="bg-[#1de9b6] text-[#071f18] text-[11px] font-bold py-1 px-2 rounded mr-3.5 tracking-wider shrink-0">
          NOTICE
        </span>
        <div className="flex items-center text-xs font-bold text-gray-600">
          <span className="text-[#1de9b6] mr-2 text-base">📢</span>
          <span>
            নাম্বার ভালো করে দেখে টাকা ডিপোজিট করবেন, ভুল হলে আমরা দায়ী থাকব না
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-[640px] mx-auto">
        {/* Deposit / Withdraw Switcher */}
        <div className="flex bg-gray-200 rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setTab('deposit');
              setBkashStep('idle');
            }}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm uppercase italic cursor-pointer transition-all ${
              tab === 'deposit'
                ? 'bg-white text-[#0d4a3a] font-black shadow-sm'
                : 'text-gray-500 font-bold'
            }`}
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSwitchToWithdrawPage) {
                onSwitchToWithdrawPage();
                return;
              }
              setTab('withdraw');
              setBkashStep('idle');
            }}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm uppercase italic cursor-pointer transition-all ${
              tab === 'withdraw'
                ? 'bg-white text-[#0d4a3a] font-black shadow-sm'
                : 'text-gray-500 font-bold'
            }`}
          >
            Withdraw
          </button>
        </div>

        {tab === 'deposit' ? (
          <form onSubmit={handleSubmitDeposit} className="space-y-6">
            {/* Available Promotion Dropdown */}
            <div className="relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                Available Promotion
              </label>
              <div
                onClick={() => setPromoOpen((o) => !o)}
                className="bg-white border-2 border-dashed border-emerald-200 p-3 rounded-xl bg-emerald-50/30 flex justify-between items-center cursor-pointer"
              >
                <span className="text-xs font-bold text-[#0d4a3a] flex items-center gap-2">
                  <span>🎁</span>
                  <span>{selectedPromo.title}</span>
                </span>
                <span className="text-[#0d4a3a] text-xs font-black">
                  {promoOpen ? '▲' : '▼'}
                </span>
              </div>

              {promoOpen && (
                <div className="absolute w-full left-0 top-full bg-white border border-slate-200 rounded-b-xl z-50 shadow-xl overflow-hidden">
                  {PROMO_OPTIONS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPromo(p);
                        setPromoOpen(false);
                      }}
                      className="p-3 text-xs border-b border-slate-100 hover:bg-emerald-50 font-bold text-gray-600 cursor-pointer flex justify-between items-center"
                    >
                      <span>{p.title}</span>
                      {p.bonusPct > 0 && (
                        <span className="text-[10px] font-black text-emerald-600">
                          +{p.bonusPct}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Select Payment Method */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* bKash Card */}
                <div
                  onClick={() => {
                    setSelectedMethod('bKash');
                    setBkashStep('idle');
                  }}
                  className={`cursor-pointer bg-white border-2 rounded-[14px] min-h-[108px] flex flex-col items-center justify-center transition-all relative p-3 ${
                    selectedMethod === 'bKash'
                      ? 'border-[#1de9b6] bg-[#f0fffb] shadow-[0_8px_22px_rgba(30,233,182,0.14)]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="absolute -top-2.5 -right-1.5 bg-red-500 text-white text-[9px] font-black py-0.5 px-2 rounded-md">
                    +10% Bonus
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E2136E] text-white flex items-center justify-center font-black text-sm shadow-sm">
                    bKash
                  </div>
                  <span className="text-[11px] font-black mt-2 text-[#0d4a3a] uppercase">
                    bKash
                  </span>
                  <span className="text-[9px] font-bold mt-0.5 text-gray-400 uppercase">
                    Auto Gateway / Send Money
                  </span>
                </div>

                {/* Nagad Card */}
                <div
                  onClick={() => {
                    setSelectedMethod('Nagad');
                    setBkashStep('idle');
                  }}
                  className={`cursor-pointer bg-white border-2 rounded-[14px] min-h-[108px] flex flex-col items-center justify-center transition-all relative p-3 ${
                    selectedMethod === 'Nagad'
                      ? 'border-[#1de9b6] bg-[#f0fffb] shadow-[0_8px_22px_rgba(30,233,182,0.14)]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="absolute -top-2.5 -right-1.5 bg-red-500 text-white text-[9px] font-black py-0.5 px-2 rounded-md">
                    +10% Bonus
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    নগদ
                  </div>
                  <span className="text-[11px] font-black mt-2 text-[#0d4a3a] uppercase">
                    Nagad
                  </span>
                  <span className="text-[9px] font-bold mt-0.5 text-gray-400 uppercase">
                    Send Money
                  </span>
                </div>

                {/* Rocket Card */}
                <div
                  onClick={() => {
                    setSelectedMethod('Rocket');
                    setBkashStep('idle');
                  }}
                  className={`cursor-pointer bg-white border-2 rounded-[14px] min-h-[108px] flex flex-col items-center justify-center transition-all relative p-3 ${
                    selectedMethod === 'Rocket'
                      ? 'border-[#1de9b6] bg-[#f0fffb] shadow-[0_8px_22px_rgba(30,233,182,0.14)]'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="absolute -top-2.5 -right-1.5 bg-red-500 text-white text-[9px] font-black py-0.5 px-2 rounded-md">
                    +10% Bonus
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    Rocket
                  </div>
                  <span className="text-[11px] font-black mt-2 text-[#0d4a3a] uppercase">
                    Rocket
                  </span>
                  <span className="text-[9px] font-bold mt-0.5 text-gray-400 uppercase">
                    Send Money
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive bKash Checkout Gateway Screen when triggered */}
            {selectedMethod === 'bKash' &&
            bkashStep !== 'idle' &&
            bkashSession ? (
              <div className="rounded-2xl overflow-hidden border-2 border-[#E2136E] shadow-xl bg-white">
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

                <div className="bg-pink-50 px-4 py-2 border-b border-pink-100 flex justify-between text-[11px] text-slate-600 font-mono-num">
                  <span>Invoice: {bkashSession.merchantInvoiceNumber}</span>
                  <span>PayID: {bkashSession.paymentID}</span>
                </div>

                <div className="p-4 space-y-3">
                  {bkashStep === 'wallet' && (
                    <>
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter your bKash Account Number
                      </div>
                      <input
                        type="text"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01770618575"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 text-center text-base font-bold font-mono-num text-slate-900"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <span>Sandbox Test Wallet: 01770618575</span>
                        <button
                          type="button"
                          onClick={() => setSenderPhone('01770618575')}
                          className="text-[#E2136E] font-extrabold cursor-pointer"
                        >
                          Use Test No
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBkashStep('idle')}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setBkashStep('otp')}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer"
                        >
                          Proceed to OTP ›
                        </button>
                      </div>
                    </>
                  )}

                  {bkashStep === 'otp' && (
                    <>
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter 6-Digit OTP Code sent to {senderPhone}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={bkashOtp}
                        onChange={(e) => setBkashOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 text-center text-lg tracking-widest font-bold font-mono-num text-slate-900"
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBkashStep('wallet')}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setBkashStep('pin')}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer"
                        >
                          Verify OTP ›
                        </button>
                      </div>
                    </>
                  )}

                  {bkashStep === 'pin' && (
                    <>
                      <div className="text-xs font-bold text-slate-700 text-center">
                        Enter 5-Digit bKash PIN to Execute Payment
                      </div>
                      <input
                        type="password"
                        maxLength={5}
                        value={bkashPin}
                        onChange={(e) => setBkashPin(e.target.value)}
                        placeholder="•••••"
                        className="w-full h-11 px-3.5 rounded-xl border-2 border-[#E2136E]/40 text-center text-xl tracking-widest font-bold font-mono-num text-slate-900"
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBkashStep('otp')}
                          className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleExecuteBkash}
                          disabled={bkashLoading}
                          className="flex-[2] h-10 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs cursor-pointer"
                        >
                          {bkashLoading
                            ? 'Executing...'
                            : `Confirm ৳${bkashSession.amount}`}
                        </button>
                      </div>
                    </>
                  )}

                  {bkashStep === 'success' && (
                    <div className="text-center space-y-3 py-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-black text-2xl">
                        ✓
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        bKash Deposit Completed!
                      </div>
                      <div className="text-xs text-slate-500 font-mono-num">
                        TrxID: <b className="text-[#E2136E]">{bkashExecutedTrx}</b>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBkashStep('idle');
                          setBkashSession(null);
                          onBack();
                        }}
                        className="w-full h-11 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase cursor-pointer"
                      >
                        Back to Lobby
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Amount (BDT) Card */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-50 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Amount (BDT)
                    </label>
                    <span className="text-[10px] font-black text-rose-500 uppercase italic">
                      Min 100 / Max 25,000
                    </span>
                  </div>

                  <div className="flex items-center border-b-2 border-emerald-400 pb-2 mb-6">
                    <span className="text-3xl font-black text-[#0d4a3a] mr-3">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      placeholder="100"
                      min={100}
                      max={25000}
                      className="w-full text-3xl font-black text-[#0d4a3a] outline-none bg-transparent font-mono-num"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((val) => {
                      const isActive = numericAmount === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmountStr(String(val))}
                          className={`py-3 rounded-[10px] text-[13px] font-extrabold border transition-all cursor-pointer font-mono-num ${
                            isActive
                              ? 'bg-[#1de9b6] text-[#071f18] border-[#1de9b6] shadow-[0_4px_10px_rgba(30,233,182,0.2)]'
                              : 'bg-white border-[#d1d9e6] text-[#0d4a3a]'
                          }`}
                        >
                          {val.toLocaleString('en-US')}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Deposit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={bkashLoading}
                    className="w-full py-[18px] rounded-[15px] font-black text-white uppercase tracking-wider flex items-center justify-center active:scale-95 transition-all shadow-xl cursor-pointer disabled:opacity-55"
                    style={{
                      background:
                        'linear-gradient(180deg, #1de9b6 0%, #00897b 100%)',
                    }}
                  >
                    {bkashLoading ? 'Processing...' : 'Deposit Now'}
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          /* WITHDRAW TAB */
          <form onSubmit={handleSubmitWithdraw} className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-emerald-50 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-[#0d4a3a] bg-emerald-50 p-3 rounded-xl">
                <span>Withdrawable Balance:</span>
                <span className="font-black text-base font-mono-num">
                  ৳{balance.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                  Select Cashout Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMethod(m)}
                      className={`py-3 rounded-xl border-2 text-xs font-black uppercase cursor-pointer transition-all ${
                        selectedMethod === m
                          ? 'border-[#1de9b6] bg-[#f0fffb] text-[#0d4a3a]'
                          : 'border-slate-200 bg-white text-gray-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                  Receiving {selectedMethod} Number
                </label>
                <input
                  type="tel"
                  value={withdrawAcc}
                  onChange={(e) => setWithdrawAcc(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm font-bold text-[#0d4a3a]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Withdraw Amount (BDT)
                  </label>
                  <span className="text-[10px] font-black text-rose-500 uppercase italic">
                    Min 200 / Max 25,000
                  </span>
                </div>
                <div className="flex items-center border-b-2 border-emerald-400 pb-2">
                  <span className="text-3xl font-black text-[#0d4a3a] mr-3">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={withdrawAmtStr}
                    onChange={(e) => setWithdrawAmtStr(e.target.value)}
                    min={200}
                    max={25000}
                    className="w-full text-3xl font-black text-[#0d4a3a] outline-none bg-transparent font-mono-num"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-[18px] rounded-[15px] font-black text-white uppercase tracking-wider flex items-center justify-center active:scale-95 transition-all shadow-xl cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #1de9b6 0%, #00897b 100%)',
              }}
            >
              Withdraw Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   FLOATING DAILY BONUS WIDGET (#wcbDailyBonusWidget from HTML)
   ============================================================ */
export const DailyBonusFloatingWidget: React.FC<{
  onClaimDailyBonus: () => void;
}> = ({ onClaimDailyBonus }) => {
  const [closed, setClosed] = useState<boolean>(false);

  if (closed) return null;

  return (
    <div
      className="fixed right-4 bottom-[96px] w-[76px] z-50 text-center select-none"
      style={{
        animation: 'planeFly 2.8s ease-in-out infinite',
      }}
    >
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close Bonus Vault"
        className="absolute -top-5 -left-1.5 w-6 h-6 rounded-full bg-slate-700/90 text-white text-base leading-none flex items-center justify-center cursor-pointer shadow-md z-10"
      >
        ×
      </button>

      <div
        onClick={onClaimDailyBonus}
        className="relative w-[68px] h-[74px] mx-auto cursor-pointer"
      >
        <div
          className="absolute left-1 right-1 top-0.5 h-[58px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, #ffd86c 0%, #ff8b3e 52%, #c1343d 100%)',
            boxShadow:
              'inset 0 0 0 2px rgba(255,255,255,0.28), 0 5px 12px rgba(255,102,45,0.28)',
          }}
        />
        <div className="absolute left-2.5 right-2.5 top-2 h-10 flex items-center justify-center text-[30px] leading-none">
          🔐
        </div>
        <div
          className="absolute -right-1 top-0 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold text-orange-900 shadow"
          style={{
            background: 'linear-gradient(180deg, #fff8b5, #ffd83f)',
          }}
        >
          ভল্ট
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClaimDailyBonus();
          }}
          className="absolute left-0.5 right-0.5 bottom-2 h-[22px] rounded-md text-white text-[9.5px] font-black cursor-pointer shadow"
          style={{
            background:
              'linear-gradient(180deg, #ffb044 0%, #ff7043 44%, #ff3f6a 100%)',
          }}
        >
          🔒 Bonus
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   PILL-STYLE BOTTOM NAV BAR (.bottom-nav-pill from HTML)
   ============================================================ */
export const PillBottomNav: React.FC<{
  activeView: ActiveView;
  onNavigateView: (v: ActiveView) => void;
  onOpenModal: (m: ModalType) => void;
}> = ({ activeView, onNavigateView, onOpenModal }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-around px-2.5 pb-2 h-[70px] bg-[#071f18]">
      <div
        className="w-full max-w-[480px] mx-auto h-[58px] rounded-full border-[1.5px] border-[#1a5c40] flex items-center justify-around px-1.5 relative"
        style={{
          background: 'linear-gradient(180deg, #0e3d2c 0%, #0a2d1f 100%)',
          boxShadow:
            '0 0 0 2px #071f18, inset 0 1px 0 rgba(30,200,130,0.18), 0 -2px 0 0 #1edd96, 0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {/* 1. Home (/) */}
        <button
          type="button"
          onClick={() => {
            onNavigateView('home');
            window.scrollTo(0, 0);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 cursor-pointer transition-colors ${
            activeView === 'home' ? 'text-[#f5c518]' : 'text-[#3db88a]'
          }`}
        >
          <span className="text-lg leading-none">🏠</span>
          <span
            className={`text-[10px] font-bold ${
              activeView === 'home'
                ? 'border-b-2 border-[#f5c518] pb-[1px]'
                : ''
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Promotion / Bonus Vault (/bonus) */}
        <button
          type="button"
          onClick={() => {
            onNavigateView('bonus_page');
            window.scrollTo(0, 0);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 cursor-pointer transition-colors ${
            activeView === 'bonus_page' ? 'text-[#f5c518]' : 'text-[#3db88a]'
          }`}
        >
          <span className="text-lg leading-none">🎁</span>
          <span
            className={`text-[10px] font-bold ${
              activeView === 'bonus_page'
                ? 'border-b-2 border-[#f5c518] pb-[1px]'
                : ''
            }`}
          >
            Bonus
          </span>
        </button>

        {/* 3. Center Elevated Refer Button (/refer) */}
        <button
          type="button"
          onClick={() => {
            onNavigateView('refer_page');
            window.scrollTo(0, 0);
          }}
          className="relative flex-1 flex flex-col items-center justify-end pb-0 cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-0.5 relative -top-[18px]">
            <div
              className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-white text-xl group-active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(145deg, #1de9b6, #00897b)',
                boxShadow:
                  '0 0 0 3px #071f18, 0 0 0 5px #1edd96, 0 6px 20px rgba(0,188,140,0.55)',
              }}
            >
              🔗
            </div>
            <span
              className={`text-[10px] font-bold ${
                activeView === 'refer_page'
                  ? 'text-[#f5c518]'
                  : 'text-[#3db88a]'
              }`}
            >
              Refer
            </span>
          </div>
        </button>

        {/* 4. Deposit (/deposit) */}
        <button
          type="button"
          onClick={() => {
            onNavigateView('deposit_page');
            window.scrollTo(0, 0);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 cursor-pointer transition-colors ${
            activeView === 'deposit_page'
              ? 'text-[#f5c518]'
              : 'text-[#3db88a] hover:text-[#f5c518]'
          }`}
        >
          <span className="text-lg leading-none">💳</span>
          <span className="text-[10px] font-bold">Deposit</span>
        </button>

        {/* 5. Member / Account */}
        <button
          type="button"
          onClick={() => onOpenModal('wallet')}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 text-[#3db88a] hover:text-[#f5c518] cursor-pointer transition-colors"
        >
          <span className="text-lg leading-none">👤</span>
          <span className="text-[10px] font-bold">Member</span>
        </button>
      </div>
    </nav>
  );
};
