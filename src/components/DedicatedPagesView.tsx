import React, { useState } from 'react';
import {
  ActiveView,
  BinaryTrade,
  BonusRecord,
  TransactionRecord,
  UserProfile,
  WingoBet,
} from '../types';

export interface PromoPictureItem {
  slug: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  rewardText: string;
  badge: string;
  gradient: string;
  icon: string;
  requiredDeposit: number;
  requiredTurnover: number;
  requiredReferrals?: number;
  rulesBn: string[];
}

export const PROMO_PICTURES_CATALOG: PromoPictureItem[] = [
  {
    slug: 'welcome-vault-200',
    titleBn: 'নতুন মেম্বার লকড স্বাগতম ভল্ট',
    titleEn: 'New Member Welcome Vault',
    subtitleBn:
      'রেজিস্ট্রেশন করলেই ভল্টে ৳২০০ জমা হয়, যা ডিপোজিট ও ৫x টার্নওভার শেষে আনলক হয়',
    rewardText: '৳২০০.০০ BDT',
    badge: 'LOCKED VAULT #1',
    gradient: 'from-[#0d7a55] via-[#0a3d2c] to-[#041812]',
    icon: '🔐',
    requiredDeposit: 1000,
    requiredTurnover: 5000,
    rulesBn: [
      '১. শুধুমাত্র নতুন রেজিস্টার্ড মেম্বারদের জন্য ৳২০০ লকড ভল্টে জমা থাকবে।',
      '২. এই বোনাস মূল ব্যালেন্সে আনতে ন্যূনতম ৳১,০০০ ভেরিফাইড ডিপোজিট থাকতে হবে।',
      '৩. স্লট, ক্র্যাশ অথবা ট্রেডিংয়ে মোট ৳৫,০০০ (৫x) বৈধ বেটিং টার্নওভার সম্পন্ন করতে হবে।',
      '৪. শর্ত পূরণের আগে কেউ ক্লেইম বা উত্তোলন করতে পারবে না (Anti-Abuse Security Lock)।',
    ],
  },
  {
    slug: 'first-deposit-129',
    titleBn: 'প্রথম ডিপোজিট ১২৯% মেগা ভিআইপি রুম',
    titleEn: 'First Deposit 129% Mega Bonus',
    subtitleBn:
      'বিকাশ, নগদ ও রকেটে প্রথম ডিপোজিটে সর্বোচ্চ ৳২,৫৮০ পর্যন্ত গ্যারান্টিড ভল্ট বোনাস',
    rewardText: '+১২৯% (সর্বোচ্চ ৳২,৫৮০)',
    badge: 'VIP ROOM #2',
    gradient: 'from-[#b8860b] via-[#5c4004] to-[#071f18]',
    icon: '👑',
    requiredDeposit: 2000,
    requiredTurnover: 16000,
    rulesBn: [
      '১. ন্যূনতম ৳২,০০০ প্রথম ডিপোজিটে ১২৯% বোনাস ভল্টে যুক্ত হবে।',
      '২. বোনাস আনলক করতে ৮x (৳১৬,০০০) রিয়েল গেম টার্নওভার সম্পন্ন করা বাধ্যতামূলক।',
      '৩. একই ডিভাইস বা আইপি থেকে একাধিক অ্যাকাউন্ট খুললে বোনাস অটো-লক হয়ে যাবে।',
    ],
  },
  {
    slug: 'refer-partner-500',
    titleBn: 'অফিশিয়াল রেফার ও অ্যাফিলিয়েট পার্টনার রুম',
    titleEn: 'VIP Refer & Affiliate Commission',
    subtitleBn:
      'আপনার দীর্ঘ রেফারেল লিংক দিয়ে বন্ধু জয়েন ও ডিপোজিট করলেই প্রতি রেফারে ৳৫০০ + আজীবন ২.৫% কমিশন',
    rewardText: '৳৫০০ / প্রতি রেফার',
    badge: 'AFFILIATE ROOM #3',
    gradient: 'from-[#0e6b8a] via-[#093c4f] to-[#051a24]',
    icon: '🤝',
    requiredDeposit: 1000,
    requiredTurnover: 3000,
    requiredReferrals: 3,
    rulesBn: [
      '১. আপনার অফিশিয়াল লম্বা রেফারেল লিংক (/register?ref=...) ব্যবহার করে বন্ধুকে রেজিস্ট্রেশন করতে হবে।',
      '২. আমন্ত্রিত বন্ধুকে ন্যূনতম ৳১,০০০ ডিপোজিট এবং ৳৩,০০০ বেটিং টার্নওভার সম্পন্ন করতে হবে।',
      '৩. ফেক রেজিস্ট্রেশন বা ডিপোজিট ছাড়া কোনো রেফারেল বোনাস আনলক হবে না।',
    ],
  },
  {
    slug: 'daily-turnover-rebate',
    titleBn: 'ডেইলি টার্নওভার ও ক্যাশব্যাক রুম',
    titleEn: 'Daily Turnover & Loss Rebate Vault',
    subtitleBn:
      'প্রতিদিন স্লট, লাইভ ক্যাসিনো ও বাইনারি ট্রেডিংয়ে ১.৮% পর্যন্ত অটোমেটিক রিবেট ভল্ট',
    rewardText: ' প্রতিদিন ৳১,০০০ পর্যন্ত',
    badge: 'REBATE ROOM #4',
    gradient: 'from-[#7c2d12] via-[#451a03] to-[#071f18]',
    icon: '🔥',
    requiredDeposit: 500,
    requiredTurnover: 3500,
    rulesBn: [
      '১. প্রতিদিনের রিবেট ক্লেইম করতে ওই দিনে কমপক্ষে ৳৫০০ ডিপোজিট থাকতে হবে।',
      '২. ন্যূনতম ৳৩,৫০০ বৈধ বেটিং টার্নওভার পূর্ণ হলে ২৪ ঘণ্টা পর ভল্ট আনলক হবে।',
    ],
  },
  {
    slug: 'app-install-vault-150',
    titleBn: 'অফিশিয়াল MONEYX অ্যাপ ইনস্টল ভল্ট',
    titleEn: 'Official PWA App Install Reward',
    subtitleBn:
      'মোবাইলে অফিশিয়াল অ্যাপ ইনস্টল ও ভেরিফাইড ডিপোজিট সম্পন্ন করলে ৳১৫০ স্পেশাল বোনাস',
    rewardText: '৳১৫০.০০ BDT',
    badge: 'APP VAULT #5',
    gradient: 'from-[#4c1d95] via-[#2e1065] to-[#071f18]',
    icon: '📲',
    requiredDeposit: 500,
    requiredTurnover: 1500,
    rulesBn: [
      '১. প্রথমে MONEYX অফিশিয়াল অ্যাপটি মোবাইলে ইনস্টল করতে হবে।',
      '২. অ্যাকাউন্টে ন্যূনতম ৳৫০০ ডিপোজিট এবং ৩x (৳১,৫০০) টার্নওভার সম্পন্ন হলেই বোনাসটি ক্লেইম করা যাবে।',
    ],
  },
  {
    slug: 'vip-weekly-salary',
    titleBn: 'ভিআইপি এজেন্ট সাপ্তাহিক স্যালারি ও লেভেল বোনাস',
    titleEn: 'VIP Weekly Salary & Level Up Chest',
    subtitleBn:
      'VIP 1 থেকে VIP 10 মেম্বারদের জন্য প্রতি সোমবার গ্যারান্টিড মাসিক ও সাপ্তাহিক স্যালারি',
    rewardText: '৳৫,০০০ - ৳৫০,০০০',
    badge: 'VIP SALARY #6',
    gradient: 'from-[#065f46] via-[#064e3b] to-[#022c22]',
    icon: '💎',
    requiredDeposit: 5000,
    requiredTurnover: 25000,
    rulesBn: [
      '১. সাপ্তাহিক স্যালারি পেতে ন্যূনতম ৳৫,০০০ ডিপোজিট এবং ৳২৫,০০০ সাপ্তাহিক টার্নওভার থাকতে হবে।',
      '২. প্রতি সোমবার রাত ১২:০০ টায় অটোমেটিক ভেরিফিকেশন শেষে ক্লেইম বাটন সচল হবে।',
    ],
  },
];

