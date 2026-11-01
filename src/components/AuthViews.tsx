import React, { useEffect, useState } from 'react';

interface AuthViewsProps {
  mode: 'register' | 'login';
  onSwitchMode: (mode: 'register' | 'login') => void;
  onBack: () => void;
  onSuccessAuth: (
    mobile: string,
    isNewUser: boolean,
    referralCode?: string
  ) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  mode,
  onSwitchMode,
  onBack,
  onSuccessAuth,
}) => {
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [inviteToken, setInviteToken] = useState<string>('');
  const [showPass1, setShowPass1] = useState<boolean>(false);
  const [showPass2, setShowPass2] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [promosAccepted, setPromosAccepted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refParam =
        params.get('ref') ||
        params.get('referral') ||
        localStorage.getItem('moneyx_referred_by') ||
        '';
      const tokenParam = params.get('invite_token') || '';
      if (refParam) {
        setReferralCode(refParam);
        localStorage.setItem('moneyx_referred_by', refParam);
      }
      if (tokenParam) {
        setInviteToken(tokenParam);
      }
    }
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
    setMobile(digitsOnly);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!/^01[3-9][0-9]{8}$/.test(mobile)) {
      setErrorMsg('সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নাম্বার দিন (01XXXXXXXXX)');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
        return;
      }
      if (!termsAccepted) {
        setErrorMsg('অনুগ্রহ করে Terms & Conditions গ্রহণ করুন।');
      }
    }

    onSuccessAuth(
      mobile,
      mode === 'register',
      referralCode.trim() || undefined
    );
  };

  const currentUrlPath =
    typeof window !== 'undefined'
      ? window.location.origin +
        (mode === 'register' ? '/register' : '/login') +
        window.location.search
      : mode === 'register'
        ? '/register'
        : '/login';

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col"
      style={{
        backgroundColor: '#042e23',
        backgroundImage: 'linear-gradient(180deg, #073f32 0%, #032119 100%)',
        fontFamily: "'Roboto', Arial, sans-serif",
      }}
    >
      <div className="w-full max-w-[460px] mx-auto p-5 min-h-screen flex flex-col relative">
        {/* Top Bar with Back Button & Current Route Badge */}
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-[#ffcc00] text-xl inline-flex items-center gap-1.5 cursor-pointer active:opacity-60 transition-opacity"
            aria-label="Back"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-xs font-bold text-[#7eb89a]">Home</span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-black/35 border border-white/10 text-[10px] font-mono text-[#1de9b6] truncate max-w-[230px]">
            {currentUrlPath}
          </span>
        </div>

        {/* MONEYX Logo */}
        <div className="flex items-center justify-center gap-2.5 mt-4">
          <img
            src="/icon.svg"
            alt="MONEYX"
            className="w-11 h-11 rounded-xl border border-[#ffcc00]/50 shadow-lg"
          />
          <div
            className="text-center text-[34px] font-black italic text-[#ffcc00] tracking-[1.5px] select-none"
            style={{
              fontFamily: '"Arial Black", sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            MONEY<span className="text-white">X</span>
          </div>
        </div>

        {/* Security Notice Banner */}
        <div className="mt-3 bg-[#021e18]/90 border border-[#ffcc00]/35 rounded-xl p-3 text-center">
          <div className="text-xs font-black text-[#ffcc00]">
            🔒 অফিশিয়াল মেম্বার ভেরিফিকেশন গেট
          </div>
          <div className="text-[11px] text-[#7eb89a] mt-0.5 leading-snug">
            রেজিস্ট্রেশন বা লগইন করার আগে কোনো গেম খেলা, ব্যালেন্স দেখা, ডিপোজিট
            বা বোনাস ক্লেইম করা সম্পূর্ণ লক করা আছে।
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center text-[#ffcc00] text-2xl font-bold mt-4">
          {mode === 'register'
            ? 'Official Member Registration'
            : 'Member Login'}
        </div>

        {/* Switch Link */}
        <div className="text-center text-sm mt-1.5 mb-5 text-white">
          {mode === 'register' ? (
            <>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSwitchMode('login');
                }}
                className="text-[#1de9b6] underline font-bold cursor-pointer"
              >
                Login (/login)
              </button>
            </>
          ) : (
            <>
              নতুন মেম্বার অ্যাকাউন্ট খুলতে চান?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSwitchMode('register');
                }}
                className="text-[#1de9b6] underline font-bold cursor-pointer"
              >
                Register (/register)
              </button>
            </>
          )}
        </div>

        {/* Active Referral Invite Token Banner if detected from URL */}
        {mode === 'register' && (referralCode || inviteToken) && (
          <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-3 mb-4 text-xs">
            <div className="flex items-center justify-between font-black text-[#1de9b6]">
              <span>🤝 রেফারেল ইনভাইট লিংক ভেরিফাইড</span>
              <span className="px-2 py-0.5 rounded bg-[#ffcc00] text-black text-[10px]">
                {referralCode || 'VIP-PARTNER'}
              </span>
            </div>
            {inviteToken && (
              <div className="text-[10px] font-mono text-[#7eb89a] truncate mt-1">
                Token: {inviteToken}
              </div>
            )}
          </div>
        )}

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mobile Input */}
          <div className="relative mb-3.5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
              <i className="fa-solid fa-phone" />
            </span>
            <input
              type="tel"
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Bangladesh (+880): 01XXXXXXXXX"
              required
              minLength={11}
              maxLength={11}
              inputMode="numeric"
              className="w-full bg-[#021e18] border border-[#094a3e] focus:border-[#1de9b6] rounded-[10px] py-4 pr-4 pl-12 text-white text-sm placeholder-[#1de9b6] placeholder:font-medium transition-colors"
            />
          </div>

          {/* Password Input */}
          <div className="relative mb-3.5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
              <i className="fa-solid fa-lock" />
            </span>
            <input
              type={showPass1 ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (কমপক্ষে ৪ অক্ষর)"
              required
              className="w-full bg-[#021e18] border border-[#094a3e] focus:border-[#1de9b6] rounded-[10px] py-4 px-12 text-white text-sm placeholder-[#1de9b6] placeholder:font-medium transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPass1((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1de9b6] cursor-pointer"
              aria-label="Toggle Password Visibility"
            >
              <i
                className={`fa-solid ${showPass1 ? 'fa-eye' : 'fa-eye-slash'}`}
              />
            </button>
          </div>

          {/* Confirm Password & Referral Code Input (Register Mode) */}
          {mode === 'register' && (
            <>
              <div className="relative mb-3.5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
                  <i className="fa-solid fa-shield-halved" />
                </span>
                <input
                  type={showPass2 ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full bg-[#021e18] border border-[#094a3e] focus:border-[#1de9b6] rounded-[10px] py-4 px-12 text-white text-sm placeholder-[#1de9b6] placeholder:font-medium transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass2((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1de9b6] cursor-pointer"
                  aria-label="Toggle Confirm Password Visibility"
                >
                  <i
                    className={`fa-solid ${
                      showPass2 ? 'fa-eye' : 'fa-eye-slash'
                    }`}
                  />
                </button>
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffcc00]">
                  <i className="fa-solid fa-user-plus" />
                </span>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Referral / Invite Code (ঐচ্ছিক, যেমন: MX883921VIP)"
                  className="w-full bg-[#021e18] border border-[#094a3e] focus:border-[#ffcc00] rounded-[10px] py-3.5 pr-4 pl-12 text-[#ffcc00] text-xs font-mono placeholder-[#7eb89a] transition-colors"
                />
              </div>
            </>
          )}

          {/* Circular Checkboxes */}
          {mode === 'register' && (
            <>
              <div
                onClick={() => setTermsAccepted((v) => !v)}
                className="flex items-start mb-3 px-1 cursor-pointer"
              >
                <div
                  className={`w-[22px] h-[22px] min-w-[22px] rounded-full border-[1.5px] mr-3 mt-0.5 flex items-center justify-center transition-colors ${
                    termsAccepted
                      ? 'bg-[#ffcc00] border-[#ffcc00] text-black'
                      : 'bg-transparent border-[#1de9b6]'
                  }`}
                >
                  {termsAccepted && (
                    <span className="text-xs font-black leading-none">✓</span>
                  )}
                </div>
                <div className="text-[11px] text-white leading-[1.4]">
                  আমার বয়স ১৮ বছরের বেশি এবং আমি MONEYX-এর সকল নিয়মাবলী, বোনাস
                  টার্নওভার শর্তাবলী ও বেটিং রুলস মেনে নিচ্ছি।
                </div>
              </div>

              <div
                onClick={() => setPromosAccepted((v) => !v)}
                className="flex items-start mb-4 px-1 cursor-pointer"
              >
                <div
                  className={`w-[22px] h-[22px] min-w-[22px] rounded-full border-[1.5px] mr-3 mt-0.5 flex items-center justify-center transition-colors ${
                    promosAccepted
                      ? 'bg-[#ffcc00] border-[#ffcc00] text-black'
                      : 'bg-transparent border-[#1de9b6]'
                  }`}
                >
                  {promosAccepted && (
                    <span className="text-xs font-black leading-none">✓</span>
                  )}
                </div>
                <div className="text-[11px] text-white leading-[1.4]">
                  আমি ভিআইপি প্রমোশন, রেফারেল রিওয়ার্ড ও ভল্ট বোনাস নোটিফিকেশন
                  পেতে চাই।
                </div>
              </div>
            </>
          )}

          {/* 3D Gold-Orange Register / Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg py-3.5 text-lg font-black text-[#8c2800] cursor-pointer mt-2 mb-5 active:translate-y-1 transition-all border border-white/40"
            style={{
              background: 'linear-gradient(180deg, #ffdf00 0%, #ff9d00 100%)',
              boxShadow: '0 4px 0px #c57300, 0 6px 10px rgba(0,0,0,0.3)',
            }}
          >
            {mode === 'register'
              ? '✓ রেজিস্ট্রেশন সম্পন্ন করুন'
              : '✓ লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};
