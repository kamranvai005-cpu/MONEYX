import React, { useState } from 'react';

interface AuthViewsProps {
  mode: 'register' | 'login';
  onSwitchMode: (mode: 'register' | 'login') => void;
  onBack: () => void;
  onSuccessAuth: (mobile: string, isNewUser: boolean) => void;
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
  const [showPass1, setShowPass1] = useState<boolean>(false);
  const [showPass2, setShowPass2] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);
  const [promosAccepted, setPromosAccepted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        return;
      }
    }

    onSuccessAuth(mobile, mode === 'register');
  };

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col"
      style={{
        backgroundColor: '#042e23',
        backgroundImage: 'linear-gradient(180deg, #073f32 0%, #032119 100%)',
        fontFamily: "'Roboto', Arial, sans-serif",
      }}
    >
      <div className="w-full max-w-[450px] mx-auto p-5 min-h-screen flex flex-col relative">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-[#ffcc00] text-xl mt-2.5 inline-flex items-center justify-center cursor-pointer active:opacity-60 transition-opacity"
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
          </button>
        </div>

        {/* MONEYX Logo */}
        <div
          className="text-center text-[34px] font-black italic text-[#ffcc00] tracking-[1.5px] mt-3.5 select-none"
          style={{
            fontFamily: '"Arial Black", sans-serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          MONEY<span className="text-white">X</span>
        </div>

        {/* Page Title */}
        <div className="text-center text-[#ffcc00] text-2xl font-bold mt-6">
          {mode === 'register' ? 'Register' : 'Login'}
        </div>

        {/* Switch Link */}
        <div className="text-center text-sm mt-2 mb-6 text-white">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSwitchMode('login');
                }}
                className="text-[#1de9b6] underline font-medium cursor-pointer"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSwitchMode('register');
                }}
                className="text-[#1de9b6] underline font-medium cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Error Box */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-lg mb-5 text-sm text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Mobile Input */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
              </svg>
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
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
              </svg>
            </span>
            <input
              type={showPass1 ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-[#021e18] border border-[#094a3e] focus:border-[#1de9b6] rounded-[10px] py-4 px-12 text-white text-sm placeholder-[#1de9b6] placeholder:font-medium transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPass1((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1de9b6] cursor-pointer"
              aria-label="Toggle Password Visibility"
            >
              {showPass1 ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Input (Register Mode) */}
          {mode === 'register' && (
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1de9b6]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                </svg>
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
                {showPass2 ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Circular Checkboxes */}
          {mode === 'register' && (
            <>
              <div
                onClick={() => setTermsAccepted((v) => !v)}
                className="flex items-start mb-3.5 px-1 cursor-pointer"
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
                  I am over 18 years of age and have read and accepted Terms
                  &amp; Conditions, Privacy Policy &amp; Betting Rules as
                  published on the site.
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
                  I would like to receive details of special offers, free bets
                  and other promotions.
                </div>
              </div>
            </>
          )}

          {/* 3D Gold-Orange Register / Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg py-3.5 text-lg font-black text-[#8c2800] cursor-pointer mt-2.5 mb-6 active:translate-y-1 transition-all border border-white/40"
            style={{
              background: 'linear-gradient(180deg, #ffdf00 0%, #ff9d00 100%)',
              boxShadow: '0 4px 0px #c57300, 0 6px 10px rgba(0,0,0,0.3)',
            }}
          >
            {mode === 'register' ? 'Register' : 'Login'}
          </button>
        </form>

        {/* Social Row */}
        <div className="flex justify-center gap-5 mb-5">
          <button
            type="button"
            onClick={() => onSuccessAuth('01770618575', mode === 'register')}
            className="w-[46px] h-[46px] rounded-full bg-[#3b5998] text-white flex items-center justify-center text-xl font-black cursor-pointer active:scale-90 transition-transform"
            title="Continue with Facebook"
          >
            f
          </button>
          <button
            type="button"
            onClick={() => onSuccessAuth('01770618575', mode === 'register')}
            className="w-[46px] h-[46px] rounded-full bg-white border border-gray-300 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            title="Continue with Google"
          >
            <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