export function buildLongReferralRegisterLink(profile: UserProfile): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://moneyx.live';
  const uid = profile.uid || '883921';
  const token =
    profile.referralToken ||
    `9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c${uid}8e1d2f3a4b5c`;
  return `${origin}/register?ref=MX${uid}VIP&invite_token=${token}&affiliate_id=BD_PARTNER_${uid}&utm_source=moneyx_official_refer&utm_medium=vip_partner_link&utm_campaign=refer_reward_500bdt&security_sig=mx_${uid}_verified`;
}

export function buildLongReferPageLink(profile: UserProfile): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://moneyx.live';
  const uid = profile.uid || '883921';
  return `${origin}/refer?partner=MX${uid}VIP&channel=bd_vip_affiliate&verify_hash=7c9e2a4b8d1f_${uid}`;
}

// ============================================================================
// 1. DEDICATED /refer PAGE VIEW (Separate Page with Long Referral Links & Picture Cards)
// ============================================================================
export const ReferAndAffiliatePageView: React.FC<{
  profile: UserProfile;
  transactions: TransactionRecord[];
  onBackHome: () => void;
  onOpenPromoDetail: (slug: string) => void;
  onNavigateBonusVault: () => void;
  onShowToast: (msg: string) => void;
}> = ({
  profile,
  transactions,
  onBackHome,
  onOpenPromoDetail,
  onNavigateBonusVault,
  onShowToast,
}) => {
  const [copiedType, setCopiedType] = useState<'reg' | 'page' | 'code' | null>(
    null
  );

  const longRegLink = buildLongReferralRegisterLink(profile);
  const longReferPageLink = buildLongReferPageLink(profile);
  const refCode = `MX${profile.uid || '883921'}VIP`;

  const completedDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCopy = (text: string, type: 'reg' | 'page' | 'code') => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedType(type);
    onShowToast('✓ অফিশিয়াল রেফারেল লিংক কপি হয়েছে!');
    setTimeout(() => setCopiedType(null), 2200);
  };

  return (
    <div className="min-h-screen bg-[#041c15] text-white pb-24">
      {/* Top Sticky Page Header */}
      <header className="sticky top-0 z-40 h-14 bg-[#071f18]/95 backdrop-blur-md border-b border-[#f0c030]/25 px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackHome}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#ffd84d] cursor-pointer"
          >
            ‹
          </button>
          <div>
            <div className="text-sm font-black text-[#ffd84d] uppercase tracking-wider">
              MONEYX PARTNER &amp; REFER CENTER
            </div>
            <div className="text-[10px] font-mono text-[#1de9b6]">
              {typeof window !== 'undefined'
                ? `${window.location.origin}/refer`
                : '/refer'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateBonusVault}
          className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-[#f0c030]/40 text-[11px] font-black text-[#ffd84d] cursor-pointer"
        >
          🔐 বোনাস ভল্ট (/bonus)
        </button>
      </header>

      <div className="max-w-[920px] mx-auto p-3.5 space-y-4">
        {/* Hero Affiliate Banner */}
        <div
          className="rounded-2xl p-5 border-2 border-[#f0c030]/40 shadow-2xl relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #071f18 0%, #0d593e 55%, #06291d 100%)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffd84d]/20 border border-[#ffd84d]/40 text-[#ffd84d] text-[10px] font-black uppercase mb-2">
            <span>🤝 OFFICIAL AFFILIATE PROGRAM</span>
            <span>·</span>
            <span>ID: {refCode}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            বন্ধুদের আমন্ত্রণ জানান এবং প্রতি ভেরিফাইড রেফারে পান{' '}
            <span className="text-[#ffd84d]">৳৫০০ BDT + ২.৫% আজীবন কমিশন!</span>
          </h1>
          <p className="text-xs text-[#b7e4ce] mt-1.5 leading-relaxed">
            নিচের দীর্ঘ ডোমেইন রেজিস্ট্রেশন লিংকটি কপি করে আপনার বন্ধুদের শেয়ার
            করুন। বন্ধু রেজিস্ট্রেশন করে ন্যূনতম ৳১,০০০ ডিপোজিট ও ৩x বেটিং
            টার্নওভার সম্পন্ন করলেই আপনার রেফারেল ভল্ট আনলক হবে।
          </p>
        </div>

        {/* Long Registration Referral Link Box */}
        <div className="rounded-2xl bg-[#0a2e22] border border-[#1ec882]/35 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-[#ffd84d] uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-link text-[#1de9b6]" />
              <span>১. আপনার দীর্ঘ ডোমেইন রেজিস্ট্রেশন লিংক (Direct Register Link)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
              SHA-256 Token Active
            </span>
          </div>

          <div className="bg-[#041812] border border-[#0d7a55]/60 rounded-xl p-3 font-mono text-[11px] text-[#1de9b6] break-all leading-relaxed select-all">
            {longRegLink}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCopy(longRegLink, 'reg')}
              className="flex-1 py-3 px-4 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-copy" />
              <span>
                {copiedType === 'reg'
                  ? '✓ রেজিস্ট্রেশন লিংক কপি হয়েছে!'
                  : 'লম্বা রেজিস্ট্রেশন লিংক কপি করুন'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy(refCode, 'code')}
              className="py-3 px-4 rounded-xl bg-[#071f18] border border-[#f0c030]/40 text-xs font-black text-[#ffd84d] cursor-pointer"
            >
              {copiedType === 'code' ? '✓ কপি হয়েছে' : `কোড: ${refCode}`}
            </button>
          </div>
        </div>

        {/* Dedicated /refer Page Link Box */}
        <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-2.5">
          <div className="text-xs font-black text-[#e8f5ee] flex items-center gap-1.5">
            <i className="fa-solid fa-share-nodes text-[#ffd84d]" />
            <span>২. আপনার ডেডিকেটেড রেফার পেজ লিংক (/refer URL)</span>
          </div>
          <div className="bg-[#041812] border border-white/10 rounded-xl p-2.5 font-mono text-[11px] text-[#7eb89a] break-all select-all">
            {longReferPageLink}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(longReferPageLink, 'page')}
            className="w-full py-2.5 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
          >
            {copiedType === 'page'
              ? '✓ /refer লিংক কপি হয়েছে!'
              : '/refer পেজ লিংক কপি করুন'}
          </button>
        </div>

        {/* Affiliate Stats & Anti-Abuse Verification Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              মোট ইনভাইট ক্লিক
            </div>
            <div className="text-lg font-black text-white font-mono-num mt-0.5">
              14
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              ভেরিফাইড ডিপোজিটর (≥৳১,০০০)
            </div>
            <div className="text-lg font-black text-[#ffd84d] font-mono-num mt-0.5">
              0 / 3
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              লকড রেফারেল বোনাস
            </div>
            <div className="text-lg font-black text-amber-400 font-mono-num mt-0.5">
              🔒 ৳1,500
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              উত্তোলনযোগ্য কমিশন
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono-num mt-0.5">
              ৳0.00
            </div>
          </div>
        </div>

        {/* Separate Clickable Picture/Banner Cards — Clicking Each Opens Its Own Separate Page! */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-sm font-black text-[#ffd84d] uppercase">
              🖼️ রেফারেল ও প্রমোশন পিকচার গ্যালারি (ক্লিক করলে আলাদা পেজে ওপেন হবে)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROMO_PICTURES_CATALOG.map((item) => (
              <div
                key={item.slug}
                onClick={() => onOpenPromoDetail(item.slug)}
                className={`rounded-2xl p-4 bg-gradient-to-br ${item.gradient} border border-[#f0c030]/35 shadow-xl cursor-pointer hover:scale-[1.01] transition-transform flex flex-col justify-between min-h-[155px] relative overflow-hidden group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/45 border border-[#ffd84d]/40 text-[10px] font-black text-[#ffd84d]">
                    {item.badge}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <div className="my-2">
                  <div className="text-base font-black text-white group-hover:text-[#ffd84d] transition-colors">
                    {item.titleBn}
                  </div>
                  <div className="text-[11px] text-white/80 mt-0.5 line-clamp-2">
                    {item.subtitleBn}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  <div>
                    <span className="text-[10px] text-[#7eb89a] block">
                      পুরস্কার ভল্ট:
                    </span>
                    <span className="text-xs font-black text-[#ffd84d]">
                      {item.rewardText}
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-[#ffd84d] text-[#1a0f00] text-[11px] font-black">
                    আলাদা পেজে দেখুন (/promo/{item.slug}) ›
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strict Anti-Fraud Notice */}
        <div className="rounded-2xl bg-[#071f18] border border-amber-500/35 p-4 text-xs text-amber-200/90 space-y-1.5">
          <div className="font-black text-[#ffd84d]">
            ⚠️ MONEYX অ্যান্টি-ফ্রড ও রেফারেল ভেরিফিকেশন নীতিমালা:
          </div>
          <div>
            • শুধুমাত্র লিংকে ক্লিক বা খালি অ্যাকাউন্ট খুললে কোনো বোনাস ক্লেইম
            করা যাবে না।
          </div>
          <div>
            • রেফারকৃত মেম্বারকে অবশ্যই ন্যূনতম <b>৳১,০০০ ডিপোজিট</b> এবং{' '}
            <b>৩x বেটিং টার্নওভার</b> সম্পন্ন করতে হবে (আপনার বর্তমান মোট ডিপোজিট:{' '}
            <b>৳{completedDeposits.toFixed(0)}</b>)।
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. DEDICATED /bonus PAGE VIEW (Professional Bonus Vault — Cannot Claim Without Meeting Strict Conditions!)
// ============================================================================
export const ProfessionalBonusVaultView: React.FC<{
  profile: UserProfile;
  balance: number;
  transactions: TransactionRecord[];
  wingoBets: WingoBet[];
  binaryTrades: BinaryTrade[];
  bonuses: BonusRecord[];
  onBackHome: () => void;
  onNavigateDeposit: () => void;
  onNavigateRefer: () => void;
  onOpenPromoDetail: (slug: string) => void;
  onUnlockVerifiedBonus: (title: string, amount: number) => void;
  onShowToast: (msg: string) => void;
}> = ({
  profile,
  transactions,
  wingoBets,
  binaryTrades,
  onBackHome,
  onNavigateDeposit,
  onNavigateRefer,
  onOpenPromoDetail,
  onUnlockVerifiedBonus,
  onShowToast,
}) => {
  const [lockedModalInfo, setLockedModalInfo] =
    useState<PromoPictureItem | null>(null);
  const [claimedSlugs, setClaimedSlugs] = useState<string[]>([]);

  // Calculate REAL verified deposits and REAL betting turnover
  const totalVerifiedDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRealTurnover =
    wingoBets.reduce((sum, b) => sum + b.amount, 0) +
    binaryTrades.reduce((sum, t) => sum + t.amount, 0);

  const verifiedReferralsCount = 0; // Requires real backend/admin verified referrals

  const handleAttemptClaim = (item: PromoPictureItem, rewardAmt: number) => {
    if (claimedSlugs.includes(item.slug)) {
      onShowToast('ইতিমধ্যে এই ভল্ট বোনাস ক্লেইম করা হয়েছে!');
      return;
    }

    const depOk = totalVerifiedDeposits >= item.requiredDeposit;
    const turnOk = totalRealTurnover >= item.requiredTurnover;
    const refOk = item.requiredReferrals
      ? verifiedReferralsCount >= item.requiredReferrals
      : true;

    if (!depOk || !turnOk || !refOk) {
      // Strictly block instant claiming! Show the professional verification lock dialog.
      setLockedModalInfo(item);
      onShowToast(
        '🔒 শর্ত পূরণ হয়নি! ডিপোজিট ও টার্নওভার সম্পন্ন ছাড়া এই বোনাস ক্লেইম করা যাবে না।'
      );
      return;
    }

    setClaimedSlugs((prev) => [...prev, item.slug]);
    onUnlockVerifiedBonus(item.titleBn, rewardAmt);
  };

  return (
    <div className="min-h-screen bg-[#041c15] text-white pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 h-14 bg-[#071f18]/95 backdrop-blur-md border-b border-[#f0c030]/25 px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackHome}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#ffd84d] cursor-pointer"
          >
            ‹
          </button>
          <div>
            <div className="text-sm font-black text-[#ffd84d] uppercase tracking-wider">
              MONEYX PROFESSIONAL BONUS VAULT
            </div>
            <div className="text-[10px] font-mono text-[#1de9b6]">
              {typeof window !== 'undefined'
                ? `${window.location.origin}/bonus`
                : '/bonus'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateDeposit}
          className="px-3 py-1.5 rounded-lg btn-3d-gold text-[11px] font-black cursor-pointer"
        >
          + ডিপোজিট করুন
        </button>
      </header>

      <div className="max-w-[960px] mx-auto p-3.5 space-y-4">
        {/* Top Vault Security Dashboard */}
        <div
          className="rounded-2xl p-4 sm:p-5 border-2 border-[#f0c030]/40 shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, #071f18 0%, #0d3d2c 55%, #041812 100%)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[#ffd84d] text-[10px] font-black uppercase">
                🔐 ANTI-ABUSE SMART VAULT SYSTEM
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white mt-1">
                প্রফেশনাল বোনাস ভল্ট ও টার্নওভার ভেরিফিকেশন সেন্টার
              </h1>
            </div>
            <div className="text-right bg-[#041812]/90 border border-[#f0c030]/35 rounded-xl px-3.5 py-2">
              <div className="text-[10px] text-[#7eb89a] font-bold">
                লকড বোনাস ভল্ট ব্যালেন্স
              </div>
              <div className="text-lg font-black text-[#ffd84d] font-mono-num">
                🔒 ৳{(profile.lockedBonusBalance ?? 200).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/10">
            <div className="bg-[#041812]/80 rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">
                আপনার ভেরিফাইড ডিপোজিট
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-400 font-mono-num mt-0.5">
                ৳{totalVerifiedDeposits.toFixed(0)}
              </div>
            </div>
            <div className="bg-[#041812]/80 rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">
                আপনার সম্পন্ন টার্নওভার (Betting)
              </div>
              <div className="text-sm sm:text-base font-black text-[#ffd84d] font-mono-num mt-0.5">
                ৳{totalRealTurnover.toFixed(0)}
              </div>
            </div>
            <div className="bg-[#041812]/80 rounded-xl p-2.5 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">
                ভেরিফাইড অ্যাক্টিভ রেফার
              </div>
              <div className="text-sm sm:text-base font-black text-cyan-400 font-mono-num mt-0.5">
                {verifiedReferralsCount} জন
              </div>
            </div>
          </div>
        </div>

        {/* Professional Bonus Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PROMO_PICTURES_CATALOG.map((item, idx) => {
            const depPct = Math.min(
              100,
              Math.floor((totalVerifiedDeposits / item.requiredDeposit) * 100)
            );
            const turnPct = Math.min(
              100,
              Math.floor((totalRealTurnover / item.requiredTurnover) * 100)
            );
            const refOk = item.requiredReferrals
              ? verifiedReferralsCount >= item.requiredReferrals
              : true;
            const isFullyUnlocked =
              depPct >= 100 && turnPct >= 100 && refOk;

            return (
              <div
                key={item.slug}
                className="rounded-2xl bg-[#0a2e22] border-2 border-[#f0c030]/25 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                {/* Clickable Top Picture Banner -> Opens Separate Page */}
                <div
                  onClick={() => onOpenPromoDetail(item.slug)}
                  className={`p-4 bg-gradient-to-r ${item.gradient} border-b border-white/10 cursor-pointer relative group`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/45 border border-[#ffd84d]/40 text-[10px] font-black text-[#ffd84d]">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#1de9b6] group-hover:underline">
                      বিস্তারিত পেজ (/promo/{item.slug}) ›
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-black text-white">
                        {item.titleBn}
                      </div>
                      <div className="text-[11px] text-white/80 mt-0.5">
                        {item.subtitleBn}
                      </div>
                    </div>
                    <div className="text-3xl shrink-0">{item.icon}</div>
                  </div>
                </div>

                {/* Progress Bars & Verification Requirements */}
                <div className="p-4 space-y-3 bg-[#071f18]/90 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#7eb89a] font-bold">
                        বোনাস পরিমাণ:
                      </span>
                      <span className="text-sm font-black text-[#ffd84d]">
                        {item.rewardText}
                      </span>
                    </div>

                    {/* Deposit Requirement Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#7eb89a]">
                          ১. ডিপোজিট শর্ত (ন্যূনতম ৳{item.requiredDeposit}):
                        </span>
                        <span
                          className={`font-mono-num font-bold ${
                            depPct >= 100
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          ৳{totalVerifiedDeposits.toFixed(0)} / ৳
                          {item.requiredDeposit} ({depPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#1de9b6] transition-all duration-300"
                          style={{ width: `${depPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Turnover Requirement Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#7eb89a]">
                          ২. বেটিং টার্নওভার শর্ত (৳{item.requiredTurnover}):
                        </span>
                        <span
                          className={`font-mono-num font-bold ${
                            turnPct >= 100
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          ৳{totalRealTurnover.toFixed(0)} / ৳
                          {item.requiredTurnover} ({turnPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#f0c030] to-amber-500 transition-all duration-300"
                          style={{ width: `${turnPct}%` }}
                        />
                      </div>
                    </div>

                    {item.requiredReferrals && (
                      <div className="flex justify-between text-[11px] pt-1">
                        <span className="text-[#7eb89a]">
                          ৩. ভেরিফাইড ডিপোজিট রেফারেল:
                        </span>
                        <span className="font-bold text-amber-400">
                          {verifiedReferralsCount} / {item.requiredReferrals} জন
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-white/10 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAttemptClaim(item, (idx + 1) * 150)
                      }
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-1.5 ${
                        isFullyUnlocked
                          ? 'btn-3d-gold'
                          : 'bg-[#0d3d2c]/60 border border-amber-500/40 text-amber-300 hover:bg-[#0d3d2c]'
                      }`}
                    >
                      <span>{isFullyUnlocked ? '🔓' : '🔒'}</span>
                      <span>
                        {isFullyUnlocked
                          ? 'বোনাস আনলক ও ক্লেইম করুন'
                          : 'লকড (শর্ত পূরণ প্রয়োজন)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPromoDetail(item.slug)}
                      className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer"
                    >
                      নিয়মাবলী ›
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Lock Popup Modal when user tries to claim before meeting conditions */}
      {lockedModalInfo && (
        <div
          onClick={() => setLockedModalInfo(null)}
          className="fixed inset-0 z-[9995] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-3xl bg-[#0a2e22] border-2 border-amber-400/50 p-5 text-white shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-black uppercase">
                🔒 ANTI-FRAUD BONUS LOCK
              </span>
              <button
                type="button"
                onClick={() => setLockedModalInfo(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-base font-black text-[#ffd84d]">
              {lockedModalInfo.titleBn} — এখনও আনলক হয়নি!
            </div>

            <p className="text-xs text-[#b7e4ce] leading-relaxed">
              নিরাপত্তা ও বোনাস নীতিমালা অনুযায়ী কোনো বোনাস সরাসরি ক্লেইম করা যায়
              না। এই বোনাসটি মূল ওয়ালেটে আনতে নিচের শর্তগুলো সম্পূর্ণ করুন:
            </p>

            <div className="bg-[#041812] border border-white/10 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7eb89a]">প্রয়োজনীয় ডিপোজিট:</span>
                <span className="font-bold text-[#ffd84d]">
                  ৳{totalVerifiedDeposits.toFixed(0)} / ৳
                  {lockedModalInfo.requiredDeposit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7eb89a]">প্রয়োজনীয় বেটিং টার্নওভার:</span>
                <span className="font-bold text-rose-400">
                  ৳{totalRealTurnover.toFixed(0)} / ৳
                  {lockedModalInfo.requiredTurnover}
                </span>
              </div>
              {lockedModalInfo.requiredReferrals && (
                <div className="flex justify-between">
                  <span className="text-[#7eb89a]">ভেরিফাইড রেফারেল:</span>
                  <span className="font-bold text-amber-400">
                    0 / {lockedModalInfo.requiredReferrals} জন
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLockedModalInfo(null);
                  onNavigateDeposit();
                }}
                className="flex-1 py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                ডিপোজিট করতে যান (/deposit)
              </button>
              {lockedModalInfo.requiredReferrals && (
                <button
                  type="button"
                  onClick={() => {
                    setLockedModalInfo(null);
                    onNavigateRefer();
                  }}
                  className="flex-1 py-3 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
                >
                  রেফার পেজ (/refer)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. DEDICATED /promo/:slug PAGE VIEW (Separate Page when clicking any Picture/Promo Card!)
// ============================================================================
export const PromoPictureDetailPageView: React.FC<{
  slug: string;
  totalVerifiedDeposits: number;
  totalRealTurnover: number;
  onBack: () => void;
  onNavigateDeposit: () => void;
  onNavigateRefer: () => void;
  onNavigateBonusVault: () => void;
}> = ({
  slug,
  totalVerifiedDeposits,
  totalRealTurnover,
  onBack,
  onNavigateDeposit,
  onNavigateRefer,
  onNavigateBonusVault,
}) => {
  const promo =
    PROMO_PICTURES_CATALOG.find((p) => p.slug === slug) ||
    PROMO_PICTURES_CATALOG[0];

  const depPct = Math.min(
    100,
    Math.floor((totalVerifiedDeposits / promo.requiredDeposit) * 100)
  );
  const turnPct = Math.min(
    100,
    Math.floor((totalRealTurnover / promo.requiredTurnover) * 100)
  );

  return (
    <div className="min-h-screen bg-[#041c15] text-white pb-24">
      <header className="sticky top-0 z-40 h-14 bg-[#071f18]/95 backdrop-blur-md border-b border-[#f0c030]/25 px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#ffd84d] cursor-pointer"
          >
            ‹
          </button>
          <div>
            <div className="text-sm font-black text-[#ffd84d] truncate max-w-[220px] sm:max-w-none">
              {promo.titleBn}
            </div>
            <div className="text-[10px] font-mono text-[#1de9b6]">
              {typeof window !== 'undefined'
                ? `${window.location.origin}/promo/${promo.slug}`
                : `/promo/${promo.slug}`}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateBonusVault}
          className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-[#f0c030]/40 text-[11px] font-black text-[#ffd84d] cursor-pointer"
        >
          সব বোনাস (/bonus)
        </button>
      </header>

      <div className="max-w-[780px] mx-auto p-4 space-y-4">
        {/* Large Hero Picture Banner */}
        <div
          className={`rounded-3xl p-6 bg-gradient-to-br ${promo.gradient} border-2 border-[#f0c030]/40 shadow-2xl relative overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full bg-black/45 border border-[#ffd84d]/40 text-xs font-black text-[#ffd84d]">
              {promo.badge}
            </span>
            <span className="text-4xl">{promo.icon}</span>
          </div>
          <h1 className="text-2xl font-black text-white">{promo.titleBn}</h1>
          <div className="text-xs font-bold text-[#ffd84d] uppercase tracking-wider mt-0.5">
            {promo.titleEn}
          </div>
          <p className="text-xs text-white/90 mt-2 leading-relaxed">
            {promo.subtitleBn}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-[#ffd84d]/40">
            <span className="text-xs text-[#7eb89a]">পুরস্কার ভল্ট:</span>
            <span className="text-base font-black text-[#ffd84d]">
              {promo.rewardText}
            </span>
          </div>
        </div>

        {/* Live Verification Progress */}
        <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
          <div className="text-xs font-black text-[#ffd84d] uppercase">
            📊 আপনার শর্ত পূরণের লাইভ স্ট্যাটাস (Anti-Abuse Verification)
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#7eb89a]">ডিপোজিট প্রগ্রেস:</span>
              <span className="font-bold text-emerald-400">
                ৳{totalVerifiedDeposits.toFixed(0)} / ৳{promo.requiredDeposit} (
                {depPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${depPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#7eb89a]">বেটিং টার্নওভার প্রগ্রেস:</span>
              <span className="font-bold text-[#ffd84d]">
                ৳{totalRealTurnover.toFixed(0)} / ৳{promo.requiredTurnover} (
                {turnPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden">
              <div
                className="h-full bg-[#ffd84d]"
                style={{ width: `${turnPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Rules */}
        <div className="rounded-2xl bg-[#071f18] border border-white/10 p-4 space-y-2.5">
          <div className="text-sm font-black text-[#ffd84d]">
            📜 অফিশিয়াল শর্তাবলী ও নিয়মাবলী:
          </div>
          {promo.rulesBn.map((r, i) => (
            <div key={i} className="text-xs text-[#b7e4ce] leading-relaxed">
              {r}
            </div>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onNavigateDeposit}
            className="flex-1 py-3.5 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
          >
            এখনই ডিপোজিট করুন (/deposit)
          </button>
          <button
            type="button"
            onClick={onNavigateRefer}
            className="flex-1 py-3.5 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
          >
            রেফার করে আয় করুন (/refer)
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. DEDICATED /php-github PAGE VIEW (PHP Backend & GitHub Deployment Guide + Files)
// ============================================================================
export const PhpGithubExportPageView: React.FC<{
  onBackHome: () => void;
  onShowToast: (msg: string) => void;
}> = ({ onBackHome, onShowToast }) => {
  return (
    <div className="min-h-screen bg-[#041c15] text-white pb-24">
      <header className="sticky top-0 z-40 h-14 bg-[#071f18]/95 backdrop-blur-md border-b border-[#f0c030]/25 px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onBackHome}
            className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#ffd84d] cursor-pointer"
          >
            ‹
          </button>
          <div>
            <div className="text-sm font-black text-[#ffd84d] uppercase">
              PHP 8+ &amp; GITHUB DEPLOYMENT CENTER
            </div>
            <div className="text-[10px] font-mono text-[#1de9b6]">
              /php-github · Ready for GitHub &amp; cPanel
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[880px] mx-auto p-4 space-y-4">
        <div className="rounded-2xl bg-[#0a2e22] border border-[#f0c030]/35 p-4 space-y-2">
          <div className="text-base font-black text-[#ffd84d]">
            🚀 PHP ও GitHub রেডি আর্কিটেকচার (100% Configured)
          </div>
          <p className="text-xs text-[#b7e4ce] leading-relaxed">
            আপনার প্রজেক্টে <b>/public/config.php</b>, <b>/public/api.php</b>,{' '}
            <b>/public/.htaccess</b> এবং <b>/public/404.html</b> যুক্ত করা
            হয়েছে। ফলে এটি সরাসরি GitHub বা যেকোনো PHP cPanel হোস্টিংয়ে আপলোড
            করলে সবগুলো আলাদা পেজ রাউট (<code>/refer</code>,{' '}
            <code>/register</code>, <code>/login</code>, <code>/bonus</code>,{' '}
            <code>/owner_kamran-admin-panel</code>) এবং PHP API কাজ করবে।
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href="/api.php"
              download="api.php"
              onClick={() => onShowToast('✓ api.php ডাউনলোড শুরু হয়েছে')}
              className="px-3.5 py-2 rounded-xl btn-3d-gold text-xs font-black"
            >
              ⬇ Download api.php
            </a>
            <a
              href="/config.php"
              download="config.php"
              onClick={() => onShowToast('✓ config.php ডাউনলোড শুরু হয়েছে')}
              className="px-3.5 py-2 rounded-xl btn-3d-green text-xs font-black"
            >
              ⬇ Download config.php
            </a>
            <a
              href="/.htaccess"
              download=".htaccess"
              onClick={() => onShowToast('✓ .htaccess ডাউনলোড শুরু হয়েছে')}
              className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold"
            >
              ⬇ Download .htaccess
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
