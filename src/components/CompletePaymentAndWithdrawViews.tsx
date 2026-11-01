import React, { useState } from 'react';
import { SavedWithdrawalWallet, TransactionRecord } from '../types';

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

export interface PendingDepositData {
  method: TransactionRecord['method'];
  amount: number;
  promoTitle: string;
  promoBonusPct: number;
}

interface CompletePaymentViewProps {
  pendingDeposit: PendingDepositData;
  merchantNumbers?: {
    bKash: string;
    Nagad: string;
    Rocket: string;
  };
  onBack: () => void;
  onCompleteDeposit: (
    method: TransactionRecord['method'],
    amount: number,
    account: string,
    trxId: string,
    paymentID?: string,
    orderID?: string
  ) => void;
  onShowToast: (msg: string) => void;
}

export const CompletePaymentView: React.FC<CompletePaymentViewProps> = ({
  pendingDeposit,
  merchantNumbers,
  onBack,
  onCompleteDeposit,
  onShowToast,
}) => {
  const { method, amount, promoTitle, promoBonusPct } = pendingDeposit;
  const [trxId, setTrxId] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('01770618575');
  const [fileName, setFileName] = useState<string>(
    'Tap to upload payment proof image'
  );
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [paymentTab, setPaymentTab] = useState<'send_money' | 'bkash_api'>(
    'send_money'
  );

  // bKash Auto Gateway API States
  const [bkashStep, setBkashStep] = useState<
    'idle' | 'wallet' | 'otp' | 'pin'
  >('idle');
  const [bkashLoading, setBkashLoading] = useState<boolean>(false);
  const [bkashSession, setBkashSession] = useState<BkashCreateState | null>(
    null
  );
  const [bkashOtp, setBkashOtp] = useState<string>('123456');
  const [bkashPin, setBkashPin] = useState<string>('12121');

  const merchantNumber =
    method === 'bKash'
      ? merchantNumbers?.bKash || '+959686685260'
      : method === 'Nagad'
      ? merchantNumbers?.Nagad || '+959686685260'
      : merchantNumbers?.Rocket || '+959686685260';

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(merchantNumber);
    } catch {
      // clipboard fallback
    }
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedTrx = trxId.trim().toUpperCase();
    if (!cleanedTrx) {
      onShowToast('Please enter your Transaction ID');
      return;
    }
    onCompleteDeposit(method, amount, senderPhone || '01770618575', cleanedTrx);
  };

  const handleStartBkashGateway = async () => {
    setBkashLoading(true);
    try {
      const orderID = `ORD${Math.floor(1000000 + Math.random() * 9000000)}`;
      const res = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          orderID,
          intent: 'sale',
        }),
      });
      const data = await res.json();
      if (!res.ok || data.errorMessage) {
        onShowToast(data.errorMessage || 'Failed to start bKash Gateway');
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

  const handleExecuteBkashGateway = async () => {
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
          amount,
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
      onCompleteDeposit(
        'bKash',
        Number(data.amount || amount),
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

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background: 'linear-gradient(160deg, #eef4f2 0%, #f7f9fc 100%)',
        fontFamily: "'Roboto', sans-serif",
        color: '#17362d',
      }}
    >
      {/* Topbar from Complete Payment HTML */}
      <div
        className="h-[62px] text-white flex items-center justify-between px-4 shadow-[0_8px_24px_rgba(6,47,37,0.18)]"
        style={{
          background: 'linear-gradient(90deg, #003333, #034C44)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-95 transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="font-black tracking-wide text-sm uppercase">
          Complete Payment
        </div>
        <div className="w-10" />
      </div>

      {/* Main Shell */}
      <div className="w-full max-w-[520px] mx-auto my-5 px-[15px]">
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_18px_55px_rgba(15,55,45,0.14)] border border-[#0d5c43]/10">
          {/* Hero Header */}
          <div
            className="text-white p-[24px_22px] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #003333, #034C44)',
            }}
          >
            <div
              className="absolute w-[160px] h-[160px] rounded-full -right-[60px] -top-[75px] pointer-events-none"
              style={{ background: 'rgba(29,233,182,0.15)' }}
            />
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div>
                <div className="text-xs uppercase font-bold opacity-80">
                  Payable Amount
                </div>
                <div className="text-[32px] font-black tracking-[-1px] mt-1 font-mono-num">
                  ৳{amount.toFixed(2)}
                </div>
                <div className="text-xs font-bold opacity-90 mt-2">
                  Send Money using {method}
                </div>
                {promoBonusPct > 0 && (
                  <div className="mt-1.5 inline-block bg-[#1de9b6]/20 border border-[#1de9b6]/40 text-[#1de9b6] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    🎁 {promoTitle} (+{promoBonusPct}%)
                  </div>
                )}
              </div>

              <div className="w-[58px] h-[58px] rounded-[17px] bg-white flex items-center justify-center p-2 shadow-[0_8px_22px_rgba(0,0,0,0.18)] shrink-0">
                {method === 'bKash' ? (
                  <div className="w-full h-full rounded-xl bg-[#E2136E] text-white flex items-center justify-center font-black text-xs">
                    bKash
                  </div>
                ) : method === 'Nagad' ? (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-xs">
                    নগদ
                  </div>
                ) : (
                  <span className="text-[26px] font-black text-[#003333]">
                    {method.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-[22px]">
            {/* Mode Switcher when bKash is chosen: Manual Send Money vs Auto bKash Gateway */}
            {method === 'bKash' && (
              <div className="flex bg-[#eef4f2] p-1 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentTab('send_money')}
                  className={`flex-1 py-2 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    paymentTab === 'send_money'
                      ? 'bg-white text-[#003333] shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  Send Money (TrxID)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentTab('bkash_api');
                    if (bkashStep === 'idle') {
                      handleStartBkashGateway();
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    paymentTab === 'bkash_api'
                      ? 'bg-[#E2136E] text-white shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  ⚡ Auto Gateway API
                </button>
              </div>
            )}

            {paymentTab === 'bkash_api' && method === 'bKash' ? (
              <div className="space-y-4">
                <div className="bg-pink-50 border border-pink-200 text-[#E2136E] rounded-[14px] p-3 text-xs font-bold">
                  Official bKash Checkout Sandbox Gateway (`v1.2.0-beta`) — Instant automated verification without manual TrxID.
                </div>

                {bkashLoading && !bkashSession ? (
                  <div className="py-8 text-center text-sm font-black text-slate-600">
                    Connecting to bKash Payment Gateway...
                  </div>
                ) : bkashSession ? (
                  <div className="rounded-2xl overflow-hidden border-2 border-[#E2136E] bg-white">
                    <div className="bg-[#E2136E] text-white p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold opacity-90">
                          {bkashSession.orgName}
                        </div>
                        <div className="text-xs font-mono-num opacity-85">
                          Invoice: {bkashSession.merchantInvoiceNumber}
                        </div>
                      </div>
                      <div className="text-right font-mono-num font-black text-lg">
                        ৳{bkashSession.amount}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {bkashStep === 'wallet' && (
                        <>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                            Your bKash Wallet Number
                          </label>
                          <input
                            type="text"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-[#E2136E]/40 text-center font-black text-base font-mono-num"
                          />
                          <button
                            type="button"
                            onClick={() => setBkashStep('otp')}
                            className="w-full h-12 rounded-xl bg-[#E2136E] text-white font-black text-xs uppercase cursor-pointer"
                          >
                            Proceed to OTP ›
                          </button>
                        </>
                      )}

                      {bkashStep === 'otp' && (
                        <>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                            Enter 6-Digit OTP (Sandbox: 123456)
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={bkashOtp}
                            onChange={(e) => setBkashOtp(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-[#E2136E]/40 text-center font-black text-lg tracking-widest font-mono-num"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBkashStep('wallet')}
                              className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => setBkashStep('pin')}
                              className="flex-[2] h-11 rounded-xl bg-[#E2136E] text-white font-black text-xs uppercase cursor-pointer"
                            >
                              Verify OTP ›
                            </button>
                          </div>
                        </>
                      )}

                      {bkashStep === 'pin' && (
                        <>
                          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600">
                            Enter 5-Digit PIN (Sandbox: 12121)
                          </label>
                          <input
                            type="password"
                            maxLength={5}
                            value={bkashPin}
                            onChange={(e) => setBkashPin(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-[#E2136E]/40 text-center font-black text-xl tracking-widest font-mono-num"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setBkashStep('otp')}
                              className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={handleExecuteBkashGateway}
                              disabled={bkashLoading}
                              className="flex-[2] h-11 rounded-xl bg-[#E2136E] text-white font-black text-xs uppercase cursor-pointer"
                            >
                              {bkashLoading
                                ? 'Executing...'
                                : `Confirm ৳${amount.toFixed(2)}`}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartBkashGateway}
                    className="w-full h-12 rounded-xl bg-[#E2136E] text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Launch bKash Gateway
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Notice Box */}
                <div className="bg-[#fff8e8] border border-[#fde1a3] text-[#8a5a00] rounded-[14px] py-3 px-3.5 text-xs font-bold leading-relaxed">
                  Send exactly <b>৳{amount.toFixed(2)}</b> to the number below,
                  then submit your Transaction ID and optional screenshot.
                </div>

                {/* Number Box */}
                <div className="mt-[18px] bg-[#f4fbf8] border border-[#d9f2e9] rounded-[18px] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[1.3px] text-[#7b9189] font-black">
                        Send Money Number
                      </div>
                      <div className="text-[25px] font-black tracking-[1px] text-[#102f26] break-all mt-1.5 font-mono-num">
                        {merchantNumber}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="border-0 text-white h-[45px] px-[18px] rounded-[13px] font-black flex items-center gap-2 shadow-[0_7px_18px_rgba(0,150,136,0.24)] cursor-pointer active:scale-95 transition shrink-0"
                      style={{
                        background:
                          'linear-gradient(180deg, #1de9b6, #009688)',
                      }}
                    >
                      <span>📋</span>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                {/* 3 Steps */}
                <div className="grid grid-cols-3 gap-2 my-[18px]">
                  <div className="bg-[#f8fafc] border border-[#e7eef0] rounded-[14px] p-2.5 text-center text-[11px] font-extrabold text-[#516d64]">
                    <span className="w-[23px] h-[23px] rounded-full bg-[#e0f7f1] text-[#046c4e] inline-flex items-center justify-center font-black mb-1">
                      1
                    </span>
                    <div>Copy Number</div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#e7eef0] rounded-[14px] p-2.5 text-center text-[11px] font-extrabold text-[#516d64]">
                    <span className="w-[23px] h-[23px] rounded-full bg-[#e0f7f1] text-[#046c4e] inline-flex items-center justify-center font-black mb-1">
                      2
                    </span>
                    <div>Send Money</div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#e7eef0] rounded-[14px] p-2.5 text-center text-[11px] font-extrabold text-[#516d64]">
                    <span className="w-[23px] h-[23px] rounded-full bg-[#e0f7f1] text-[#046c4e] inline-flex items-center justify-center font-black mb-1">
                      3
                    </span>
                    <div>Submit TrxID</div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleManualSubmit}>
                  <div className="mt-[18px]">
                    <label
                      htmlFor="trx_id"
                      className="block text-[11px] font-black uppercase tracking-[1px] text-[#557268] mb-2"
                    >
                      Transaction ID *
                    </label>
                    <input
                      id="trx_id"
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="Enter Transaction ID (e.g. BKA984210X)"
                      required
                      className="w-full h-[52px] rounded-[15px] border-2 border-[#dce8e4] px-4 text-[15px] font-extrabold text-[#12352c] outline-none focus:border-[#009688] focus:bg-[#fafffd] transition"
                    />
                  </div>

                  <div className="mt-[18px]">
                    <label
                      htmlFor="screenshot"
                      className="block text-[11px] font-black uppercase tracking-[1px] text-[#557268] mb-2"
                    >
                      Payment Screenshot (Optional)
                    </label>
                    <label
                      htmlFor="screenshot"
                      className="border-2 border-dashed border-[#cbdcd6] rounded-[16px] p-4 text-center cursor-pointer block bg-[#fbfdfc] hover:border-[#009688] transition"
                    >
                      <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFileName(
                            file
                              ? file.name
                              : 'Tap to upload payment proof image'
                          );
                        }}
                      />
                      <div className="text-xl text-[#0f766e]">☁️⬆️</div>
                      <div className="text-xs font-extrabold text-[#355a4f] mt-1.5 break-all">
                        {fileName}
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[54px] border-0 rounded-[16px] text-white font-black text-[15px] uppercase tracking-[0.8px] mt-[22px] shadow-[0_12px_26px_rgba(3,76,68,0.26)] cursor-pointer active:scale-[0.99] transition"
                    style={{
                      background: 'linear-gradient(180deg, #034C44, #003333)',
                    }}
                  >
                    Submit Deposit Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Toast ("Number copied") */}
      <div
        className={`fixed left-1/2 bottom-6 -translate-x-1/2 bg-[#062920] text-white py-3 px-[18px] rounded-full text-xs font-extrabold transition-all duration-200 z-50 pointer-events-none ${
          copiedToast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3'
        }`}
      >
        Number copied
      </div>
    </div>
  );
};

/* ============================================================
   SCREEN B: WITHDRAW MONEY PAGE (from User's HTML)
   ============================================================ */
interface WithdrawMoneyViewProps {
  balance: number;
  bonusBalance: number;
  turnoverDone: number;
  savedWallets: SavedWithdrawalWallet[];
  transactions: TransactionRecord[];
  onBack: () => void;
  onAddWallet: (wallet: Omit<SavedWithdrawalWallet, 'id'>) => void;
  onUpdateWalletPin: (walletId: string, newPin: string) => void;
  onSubmitWithdraw: (
    method: TransactionRecord['method'],
    amount: number,
    account: string
  ) => boolean;
  onShowToast: (msg: string) => void;
}

export const WithdrawMoneyView: React.FC<WithdrawMoneyViewProps> = ({
  balance,
  bonusBalance,
  turnoverDone,
  savedWallets,
  transactions,
  onBack,
  onAddWallet,
  onUpdateWalletPin,
  onSubmitWithdraw,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
  const [amountInput, setAmountInput] = useState<string>('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    savedWallets[0]?.id || ''
  );

  // 3 Modals from Withdraw Money HTML
  const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false);
  const [pinSetupWallet, setPinSetupWallet] =
    useState<SavedWithdrawalWallet | null>(null);
  const [confirmPinOpen, setConfirmPinOpen] = useState<boolean>(false);

  // Add Account Modal inputs
  const [newMethod, setNewMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>(
    'bKash'
  );
  const [newAccountNum, setNewAccountNum] = useState<string>('');
  const [newAccountPin, setNewAccountPin] = useState<string>('');

  // PIN Setup Modal input
  const [setupPinVal, setSetupPinVal] = useState<string>('');

  // Confirm PIN Modal input
  const [confirmPinVal, setConfirmPinVal] = useState<string>('');

  const minWithdraw = 200;
  const maxWithdraw = 25000;
  const canWithdraw = balance >= minWithdraw;
  const withdrawableAmount = canWithdraw ? balance : 0;

  const selectedWallet =
    savedWallets.find((w) => w.id === selectedWalletId) || savedWallets[0];

  const numericAmount = parseFloat(amountInput || '0');

  // Compute live validation message (#liveMessage)
  const getLiveMessage = (): {
    show: boolean;
    type: 'ok' | 'locked';
    text: string;
  } => {
    if (!amountInput) {
      return { show: false, type: 'ok', text: '' };
    }
    if (!canWithdraw) {
      return {
        show: true,
        type: 'locked',
        text: 'Withdrawal is currently locked. Minimum ৳200 balance is required.',
      };
    }
    if (numericAmount < minWithdraw) {
      return {
        show: true,
        type: 'locked',
        text: `Minimum withdrawal is ৳${minWithdraw.toFixed(2)}.`,
      };
    }
    if (numericAmount > maxWithdraw) {
      return {
        show: true,
        type: 'locked',
        text: `Maximum withdrawal is ৳${maxWithdraw.toFixed(2)}.`,
      };
    }
    if (numericAmount > withdrawableAmount) {
      return {
        show: true,
        type: 'locked',
        text: `Entered amount exceeds your withdrawable balance of ৳${withdrawableAmount.toFixed(2)}.`,
      };
    }
    return {
      show: true,
      type: 'ok',
      text: `৳${numericAmount.toFixed(2)} is valid and ready for withdrawal.`,
    };
  };

  const liveMsg = getLiveMessage();

  const isSubmitEnabled =
    canWithdraw &&
    Boolean(selectedWallet) &&
    numericAmount >= minWithdraw &&
    numericAmount <= maxWithdraw &&
    numericAmount <= withdrawableAmount;

  const handleOpenAddModal = () => {
    setNewMethod('bKash');
    setNewAccountNum('');
    setNewAccountPin('');
    setAddAccountOpen(true);
  };

  const handleSaveNewWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedNum = newAccountNum.trim();
    const cleanedPin = newAccountPin.replace(/\D/g, '').slice(0, 4);
    if (!cleanedNum) {
      onShowToast('Please enter account number');
      return;
    }
    if (cleanedPin.length !== 4) {
      onShowToast('Please enter a 4-digit PIN');
      return;
    }
    onAddWallet({
      method: newMethod,
      accountNumber: cleanedNum,
      pin: cleanedPin,
    });
    setAddAccountOpen(false);
    onShowToast(`✓ ${newMethod} Withdrawal Account Saved`);
  };

  const handleSaveSetupPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinSetupWallet) return;
    const cleanedPin = setupPinVal.replace(/\D/g, '').slice(0, 4);
    if (cleanedPin.length !== 4) {
      onShowToast('PIN must be 4 digits');
      return;
    }
    onUpdateWalletPin(pinSetupWallet.id, cleanedPin);
    setPinSetupWallet(null);
    setSetupPinVal('');
    onShowToast('✓ Withdrawal PIN Updated');
  };

  const handleConfirmWithdrawWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    if (confirmPinVal !== selectedWallet.pin) {
      onShowToast('Incorrect 4-Digit Withdrawal PIN!');
      return;
    }
    const ok = onSubmitWithdraw(
      selectedWallet.method,
      numericAmount,
      selectedWallet.accountNumber
    );
    if (ok) {
      setConfirmPinOpen(false);
      setConfirmPinVal('');
      setAmountInput('');
      setActiveTab('history');
    }
  };

  const withdrawHistory = transactions.filter((t) => t.type === 'Withdraw');

  return (
    <div
      className="min-h-screen pb-32"
      style={{
        background: '#f2f5f6',
        color: '#173e34',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="text-white py-4 px-[18px] flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_18px_rgba(0,0,0,0.12)]"
        style={{
          background: 'linear-gradient(135deg, #0d3d2f, #176348)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="text-white cursor-pointer p-1 active:scale-95 transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="font-black text-base tracking-[0.5px]">
          WITHDRAW MONEY
        </div>
        <div className="w-5" />
      </div>

      <div className="max-w-[520px] mx-auto p-3.5">
        {/* Tabs: Withdraw Money | Withdrawal History */}
        <div className="grid grid-cols-2 bg-[#dfe7e5] p-1 rounded-[14px] mb-3.5">
          <button
            type="button"
            onClick={() => setActiveTab('withdraw')}
            className={`text-center py-2.5 rounded-[11px] font-black text-xs cursor-pointer transition-all ${
              activeTab === 'withdraw'
                ? 'bg-white text-[#0d3d2f] shadow-[0_3px_10px_rgba(0,0,0,0.08)]'
                : 'text-[#5c746d]'
            }`}
          >
            Withdraw Money
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`text-center py-2.5 rounded-[11px] font-black text-xs cursor-pointer transition-all ${
              activeTab === 'history'
                ? 'bg-white text-[#0d3d2f] shadow-[0_3px_10px_rgba(0,0,0,0.08)]'
                : 'text-[#5c746d]'
            }`}
          >
            Withdrawal History
          </button>
        </div>

        {activeTab === 'withdraw' ? (
          <>
            {/* Balance Card */}
            <div
              className="text-white rounded-[20px] p-[18px] shadow-[0_12px_28px_rgba(13,61,47,0.18)] mb-3.5"
              style={{
                background: 'linear-gradient(135deg, #0d3d2f, #14533d)',
              }}
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/10 rounded-[14px] p-3">
                  <div className="text-[11px] opacity-75 font-bold">
                    Current Balance
                  </div>
                  <div className="text-xl font-black mt-1 font-mono-num">
                    ৳{balance.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-[14px] p-3">
                  <div className="text-[11px] opacity-75 font-bold">
                    Bonus Balance
                  </div>
                  <div className="text-xl font-black mt-1 font-mono-num">
                    ৳{bonusBalance.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-[14px] p-3">
                  <div className="text-[11px] opacity-75 font-bold">
                    Turnover Done
                  </div>
                  <div className="text-xl font-black mt-1 font-mono-num">
                    ৳{turnoverDone.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white/10 rounded-[14px] p-3">
                  <div className="text-[11px] opacity-75 font-bold">
                    Withdrawable
                  </div>
                  <div className="text-xl font-black mt-1 font-mono-num">
                    ৳{withdrawableAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Status Card (#eligibilityCard) */}
            <div
              className={`rounded-[16px] p-3.5 mb-3.5 text-[13px] font-bold leading-relaxed border ${
                canWithdraw
                  ? 'bg-[#eafaf4] border-[#b7ebd6] text-[#0d684c]'
                  : 'bg-[#fff4e5] border-[#ffd599] text-[#9a5200]'
              }`}
            >
              {canWithdraw ? (
                <>
                  ✅ You can withdraw now. Available withdrawal amount:{' '}
                  <b>৳{withdrawableAmount.toFixed(2)}</b>
                </>
              ) : (
                <>
                  🔒 Withdrawal is currently locked. Minimum withdrawable
                  balance is <b>৳{minWithdraw.toFixed(2)}</b>.
                </>
              )}
            </div>

            {/* Withdrawal Amount Card */}
            <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_22px_rgba(0,0,0,0.05)] mb-3.5 border border-[#e7eeec]">
              <div className="text-xs font-black uppercase text-[#668078] tracking-[0.7px] mb-2.5">
                Withdrawal Amount
              </div>
              <div className="flex items-center border-2 border-[#d9e5e2] rounded-[14px] px-3.5 py-2.5 bg-[#fbfdfd]">
                <span className="text-[26px] font-black text-[#0d3d2f] mr-2.5">
                  ৳
                </span>
                <input
                  type="number"
                  min={minWithdraw}
                  max={maxWithdraw}
                  step="0.01"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Enter amount (200 - 25000)"
                  className="border-0 outline-none w-full text-[22px] font-black text-[#0d3d2f] bg-transparent font-mono-num"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[200, 500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(preset))}
                    className="px-3 py-1 rounded-lg bg-[#eef4f2] hover:bg-[#d9f2e9] text-[#0d3d2f] text-xs font-black font-mono-num cursor-pointer transition"
                  >
                    ৳{preset}
                  </button>
                ))}
              </div>

              {liveMsg.show && (
                <div
                  className={`mt-2.5 rounded-[12px] py-2.5 px-3 text-xs font-extrabold border ${
                    liveMsg.type === 'ok'
                      ? 'bg-[#eafaf4] border-[#b7ebd6] text-[#0d684c]'
                      : 'bg-[#fff4e5] border-[#ffd599] text-[#9a5200]'
                  }`}
                >
                  {liveMsg.text}
                </div>
              )}
            </div>

            {/* Withdrawal Account Card */}
            <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_22px_rgba(0,0,0,0.05)] mb-3.5 border border-[#e7eeec]">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-black uppercase text-[#668078] tracking-[0.7px] mb-0">
                  Withdrawal Account
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="border-0 text-white py-2 px-3 rounded-[10px] font-black text-xs cursor-pointer active:scale-95 transition"
                  style={{
                    background: 'linear-gradient(135deg, #17a56b, #0d6e49)',
                  }}
                >
                  + Add Account
                </button>
              </div>

              {savedWallets.length === 0 ? (
                <div className="text-center py-5 text-xs font-bold text-[#758c84] bg-[#f8fbfa] rounded-xl border border-dashed border-[#d9e5e2]">
                  No withdrawal account added yet. Click &ldquo;+ Add
                  Account&rdquo; above.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedWallets.map((w) => {
                    const isSelected =
                      (selectedWallet?.id || '') === w.id;
                    const hasPin = w.pin && w.pin.length === 4;
                    return (
                      <div
                        key={w.id}
                        onClick={() => {
                          if (!hasPin) {
                            setPinSetupWallet(w);
                            setSetupPinVal('');
                            return;
                          }
                          setSelectedWalletId(w.id);
                        }}
                        className={`border-2 rounded-[14px] p-3 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#16a067] bg-[#f1fbf7]'
                            : 'border-[#dce7e4] bg-white'
                        }`}
                      >
                        <div>
                          <div className="font-black text-sm text-[#0d3d2f] flex items-center gap-2">
                            <span>{w.method}</span>
                            <span
                              className={`text-[10px] py-0.5 px-2 rounded-full font-black ${
                                hasPin
                                  ? 'bg-[#e6f9f1] text-[#0c6b49]'
                                  : 'bg-[#fff2db] text-[#9b5b00]'
                              }`}
                            >
                              {hasPin ? 'PIN Ready' : 'Set PIN'}
                            </span>
                          </div>
                          <div className="text-[13px] font-bold text-[#567168] mt-1 font-mono-num">
                            {w.accountNumber}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPinSetupWallet(w);
                              setSetupPinVal(w.pin);
                            }}
                            className="text-[10px] font-bold text-[#0d6e49] underline cursor-pointer px-1.5 py-1"
                          >
                            PIN
                          </button>
                          <div
                            className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center text-xs ${
                              isSelected
                                ? 'bg-[#16a067] border-[#16a067] text-white'
                                : 'border-[#b9ccc6] text-transparent'
                            }`}
                          >
                            ✓
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                disabled={!isSubmitEnabled}
                onClick={() => {
                  setConfirmPinVal('');
                  setConfirmPinOpen(true);
                }}
                className="w-full mt-3.5 border-0 py-4 rounded-[15px] font-black text-[15px] text-white cursor-pointer disabled:bg-[#b8c8c3] disabled:cursor-not-allowed transition shadow-lg"
                style={
                  isSubmitEnabled
                    ? {
                        background:
                          'linear-gradient(180deg, #1de9b6, #0aa37f)',
                      }
                    : undefined
                }
              >
                Withdraw Now
              </button>
            </div>
          </>
        ) : (
          /* Withdrawal History Tab */
          <div className="bg-white rounded-[18px] p-4 shadow-[0_6px_22px_rgba(0,0,0,0.05)] border border-[#e7eeec]">
            <div className="text-xs font-black uppercase text-[#668078] tracking-[0.7px] mb-3">
              Withdrawal History
            </div>
            {withdrawHistory.length === 0 ? (
              <div className="text-center py-8 text-xs font-bold text-[#668078]">
                No withdrawal requests yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {withdrawHistory.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#dce7e4] rounded-[14px] p-3 flex items-center justify-between bg-[#fbfdfd]"
                  >
                    <div>
                      <div className="font-black text-sm text-[#0d3d2f]">
                        {item.method} · {item.account}
                      </div>
                      <div className="text-[11px] font-bold text-[#668078] mt-0.5 font-mono-num">
                        TrxID: {item.trxId} · {item.createdAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-base text-[#0d3d2f] font-mono-num">
                        ৳{item.amount.toFixed(2)}
                      </div>
                      <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-[#e6f9f1] text-[#0c6b49]">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal 1: Add Withdrawal Account (#addAccountModal) */}
      {addAccountOpen && (
        <div
          onClick={() => setAddAccountOpen(false)}
          className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[400px] rounded-[20px] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
          >
            <div className="text-[17px] font-black text-[#0d3d2f] mb-1.5">
              Add Withdrawal Account
            </div>
            <div className="text-xs text-[#668078] font-bold mb-3.5">
              Save your account and a 4-digit withdrawal PIN.
            </div>
            <form onSubmit={handleSaveNewWallet}>
              <div className="mb-3">
                <label className="block text-[11px] font-black text-[#58726a] mb-1 uppercase">
                  Payment Method
                </label>
                <select
                  value={newMethod}
                  onChange={(e) =>
                    setNewMethod(
                      e.target.value as 'bKash' | 'Nagad' | 'Rocket'
                    )
                  }
                  className="w-full p-3 border-2 border-[#d9e5e2] rounded-[12px] text-sm font-extrabold text-[#0d3d2f] outline-none"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-black text-[#58726a] mb-1 uppercase">
                  Account Number
                </label>
                <input
                  type="tel"
                  value={newAccountNum}
                  onChange={(e) => setNewAccountNum(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full p-3 border-2 border-[#d9e5e2] rounded-[12px] text-sm font-extrabold text-[#0d3d2f] outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-black text-[#58726a] mb-1 uppercase">
                  4-Digit Withdrawal PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newAccountPin}
                  onChange={(e) =>
                    setNewAccountPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  placeholder="••••"
                  required
                  className="w-full p-3 border-2 border-[#d9e5e2] rounded-[12px] text-[22px] font-extrabold text-[#0d3d2f] text-center tracking-[8px] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 border-0 py-3.5 rounded-[14px] font-black text-sm text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, #1de9b6, #0aa37f)',
                }}
              >
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Set Withdrawal PIN (#pinSetupModal) */}
      {pinSetupWallet && (
        <div
          onClick={() => setPinSetupWallet(null)}
          className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[400px] rounded-[20px] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
          >
            <div className="text-[17px] font-black text-[#0d3d2f] mb-1.5">
              Set Withdrawal PIN
            </div>
            <div className="text-xs text-[#668078] font-bold mb-3.5">
              Set a 4-digit PIN for {pinSetupWallet.method} (
              {pinSetupWallet.accountNumber}).
            </div>
            <form onSubmit={handleSaveSetupPin}>
              <div className="mb-3">
                <label className="block text-[11px] font-black text-[#58726a] mb-1 uppercase">
                  New 4-Digit PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={setupPinVal}
                  onChange={(e) =>
                    setSetupPinVal(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  placeholder="••••"
                  required
                  className="w-full p-3 border-2 border-[#d9e5e2] rounded-[12px] text-[22px] font-extrabold text-[#0d3d2f] text-center tracking-[8px] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 border-0 py-3.5 rounded-[14px] font-black text-sm text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, #1de9b6, #0aa37f)',
                }}
              >
                Save PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Withdrawal PIN (#confirmPinModal) */}
      {confirmPinOpen && selectedWallet && (
        <div
          onClick={() => setConfirmPinOpen(false)}
          className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[400px] rounded-[20px] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
          >
            <div className="text-[17px] font-black text-[#0d3d2f] mb-1.5">
              Enter Withdrawal PIN
            </div>
            <div className="text-xs text-[#668078] font-bold mb-3.5">
              Confirm withdrawal of <b>৳{numericAmount.toFixed(2)}</b> to{' '}
              <b>
                {selectedWallet.method} ({selectedWallet.accountNumber})
              </b>{' '}
              with your 4-digit PIN (Default: {selectedWallet.pin}).
            </div>
            <form onSubmit={handleConfirmWithdrawWithPin}>
              <div className="mb-3">
                <label className="block text-[11px] font-black text-[#58726a] mb-1 uppercase">
                  4-Digit PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPinVal}
                  onChange={(e) =>
                    setConfirmPinVal(
                      e.target.value.replace(/\D/g, '').slice(0, 4)
                    )
                  }
                  placeholder="••••"
                  required
                  className="w-full p-3 border-2 border-[#d9e5e2] rounded-[12px] text-[22px] font-extrabold text-[#0d3d2f] text-center tracking-[8px] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 border-0 py-3.5 rounded-[14px] font-black text-sm text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, #1de9b6, #0aa37f)',
                }}
              >
                Confirm Withdrawal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
