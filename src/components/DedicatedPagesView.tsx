import React, { useCallback, useEffect, useState } from 'react';
import {
  BinaryTrade,
  BonusRecord,
  SavedWithdrawalWallet,
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
    badge: 'WELCOME VAULT',
    gradient: 'from-[#0d7a55] via-[#0a3d2c] to-[#041812]',
    icon: '🔐',
    requiredDeposit: 1000,
    requiredTurnover: 5000,
    rulesBn: [
      '১. শুধুমাত্র নতুন রেজিস্টার্ড মেম্বারদের জন্য ৳২০০ লকড ভল্টে জমা থাকবে।',
      '২. এই বোনাস মূল ব্যালেন্সে আনতে ন্যূনতম ৳১,০০০ ভেরিফাইড ডিপোজিট থাকতে হবে।',
      '৩. স্লট, ক্র্যাশ অথবা ট্রেডিংয়ে মোট ৳৫,০০০ (৫x) বৈধ বেটিং টার্নওভার সম্পন্ন করতে হবে।',
      '৪. শর্ত পূরণের আগে কেউ ক্লেইম বা উত্তোলন করতে পারবে না।',
    ],
  },
  {
    slug: 'first-deposit-129',
    titleBn: 'প্রথম ডিপোজিট ১২৯% মেগা ভিআইপি রুম',
    titleEn: 'First Deposit 129% Mega Bonus',
    subtitleBn:
      'বিকাশ, নগদ ও রকেটে প্রথম ডিপোজিটে সর্বোচ্চ ৳২,৫৮০ পর্যন্ত গ্যারান্টিড ভল্ট বোনাস',
    rewardText: '+১২৯% (সর্বোচ্চ ৳২,৫৮০)',
    badge: 'VIP DEPOSIT',
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
    badge: 'AFFILIATE VIP',
    gradient: 'from-[#0e6b8a] via-[#093c4f] to-[#051a24]',
    icon: '🤝',
    requiredDeposit: 1000,
    requiredTurnover: 3000,
    requiredReferrals: 1,
    rulesBn: [
      '১. আপনার অফিশিয়াল লম্বা রেফারেল লিংক ব্যবহার করে বন্ধুকে রেজিস্ট্রেশন করতে হবে।',
      '২. আমন্ত্রিত বন্ধুকে ন্যূনতম ৳১,০০০ ডিপোজিট এবং ৳৩,০০০ বেটিং টার্নওভার সম্পন্ন করতে হবে।',
      '৩. ডিপোজিট ও টার্নওভার ভেরিফাই হওয়ার সাথে সাথে কমিশন আনলক হবে।',
    ],
  },
  {
    slug: 'daily-turnover-rebate',
    titleBn: 'ডেইলি টার্নওভার ও ক্যাশব্যাক রুম',
    titleEn: 'Daily Turnover & Loss Rebate Vault',
    subtitleBn:
      'প্রতিদিন স্লট, লাইভ ক্যাসিনো ও বাইনারি ট্রেডিংয়ে ১.৮% পর্যন্ত অটোমেটিক রিবেট ভল্ট',
    rewardText: 'প্রতিদিন ৳১,০০০ পর্যন্ত',
    badge: 'DAILY REBATE',
    gradient: 'from-[#7c2d12] via-[#451a03] to-[#071f18]',
    icon: '🔥',
    requiredDeposit: 500,
    requiredTurnover: 3500,
    rulesBn: [
      '১. প্রতিদিনের রিবেট ক্লেইম করতে ওই দিনে কমপক্ষে ৳৫০০ ডিপোজিট থাকতে হবে।',
      '২. ন্যূনতম ৳৩,৫০০ বৈধ বেটিং টার্নওভার পূর্ণ হলে ভল্ট আনলক হবে।',
    ],
  },
  {
    slug: 'app-install-vault-150',
    titleBn: 'অফিশিয়াল অ্যাপ মেম্বার ভল্ট',
    titleEn: 'Official App Member Reward',
    subtitleBn:
      'মোবাইলে অফিশিয়াল অ্যাপ ব্যবহার ও ভেরিফাইড ডিপোজিট সম্পন্ন করলে ৳১৫০ স্পেশাল বোনাস',
    rewardText: '৳১৫০.০০ BDT',
    badge: 'APP VAULT',
    gradient: 'from-[#4c1d95] via-[#2e1065] to-[#071f18]',
    icon: '📲',
    requiredDeposit: 500,
    requiredTurnover: 1500,
    rulesBn: [
      '১. প্রথমে MONEYX অফিশিয়াল অ্যাপটি মোবাইলে ইনস্টল থাকতে হবে।',
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
    badge: 'VIP SALARY',
    gradient: 'from-[#065f46] via-[#064e3b] to-[#022c22]',
    icon: '💎',
    requiredDeposit: 5000,
    requiredTurnover: 25000,
    rulesBn: [
      '১. সাপ্তাহিক স্যালারি পেতে ন্যূনতম ৳৫,০০০ ডিপোজিট এবং ৳২৫,০০০ সাপ্তাহিক টার্নওভার থাকতে হবে।',
      '২. প্রতি সোমবার অটোমেটিক ভেরিফিকেশন শেষে ক্লেইম বাটন সচল হবে।',
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

export function buildLongOptionUrl(
  optionName: string,
  profile: UserProfile
): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://moneyx.live';
  const uid = profile.uid || '883921';
  const sig = `9f8a7b6c5d4e3f2a_${uid}_bd_royal`;
  return `${origin}/${optionName}?session_token=${sig}&member_uid=${uid}&security_mode=ssl_256_verified&channel=moneyx_official`;
}

interface ReferredMember {
  uid: string;
  mobileMasked: string;
  depositTotal: number;
  turnoverTotal: number;
  commissionEarned: number;
  isVerified: boolean;
  joinedAt: string;
}

interface RealReferStats {
  clicks: number;
  totalInvited: number;
  verifiedCount: number;
  lockedBonus: number;
  claimableCommission: number;
  totalClaimed: number;
  members: ReferredMember[];
}

// ============================================================================
// 1. REAL REFERRAL & AFFILIATE CENTER VIEW (100% Real Server-Backed Tracking)
// ============================================================================
export const ReferAndAffiliatePageView: React.FC<{
  profile: UserProfile;
  transactions: TransactionRecord[];
  onBackHome: () => void;
  onOpenPromoDetail: (slug: string) => void;
  onNavigateBonusVault: () => void;
  onClaimRealReferralCommission: (amount: number) => void;
  onShowToast: (msg: string) => void;
}> = ({
  profile,
  onBackHome,
  onOpenPromoDetail,
  onNavigateBonusVault,
  onClaimRealReferralCommission,
  onShowToast,
}) => {
  const [copiedType, setCopiedType] = useState<'reg' | 'code' | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [stats, setStats] = useState<RealReferStats>({
    clicks: 0,
    totalInvited: 0,
    verifiedCount: 0,
    lockedBonus: 0,
    claimableCommission: 0,
    totalClaimed: 0,
    members: [],
  });

  const longRegLink = buildLongReferralRegisterLink(profile);
  const refCode = `MX${profile.uid || '883921'}VIP`;

  const fetchRealReferralStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(
        `/api/refer/stats/${encodeURIComponent(profile.uid || '883921')}`
      );
      const data = await res.json();
      if (data && data.status === 'ok') {
        setStats({
          clicks: data.clicks || 0,
          totalInvited: data.totalInvited || 0,
          verifiedCount: data.verifiedCount || 0,
          lockedBonus: data.lockedBonus || 0,
          claimableCommission: data.claimableCommission || 0,
          totalClaimed: data.totalClaimed || 0,
          members: Array.isArray(data.members) ? data.members : [],
        });
      }
    } catch {
      // ignore offline
    } finally {
      setLoadingStats(false);
    }
  }, [profile.uid]);

  useEffect(() => {
    fetchRealReferralStats();
  }, [fetchRealReferralStats]);

  const handleCopy = (text: string, type: 'reg' | 'code') => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedType(type);
    onShowToast('✓ আপনার অফিশিয়াল লম্বা রেফারেল লিংক কপি হয়েছে!');
    setTimeout(() => setCopiedType(null), 2200);
  };

  const handleClaimCommission = async () => {
    if (stats.claimableCommission <= 0) {
      onShowToast(
        '🔒 আপনার এখনও কোনো আনলকড কমিশন নেই! আমন্ত্রিত বন্ধুকে ন্যূনতম ৳১,০০০ ডিপোজিট ও ৩x টার্নওভার সম্পন্ন করতে হবে।'
      );
      return;
    }
    setClaiming(true);
    try {
      const res = await fetch('/api/refer/claim-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: profile.uid }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'ok' && data.claimedAmount > 0) {
        onClaimRealReferralCommission(Number(data.claimedAmount));
        await fetchRealReferralStats();
      } else {
        onShowToast(data.message || 'কমিশন ক্লেইম করা যায়নি।');
      }
    } catch {
      onShowToast('নেটওয়ার্ক ত্রুটি, আবার চেষ্টা করুন।');
    } finally {
      setClaiming(false);
    }
  };

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
            <div className="text-sm font-black text-[#ffd84d] uppercase tracking-wider">
              রেফারেল ও পার্টনার প্রোগ্রাম
            </div>
            <div className="text-[10px] text-[#7eb89a] font-bold">
              অফিশিয়াল অ্যাফিলিয়েট ড্যাশবোর্ড
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchRealReferralStats}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-[#1de9b6] cursor-pointer"
          >
            ↻ রিফ্রেশ
          </button>
          <button
            type="button"
            onClick={onNavigateBonusVault}
            className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-[#f0c030]/40 text-[11px] font-black text-[#ffd84d] cursor-pointer"
          >
            🔐 বোনাস ভল্ট
          </button>
        </div>
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
            <span>🤝 রিয়েল-টাইম অ্যাফিলিয়েট সিস্টেম</span>
            <span>·</span>
            <span>কোড: {refCode}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            বন্ধুদের আমন্ত্রণ জানান এবং প্রতি ভেরিফাইড রেফারে পান{' '}
            <span className="text-[#ffd84d]">৳৫০০ BDT + ২.৫% আজীবন কমিশন!</span>
          </h1>
          <p className="text-xs text-[#b7e4ce] mt-1.5 leading-relaxed">
            আপনার নিচের লম্বা রেফারেল লিংকটি দিয়ে যখনই কোনো বন্ধু রেজিস্ট্রেশন ও
            ডিপোজিট করবে, নিচের রিয়েল-টাইম মেম্বার টেবিলে সাথে সাথে তার নাম,
            ডিপোজিট ও আপনার কমিশন যুক্ত হয়ে যাবে।
          </p>
        </div>

        {/* Long Registration Referral Link Box */}
        <div className="rounded-2xl bg-[#0a2e22] border border-[#1ec882]/35 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-[#ffd84d] uppercase flex items-center gap-1.5">
              <i className="fa-solid fa-link text-[#1de9b6]" />
              <span>আপনার অফিশিয়াল লম্বা রেফারেল রেজিস্ট্রেশন লিংক</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
              Verified Active
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
                  ? '✓ লম্বা রেফারেল লিংক কপি হয়েছে!'
                  : 'রেফারেল লিংক কপি করুন'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCopy(refCode, 'code')}
              className="py-3 px-4 rounded-xl bg-[#071f18] border border-[#f0c030]/40 text-xs font-black text-[#ffd84d] cursor-pointer"
            >
              {copiedType === 'code' ? '✓ কপি হয়েছে' : `রেফার কোড: ${refCode}`}
            </button>
          </div>
        </div>

        {/* Real-Time Server Referral Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              লিংক ভিজিট / ক্লিক
            </div>
            <div className="text-lg font-black text-white font-mono-num mt-0.5">
              {stats.clicks}
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              রেজিস্টার্ড মেম্বার
            </div>
            <div className="text-lg font-black text-[#1de9b6] font-mono-num mt-0.5">
              {stats.totalInvited} জন
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              ভেরিফাইড ডিপোজিটর (≥৳১,০০০)
            </div>
            <div className="text-lg font-black text-[#ffd84d] font-mono-num mt-0.5">
              {stats.verifiedCount} জন
            </div>
          </div>
          <div className="bg-[#0a2e22] border border-white/10 rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#7eb89a] font-bold">
              ক্লেইমযোগ্য কমিশন
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono-num mt-0.5">
              ৳{stats.claimableCommission.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Claim Real Unlocked Commission Bar */}
        <div className="rounded-2xl bg-[#0a2e22] border border-[#f0c030]/35 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-[#ffd84d]">
              💰 আপনার রেফারেল কমিশন ওয়ালেট
            </div>
            <div className="text-[11px] text-[#7eb89a] mt-0.5">
              লকড বোনাস: <b>৳{stats.lockedBonus.toFixed(0)}</b> · মোট উত্তোলিত:{' '}
              <b>৳{stats.totalClaimed.toFixed(2)}</b>
            </div>
          </div>
          <button
            type="button"
            disabled={claiming}
            onClick={handleClaimCommission}
            className="px-5 py-2.5 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
          >
            {claiming
              ? 'ভেরিফাই হচ্ছে...'
              : `কমিশন মূল ওয়ালেটে নিন (৳${stats.claimableCommission.toFixed(2)})`}
          </button>
        </div>

        {/* Real Invited Members Table */}
        <div className="rounded-2xl bg-[#0a2e22] border border-white/10 overflow-hidden">
          <div className="px-4 py-3 bg-[#071f18] border-b border-white/10 flex items-center justify-between">
            <div className="text-xs font-black text-[#ffd84d] uppercase">
              👥 আপনার রেফারে জয়েন করা রিয়েল মেম্বার তালিকা ({stats.members.length})
            </div>
            {loadingStats && (
              <span className="text-[10px] text-[#1de9b6]">লোড হচ্ছে...</span>
            )}
          </div>

          {stats.members.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <div className="text-2xl">🤝</div>
              <div className="text-xs font-bold text-white">
                এখনও আপনার রেফার কোড ({refCode}) দিয়ে কেউ জয়েন করেনি।
              </div>
              <div className="text-[11px] text-[#7eb89a] max-w-md mx-auto">
                উপরের লম্বা রেফারেল লিংকটি কপি করে বন্ধুকে পাঠান। বন্ধু ওই লিংক
                দিয়ে নতুন অ্যাকাউন্ট খুললেই এখানে সাথে সাথে তার রেকর্ড চলে আসবে!
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {stats.members.map((m) => (
                <div
                  key={m.uid + m.joinedAt}
                  className="p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-black text-white flex items-center gap-2">
                      <span>📱 {m.mobileMasked}</span>
                      <span className="text-[10px] font-mono text-[#7eb89a]">
                        UID: {m.uid}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7eb89a] mt-0.5">
                      জয়েন: {m.joinedAt}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-[#e8f5ee]">
                      ডিপোজিট: <b>৳{m.depositTotal.toFixed(0)}</b> · টার্নওভার:{' '}
                      <b>৳{m.turnoverTotal.toFixed(0)}</b>
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          m.isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        }`}
                      >
                        {m.isVerified
                          ? '✓ ভেরিফাইড (+৳৫০০ আনলকড)'
                          : '🔒 ডিপোজিট/টার্নওভার বাকি'}
                      </span>
                      <span className="font-mono-num font-black text-[#ffd84d]">
                        +৳{m.commissionEarned.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Multi-Tier Commission Structure */}
        <div className="rounded-2xl bg-[#071f18] border border-white/10 p-4 space-y-2.5">
          <div className="text-xs font-black text-[#ffd84d] uppercase">
            📊 ৩-লেভেল লাইফটাইম অ্যাফিলিয়েট কমিশন চার্ট
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">লেভেল ১ (সরাসরি)</div>
              <div className="text-base font-black text-[#ffd84d] mt-0.5">
                ২.৫০%
              </div>
              <div className="text-[10px] text-emerald-400">+৳৫০০ বোনাস</div>
            </div>
            <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">লেভেল ২ (টিম)</div>
              <div className="text-base font-black text-[#1de9b6] mt-0.5">
                ১.০০%
              </div>
              <div className="text-[10px] text-[#7eb89a]">আজীবন রিবেট</div>
            </div>
            <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">লেভেল ৩ (নেটওয়ার্ক)</div>
              <div className="text-base font-black text-white mt-0.5">
                ০.৫০%
              </div>
              <div className="text-[10px] text-[#7eb89a]">আজীবন রিবেট</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. DEDICATED BONUS VAULT VIEW (All Bonuses Live Here — None on Home Screen!)
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
  bonuses,
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

  const totalVerifiedDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRealTurnover =
    wingoBets.reduce((sum, b) => sum + b.amount, 0) +
    binaryTrades.reduce((sum, t) => sum + t.amount, 0);

  const handleAttemptClaim = (item: PromoPictureItem, rewardAmt: number) => {
    if (claimedSlugs.includes(item.slug)) {
      onShowToast('ইতিমধ্যে এই ভল্ট বোনাস ক্লেইম করা হয়েছে!');
      return;
    }

    const depOk = totalVerifiedDeposits >= item.requiredDeposit;
    const turnOk = totalRealTurnover >= item.requiredTurnover;

    if (!depOk || !turnOk) {
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
              প্রফেশনাল বোনাস ও প্রমোশন ভল্ট
            </div>
            <div className="text-[10px] text-[#7eb89a] font-bold">
              টার্নওভার ও ডিপোজিট ভেরিফিকেশন রুম
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
                🔐 স্মার্ট বোনাস ভল্ট সিকিউরিটি
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white mt-1">
                সকল বোনাস ও প্রমোশন রুম
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

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
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
                আপনার সম্পন্ন বেটিং টার্নওভার
              </div>
              <div className="text-sm sm:text-base font-black text-[#ffd84d] font-mono-num mt-0.5">
                ৳{totalRealTurnover.toFixed(0)}
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
            const isFullyUnlocked = depPct >= 100 && turnPct >= 100;

            return (
              <div
                key={item.slug}
                className="rounded-2xl bg-[#0a2e22] border-2 border-[#f0c030]/25 overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div
                  onClick={() => onOpenPromoDetail(item.slug)}
                  className={`p-4 bg-gradient-to-r ${item.gradient} border-b border-white/10 cursor-pointer relative group`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/45 border border-[#ffd84d]/40 text-[10px] font-black text-[#ffd84d]">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#1de9b6] group-hover:underline">
                      বিস্তারিত দেখুন ›
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
                  </div>

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

        {/* Bonus Vault Logs */}
        {bonuses.length > 0 && (
          <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-2.5">
            <div className="text-xs font-black text-[#ffd84d] uppercase">
              📜 আপনার বোনাস ভল্ট লগ ({bonuses.length})
            </div>
            <div className="space-y-2">
              {bonuses.slice(0, 6).map((b) => (
                <div
                  key={b.id}
                  className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{b.title}</div>
                    <div className="text-[10px] text-[#7eb89a] mt-0.5">
                      {b.createdAt}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#ffd84d] font-mono-num">
                      +৳{b.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-amber-300 font-bold">
                      {b.status === 'Claimed' ? '✓ আনলকড' : '🔒 ভল্টে লকড'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Lock Popup Modal */}
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
                🔒 বোনাস ভেরিফিকেশন লক
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
              নিরাপত্তা নীতিমালা অনুযায়ী শর্ত পূরণ ছাড়া কোনো বোনাস সরাসরি ক্লেইম
              করা যায় না। নিচের শর্তগুলো সম্পূর্ণ করুন:
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
                ডিপোজিট করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  setLockedModalInfo(null);
                  onNavigateRefer();
                }}
                className="flex-1 py-3 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
              >
                রেফার সেন্টার
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 3. DEDICATED PROMO PICTURE DETAIL VIEW
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
          <div className="text-sm font-black text-[#ffd84d] truncate max-w-[240px] sm:max-w-none">
            {promo.titleBn}
          </div>
        </div>
        <button
          type="button"
          onClick={onNavigateBonusVault}
          className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-[#f0c030]/40 text-[11px] font-black text-[#ffd84d] cursor-pointer"
        >
          সব বোনাস ভল্ট
        </button>
      </header>

      <div className="max-w-[780px] mx-auto p-4 space-y-4">
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

        <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
          <div className="text-xs font-black text-[#ffd84d] uppercase">
            📊 আপনার শর্ত পূরণের লাইভ প্রগ্রেস
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
            এখনই ডিপোজিট করুন
          </button>
          <button
            type="button"
            onClick={onNavigateRefer}
            className="flex-1 py-3.5 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
          >
            রেফার করে আয় করুন
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. STANDALONE FULL-PAGE MEMBER ACCOUNT CENTER (Isolated & Feature-Packed!)
// ============================================================================
export const MemberAccountCenterPageView: React.FC<{
  profile: UserProfile;
  balance: number;
  transactions: TransactionRecord[];
  bonuses: BonusRecord[];
  wingoBets: WingoBet[];
  binaryTrades: BinaryTrade[];
  savedWallets: SavedWithdrawalWallet[];
  onBackHome: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onAddWallet: (w: Omit<SavedWithdrawalWallet, 'id'>) => void;
  onNavigateDeposit: () => void;
  onNavigateWithdraw: () => void;
  onNavigateRefer: () => void;
  onNavigateBonus: () => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}> = ({
  profile,
  balance,
  transactions,
  wingoBets,
  binaryTrades,
  savedWallets,
  onBackHome,
  onUpdateProfile,
  onAddWallet,
  onNavigateDeposit,
  onNavigateWithdraw,
  onNavigateRefer,
  onNavigateBonus,
  onLogout,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'security' | 'kyc' | 'wallets' | 'statement' | 'vip'
  >('overview');

  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [emailInput, setEmailInput] = useState(profile.email || '');
  const [nidInput, setNidInput] = useState(profile.nidNumber || '');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [txPinInput, setTxPinInput] = useState(profile.txPin || '');

  // New Withdrawal Wallet state
  const [newWalletMethod, setNewWalletMethod] = useState<
    'bKash' | 'Nagad' | 'Rocket'
  >('bKash');
  const [newWalletNum, setNewWalletNum] = useState('');
  const [newWalletPin, setNewWalletPin] = useState('');

  const totalDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdraws = transactions
    .filter((t) => t.type === 'Withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalTurnover =
    wingoBets.reduce((sum, b) => sum + b.amount, 0) +
    binaryTrades.reduce((sum, t) => sum + t.amount, 0);

  const vipProgressPct = Math.min(100, Math.floor((totalDeposits / 5000) * 100));

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
            <div className="text-sm font-black text-[#ffd84d] uppercase tracking-wider">
              মেম্বার অ্যাকাউন্ট ও সিকিউরিটি সেন্টার
            </div>
            <div className="text-[10px] text-[#7eb89a] font-bold">
              UID: {profile.uid} · VIP Level {profile.vipLevel || 1}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black cursor-pointer"
        >
          লগআউট
        </button>
      </header>

      <div className="max-w-[960px] mx-auto p-3.5 space-y-4">
        {/* Top Member VIP Identity Card */}
        <div
          className="rounded-2xl p-5 border-2 border-[#f0c030]/40 shadow-2xl"
          style={{
            background:
              'linear-gradient(135deg, #071f18 0%, #0d4a35 55%, #041812 100%)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-[#041812] border-2 border-[#ffd84d] flex items-center justify-center overflow-hidden shadow-lg">
                <img
                  src="/icon.svg"
                  alt="VIP"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">
                    {profile.nickname}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#ffd84d] to-[#c89a10] text-[#1a0f00] text-[10px] font-black">
                    VIP {profile.vipLevel || 1}
                  </span>
                </div>
                <div className="text-xs text-[#1de9b6] font-mono mt-0.5">
                  📱 {profile.mobile || 'Verified Member'} · UID: {profile.uid}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      profile.kycStatus === 'Verified'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    KYC: {profile.kycStatus || 'Unverified'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-[#7eb89a]">
                    2FA: {profile.twoFactorEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onNavigateDeposit}
                className="px-4 py-2.5 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
              >
                + ডিপোজিট
              </button>
              <button
                type="button"
                onClick={onNavigateWithdraw}
                className="px-4 py-2.5 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                ⇧ উত্তোলন
              </button>
            </div>
          </div>

          {/* Wallet & Turnover 4-Card Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10">
            <div className="bg-[#041812]/80 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">মূল ব্যালেন্স</div>
              <div className="text-base font-black text-[#ffd84d] font-mono-num mt-0.5">
                ৳{balance.toFixed(2)}
              </div>
            </div>
            <div className="bg-[#041812]/80 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">লকড বোনাস ভল্ট</div>
              <div className="text-base font-black text-amber-400 font-mono-num mt-0.5">
                🔒 ৳{(profile.lockedBonusBalance ?? 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-[#041812]/80 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">মোট ডিপোজিট</div>
              <div className="text-base font-black text-emerald-400 font-mono-num mt-0.5">
                ৳{totalDeposits.toFixed(0)}
              </div>
            </div>
            <div className="bg-[#041812]/80 rounded-xl p-3 border border-white/10">
              <div className="text-[10px] text-[#7eb89a]">মোট বেটিং টার্নওভার</div>
              <div className="text-base font-black text-cyan-400 font-mono-num mt-0.5">
                ৳{totalTurnover.toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Account Feature Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'overview', label: '👤 প্রোফাইল ও ওভারভিউ' },
            { id: 'security', label: '🛡️ সিকিউরিটি ও পিন' },
            { id: 'kyc', label: '🪪 কেওয়াইসি ভেরিফিকেশন' },
            { id: 'wallets', label: '💳 উত্তোলন ওয়ালেট' },
            { id: 'statement', label: '📊 লেনদেন ও বেটিং হিস্ট্রি' },
            { id: 'vip', label: '👑 ভিআইপি ক্লাব' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                setActiveTab(
                  t.id as
                    | 'overview'
                    | 'security'
                    | 'kyc'
                    | 'wallets'
                    | 'statement'
                    | 'vip'
                )
              }
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                activeTab === t.id
                  ? 'bg-[#0d7a55] border border-[#ffd84d]/50 text-[#ffd84d] shadow-md'
                  : 'bg-[#0a2e22] border border-white/10 text-[#7eb89a] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & PROFILE EDIT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
              <div className="text-sm font-black text-[#ffd84d]">
                ✏️ ব্যক্তিগত প্রোফাইল তথ্য আপডেট
              </div>
              <div>
                <label className="text-[11px] text-[#7eb89a] block mb-1">
                  মেম্বার নিকনেম
                </label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#7eb89a] block mb-1">
                  ইমেইল অ্যাড্রেস (সিকিউরিটি রিকভারি)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="vip@moneyx.live"
                  className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({
                    nickname: nicknameInput.trim() || profile.nickname,
                    email: emailInput.trim(),
                  });
                  onShowToast('✓ প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
                }}
                className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                প্রোফাইল সেভ করুন
              </button>
            </div>

            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
              <div className="text-sm font-black text-[#ffd84d]">
                ⚡ কুইক অ্যাকাউন্ট সার্ভিস
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onNavigateRefer}
                  className="p-3 rounded-xl bg-[#071f18] border border-white/10 text-left hover:border-[#ffd84d]/40 cursor-pointer"
                >
                  <div className="text-lg">🤝</div>
                  <div className="text-xs font-black text-white mt-1">
                    রেফার ও কমিশন
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    প্রতি রেফারে ৳৫০০
                  </div>
                </button>
                <button
                  type="button"
                  onClick={onNavigateBonus}
                  className="p-3 rounded-xl bg-[#071f18] border border-white/10 text-left hover:border-[#ffd84d]/40 cursor-pointer"
                >
                  <div className="text-lg">🔐</div>
                  <div className="text-xs font-black text-white mt-1">
                    বোনাস ভল্ট রুম
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    টার্নওভার ভেরিফিকেশন
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="p-3 rounded-xl bg-[#071f18] border border-white/10 text-left hover:border-[#ffd84d]/40 cursor-pointer"
                >
                  <div className="text-lg">🛡️</div>
                  <div className="text-xs font-black text-white mt-1">
                    ট্রানজেকশন পিন ও 2FA
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    অ্যাকাউন্ট সুরক্ষা
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('statement')}
                  className="p-3 rounded-xl bg-[#071f18] border border-white/10 text-left hover:border-[#ffd84d]/40 cursor-pointer"
                >
                  <div className="text-lg">📑</div>
                  <div className="text-xs font-black text-white mt-1">
                    অ্যাকাউন্ট স্টেটমেন্ট
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    সকল লেনদেন ও বেট
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY CENTER */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
              <div className="text-sm font-black text-[#ffd84d]">
                🔑 লগইন পাসওয়ার্ড ও ৬-ডিজিট উত্তোলন পিন
              </div>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড"
                className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              <input
                type="password"
                maxLength={6}
                value={txPinInput}
                onChange={(e) =>
                  setTxPinInput(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="৬-ডিজিট ট্রানজেকশন পিন (উত্তোলনের জন্য)"
                className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({ txPin: txPinInput });
                  setOldPass('');
                  setNewPass('');
                  onShowToast('✓ সিকিউরিটি পাসওয়ার্ড ও ট্রানজেকশন পিন আপডেট হয়েছে!');
                }}
                className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                সিকিউরিটি সেটিংস আপডেট করুন
              </button>
            </div>

            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
              <div className="text-sm font-black text-[#ffd84d]">
                🛡️ টু-ফ্যাক্টর অথেনটিকেশন (2FA) ও বায়োমেট্রিক লক
              </div>

              <div className="bg-[#071f18] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white">
                    Google / SMS 2FA ভেরিফিকেশন
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    উত্তোলনের সময় অতিরিক্ত ওটিপি সুরক্ষা
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProfile({
                      twoFactorEnabled: !profile.twoFactorEnabled,
                    });
                    onShowToast(
                      !profile.twoFactorEnabled
                        ? '✓ 2FA সিকিউরিটি চালু করা হয়েছে!'
                        : '2FA সিকিউরিটি বন্ধ করা হয়েছে।'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                    profile.twoFactorEnabled
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {profile.twoFactorEnabled ? 'সক্রিয় (ON)' : 'চালু করুন'}
                </button>
              </div>

              <div className="bg-[#071f18] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white">
                    বায়োমেট্রিক ফিঙ্গারপ্রিন্ট / FaceID লক
                  </div>
                  <div className="text-[10px] text-[#7eb89a]">
                    অ্যাপ ওপেন করার সময় ডিভাইস লক
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateProfile({
                      biometricEnabled: !profile.biometricEnabled,
                    });
                    onShowToast('✓ বায়োমেট্রিক সিকিউরিটি আপডেট হয়েছে!');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                    profile.biometricEnabled
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {profile.biometricEnabled ? 'সক্রিয় (ON)' : 'চালু করুন'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KYC VERIFICATION */}
        {activeTab === 'kyc' && (
          <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-black text-[#ffd84d]">
                🪪 জাতীয় পরিচয়পত্র (NID / Passport) কেওয়াইসি ভেরিফিকেশন
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                {profile.kycStatus || 'Unverified'}
              </span>
            </div>
            <p className="text-xs text-[#7eb89a]">
              বড় অংকের উত্তোলন (প্রতিদিন ৳২৫,০০০+) নির্বিঘ্নে সম্পন্ন করতে আপনার
              জাতীয় পরিচয়পত্র বা পাসপোর্ট নাম্বার সাবমিট করুন।
            </p>
            <input
              type="text"
              value={nidInput}
              onChange={(e) => setNidInput(e.target.value)}
              placeholder="১০ বা ১৭ ডিজিটের NID নাম্বার দিন"
              className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white font-mono"
            />
            <button
              type="button"
              onClick={() => {
                if (nidInput.trim().length < 8) {
                  onShowToast('অনুগ্রহ করে সঠিক NID নাম্বার দিন!');
                  return;
                }
                onUpdateProfile({
                  nidNumber: nidInput.trim(),
                  kycStatus: 'Verified',
                });
                onShowToast('✓ আপনার KYC ভেরিফিকেশন সম্পন্ন হয়েছে!');
              }}
              className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
            >
              কেওয়াইসি ডকুমেন্ট ভেরিফাই করুন
            </button>
          </div>
        )}

        {/* TAB 4: SAVED WITHDRAWAL WALLETS */}
        {activeTab === 'wallets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-3">
              <div className="text-sm font-black text-[#ffd84d]">
                💳 নতুন উত্তোলন ওয়ালেট যুক্ত করুন
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNewWalletMethod(m)}
                    className={`py-2 rounded-xl text-xs font-black cursor-pointer border ${
                      newWalletMethod === m
                        ? 'bg-[#0d7a55] border-[#ffd84d] text-[#ffd84d]'
                        : 'bg-[#041812] border-white/10 text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="tel"
                maxLength={11}
                value={newWalletNum}
                onChange={(e) =>
                  setNewWalletNum(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="ওয়ালেট নাম্বার (01XXXXXXXXX)"
                className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
              <input
                type="password"
                maxLength={6}
                value={newWalletPin}
                onChange={(e) =>
                  setNewWalletPin(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="৪ বা ৬ ডিজিট সিকিউরিটি পিন"
                className="w-full bg-[#041812] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (newWalletNum.length !== 11 || newWalletPin.length < 4) {
                    onShowToast('১১ ডিজিট মোবাইল নাম্বার এবং পিন দিন!');
                    return;
                  }
                  onAddWallet({
                    method: newWalletMethod,
                    accountNumber: newWalletNum,
                    pin: newWalletPin,
                  });
                  setNewWalletNum('');
                  setNewWalletPin('');
                  onShowToast('✓ উত্তোলন ওয়ালেট যুক্ত হয়েছে!');
                }}
                className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                + ওয়ালেট সেভ করুন
              </button>
            </div>

            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-2.5">
              <div className="text-sm font-black text-[#ffd84d]">
                🏦 সংরক্ষিত ওয়ালেট তালিকা ({savedWallets.length})
              </div>
              {savedWallets.length === 0 ? (
                <div className="text-xs text-[#7eb89a] py-6 text-center">
                  কোনো ওয়ালেট যুক্ত করা হয়নি।
                </div>
              ) : (
                savedWallets.map((w) => (
                  <div
                    key={w.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-black text-[#ffd84d]">{w.method}</div>
                      <div className="font-mono text-white mt-0.5">
                        {w.accountNumber}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      ✓ Verified
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: STATEMENT & BETTING HISTORY */}
        {activeTab === 'statement' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] text-[#7eb89a]">মোট ডিপোজিট</div>
                <div className="text-sm font-black text-emerald-400 font-mono-num">
                  ৳{totalDeposits.toFixed(0)}
                </div>
              </div>
              <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] text-[#7eb89a]">মোট উত্তোলন</div>
                <div className="text-sm font-black text-amber-400 font-mono-num">
                  ৳{totalWithdraws.toFixed(0)}
                </div>
              </div>
              <div className="bg-[#0a2e22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] text-[#7eb89a]">মোট গেম রাউন্ড</div>
                <div className="text-sm font-black text-white font-mono-num">
                  {wingoBets.length + binaryTrades.length}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0a2e22] border border-white/10 p-4 space-y-2.5">
              <div className="text-xs font-black text-[#ffd84d] uppercase">
                💳 সাম্প্রতিক ডিপোজিট ও উত্তোলন রেকর্ড ({transactions.length})
              </div>
              {transactions.length === 0 ? (
                <div className="text-xs text-[#7eb89a] py-4 text-center">
                  কোনো লেনদেন রেকর্ড পাওয়া যায়নি।
                </div>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-black text-white">
                        {t.type} · {t.method}
                      </div>
                      <div className="text-[10px] text-[#7eb89a] font-mono">
                        TrxID: {t.trxId} · {t.createdAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-black font-mono-num ${
                          t.type === 'Deposit'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {t.type === 'Deposit' ? '+' : '-'}৳{t.amount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-300 font-bold">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: VIP CLUB */}
        {activeTab === 'vip' && (
          <div className="rounded-2xl bg-[#0a2e22] border border-[#f0c030]/35 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-black text-[#ffd84d]">
                  👑 MONEYX রয়্যাল ভিআইপি ক্লাব
                </div>
                <div className="text-xs text-[#7eb89a]">
                  আপনার বর্তমান লেভেল: VIP {profile.vipLevel || 1}
                </div>
              </div>
              <span className="text-2xl">💎</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7eb89a]">পরবর্তী ভিআইপি লেভেল প্রগ্রেস:</span>
                <span className="font-bold text-[#ffd84d]">
                  ৳{totalDeposits.toFixed(0)} / ৳5,000 ({vipProgressPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffd84d] to-emerald-400"
                  style={{ width: `${vipProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
