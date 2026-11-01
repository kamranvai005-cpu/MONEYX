import React, { useEffect, useState } from 'react';
import { ActiveView, ModalType, TransactionRecord } from '../types';

/* ============================================================
   1. APP INSTALL TOP BANNER (from File 1 #dlBannerTop)
   ============================================================ */
export const AppInstallTopBanner: React.FC<{
  onInstallClick: () => void;
}> = ({ onInstallClick }) => {
  const [visible, setVisible] = useState<boolean>(true);
  if (!visible) return null;

  return (
    <div
      id="dlBannerTop"
      className="w-full flex items-center justify-between px-3 py-2 border-b border-[#f0c030]/25 z-30"
      style={{
        background: 'linear-gradient(135deg, #0a2e22 0%, #0d3d2c 100%)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close App Banner"
          className="w-[22px] h-[22px] rounded-full bg-white/10 text-[#7eb89a] hover:text-white flex items-center justify-center text-[11px] cursor-pointer shrink-0"
        >
          <i className="fas fa-times" />
        </button>
        <div className="w-[34px] h-[34px] rounded-lg bg-[#0d7a55] border border-[#ffd84d]/40 overflow-hidden flex items-center justify-center shrink-0 shadow">
          <img
            src="/icon.svg"
            alt="MONEYX App Install"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#e8f5ee] leading-tight">
            MONEYX App Install
          </div>
          <div className="text-[10px] text-[#ffd84d] tracking-wider">
            ★★★★½
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onInstallClick}
        className="btn-3d-gold px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase cursor-pointer flex items-center gap-1.5"
      >
        <i className="fa-solid fa-cloud-arrow-down text-[11px]" />
        <span>Download</span>
      </button>
    </div>
  );
};

/* ============================================================
   2. 2-COLUMN 3D TACTILE SIDEBAR (Exact match to File 1 #sidebar)
   ============================================================ */
interface TactileSidebarProps {
  isOpen: boolean;
  activeCategory: string;
  onClose: () => void;
  onSelectCategory: (catId: string) => void;
  onNavigateView: (view: ActiveView) => void;
  onOpenModal: (modal: ModalType) => void;
  onOpenInstallModal: () => void;
  onOpenAdminPanel: () => void;
}

const SIDEBAR_3D_CARDS: Array<{
  id: string;
  label: string;
  faIcon: string;
  iconColor: string;
  actionType: 'cat' | 'view' | 'modal' | 'install';
  target: string;
}> = [
  {
    id: 'sb-hot',
    label: 'Hot Games',
    faIcon: 'fa-solid fa-fire',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'ALL',
  },
  {
    id: 'sb-invite',
    label: 'Invite friends',
    faIcon: 'fa-solid fa-user-group',
    iconColor: '#49b9ab',
    actionType: 'modal',
    target: 'invite',
  },
  {
    id: 'sb-fav',
    label: 'Favorites',
    faIcon: 'fa-solid fa-heart',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'FAV',
  },
  {
    id: 'sb-promo',
    label: 'Promotion',
    faIcon: 'fa-solid fa-gift',
    iconColor: '#db9c3f',
    actionType: 'view',
    target: 'deposit_page',
  },
  {
    id: 'sb-slots',
    label: 'Slots',
    faIcon: 'fa-solid fa-dice',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'slots',
  },
  {
    id: 'sb-reward',
    label: 'Reward Center',
    faIcon: 'fa-solid fa-award',
    iconColor: '#db9c3f',
    actionType: 'modal',
    target: 'gifts',
  },
  {
    id: 'sb-live',
    label: 'Live Casino',
    faIcon: 'fa-solid fa-dharmachakra',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'live',
  },
  {
    id: 'sb-rebate',
    label: 'Manual Rebate',
    faIcon: 'fa-solid fa-hand-holding-dollar',
    iconColor: '#db9c3f',
    actionType: 'modal',
    target: 'bonus_record',
  },
  {
    id: 'sb-sports',
    label: 'Sports',
    faIcon: 'fa-solid fa-futbol',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'sports',
  },
  {
    id: 'sb-vip',
    label: 'VIP',
    faIcon: 'fa-solid fa-gem',
    iconColor: '#db9c3f',
    actionType: 'modal',
    target: 'vip',
  },
  {
    id: 'sb-esports',
    label: 'E-sports',
    faIcon: 'fa-solid fa-gamepad',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'crash',
  },
  {
    id: 'sb-mission',
    label: 'Mission',
    faIcon: 'fa-solid fa-bullseye',
    iconColor: '#db9c3f',
    actionType: 'modal',
    target: 'gifts',
  },
  {
    id: 'sb-poker',
    label: 'Poker',
    faIcon: 'fa-solid fa-diamond',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'poker',
  },
  {
    id: 'sb-fish',
    label: 'Fish',
    faIcon: 'fa-solid fa-fish',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'fishing',
  },
  {
    id: 'sb-lottery',
    label: 'Lottery',
    faIcon: 'fa-solid fa-ticket',
    iconColor: '#d76d5e',
    actionType: 'cat',
    target: 'lottery',
  },
  {
    id: 'sb-download',
    label: 'APP Download',
    faIcon: 'fa-solid fa-cloud-arrow-down',
    iconColor: '#49b9ab',
    actionType: 'install',
    target: 'install',
  },
  {
    id: 'sb-support',
    label: 'Customer Service',
    faIcon: 'fa-solid fa-headset',
    iconColor: '#49b9ab',
    actionType: 'modal',
    target: 'support',
  },
  {
    id: 'sb-affiliate',
    label: 'Affiliate',
    faIcon: 'fa-solid fa-handshake',
    iconColor: '#db9c3f',
    actionType: 'modal',
    target: 'invite',
  },
];

export const TactileTwoColumnSidebar: React.FC<TactileSidebarProps> = ({
  isOpen,
  activeCategory,
  onClose,
  onSelectCategory,
  onNavigateView,
  onOpenModal,
  onOpenInstallModal,
  onOpenAdminPanel,
}) => {
  const handleCardClick = (item: (typeof SIDEBAR_3D_CARDS)[number]) => {
    if (item.actionType === 'cat') {
      onSelectCategory(item.target);
    } else if (item.actionType === 'view') {
      onNavigateView(item.target as ActiveView);
    } else if (item.actionType === 'modal') {
      onOpenModal(item.target as ModalType);
    } else if (item.actionType === 'install') {
      onOpenInstallModal();
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          ${
            isOpen
              ? 'fixed left-0 top-0 bottom-0 z-50 w-[235px] translate-x-0'
              : 'hidden lg:block lg:w-[235px] lg:shrink-0 lg:sticky lg:top-[56px] lg:h-[calc(100vh-56px)]'
          }
          bg-[#062c23] overflow-y-auto no-scrollbar border-r border-white/10 pb-24 transition-transform
        `}
      >
        {/* Sidebar Header (.sb-header) */}
        <div className="bg-[#062c23] flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
          <span
            className="text-[#f5c518] text-xl font-black italic tracking-wider"
            style={{
              fontFamily: 'Arial Black, sans-serif',
              textShadow: '0 0 16px rgba(245,197,24,0.35)',
            }}
          >
            MONEY<span className="text-white">X</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full text-white hover:bg-white/10 flex items-center justify-center text-base cursor-pointer"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* 2-Column 3D Menu Grid (.sb-menu-grid & .sb-menu-card) */}
        <div className="grid grid-cols-2 gap-[9px] p-3.5">
          {SIDEBAR_3D_CARDS.map((card) => {
            const isSelected =
              card.actionType === 'cat' && activeCategory === card.target;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card)}
                className={`rounded-[14px] pt-[18px] pb-[14px] px-2 flex flex-col items-center justify-center gap-2.5 min-h-[100px] cursor-pointer transition-all active:translate-y-1 ${
                  isSelected ? 'ring-1 ring-[#ffd84d]' : ''
                }`}
                style={{
                  background: '#093327',
                  borderTop: '1.5px solid rgba(30, 180, 130, 0.35)',
                  borderLeft: '1.5px solid rgba(30, 180, 130, 0.25)',
                  borderRight: '1.5px solid rgba(10, 60, 40, 0.8)',
                  borderBottom: '3px solid #031913',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.07), 0 6px 0 #031510, 0 8px 16px rgba(0,0,0,0.45)',
                }}
              >
                <div
                  className="text-xl leading-none flex items-center justify-center"
                  style={{ color: card.iconColor }}
                >
                  <i className={card.faIcon} />
                </div>
                <span className="text-white text-[11.5px] font-bold text-center leading-tight">
                  {card.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Language Flag & Admin Action Strip */}
        <div className="px-3.5 space-y-2.5">
          <div className="bg-[#093327] border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img
                src="https://flagcdn.com/w40/bd.png"
                alt="BD"
                className="w-6 h-6 rounded-full object-cover"
              />
              <div>
                <div className="font-black text-white text-[11px]">
                  BDT · বাংলাদেশ
                </div>
                <div className="text-[9px] text-[#7eb89a]">
                  বাংলা / English
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#ffd84d]">LIVE</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onOpenAdminPanel();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 border border-[#f0c030]/40 text-[#ffd84d] text-xs font-extrabold cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-crown" />
            <span>Owner Kamran Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};

/* ============================================================
   3. NYNO BET DESKTOP MEGA-NAVIGATION + TOKEN/POINT/FORTUNE WHEEL BAR
      (from File 2 www-nynobet-live)
   ============================================================ */
export const NynoBetDesktopMegaNav: React.FC<{
  activeCategory: string;
  balance: number;
  onSelectCategory: (cat: string) => void;
  onNavigateView: (view: ActiveView) => void;
  onOpenModal: (modal: ModalType) => void;
  onOpenInstallModal: () => void;
  onClaimWheelReward: (title: string, amount: number) => void;
}> = ({
  activeCategory,
  balance,
  onSelectCategory,
  onNavigateView,
  onOpenModal,
  onOpenInstallModal,
  onClaimWheelReward,
}) => {
  const [walletModalOpen, setWalletModalOpen] = useState<
    null | 'token' | 'point' | 'balance' | 'wheel'
  >(null);
  const [tokens, setTokens] = useState<number>(25);
  const [points, setPoints] = useState<number>(3500);
  const [wheelSpinning, setWheelSpinning] = useState<boolean>(false);
  const [wheelAngle, setWheelAngle] = useState<number>(0);
  const [wheelWonText, setWheelWonText] = useState<string | null>(null);

  const navLinks = [
    { id: 'ALL', labelBn: 'হোম', icon: 'fas fa-home' },
    { id: 'hot', labelBn: 'Hot', icon: 'fas fa-fire' },
    { id: 'sports', labelBn: 'খেলাধুলা', icon: 'fas fa-futbol' },
    { id: 'BINARY', labelBn: 'বাইনারি OTC', icon: 'fas fa-chart-line' },
    { id: 'WINGO', labelBn: 'উইনগো ৩০সে', icon: 'fas fa-bullseye' },
    { id: 'live', labelBn: 'ক্যাসিনো', icon: 'fas fa-video' },
    { id: 'slots', labelBn: 'স্লট', icon: 'fas fa-dice' },
    { id: 'fishing', labelBn: 'মাছ ধরা', icon: 'fas fa-fish' },
    { id: 'crash', labelBn: 'ক্র্যাশ', icon: 'fas fa-rocket' },
    { id: 'dice', labelBn: 'ডাইস', icon: 'fas fa-dice-five' },
    { id: 'card', labelBn: 'কার্ড ও টেবিল', icon: 'fas fa-clone' },
  ];

  const handleSpinFortuneWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelWonText(null);
    const nextAngle = wheelAngle + 1440 + Math.floor(Math.random() * 360);
    setWheelAngle(nextAngle);

    setTimeout(() => {
      const prizes = [50, 88, 120, 200, 300, 500];
      const wonAmt = prizes[Math.floor(Math.random() * prizes.length)];
      setTokens((t) => Math.max(0, t - 1));
      setPoints((p) => p + 150);
      setWheelSpinning(false);
      setWheelWonText(`🎉 অভিনন্দন! আপনি জিতেছেন BDT ${wonAmt}.00!`);
      onClaimWheelReward('MONEYX Fortune Wheel Spin Prize', wonAmt);
    }, 1800);
  };

  return (
    <>
      <div className="bg-[#06241b] border-b border-white/10 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category Links */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navLinks.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'BINARY') {
                    onNavigateView('binary');
                  } else if (item.id === 'WINGO') {
                    onNavigateView('trading');
                  } else {
                    onSelectCategory(item.id === 'hot' ? 'ALL' : item.id);
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg font-extrabold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#0d7a55] text-[#ffd84d] shadow-sm'
                    : 'text-[#e8f5ee]/85 hover:bg-white/5 hover:text-[#ffd84d]'
                }`}
              >
                <i className={`${item.icon} text-[11px]`} />
                <span>{item.labelBn}</span>
              </button>
            );
          })}
        </div>

        {/* NYNO BET Token / Point / Fortune Wheel / Main Wallet Quick Badges */}
        <div className="flex items-center gap-1.5 ml-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setWalletModalOpen('token')}
            className="px-2.5 py-1 rounded-lg bg-[#0d3d2c] border border-[#f0c030]/30 text-[#ffd84d] font-bold text-[11px] cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <span>🪙 টোকেন:</span>
            <b className="font-mono-num">{tokens}</b>
          </button>

          <button
            type="button"
            onClick={() => setWalletModalOpen('point')}
            className="px-2.5 py-1 rounded-lg bg-[#0d3d2c] border border-emerald-400/30 text-emerald-300 font-bold text-[11px] cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <span>⭐ পয়েন্ট:</span>
            <b className="font-mono-num">{points}</b>
          </button>

          <button
            type="button"
            onClick={() => setWalletModalOpen('wheel')}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-[11px] cursor-pointer flex items-center gap-1 whitespace-nowrap shadow"
          >
            <span>🎡 ফরচুন হুইল</span>
          </button>

          <button
            type="button"
            onClick={() => setWalletModalOpen('balance')}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-[11px] cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <span>💼 প্রধান ওয়ালেট</span>
          </button>

          <button
            type="button"
            onClick={onOpenInstallModal}
            className="hidden sm:flex px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#1de9b6] font-bold text-[11px] cursor-pointer items-center gap-1 whitespace-nowrap"
          >
            <i className="fas fa-mobile-screen" />
            <span>মোবাইল অ্যাপ</span>
          </button>
        </div>
      </div>

      {/* Modals for Token (#tokenmodal), Point (#pointmodal), Fortune Wheel, and Main Wallet (#balancemodal) */}
      {walletModalOpen && (
        <div
          onClick={() => setWalletModalOpen(null)}
          className="fixed inset-0 z-[9995] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-3xl bg-[#0a2e22] border-2 border-[#f0c030]/40 p-5 text-white shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setWalletModalOpen(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer"
            >
              ×
            </button>

            {walletModalOpen === 'token' && (
              <div className="space-y-4">
                <h4 className="text-lg font-black text-[#ffd84d]">
                  🪙 টোকেন ওয়ালেট (Token Wallet)
                </h4>
                <div className="bg-[#071f18] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#7eb89a] font-bold">
                    মোট উপলব্ধ টোকেন:
                  </span>
                  <span className="text-2xl font-black text-[#ffd84d] font-mono-num">
                    {tokens}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#7eb89a]">
                  এখনই খেলুন:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setWalletModalOpen('wheel')}
                    className="p-3 rounded-xl bg-[#0d3d2c] hover:bg-[#0d7a55] border border-white/10 text-center cursor-pointer transition"
                  >
                    <div className="text-2xl mb-1">🎁</div>
                    <div className="text-xs font-black text-white">
                      দৈনিক পুরস্কার
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletModalOpen('wheel')}
                    className="p-3 rounded-xl bg-[#0d3d2c] hover:bg-[#0d7a55] border border-white/10 text-center cursor-pointer transition"
                  >
                    <div className="text-2xl mb-1">🎮</div>
                    <div className="text-xs font-black text-white">
                      Play 2 Earn
                    </div>
                  </button>
                </div>
              </div>
            )}

            {walletModalOpen === 'point' && (
              <div className="space-y-4">
                <h4 className="text-lg font-black text-[#ffd84d]">
                  ⭐ পয়েন্ট ওয়ালেট (VIP Points)
                </h4>
                <div className="bg-[#071f18] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#7eb89a] font-bold">
                    অর্জিত পয়েন্ট:
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono-num">
                    {points}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#7eb89a]">
                  এখনই খেলুন:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setWalletModalOpen(null);
                      onOpenModal('gifts');
                    }}
                    className="p-3 rounded-xl bg-[#0d3d2c] hover:bg-[#0d7a55] border border-white/10 text-center cursor-pointer transition"
                  >
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-black text-white">মিশন</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletModalOpen('wheel')}
                    className="p-3 rounded-xl bg-[#0d3d2c] hover:bg-[#0d7a55] border border-white/10 text-center cursor-pointer transition"
                  >
                    <div className="text-2xl mb-1">🎡</div>
                    <div className="text-xs font-black text-white">
                      ফরচুন হুইল
                    </div>
                  </button>
                </div>
              </div>
            )}

            {walletModalOpen === 'wheel' && (
              <div className="text-center space-y-4">
                <h4 className="text-lg font-black text-[#ffd84d]">
                  🎡 MONEYX ফরচুন হুইল (Fortune Wheel)
                </h4>
                <p className="text-xs text-[#7eb89a]">
                  চাকা ঘুরিয়ে জিতে নিন তাৎক্ষণিক BDT ৫০ থেকে BDT ৫০০ ক্যাশ
                  বোনাস!
                </p>

                <div className="relative w-44 h-44 mx-auto">
                  <div
                    className="w-full h-full rounded-full border-4 border-[#ffd84d] flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(240,192,48,0.4)] transition-transform duration-[1800ms] ease-out"
                    style={{
                      transform: `rotate(${wheelAngle}deg)`,
                      background:
                        'conic-gradient(#0d7a55 0deg 60deg, #b45309 60deg 120deg, #0d3d2c 120deg 180deg, #e11d48 180deg 240deg, #0d7a55 240deg 300deg, #ca8a04 300deg 360deg)',
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#071f18] border-2 border-[#ffd84d] flex items-center justify-center text-xs font-black text-[#ffd84d]">
                      MX
                    </div>
                  </div>
                </div>

                {wheelWonText && (
                  <div className="py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                    {wheelWonText}
                  </div>
                )}

                <button
                  type="button"
                  disabled={wheelSpinning}
                  onClick={handleSpinFortuneWheel}
                  className="w-full py-3.5 rounded-xl btn-3d-gold text-sm font-black uppercase cursor-pointer"
                >
                  {wheelSpinning ? 'চাকা ঘুরছে...' : '🎰 এখনই স্পিন করুন'}
                </button>
              </div>
            )}

            {walletModalOpen === 'balance' && (
              <div className="space-y-3.5">
                <h4 className="text-base font-black text-[#ffd84d]">
                  💼 প্রধান ওয়ালেট (Main &amp; Provider Wallets)
                </h4>
                <div className="bg-[#071f18] p-3.5 rounded-2xl border border-[#f0c030]/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#7eb89a] font-bold">
                      প্রধান ওয়ালেট ব্যালেন্স
                    </div>
                    <div className="text-xl font-black text-[#ffd84d] font-mono-num">
                      ৳{balance.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWalletModalOpen(null)}
                      className="btn-3d-green px-3 py-1.5 rounded-lg text-[11px] font-black cursor-pointer"
                    >
                      অল ইন
                    </button>
                  </div>
                </div>

                <div className="max-h-[210px] overflow-y-auto space-y-1.5 pr-1">
                  {[
                    { name: 'JILI SLOTS & FISHING', status: 'Seamless Active' },
                    { name: 'PG SOFTPOCKET GAMES', status: 'Seamless Active' },
                    { name: 'EVOLUTION LIVE CASINO', status: 'Seamless Active' },
                    { name: 'SPRIBE AVIATOR CRASH', status: 'Seamless Active' },
                    { name: 'PRAGMATIC PLAY', status: 'Seamless Active' },
                    { name: 'SABA & 9WICKETS SPORTS', status: 'Seamless Active' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="bg-[#071f18]/80 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-emerald-400 font-mono-num font-bold text-[11px]">
                        ৳{balance.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ============================================================
   4. MONEYX COMBINED SECTIONS:
      - Product Overview (পণ্য ওভারভিউ)
      - Daily Challenge Tournament Leaderboard
      - Live Transaction Ticker (Live আমানত & Live প্রত্যাহার)
      - Excellent Service Speed Gauges
      - Rich Casino Footer, Right Fixed Promo/VIP & Floating Social Buttons
   ============================================================ */
const INITIAL_LIVE_DEPOSITS = [
  { rank: 1, name: 'Rahim Khan', amount: 5200.0, method: 'bKash' },
  { rank: 2, name: 'Shakila Sultana', amount: 3800.0, method: 'Nagad' },
  { rank: 3, name: 'Tanvir Hossain', amount: 7500.0, method: 'bKash' },
  { rank: 4, name: 'Imran Ali', amount: 8200.0, method: 'Rocket' },
  { rank: 5, name: 'Sajid Hasan', amount: 5600.0, method: 'bKash' },
  { rank: 6, name: 'Rafiq Ahmed', amount: 4500.0, method: 'Nagad' },
  { rank: 7, name: 'Jamilur Rahman', amount: 5100.0, method: 'bKash' },
  { rank: 8, name: 'Habib Ullah', amount: 7900.0, method: 'Nagad' },
];

const INITIAL_LIVE_WITHDRAWALS = [
  { rank: 1, name: 'Nusrat Jahan', amount: 2400.0, method: 'bKash' },
  { rank: 2, name: 'Arif Chowdhury', amount: 6100.0, method: 'Nagad' },
  { rank: 3, name: 'Farhana Akter', amount: 4700.0, method: 'bKash' },
  { rank: 4, name: 'Laila Begum', amount: 3900.0, method: 'Rocket' },
  { rank: 5, name: 'Tania Rahman', amount: 7300.0, method: 'bKash' },
  { rank: 6, name: 'Mita Khatun', amount: 6800.0, method: 'Nagad' },
  { rank: 7, name: 'Sohana Akter', amount: 3600.0, method: 'bKash' },
];

export const NynoDollarCombinedFooterAndLiveSections: React.FC<{
  transactions: TransactionRecord[];
  onSelectCategory: (cat: string) => void;
  onNavigateView: (view: ActiveView) => void;
  onOpenModal: (modal: ModalType) => void;
  onOpenAdminPanel: () => void;
}> = ({
  transactions,
  onSelectCategory,
  onNavigateView,
  onOpenModal,
  onOpenAdminPanel,
}) => {
  const [selectedOverviewTab, setSelectedOverviewTab] =
    useState<string>('live');
  const [liveDeps, setLiveDeps] = useState(INITIAL_LIVE_DEPOSITS);
  const [liveWits, setLiveWits] = useState(INITIAL_LIVE_WITHDRAWALS);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [challengeSec, setChallengeSec] = useState<number>(51824);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setCurrentTimeStr(
        `${pad(now.getDate())}/${pad(
          now.getMonth() + 1
        )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
          now.getMinutes()
        )}:${pad(now.getSeconds())} (GMT+8)`
      );
      setChallengeSec((prev) => (prev > 0 ? prev - 1 : 86400));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const tickerInterval = setInterval(() => {
      setLiveDeps((prev) => {
        if (prev.length <= 1) return prev;
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setLiveWits((prev) => {
        if (prev.length <= 1) return prev;
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2600);

    return () => {
      clearInterval(clockInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const realDeposits = transactions
    .filter((t) => t.type === 'Deposit')
    .slice(0, 2)
    .map((t, i) => ({
      rank: i + 1,
      name: `VIP (${t.account.slice(-4)})`,
      amount: t.amount,
      method: t.method,
    }));

  const realWithdrawals = transactions
    .filter((t) => t.type === 'Withdraw')
    .slice(0, 2)
    .map((t, i) => ({
      rank: i + 1,
      name: `VIP (${t.account.slice(-4)})`,
      amount: t.amount,
      method: t.method,
    }));

  const combinedDeposits = [...realDeposits, ...liveDeps].slice(0, 6);
  const combinedWithdrawals = [...realWithdrawals, ...liveWits].slice(0, 6);

  const hrs = Math.floor(challengeSec / 3600);
  const mins = Math.floor((challengeSec % 3600) / 60);
  const secs = challengeSec % 60;

  const overviewItems = [
    {
      id: 'live',
      titleBn: 'লাইভ ক্যাসিনো',
      titleEn: 'Live Casino Bangladesh',
      icon: '🎥',
      desc: 'Evolution, AE Sexy, Pragmatic Play এবং Ezugi-এর সাথে সরাসরি লাইভ ডিলার ক্যাসিনো এবং রিয়েল-টাইম রুলেট ও ব্যাকারাট উপভোগ করুন — সবই পাওয়া যায় MONEYX-এ।',
      cta: 'লাইভ ক্যাসিনো খেলুন',
    },
    {
      id: 'sports',
      titleBn: 'খেলাধুলা',
      titleEn: 'Sportsbook & Cricket',
      icon: '🏏',
      desc: 'BPL, IPL, আন্তর্জাতিক ক্রিকেট ও ফুটবল ম্যাচে সর্বোচ্চ অডস এবং BTI, SABA ও 9Wickets স্পোর্টসবুক লাইভ বেটিং।',
      cta: 'স্পোর্টস বেটিং করুন',
    },
    {
      id: 'slots',
      titleBn: 'স্লট গেমস',
      titleEn: 'JILI & PGSoft Slots',
      icon: '🎰',
      desc: 'Super Ace, Fortune Gems, Boxing King এবং ১০০০+ হাই-পেআউট স্লট গেমে ১০২৪ ওয়েজ গোল্ডেন কার্ড ক্যাসকেড জ্যাকপট।',
      cta: 'SuperAce স্লট খেলুন',
    },
    {
      id: 'binary',
      titleBn: 'বাইনারি ট্রেডিং',
      titleEn: 'Binary Options +96%',
      icon: '📈',
      desc: 'BTC/USDT, EUR/USD, এবং GOLD চার্টে ১০ সেকেন্ড থেকে ৬০ সেকেন্ডের লাইভ ক্যান্ডেলস্টিক ট্রেডিংয়ে +৯৬% পর্যন্ত তাৎক্ষণিক মুনাফা।',
      cta: 'বাইনারি ট্রেড করুন',
    },
    {
      id: 'fishing',
      titleBn: 'মাছ ধরা',
      titleEn: 'Mega Fishing Arcade',
      icon: '🐟',
      desc: 'JILI Mega Fishing, All-Star Fishing এবং Dragon Fishing-এ মাল্টিপ্লায়ার বস শিকার করে তাৎক্ষণিক ক্যাশ রিওয়ার্ড জিতুন।',
      cta: 'ফিশিং গেম খেলুন',
    },
    {
      id: 'crash',
      titleBn: 'ক্র্যাশ ও উইনগো',
      titleEn: 'Aviator & WinGo 30s',
      icon: '🚀',
      desc: 'Spribe Aviator ক্র্যাশ এবং প্রতি ৩০ সেকেন্ডে নন-স্টপ WinGo লটারি ড্র-তে Big/Small ও কালার প্রেডিকশন।',
      cta: 'WinGo 30s খেলুন',
    },
  ];

  const activeOverview =
    overviewItems.find((i) => i.id === selectedOverviewTab) || overviewItems[0];

  const providersList = [
    'PG SOFT',
    'BNG',
    'PRAGMATIC',
    'JILI',
    'SPRIBE',
    'FA CHAI',
    'NETENT',
    'JDB',
    'GAMEPLAY',
    'BOOMING',
    'MEGA',
    'JOKER',
    'SPADEGAMING',
    'ASKMESLOT',
    'EVOLUTION',
    'PLAYSTAR',
    'YELLOW BAT',
    'FIRST PERSON',
    'KK GAMING',
    '7 MOJOS',
  ];

  return (
    <div className="space-y-4 px-2.5 pt-2">
      {/* ==================== 1. PRODUCT OVERVIEW (পণ্য ওভারভিউ) ==================== */}
      <section className="rounded-2xl bg-[#0d3d2c]/45 border border-white/10 p-4">
        <div className="text-center max-w-[680px] mx-auto mb-3.5">
          <h2 className="text-base sm:text-lg font-black text-[#ffd84d] uppercase tracking-wide">
            পণ্য ওভারভিউ · MONEYX PRODUCT OVERVIEW
          </h2>
          <p className="text-[11px] text-[#7eb89a] mt-1 leading-relaxed">
            আমরা প্রিমিয়াম অনলাইন জুয়া এবং লাইভ ক্যাসিনোর অভিজ্ঞতা প্রদান করি
            সেরা গেমিংয়ের জন্য। অনলাইন লাইভ ক্যাসিনো বাংলাদেশ, স্লট গেমস,
            স্পোর্টস বেটিং এবং অনেক কার্ড ও পোকার গেম — সবই পাওয়া যায় MONEYX-এ।
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {overviewItems.map((tab) => {
            const active = selectedOverviewTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedOverviewTab(tab.id)}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  active
                    ? 'bg-[#0d7a55] border-[#ffd84d] text-[#ffd84d] shadow-md'
                    : 'bg-[#071f18]/70 border-white/10 text-[#e8f5ee] hover:border-[#13a36e]'
                }`}
              >
                <div className="text-xl">{tab.icon}</div>
                <div className="text-[11px] font-extrabold mt-1">
                  {tab.titleBn}
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="rounded-xl p-4 border border-[#f0c030]/25 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background:
              'linear-gradient(135deg, #071f18 0%, #0a2e22 60%, #0d3d2c 100%)',
          }}
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="text-xs font-extrabold text-[#1de9b6] uppercase tracking-wider">
              {activeOverview.titleEn}
            </div>
            <div className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>{activeOverview.icon}</span>
              <span>{activeOverview.titleBn}</span>
            </div>
            <p className="text-xs text-[#7eb89a] max-w-[520px]">
              {activeOverview.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (activeOverview.id === 'binary') {
                onNavigateView('binary');
              } else if (activeOverview.id === 'crash') {
                onNavigateView('trading');
              } else if (activeOverview.id === 'slots') {
                onNavigateView('slot_game');
              } else {
                onSelectCategory(activeOverview.id);
              }
            }}
            className="btn-3d-gold px-5 py-2.5 rounded-xl text-xs font-black uppercase shrink-0 cursor-pointer"
          >
            {activeOverview.cta} ›
          </button>
        </div>
      </section>

      {/* ==================== 2. WHO WE ARE (আমরা যারা from File 2) ==================== */}
      <section className="rounded-2xl bg-[#0d3d2c]/45 border border-white/10 p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#0d7a55] to-[#071f18] border-2 border-[#ffd84d]/40 flex flex-col items-center justify-center shrink-0 shadow-xl">
          <span className="text-2xl font-black italic text-[#ffd84d]">MX</span>
          <span className="text-[10px] font-extrabold text-white mt-0.5">
            MONEYX APP
          </span>
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#1de9b6] uppercase">
            আমরা যারা · WHO WE ARE
          </div>
          <h3 className="text-base font-black text-[#ffd84d] mt-0.5">
            বাংলাদেশের শীর্ষস্থানীয় এবং বিশ্বস্ত অনলাইন ক্যাসিনো — MONEYX
          </h3>
          <p className="text-xs text-[#7eb89a] mt-1 leading-relaxed">
            Be spoilt with our huge array of exclusive games. All our online
            casino games are made available for both desktop and mobile so our
            customers can play anywhere they want with world-leading security
            and instant bKash, Nagad &amp; Rocket automated banking.
          </p>
        </div>
      </section>

      {/* ==================== 3. DAILY CHALLENGE TOURNAMENT ==================== */}
      <section className="rounded-2xl bg-[#0d3d2c]/45 border border-white/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-black text-[#ffd84d] uppercase tracking-wide flex items-center gap-2">
              <span>🏆</span>
              <span>DAILY CHALLENGE &amp; MULTIPLIER TOURNAMENT</span>
            </h2>
            <p className="text-[11px] text-[#7eb89a]">
              Pragmatic Play Multipliers &amp; Go Wild With Me!
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#071f18] border border-[#f0c030]/35 px-3 py-1.5 rounded-xl font-mono-num">
            <span className="text-[10px] text-[#7eb89a] uppercase font-bold mr-1">
              finish in:
            </span>
            <span className="bg-[#0d3d2c] text-[#ffd84d] font-black text-xs px-2 py-0.5 rounded">
              00 Days
            </span>
            <span className="text-[#ffd84d] font-black">:</span>
            <span className="bg-[#0d3d2c] text-[#ffd84d] font-black text-xs px-2 py-0.5 rounded">
              {String(hrs).padStart(2, '0')} Hours
            </span>
            <span className="text-[#ffd84d] font-black">:</span>
            <span className="bg-[#0d3d2c] text-[#ffd84d] font-black text-xs px-2 py-0.5 rounded">
              {String(mins).padStart(2, '0')} Min
            </span>
            <span className="text-[#ffd84d] font-black">:</span>
            <span className="bg-[#0d3d2c] text-[#ffd84d] font-black text-xs px-2 py-0.5 rounded">
              {String(secs).padStart(2, '0')} Sec
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            className="rounded-xl p-4 border border-[#f0c030]/30 flex flex-col justify-between"
            style={{
              background:
                'linear-gradient(135deg, #0d7a55 0%, #071f18 100%)',
            }}
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-[#ffd84d] text-[#2a1500] px-2.5 py-0.5 rounded-full">
                PRAGMATIC PLAY MULTIPLIERS
              </span>
              <div className="text-lg font-black text-white mt-2">
                Go Wild With MONEYX!
              </div>
              <div className="text-xs text-[#e8f5ee]/80 mt-1">
                Top 3 daily players share the $10,000 / ৳10,00,000 Prize Pool +
                3,500 VIP Points.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
              <span className="text-xs font-bold text-[#ffd84d] uppercase">
                Prize Pool
              </span>
              <span className="text-2xl font-black text-white font-mono-num">
                $ 10,000
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#071f18]/85 rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 px-4 py-2.5 bg-white/[0.04] border-b border-white/10 text-[11px] font-black uppercase text-[#7eb89a]">
              <div>Place</div>
              <div>Player, Multiplier</div>
              <div className="text-right">Turn Over</div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {[
                {
                  medal: '🥇 #1',
                  player: 'Gorden',
                  mult: '2020.91',
                  prize: '$3,000',
                  pts: '+3 500 points',
                },
                {
                  medal: '🥈 #2',
                  player: 'Kamran_VIP',
                  mult: '1840.55',
                  prize: '$2,000',
                  pts: '+2 500 points',
                },
                {
                  medal: '🥉 #3',
                  player: 'Tanvir_BD',
                  mult: '1420.10',
                  prize: '$1,000',
                  pts: '+1 500 points',
                },
              ].map((row) => (
                <div
                  key={row.medal}
                  className="grid grid-cols-3 items-center px-4 py-2.5 text-xs"
                >
                  <div className="font-black text-[#ffd84d]">{row.medal}</div>
                  <div>
                    <div className="font-extrabold text-white">
                      {row.player}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono-num">
                      {row.mult}
                    </div>
                  </div>
                  <div className="text-right font-mono-num">
                    <div className="font-black text-[#ffd84d]">{row.prize}</div>
                    <div className="text-[10px] text-[#7eb89a]">{row.pts}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. LIVE TRANSACTION TICKER (Live আমানত & Live প্রত্যাহার) ==================== */}
      <section className="rounded-2xl bg-[#0d3d2c]/45 border border-white/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-black text-[#ffd84d] uppercase tracking-wide flex items-center gap-2">
            <span>⚡</span>
            <span>LIVE TRANSACTION · রিয়েল-টাইম আমানত ও প্রত্যাহার</span>
          </h2>
          <div className="text-[11px] text-[#7eb89a] font-mono-num">
            আপডেট করা সময়: <span className="text-white">{currentTimeStr}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Live Deposit Box (Live আমানত) */}
          <div className="bg-[#071f18] border border-emerald-500/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gradient-to-r from-[#0d7a55]/40 to-transparent border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase text-emerald-300">
                  Live আমানত
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#7eb89a]">টাকা</span>
            </div>

            <div className="divide-y divide-white/[0.05] p-2">
              {combinedDeposits.map((item, idx) => (
                <div
                  key={`dep-${item.name}-${idx}`}
                  className="flex items-center justify-between px-2.5 py-2 text-xs hover:bg-white/[0.02] rounded-lg transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#7eb89a]">
                      {item.method}
                    </span>
                  </div>
                  <div className="font-black text-emerald-400 font-mono-num">
                    BDT&nbsp;
                    {item.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Withdrawal Box (Live প্রত্যাহার) */}
          <div className="bg-[#071f18] border border-[#f0c030]/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/25 to-transparent border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffd84d] animate-ping" />
                <span className="text-xs font-black uppercase text-[#ffd84d]">
                  Live প্রত্যাহার
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#7eb89a]">টাকা</span>
            </div>

            <div className="divide-y divide-white/[0.05] p-2">
              {combinedWithdrawals.map((item, idx) => (
                <div
                  key={`wit-${item.name}-${idx}`}
                  className="flex items-center justify-between px-2.5 py-2 text-xs hover:bg-white/[0.02] rounded-lg transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-[#ffd84d] text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#7eb89a]">
                      {item.method}
                    </span>
                  </div>
                  <div className="font-black text-[#ffd84d] font-mono-num">
                    BDT&nbsp;
                    {item.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 5. EXCELLENT SERVICE SPEED GAUGES ==================== */}
      <section className="rounded-2xl bg-[#0d3d2c]/45 border border-white/10 p-4">
        <div className="text-center mb-4">
          <h2 className="text-base font-black text-[#ffd84d] uppercase tracking-wide">
            EXCELLENT SERVICE
          </h2>
          <p className="text-[11px] text-[#7eb89a]">
            Dedicated to provide you with the best quality service on MONEYX
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              value: '2',
              unit: 'Min',
              sub: 'CURRENT SPEED',
              title: 'AVERAGES TIME OF DEPOSIT',
              strokeDash: '165 250',
            },
            {
              value: '4',
              unit: 'Platform',
              sub: 'TOTAL AMOUNT',
              title: 'PAYMENT PLATFORM PARTNERS',
              strokeDash: '190 250',
            },
            {
              value: '8',
              unit: 'Min',
              sub: 'TOTAL AMOUNT',
              title: 'AVERAGES TIME OF WITHDRAW',
              strokeDash: '175 250',
            },
            {
              value: '50',
              unit: 'Platform',
              sub: 'TOTAL AMOUNT',
              title: 'GAMING PROVIDER PARTNERS',
              strokeDash: '215 250',
            },
          ].map((g) => (
            <div
              key={g.title}
              className="bg-[#071f18] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#ff8633"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={g.strokeDash}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#ff8633] font-mono-num leading-none">
                    {g.value}
                  </span>
                  <span className="text-[9px] font-bold text-[#1de9b6] uppercase mt-0.5">
                    {g.unit}
                  </span>
                </div>
              </div>
              <div className="text-[9px] text-[#7eb89a] font-bold mt-1">
                {g.sub}
              </div>
              <div className="text-[10px] font-black text-white mt-0.5 leading-tight">
                {g.title}
              </div>
            </div>
          ))}
        </div>

        {/* 4 Service Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            {
              icon: '🏆',
              title: 'Professional',
              desc: 'MONEYX provides you with nearly a thousand exciting games and entertainment methods.',
            },
            {
              icon: '🛡️',
              title: 'Safety',
              desc: 'Exclusively developed intelligent technology and serious safety management system.',
            },
            {
              icon: '📱',
              title: 'Convenient',
              desc: 'Full set of terminal applications for Web, H5, iOS and Android native PWA apps.',
            },
            {
              icon: '⚡',
              title: 'Speed',
              desc: 'Latest financial processing technology for ultra-fast deposit, retrieval and transfer.',
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-[#071f18]/70 border border-white/[0.06] rounded-xl p-3"
            >
              <div className="flex items-center gap-2 font-black text-xs text-[#ffd84d]">
                <span className="text-base">{s.icon}</span>
                <span>{s.title}</span>
              </div>
              <p className="text-[10.5px] text-[#7eb89a] mt-1 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 6. MONEYX RICH FOOTER (File 1 + File 2 Combined) ==================== */}
      <footer className="rounded-2xl bg-gradient-to-b from-[#071f18] to-[#050f0c] border border-white/10 p-4 text-[#7eb89a] space-y-4">
        {/* Payment Methods */}
        <div>
          <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-wider mb-2">
            Payment Methods · মূল্যপরিশোধ পদ্ধতি
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'bKash', bg: 'bg-[#E2136E] text-white' },
              { name: 'Nagad', bg: 'bg-orange-600 text-white' },
              { name: 'Rocket', bg: 'bg-purple-700 text-white' },
              { name: 'Upay', bg: 'bg-sky-600 text-white' },
              { name: 'Bank', bg: 'bg-emerald-700 text-white' },
              { name: 'Crypto USDT', bg: 'bg-teal-600 text-white' },
              { name: '18+', bg: 'bg-rose-700 text-white' },
            ].map((pm) => (
              <span
                key={pm.name}
                onClick={() => onNavigateView('deposit_page')}
                className={`${pm.bg} px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer shadow-sm`}
              >
                {pm.name}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-white/[0.06]" />

        {/* 20 Provider Grid (.cv-providers-grid) */}
        <div>
          <div className="text-[11px] font-extrabold text-white/60 uppercase tracking-wider mb-2">
            Official Gaming Providers
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {providersList.map((prov) => (
              <div
                key={prov}
                onClick={() => onNavigateView('slot_game')}
                className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg min-h-[42px] flex items-center justify-center px-1 text-center text-[10px] font-black text-[#e8f5ee] cursor-pointer transition"
              >
                {prov}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-white/[0.06]" />

        {/* Club Partners, Brand Ambassadors & License */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d4a3a] to-[#071f18] border border-[#1a7a5e] text-[#ffd84d] font-black italic text-base flex items-center justify-center shrink-0">
              MX
            </div>
            <div>
              <div className="font-extrabold text-white text-xs">
                Best Quality Platform — MONEYX
              </div>
              <p className="text-[10px] text-[#7eb89a] mt-0.5 leading-relaxed">
                কুরাসাও সরকারের দ্বারা নিয়ন্ত্রিত ও লাইসেন্সপ্রাপ্ত এবং Gaming
                Services Provider N.V.-এর মাস্টার লাইসেন্স #366/JAZ এর অধীনে
                পরিচালিত।
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
            <div className="font-extrabold text-white text-xs">
              অফিসিয়াল ক্লাব পার্টনার ও স্পনসর
            </div>
            <div className="text-[10px] text-[#7eb89a] mt-1 leading-relaxed">
              Crystal Palace F.C. · Burnley F.C. · Huddersfield Town · Los
              Angeles Knight Riders · Galle Titans
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-white text-xs">
                MONEYX Bangladesh — Top Casino &amp; Betting
              </div>
              <div className="text-[10px] text-[#7eb89a] mt-1">
                © 2026 MONEYX. All Rights Reserved. +18
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-[#f0c030]/40 text-[#ffd84d] text-[10px] font-black uppercase cursor-pointer shrink-0 hover:bg-amber-500/25"
            >
              👑 Admin
            </button>
          </div>
        </div>
      </footer>

      {/* ==================== 7. FLOATING SOCIAL BUTTONS (.float-social-btns from File 1) ==================== */}
      <div className="fixed left-3 bottom-[84px] z-40 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onOpenModal('support')}
          title="WhatsApp"
          className="w-[42px] h-[42px] rounded-full bg-[#25d366] text-white flex items-center justify-center text-lg shadow-lg cursor-pointer active:scale-90 transition"
        >
          <i className="fab fa-whatsapp" />
        </button>
        <button
          type="button"
          onClick={() => onOpenModal('invite')}
          title="Facebook"
          className="w-[42px] h-[42px] rounded-full bg-[#1877f2] text-white flex items-center justify-center text-base shadow-lg cursor-pointer active:scale-90 transition"
        >
          <i className="fab fa-facebook-f" />
        </button>
        <button
          type="button"
          onClick={() => onOpenModal('invite')}
          title="Telegram"
          className="w-[42px] h-[42px] rounded-full bg-[#0088cc] text-white flex items-center justify-center text-base shadow-lg cursor-pointer active:scale-90 transition"
        >
          <i className="fab fa-telegram-plane" />
        </button>
        <button
          type="button"
          onClick={() => onOpenModal('support')}
          title="Live Support"
          className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#0d7a55] to-[#13a36e] text-white flex items-center justify-center text-base shadow-lg cursor-pointer active:scale-90 transition"
        >
          <i className="fas fa-headset" />
        </button>
      </div>
    </div>
  );
};
