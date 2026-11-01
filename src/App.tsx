import React, { useEffect, useState } from 'react';
import { AuthViews } from './components/AuthViews';
import { BinaryTradingView } from './components/BinaryTradingView';
import {
  CompletePaymentView,
  PendingDepositData,
  WithdrawMoneyView,
} from './components/CompletePaymentAndWithdrawViews';
import {
  DailyBonusFloatingWidget,
  FundsManagementView,
  PillBottomNav,
} from './components/FundsManagementView';
import {
  BetConfirmationSheet,
  FeatureModals,
  ResultPopupModal,
} from './components/Modals';
import {
  AppInstallTopBanner,
  NynoBetDesktopMegaNav,
  NynoDollarCombinedFooterAndLiveSections,
  TactileTwoColumnSidebar,
} from './components/NynoDollarCombinedSections';
import { OwnerKamranAdminPanel } from './components/OwnerKamranAdminPanel';
import {
  MoneyxPWAInstallModal,
  OfflineIndicator,
} from './components/PWAInstallModal';
import { SuperAceSlotView } from './components/SuperAceSlotView';
import {
  WingoTradingView,
  formatPeriodId,
  getNumberColor,
} from './components/WingoTradingView';
import {
  ActiveView,
  BinaryTrade,
  BonusRecord,
  ModalType,
  ResultPopupData,
  SavedWithdrawalWallet,
  SiteAdminSettings,
  TransactionRecord,
  UserProfile,
  WingoBet,
  WingoResult,
} from './types';

const STORAGE_KEYS = {
  BALANCE: 'moneyx_balance_v1',
  PROFILE: 'moneyx_profile_v1',
  WINGO_BETS: 'moneyx_wingo_bets_v1',
  BINARY_TRADES: 'moneyx_binary_trades_v1',
  TRANSACTIONS: 'moneyx_transactions_v1',
  BONUSES: 'moneyx_bonuses_v1',
  FAVORITES: 'moneyx_favorites_v1',
  SAVED_WALLETS: 'moneyx_saved_wallets_v1',
  ADMIN_SETTINGS: 'moneyx_admin_settings_v1',
};

export type GameCategoryType =
  | 'hot'
  | 'popular'
  | 'live'
  | 'sports'
  | 'slots'
  | 'poker'
  | 'fishing'
  | 'dice'
  | 'lottery'
  | 'crash'
  | 'card'
  | 'table';

interface GameItem {
  id: string;
  name: string;
  provider: string;
  category: GameCategoryType;
  img: string;
  accent: string;
  iconText: string;
  actionView?: ActiveView;
}

const GAME_CATALOG: GameItem[] = [
  // ==================== HOT GAMES ====================
  {
    id: 'binary-pro',
    name: 'Binary OTC Pro',
    provider: 'MONEYX ORIGINAL',
    category: 'hot',
    img: '',
    accent: 'from-emerald-600 via-teal-800 to-slate-950',
    iconText: '📈 +96%',
    actionView: 'binary',
  },
  {
    id: 'wingo-30s',
    name: 'WinGo 30s Live',
    provider: 'MONEYX LOTTERY',
    category: 'hot',
    img: 'https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/lotterycategory_20230725010909y1nq%20(1).png',
    accent: 'from-amber-500 via-emerald-700 to-teal-950',
    iconText: '🎱 30S',
    actionView: 'trading',
  },
  {
    id: '737',
    name: 'Aviator',
    provider: 'SPRIBE',
    category: 'hot',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/737/public',
    accent: 'from-rose-600 via-red-800 to-slate-950',
    iconText: '✈️ CRASH',
    actionView: 'slot_game',
  },
  {
    id: '879',
    name: 'Super Ace',
    provider: 'JILI',
    category: 'hot',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/super-ace.png',
    accent: 'from-amber-500 via-yellow-700 to-amber-950',
    iconText: '🃏 ACE',
    actionView: 'slot_game',
  },
  {
    id: '792',
    name: 'Fortune Gems',
    provider: 'JILI',
    category: 'hot',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/fortune-gems.png',
    accent: 'from-emerald-500 via-teal-700 to-emerald-950',
    iconText: '💎 GEMS',
    actionView: 'slot_game',
  },
  {
    id: '6260',
    name: 'BtiGaming',
    provider: 'BTI SPORTS',
    category: 'hot',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6260/public',
    accent: 'from-teal-500 via-emerald-800 to-slate-950',
    iconText: '⚽ BTI',
    actionView: 'slot_game',
  },

  // ==================== POPULAR GAMES ====================
  {
    id: '581',
    name: 'Super Ace Deluxe',
    provider: 'JILI',
    category: 'popular',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/super-ace-deluxe.png',
    accent: 'from-yellow-500 via-amber-700 to-slate-950',
    iconText: '🂡 DELUXE',
    actionView: 'slot_game',
  },
  {
    id: '4602',
    name: 'Revenge of Loki',
    provider: 'PRAGMATIC',
    category: 'popular',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/4602/public',
    accent: 'from-emerald-600 via-teal-800 to-slate-950',
    iconText: '⚡ LOKI',
    actionView: 'slot_game',
  },
  {
    id: '1074',
    name: 'Mega Ace',
    provider: 'JILI',
    category: 'popular',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/mega-ace.png',
    accent: 'from-amber-500 via-orange-700 to-slate-950',
    iconText: '👑 MEGA',
    actionView: 'slot_game',
  },
  {
    id: '75',
    name: 'JILI CAISHEN',
    provider: 'JILI',
    category: 'popular',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/jilijilijili-caishen.png',
    accent: 'from-red-600 via-amber-700 to-slate-950',
    iconText: '🧧 GOLD',
    actionView: 'slot_game',
  },
  {
    id: '4800',
    name: 'Extra Juicy Megaways',
    provider: 'PRAGMATIC',
    category: 'popular',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/4800/public',
    accent: 'from-pink-500 via-rose-700 to-slate-950',
    iconText: '🍒 777',
    actionView: 'slot_game',
  },
  {
    id: '925',
    name: 'Mega Fishing',
    provider: 'JILI',
    category: 'popular',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/fish-mega-fishing.png',
    accent: 'from-cyan-500 via-teal-800 to-slate-950',
    iconText: '🦈 FISH',
    actionView: 'slot_game',
  },

  // ==================== CRASH GAMES ====================
  {
    id: 'crash-aviator',
    name: 'Aviator Pro',
    provider: 'SPRIBE',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/737/public',
    accent: 'from-rose-600 via-red-800 to-slate-950',
    iconText: '✈️ 100X',
    actionView: 'slot_game',
  },
  {
    id: '7195',
    name: 'Air Jet',
    provider: '100HP',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7195/public',
    accent: 'from-sky-600 via-blue-900 to-slate-950',
    iconText: '🛩️ JET',
    actionView: 'slot_game',
  },
  {
    id: '6425',
    name: 'Fortune Crash',
    provider: 'JILI CRASH',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6425/public',
    accent: 'from-amber-500 via-red-800 to-slate-950',
    iconText: '🚀 CRASH',
    actionView: 'slot_game',
  },
  {
    id: '7120',
    name: 'Aviafly',
    provider: 'INOUT',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7120/public',
    accent: 'from-emerald-500 via-teal-800 to-slate-950',
    iconText: '🛫 FLY',
    actionView: 'slot_game',
  },
  {
    id: '7202',
    name: 'Astronaut',
    provider: '100HP',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7202/public',
    accent: 'from-purple-600 via-indigo-900 to-slate-950',
    iconText: '👨‍🚀 SPACE',
    actionView: 'slot_game',
  },
  {
    id: '6989',
    name: 'Aviamasters',
    provider: 'BGAMING',
    category: 'crash',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6989/public',
    accent: 'from-orange-500 via-rose-800 to-slate-950',
    iconText: '🔥 MASTER',
    actionView: 'slot_game',
  },

  // ==================== LIVE CASINO ====================
  {
    id: '6302',
    name: 'Crazy Time A',
    provider: 'EVOLUTION',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/5764/public',
    accent: 'from-amber-500 via-red-700 to-slate-950',
    iconText: '🎡 LIVE',
    actionView: 'slot_game',
  },
  {
    id: '5764',
    name: 'Mega Roulette',
    provider: 'PRAGMATIC LIVE',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/5764/public',
    accent: 'from-emerald-600 via-green-800 to-slate-950',
    iconText: '🎯 500X',
    actionView: 'slot_game',
  },
  {
    id: '5746',
    name: 'Speed Baccarat 3',
    provider: 'EVOLUTION',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/5746/public',
    accent: 'from-amber-600 via-yellow-800 to-slate-950',
    iconText: '🎴 VIP',
    actionView: 'slot_game',
  },
  {
    id: '5685',
    name: 'Italian Mega Roulette',
    provider: 'EVOLUTION',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/5685/public',
    accent: 'from-teal-600 via-emerald-800 to-slate-950',
    iconText: '🎰 LIVE',
    actionView: 'slot_game',
  },
  {
    id: '5669',
    name: 'Baccarat 8',
    provider: 'PRAGMATIC LIVE',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/5669/public',
    accent: 'from-rose-600 via-red-900 to-slate-950',
    iconText: '♠️ BACC',
    actionView: 'slot_game',
  },
  {
    id: '6298',
    name: 'Cash or Crash',
    provider: 'EVOLUTION',
    category: 'live',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/737/public',
    accent: 'from-amber-500 via-teal-800 to-slate-950',
    iconText: '🚀 CASH',
    actionView: 'slot_game',
  },

  // ==================== SPORTS ====================
  {
    id: '7004',
    name: 'LuckSportGaming',
    provider: 'SPORTSBOOK',
    category: 'sports',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7004/public',
    accent: 'from-emerald-500 via-green-800 to-slate-950',
    iconText: '🏏 LIVE',
    actionView: 'slot_game',
  },
  {
    id: '4451',
    name: 'SABA Sports',
    provider: 'SABA',
    category: 'sports',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/4451/public',
    accent: 'from-teal-500 via-emerald-800 to-slate-950',
    iconText: '⚽ SABA',
    actionView: 'slot_game',
  },
  {
    id: '7463',
    name: 'SBO Sportsbook',
    provider: 'SBOBET',
    category: 'sports',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7463/public',
    accent: 'from-amber-500 via-emerald-800 to-slate-950',
    iconText: '🏆 SBO',
    actionView: 'slot_game',
  },
  {
    id: 'sports-bpl',
    name: 'Cricket Exchange Live',
    provider: 'MONEYX SPORTS',
    category: 'sports',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6260/public',
    accent: 'from-green-600 via-emerald-900 to-slate-950',
    iconText: '🏏 BPL/IPL',
    actionView: 'slot_game',
  },

  // ==================== SLOTS ====================
  {
    id: '634',
    name: 'Agent Ace',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/agent-ace.png',
    accent: 'from-amber-500 via-yellow-800 to-slate-950',
    iconText: '🕵️ ACE',
    actionView: 'slot_game',
  },
  {
    id: '931',
    name: 'Ali Baba',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/ali-baba.png',
    accent: 'from-yellow-500 via-amber-800 to-slate-950',
    iconText: '🏺 GOLD',
    actionView: 'slot_game',
  },
  {
    id: '699',
    name: 'Boxing King',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/boxing-king.png',
    accent: 'from-red-600 via-rose-800 to-slate-950',
    iconText: '🥊 KING',
    actionView: 'slot_game',
  },
  {
    id: '700',
    name: 'Charge Buffalo',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/charge-buffalo.png',
    accent: 'from-amber-600 via-orange-900 to-slate-950',
    iconText: '🦬 WILD',
    actionView: 'slot_game',
  },
  {
    id: '482',
    name: 'Book of Gold',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/book-of-gold.png',
    accent: 'from-yellow-400 via-amber-700 to-slate-950',
    iconText: '📖 777',
    actionView: 'slot_game',
  },
  {
    id: '468',
    name: 'Crazy Hunter',
    provider: 'JILI',
    category: 'slots',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/crazy-hunter.png',
    accent: 'from-emerald-500 via-teal-800 to-slate-950',
    iconText: '🎯 HUNT',
    actionView: 'slot_game',
  },

  // ==================== POKER & FISHING ====================
  {
    id: '1308',
    name: 'ALL-IN POKER',
    provider: 'JILI POKER',
    category: 'poker',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/1308/public',
    accent: 'from-emerald-600 via-teal-900 to-slate-950',
    iconText: '♠️ ALL-IN',
    actionView: 'slot_game',
  },
  {
    id: '7296',
    name: 'Crystal Poker',
    provider: 'EVOPLAY',
    category: 'poker',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7296/public',
    accent: 'from-teal-500 via-emerald-800 to-slate-950',
    iconText: '♦️ POKER',
    actionView: 'slot_game',
  },
  {
    id: '7285',
    name: 'Video Poker',
    provider: 'EVOPLAY',
    category: 'poker',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7285/public',
    accent: 'from-amber-500 via-teal-900 to-slate-950',
    iconText: '🃏 VIDEO',
    actionView: 'slot_game',
  },
  {
    id: '728',
    name: 'All-star Fishing',
    provider: 'JILI FISHING',
    category: 'fishing',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/fish-all-star-fishing.png',
    accent: 'from-cyan-500 via-teal-800 to-slate-950',
    iconText: '🐟 STAR',
    actionView: 'slot_game',
  },
  {
    id: '698',
    name: 'Bombing Fishing',
    provider: 'JILI FISHING',
    category: 'fishing',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/fish-bombing-fishing.png',
    accent: 'from-blue-500 via-cyan-800 to-slate-950',
    iconText: '💣 FISH',
    actionView: 'slot_game',
  },
  {
    id: '922',
    name: 'Jackpot Fishing',
    provider: 'JILI FISHING',
    category: 'fishing',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/fish-jackpot-fishing.png',
    accent: 'from-amber-500 via-cyan-800 to-slate-950',
    iconText: '🦈 JACKPOT',
    actionView: 'slot_game',
  },

  // ==================== DICE GAMES ====================
  {
    id: '6894',
    name: "Aztec's Claw Wild Dice",
    provider: 'BGAMING',
    category: 'dice',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6894/public',
    accent: 'from-amber-500 via-emerald-800 to-slate-950',
    iconText: '🎲 AZTEC',
    actionView: 'slot_game',
  },
  {
    id: '3373',
    name: 'Bonus Dice',
    provider: 'EGT',
    category: 'dice',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/3373/public',
    accent: 'from-rose-500 via-amber-800 to-slate-950',
    iconText: '🎲 BONUS',
    actionView: 'slot_game',
  },
  {
    id: '6875',
    name: 'Dice Bonanza',
    provider: 'BGAMING',
    category: 'dice',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6875/public',
    accent: 'from-purple-500 via-teal-800 to-slate-950',
    iconText: '🎲 100X',
    actionView: 'slot_game',
  },
  {
    id: '6984',
    name: 'Dice Clash',
    provider: 'BGAMING',
    category: 'dice',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6984/public',
    accent: 'from-emerald-500 via-cyan-800 to-slate-950',
    iconText: '⚔️ DICE',
    actionView: 'slot_game',
  },

  // ==================== LOTTERY ====================
  {
    id: 'lottery-wingo',
    name: 'WinGo 30s Color Draw',
    provider: 'MONEYX LOTTERY',
    category: 'lottery',
    img: 'https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/lotterycategory_20230725010909y1nq%20(1).png',
    accent: 'from-amber-500 via-emerald-700 to-slate-950',
    iconText: '🎱 WINGO',
    actionView: 'trading',
  },
  {
    id: '1363',
    name: 'CQ9 Lottery',
    provider: 'CQ9',
    category: 'lottery',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/1363/public',
    accent: 'from-yellow-500 via-amber-800 to-slate-950',
    iconText: '🎟️ CQ9',
    actionView: 'trading',
  },
  {
    id: '7908',
    name: 'Magic Keno',
    provider: 'TURBO GAMES',
    category: 'lottery',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7908/public',
    accent: 'from-teal-500 via-emerald-800 to-slate-950',
    iconText: '🔮 KENO',
    actionView: 'trading',
  },

  // ==================== CARD & TABLE GAMES ====================
  {
    id: '1296',
    name: 'Dragon Tiger - Joker Bonus',
    provider: 'CQ9',
    category: 'card',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/1296/public',
    accent: 'from-red-600 via-amber-800 to-slate-950',
    iconText: '🐉🐯 DT',
    actionView: 'slot_game',
  },
  {
    id: '908',
    name: 'Pusoy Rush',
    provider: 'JILI',
    category: 'card',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/pusoy-go.png',
    accent: 'from-emerald-600 via-teal-800 to-slate-950',
    iconText: '🃏 PUSOY',
    actionView: 'slot_game',
  },
  {
    id: '962',
    name: 'Tongits Go',
    provider: 'JILI',
    category: 'card',
    img: 'https://cdn.gambllyapi.com/assets/providers/JL/tongits-go.png',
    accent: 'from-amber-500 via-yellow-800 to-slate-950',
    iconText: '🎴 TONGITS',
    actionView: 'slot_game',
  },
  {
    id: '6965',
    name: 'Classic Multihand Blackjack',
    provider: 'BGAMING',
    category: 'table',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6965/public',
    accent: 'from-emerald-600 via-slate-900 to-black',
    iconText: '🂡 21 BJ',
    actionView: 'slot_game',
  },
  {
    id: '6891',
    name: 'European Roulette VIP',
    provider: 'BGAMING',
    category: 'table',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/6891/public',
    accent: 'from-red-700 via-emerald-900 to-slate-950',
    iconText: '🎡 ROULETTE',
    actionView: 'slot_game',
  },
  {
    id: '7344',
    name: 'Texas Holdem Poker 3D',
    provider: 'EVOPLAY',
    category: 'table',
    img: 'https://imagedelivery.net/nVyft9zNw2I0pNVtrnC1zA/7344/public',
    accent: 'from-amber-600 via-teal-900 to-slate-950',
    iconText: '♠️ HOLDEM',
    actionView: 'slot_game',
  },
];

function generateInitialWingoHistory(count = 40): WingoResult[] {
  const currentPeriod = Math.floor(Date.now() / 1000 / 30);
  const results: WingoResult[] = [];
  for (let i = 1; i <= count; i++) {
    const p = currentPeriod - i;
    const seed = Math.abs(Math.sin(p * 12.9898) * 43758.5453);
    const num = Math.floor((seed - Math.floor(seed)) * 10);
    const size: 'Big' | 'Small' = num >= 5 ? 'Big' : 'Small';
    const color = getNumberColor(num);
    results.push({
      period: formatPeriodId(p),
      periodNum: p,
      number_result: num,
      size_result: size,
      color_result: color,
      timestamp: new Date(p * 30 * 1000).toLocaleTimeString(),
    });
  }
  return results;
}

const GameCardItem: React.FC<{
  game: GameItem;
  isFav: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onSelect: (game: GameItem) => void;
}> = ({ game, isFav, onToggleFav, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect(game)}
      className="d333-game-card cursor-pointer group"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-[#0a2e22]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${game.accent} flex flex-col items-center justify-center p-2 text-center`}
        >
          <div className="text-xl font-black text-[#ffd84d] drop-shadow-md">
            {game.iconText}
          </div>
          <div className="text-[10px] font-extrabold text-white/90 uppercase tracking-wider mt-1 line-clamp-1">
            {game.name}
          </div>
          <div className="text-[8px] font-bold text-[#7eb89a] mt-0.5">
            {game.provider}
          </div>
        </div>

        {game.img && !imgError && (
          <img
            src={game.img}
            alt={game.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="relative z-[1] w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Play Hover Overlay Badge */}
        <div className="absolute inset-0 z-[2] bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1 rounded-full bg-gradient-to-b from-[#ffd84d] to-[#c89a10] text-[#1a0f00] text-[10px] font-black uppercase shadow-lg">
            ▶ PLAY
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => onToggleFav(game.id, e)}
          title="Favorite"
          className={`
            absolute top-1.5 right-1.5 z-10 w-[26px] h-[26px] rounded-full
            backdrop-blur-sm flex items-center justify-center text-xs cursor-pointer transition-colors
            ${
              isFav
                ? 'bg-[#f0c030]/25 text-[#ffd84d]'
                : 'bg-black/45 text-white/65 hover:text-white'
            }
          `}
        >
          ♥
        </button>
      </div>
      <div className="text-[11px] font-bold text-[#e8f5ee] py-1.5 px-1.5 text-center truncate bg-[#0d3d2c]">
        {game.name}
      </div>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (
      path.includes('/owner_kamran-admin-panel') ||
      hash.includes('owner_kamran-admin-panel')
    ) {
      return 'admin_panel';
    }
    return 'home';
  });
  const [fundsInitialTab, setFundsInitialTab] = useState<
    'deposit' | 'withdraw'
  >('deposit');
  const [wingoSubTab, setWingoSubTab] = useState<'history' | 'chart' | 'my'>(
    'history'
  );
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pwaModalOpen, setPwaModalOpen] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // MONEYX UI States
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [bannerSlide, setBannerSlide] = useState<number>(0);
  const [jackpotValue, setJackpotValue] = useState<number>(88492615);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['binary-pro', 'wingo-30s', '737', '879'];
  });

  // User Balance
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return saved !== null ? parseFloat(saved) : 5000.0;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback below
      }
    }
    return {
      nickname: 'MONEYX VIP',
      uid: '883921',
      mobile: '01770618575',
      isLoggedIn: false,
      avatar:
        'https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/viip-removebg-preview.png',
      vipLevel: 1,
      lastLogin: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
  });

  const [wingoHistory, setWingoHistory] = useState<WingoResult[]>(() =>
    generateInitialWingoHistory(45)
  );

  const [wingoBets, setWingoBets] = useState<WingoBet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WINGO_BETS);
    return saved ? JSON.parse(saved) : [];
  });

  const [binaryTrades, setBinaryTrades] = useState<BinaryTrade[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BINARY_TRADES);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'dep-init-1',
        type: 'Deposit',
        method: 'bKash',
        amount: 5000,
        account: '01770618575',
        trxId: 'BKA984120M',
        paymentID: 'TR00118839210',
        orderID: 'ORD1020069',
        status: 'Completed',
        createdAt: new Date().toLocaleTimeString(),
      },
    ];
  });

  const [bonuses, setBonuses] = useState<BonusRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BONUSES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'bon-init-1',
        title: 'MONEYX 10% Welcome Bonus',
        amount: 500,
        createdAt: new Date().toLocaleDateString(),
      },
    ];
  });

  // Bet Sheet & Result Popup states
  const [betSheetOpen, setBetSheetOpen] = useState<boolean>(false);
  const [betSheetChoice, setBetSheetChoice] = useState<string>('Big');
  const [betSheetMult, setBetSheetMult] = useState<number>(1);
  const [resultPopup, setResultPopup] = useState<ResultPopupData | null>(null);

  // Pending Deposit for Complete Payment Screen & Playable Game Info & Saved Wallets
  const [pendingDeposit, setPendingDeposit] = useState<PendingDepositData>({
    method: 'bKash',
    amount: 1000,
    promoTitle: 'Regular Deposit',
    promoBonusPct: 0,
  });
  const [selectedSlotGame, setSelectedSlotGame] = useState<{
    name: string;
    provider: string;
    category: string;
  }>({ name: 'Super Ace', provider: 'JILI', category: 'slots' });

  const [savedWallets, setSavedWallets] = useState<SavedWithdrawalWallet[]>(
    () => {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_WALLETS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
      return [
        {
          id: 'w-init-1',
          method: 'bKash',
          accountNumber: '01770618575',
          pin: '1234',
        },
      ];
    }
  );

  const [adminSettings, setAdminSettings] = useState<SiteAdminSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      bkashNumber: '+959686685260',
      nagadNumber: '+959686685260',
      rocketNumber: '+959686685260',
      depositBonusPct: 10,
      minDeposit: 100,
      maxDeposit: 25000,
      minWithdraw: 200,
      maxWithdraw: 25000,
      announcementText:
        'Welcome to MONEYX — Bangladesh #1 Live Casino, Slots, Crash & Trading Platform! bKash, Nagad, Rocket 10% Instant Deposit Bonus! Install MONEYX App for +৳150 Free Bonus!',
      forcedWingoResult: null,
      adminPin: '2026',
    };
  });

  // Listen to browser URL changes for /owner_kamran-admin-panel
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (
        path.includes('/owner_kamran-admin-panel') ||
        hash.includes('owner_kamran-admin-panel')
      ) {
        setActiveView('admin_panel');
      } else if (activeView === 'admin_panel') {
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeView]);

  const handleOpenAdminPanel = () => {
    try {
      window.history.pushState({}, '', '/owner_kamran-admin-panel');
    } catch {
      // fallback if pushState restricted
    }
    setActiveView('admin_panel');
    window.scrollTo(0, 0);
  };

  const handleExitAdminPanel = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      // fallback
    }
    setActiveView('home');
    window.scrollTo(0, 0);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toFixed(2));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_SETTINGS,
      JSON.stringify(adminSettings)
    );
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SAVED_WALLETS,
      JSON.stringify(savedWallets)
    );
  }, [savedWallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WINGO_BETS, JSON.stringify(wingoBets));
  }, [wingoBets]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.BINARY_TRADES,
      JSON.stringify(binaryTrades)
    );
  }, [binaryTrades]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BONUSES, JSON.stringify(bonuses));
  }, [bonuses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Auto-advance Hero Slider & Live Jackpot Ticker
  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setBannerSlide((prev) => (prev + 1) % 3);
    }, 4000);
    const jackpotTimer = setInterval(() => {
      setJackpotValue((prev) => prev + Math.floor(15 + Math.random() * 95));
    }, 1400);
    return () => {
      clearInterval(sliderTimer);
      clearInterval(jackpotTimer);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const handleRefreshBalance = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Balance Synchronized');
    }, 600);
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      triggerToast(exists ? 'Removed from Favorites' : '♥ Added to Favorites');
      return next;
    });
  };

  // Every single game card in MONEYX is playable!
  const handleSelectGame = (game: GameItem) => {
    if (game.id === 'binary-pro') {
      setActiveView('binary');
      window.scrollTo(0, 0);
      return;
    }
    if (game.id === 'wingo-30s' || game.category === 'lottery') {
      setWingoSubTab('history');
      setActiveView('trading');
      window.scrollTo(0, 0);
      return;
    }
    // Launch the 5-Engine Universal Playable Arena (Slot, Aviator Crash, Fishing Cannon, Live Casino Dealer, or 3D Dice/Sports)
    setSelectedSlotGame({
      name: game.name,
      provider: game.provider,
      category: game.category,
    });
    setActiveView('slot_game');
    window.scrollTo(0, 0);
  };

  const handleOpenFundsPage = (tab: 'deposit' | 'withdraw') => {
    if (tab === 'withdraw') {
      setActiveView('withdraw_page');
    } else {
      setFundsInitialTab('deposit');
      setActiveView('deposit_page');
    }
    window.scrollTo(0, 0);
  };

  // WinGo 30s Bet Placement
  const handleOpenWingoBetModal = (choice: string, presetMult = 1) => {
    setBetSheetChoice(choice);
    setBetSheetMult(presetMult);
    setBetSheetOpen(true);
  };

  const handleConfirmWingoBet = (
    choice: string,
    totalAmount: number,
    mult: number
  ) => {
    if (totalAmount > balance) {
      triggerToast('Insufficient BDT Balance! Please Deposit.');
      return;
    }

    const currentPeriodNum = Math.floor(Date.now() / 1000 / 30);
    const newBet: WingoBet = {
      id: `wg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      period: formatPeriodId(currentPeriodNum),
      periodNum: currentPeriodNum,
      choice,
      amount: totalAmount,
      multiplier: mult,
      status: 'Pending',
      winAmount: 0,
      createdAt: new Date().toLocaleTimeString(),
    };

    setBalance((prev) => Number((prev - totalAmount).toFixed(2)));
    setWingoBets((prev) => [newBet, ...prev]);
    setBetSheetOpen(false);
    triggerToast(`Trade Placed: ${choice} (BDT ${totalAmount.toFixed(2)})`);
  };

  // Resolve WinGo 30s Period & Settle Pending Bets
  const handleResolveWingoPeriod = (result: WingoResult) => {
    setWingoHistory((prev) => {
      if (prev.some((r) => r.period === result.period)) return prev;
      return [result, ...prev.slice(0, 59)];
    });

    setWingoBets((prevBets) => {
      let anyPendingForPeriod = false;
      let totalWonInPeriod = 0;

      const updated = prevBets.map((bet) => {
        if (bet.period === result.period && bet.status === 'Pending') {
          anyPendingForPeriod = true;
          let won = false;
          let payoutRate = 1.96;

          if (bet.choice === 'Big' && result.size_result === 'Big') {
            won = true;
            payoutRate = 1.96;
          } else if (bet.choice === 'Small' && result.size_result === 'Small') {
            won = true;
            payoutRate = 1.96;
          } else if (
            bet.choice === 'Green' &&
            result.color_result.includes('Green')
          ) {
            won = true;
            payoutRate = result.number_result === 5 ? 1.5 : 2.0;
          } else if (
            bet.choice === 'Red' &&
            result.color_result.includes('Red')
          ) {
            won = true;
            payoutRate = result.number_result === 0 ? 1.5 : 2.0;
          } else if (
            bet.choice === 'Violet' &&
            result.color_result.includes('Violet')
          ) {
            won = true;
            payoutRate = 4.5;
          }

          const winAmt = won
            ? Number((bet.amount * payoutRate).toFixed(2))
            : 0;
          if (won) totalWonInPeriod += winAmt;

          return {
            ...bet,
            status: (won ? 'Win' : 'Lose') as 'Win' | 'Lose',
            winAmount: winAmt,
            resultNumber: result.number_result,
            resultSize: result.size_result,
          };
        }
        return bet;
      });

      if (anyPendingForPeriod) {
        if (totalWonInPeriod > 0) {
          setBalance((b) => Number((b + totalWonInPeriod).toFixed(2)));
        }
        setResultPopup({
          mode: 'Trading',
          periodOrPair: `Period ${result.period}`,
          resultText: `${result.number_result} · ${result.size_result} (${result.color_result})`,
          winAmount: totalWonInPeriod,
          isWin: totalWonInPeriod > 0,
        });
      }

      return updated;
    });
  };

  // Binary Trading Placement & Settlement
  const handlePlaceBinaryTrade = (
    tradeInput: Omit<BinaryTrade, 'id' | 'status' | 'profit' | 'createdAt'>
  ): boolean => {
    if (tradeInput.amount > balance) {
      triggerToast('Insufficient BDT Balance');
      return false;
    }

    const newTrade: BinaryTrade = {
      ...tradeInput,
      id: `bin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'OPEN',
      profit: 0,
      createdAt: new Date().toLocaleTimeString(),
    };

    setBalance((prev) => Number((prev - tradeInput.amount).toFixed(2)));
    setBinaryTrades((prev) => [newTrade, ...prev]);
    return true;
  };

  const handleSettleBinaryTrade = (tradeId: string, exitPrice: number) => {
    setBinaryTrades((prev) =>
      prev.map((t) => {
        if (t.id !== tradeId || t.status !== 'OPEN') return t;

        const isWin =
          (t.direction === 'CALL' && exitPrice > t.entryPrice) ||
          (t.direction === 'PUT' && exitPrice < t.entryPrice);

        const totalPayout = isWin
          ? Number((t.amount * (1 + t.payoutPercent / 100)).toFixed(2))
          : 0;

        if (isWin) {
          setBalance((b) => Number((b + totalPayout).toFixed(2)));
        }

        return {
          ...t,
          exitPrice,
          status: isWin ? 'WIN' : 'LOSE',
          profit: totalPayout,
        };
      })
    );
  };

  // Wallet Deposit / Withdraw / Bonus Handlers
  const handleDeposit = (
    method: TransactionRecord['method'],
    amount: number,
    account: string,
    trxId: string,
    paymentID?: string,
    orderID?: string
  ) => {
    const rec: TransactionRecord = {
      id: `dep-${Date.now()}`,
      type: 'Deposit',
      method,
      amount,
      account,
      trxId,
      paymentID,
      orderID,
      status: 'Completed',
      createdAt: new Date().toLocaleTimeString(),
    };
    setTransactions((prev) => [rec, ...prev]);
    setBalance((prev) => Number((prev + amount).toFixed(2)));
    triggerToast(`✓ Deposit BDT ${amount.toFixed(2)} Credited!`);
  };

  const handleWithdraw = (
    method: TransactionRecord['method'],
    amount: number,
    account: string
  ): boolean => {
    if (amount < 200) {
      triggerToast('Minimum withdrawal is BDT 200');
      return false;
    }
    if (amount > balance) {
      triggerToast('Insufficient balance for withdrawal');
      return false;
    }
    const rec: TransactionRecord = {
      id: `wit-${Date.now()}`,
      type: 'Withdraw',
      method,
      amount,
      account,
      trxId: `WTH${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      createdAt: new Date().toLocaleTimeString(),
    };
    setTransactions((prev) => [rec, ...prev]);
    setBalance((prev) => Number((prev - amount).toFixed(2)));
    triggerToast(`✓ Withdrawal BDT ${amount.toFixed(2)} Submitted!`);
    return true;
  };

  const handleClaimBonus = (title: string, amount: number) => {
    const bon: BonusRecord = {
      id: `bon-${Date.now()}`,
      title,
      amount,
      createdAt: new Date().toLocaleTimeString(),
    };
    setBonuses((prev) => [bon, ...prev]);
    setBalance((prev) => Number((prev + amount).toFixed(2)));
    triggerToast(`✓ Claimed +BDT ${amount.toFixed(2)} (${title})`);
  };

  const handleSuccessAuth = (mobile: string, isNewUser: boolean) => {
    setProfile((prev) => ({
      ...prev,
      mobile,
      nickname: `MONEYX VIP ${mobile.slice(-4)}`,
      isLoggedIn: true,
    }));
    if (isNewUser) {
      handleClaimBonus('MONEYX New Member Bonus', 200);
    } else {
      triggerToast(`✓ Logged in as ${mobile}`);
    }
    setActiveView('home');
    window.scrollTo(0, 0);
  };

  const handleResetSession = () => {
    setBalance(5000.0);
    setBinaryTrades([]);
    setWingoBets([]);
    setProfile((prev) => ({ ...prev, isLoggedIn: false }));
    triggerToast('Account reset to BDT 5,000.00');
  };

  const formattedJackpot = jackpotValue.toLocaleString('en-US');

  const categoryTabs = [
    { id: 'ALL', label: 'HOT GAMES', icon: '🔥' },
    { id: 'FAV', label: 'FAVORITES', icon: '❤️' },
    { id: 'popular', label: 'POPULAR', icon: '🎮' },
    { id: 'crash', label: 'CRASH', icon: '🚀' },
    { id: 'live', label: 'LIVE CASINO', icon: '🎥' },
    { id: 'sports', label: 'SPORTS', icon: '⚽' },
    { id: 'slots', label: 'SLOTS', icon: '🎰' },
    { id: 'poker', label: 'POKER', icon: '♠️' },
    { id: 'fishing', label: 'FISHING', icon: '🐟' },
    { id: 'dice', label: 'DICE GAME', icon: '🎲' },
    { id: 'lottery', label: 'LOTTERY', icon: '🎱' },
    { id: 'card', label: 'CARD & TABLE', icon: '🃏' },
  ];

  // If on Owner Kamran Admin Panel (/owner_kamran-admin-panel)
  if (activeView === 'admin_panel') {
    return (
      <>
        <OfflineIndicator />
        <OwnerKamranAdminPanel
          balance={balance}
          profile={profile}
          settings={adminSettings}
          transactions={transactions}
          bonuses={bonuses}
          wingoBets={wingoBets}
          binaryTrades={binaryTrades}
          savedWallets={savedWallets}
          jackpotValue={jackpotValue}
          onUpdateBalance={(newBal) => setBalance(newBal)}
          onUpdateProfile={(updates) =>
            setProfile((prev) => ({ ...prev, ...updates }))
          }
          onUpdateSettings={(updates) =>
            setAdminSettings((prev) => ({ ...prev, ...updates }))
          }
          onUpdateTransactionStatus={(txId, newStatus) => {
            setTransactions((prev) =>
              prev.map((tx) =>
                tx.id === txId ? { ...tx, status: newStatus } : tx
              )
            );
            triggerToast(`✓ Transaction status updated to ${newStatus}`);
          }}
          onDeleteTransaction={(txId) => {
            setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
            triggerToast('🗑️ Transaction deleted');
          }}
          onAdminAddBonus={handleClaimBonus}
          onUpdateJackpot={(newVal) => setJackpotValue(newVal)}
          onExitAdmin={handleExitAdminPanel}
          onShowToast={triggerToast}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // If on Register or Login view, render full-screen MONEYX Auth page
  if (activeView === 'register' || activeView === 'login') {
    return (
      <>
        <OfflineIndicator />
        <AuthViews
          mode={activeView}
          onSwitchMode={(m) => setActiveView(m)}
          onBack={() => setActiveView('home')}
          onSuccessAuth={handleSuccessAuth}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // If on Universal Playable Game Arena (Slots, Crash, Fishing, Live Casino, Poker, Dice, Sports, Card & Table)
  if (activeView === 'slot_game') {
    return (
      <>
        <OfflineIndicator />
        <SuperAceSlotView
          gameName={selectedSlotGame.name}
          provider={selectedSlotGame.provider}
          gameCategory={selectedSlotGame.category}
          balance={balance}
          onBack={() => setActiveView('home')}
          onUpdateBalance={(delta) =>
            setBalance((prev) => Math.max(0, Number((prev + delta).toFixed(2))))
          }
          onShowToast={triggerToast}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // If on Complete Payment screen
  if (activeView === 'complete_payment') {
    return (
      <>
        <OfflineIndicator />
        <CompletePaymentView
          pendingDeposit={pendingDeposit}
          merchantNumbers={{
            bKash: adminSettings.bkashNumber,
            Nagad: adminSettings.nagadNumber,
            Rocket: adminSettings.rocketNumber,
          }}
          onBack={() => setActiveView('deposit_page')}
          onCompleteDeposit={(
            method,
            amt,
            account,
            trxId,
            paymentID,
            orderID
          ) => {
            handleDeposit(method, amt, account, trxId, paymentID, orderID);
            const gatewayBonus = Math.round(
              amt * (adminSettings.depositBonusPct / 100)
            );
            const promoBonus =
              pendingDeposit.promoBonusPct > 0
                ? Math.round((amt * pendingDeposit.promoBonusPct) / 100)
                : 0;
            if (gatewayBonus + promoBonus > 0) {
              handleClaimBonus(
                `${method} +${adminSettings.depositBonusPct}%${
                  pendingDeposit.promoBonusPct > 0
                    ? ` & ${pendingDeposit.promoTitle}`
                    : ''
                }`,
                gatewayBonus + promoBonus
              );
            }
            setActiveView('home');
            window.scrollTo(0, 0);
          }}
          onShowToast={triggerToast}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // If on Withdraw Money page
  if (activeView === 'withdraw_page') {
    const totalBonusBalance = bonuses.reduce((sum, b) => sum + b.amount, 0);
    const totalTurnover =
      wingoBets.reduce((sum, b) => sum + b.amount, 0) +
      binaryTrades.reduce((sum, t) => sum + t.amount, 0);

    return (
      <>
        <OfflineIndicator />
        <WithdrawMoneyView
          balance={balance}
          bonusBalance={totalBonusBalance}
          turnoverDone={totalTurnover}
          savedWallets={savedWallets}
          transactions={transactions}
          onBack={() => setActiveView('home')}
          onAddWallet={(newW) => {
            const created: SavedWithdrawalWallet = {
              ...newW,
              id: `w-${Date.now()}`,
            };
            setSavedWallets((prev) => [created, ...prev]);
          }}
          onUpdateWalletPin={(walletId, newPin) => {
            setSavedWallets((prev) =>
              prev.map((w) => (w.id === walletId ? { ...w, pin: newPin } : w))
            );
          }}
          onSubmitWithdraw={handleWithdraw}
          onShowToast={triggerToast}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => setActiveView(v)}
          onOpenModal={(m) => setActiveModal(m)}
        />
        <FeatureModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          balance={balance}
          profile={profile}
          onUpdateProfile={(updates) =>
            setProfile((prev) => ({ ...prev, ...updates }))
          }
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onClaimBonus={handleClaimBonus}
          transactions={transactions}
          bonuses={bonuses}
          binaryTrades={binaryTrades}
          wingoBets={wingoBets}
          onShowToast={triggerToast}
          onResetSession={handleResetSession}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // If on Deposit / Funds Management view
  if (activeView === 'deposit_page') {
    return (
      <>
        <OfflineIndicator />
        <FundsManagementView
          initialTab={fundsInitialTab}
          balance={balance}
          onBack={() => setActiveView('home')}
          onProceedToCompletePayment={(data) => {
            setPendingDeposit(data);
            setActiveView('complete_payment');
            window.scrollTo(0, 0);
          }}
          onSwitchToWithdrawPage={() => {
            setActiveView('withdraw_page');
            window.scrollTo(0, 0);
          }}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onClaimBonus={handleClaimBonus}
          onShowToast={triggerToast}
        />
        <DailyBonusFloatingWidget
          onClaimDailyBonus={() =>
            handleClaimBonus('Daily Free Gift Bonus', 100)
          }
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => setActiveView(v)}
          onOpenModal={(m) => setActiveModal(m)}
        />
        <FeatureModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          balance={balance}
          profile={profile}
          onUpdateProfile={(updates) =>
            setProfile((prev) => ({ ...prev, ...updates }))
          }
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onClaimBonus={handleClaimBonus}
          transactions={transactions}
          bonuses={bonuses}
          binaryTrades={binaryTrades}
          wingoBets={wingoBets}
          onShowToast={triggerToast}
          onResetSession={handleResetSession}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app-viewport pb-[76px]">
      <OfflineIndicator />

      {/* ==================== MONEYX STICKY TOP HEADER ==================== */}
      <header className="sticky top-0 z-40 h-[56px] bg-[#071f18]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3">
        <div className="flex items-center gap-2.5">
          {/* Custom Hamburger Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="w-9 h-9 rounded-lg bg-white/[0.07] border border-white/15 flex items-center justify-center cursor-pointer active:bg-white/15 transition-colors"
          >
            <div className="flex flex-col gap-1 w-[18px]">
              <div className="flex items-center gap-0.5">
                <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-white shrink-0" />
                <span className="h-[2px] w-full bg-white rounded-sm block" />
              </div>
              <span className="h-[2px] w-full bg-white rounded-sm block" />
              <span className="h-[2px] w-[65%] bg-white rounded-sm block" />
            </div>
          </button>

          {/* MONEYX Glowing Italic Brand Logo */}
          <div
            onClick={() => {
              setActiveView('home');
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
          >
            <img
              src="/icon.svg"
              alt="MONEYX"
              className="w-7 h-7 rounded-lg border border-[#ffd84d]/40 shadow-sm"
            />
            <span
              className="text-[20px] sm:text-[22px] font-black italic text-[#ffd84d] tracking-wider"
              style={{ textShadow: '0 0 20px rgba(240,192,48,0.45)' }}
            >
              MONEY<span className="text-white">X</span>
            </span>
          </div>
        </div>

        {/* Right Actions: PWA App Button + Live Balance + Log In & Register 3D Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setPwaModalOpen(true)}
            title="Install MONEYX App"
            className="hidden xs:inline-flex items-center gap-1 bg-[#0d3d2c] hover:bg-[#13a36e]/30 border border-[#1ec882]/40 text-[#e8f5ee] px-2 py-1 rounded-md text-[10px] font-extrabold cursor-pointer transition-colors"
          >
            <span>📲</span>
            <span className="hidden sm:inline">App</span>
          </button>

          <div
            onClick={handleRefreshBalance}
            className="bg-[#0d3d2c] border border-[#f0c030]/35 rounded-md px-2 py-1 flex items-center gap-1 cursor-pointer"
          >
            <span className="text-[11px] font-extrabold text-[#ffd84d] font-mono-num whitespace-nowrap">
              ৳{balance.toFixed(0)}
            </span>
            <span
              className={`text-[#7eb89a] text-xs inline-block ${
                isRefreshing ? 'refresh-spin' : ''
              }`}
            >
              ↻
            </span>
          </div>

          {profile.isLoggedIn ? (
            <button
              type="button"
              onClick={() => handleOpenFundsPage('deposit')}
              className="btn-3d-green px-3 py-1.5 rounded-md text-xs font-extrabold cursor-pointer whitespace-nowrap"
            >
              + Deposit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className="btn-3d-green px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-extrabold cursor-pointer whitespace-nowrap"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setActiveView('register')}
                className="btn-3d-gold px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-extrabold cursor-pointer whitespace-nowrap"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* ==================== MONEYX APP INSTALL TOP BANNER ==================== */}
      {activeView === 'home' && (
        <AppInstallTopBanner onInstallClick={() => setPwaModalOpen(true)} />
      )}

      {/* ==================== MONEYX DESKTOP MEGA-NAVIGATION BAR ==================== */}
      {activeView === 'home' && (
        <NynoBetDesktopMegaNav
          activeCategory={activeCategory}
          balance={balance}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onNavigateView={(v) => setActiveView(v)}
          onOpenModal={(m) => setActiveModal(m)}
          onOpenInstallModal={() => setPwaModalOpen(true)}
          onClaimWheelReward={handleClaimBonus}
        />
      )}

      {/* ==================== VIEW 1: MONEYX HOME LOBBY ==================== */}
      {activeView === 'home' && (
        <div className="view-animate flex-1">
          {/* Announcement Bar */}
          <div className="bg-white/[0.04] border-b border-white/[0.08] py-1.5 px-3.5 flex items-center gap-2 overflow-hidden">
            <span className="text-sm text-[#ffd84d] shrink-0">📢</span>
            <div className="overflow-hidden flex-1">
              <div className="marquee-track text-xs text-[#7eb89a] font-semibold">
                {adminSettings.announcementText}
              </div>
            </div>
          </div>

          <div className="flex max-w-[1260px] mx-auto">
            {/* 2-Column 3D Tactile Sidebar */}
            <TactileTwoColumnSidebar
              isOpen={sidebarOpen}
              activeCategory={activeCategory}
              onClose={() => setSidebarOpen(false)}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onNavigateView={(v) => setActiveView(v)}
              onOpenModal={(m) => setActiveModal(m)}
              onOpenAdminPanel={handleOpenAdminPanel}
              onOpenInstallModal={() => setPwaModalOpen(true)}
            />

            {/* Main Lobby Content */}
            <div className="flex-1 min-w-0">
              {/* Promo Banner Slider */}
              <div className="pt-2.5 px-2.5 pb-1">
                <div className="relative rounded-xl overflow-hidden h-[170px] sm:h-[210px] border border-[#f0c030]/25 shadow-lg">
                  {bannerSlide === 0 && (
                    <div
                      onClick={() => handleOpenFundsPage('deposit')}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #071f18 0%, #0d7a55 55%, #0a2e22 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          MONEYX EXCLUSIVE OFFER
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          bKash · Nagad · Rocket
                          <span className="block text-[#ffd84d]">
                            10% Instant Bonus!
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          First Deposit up to +129% Promotion Bonus
                        </div>
                        <span className="mt-3 inline-block btn-3d-gold px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          Deposit Now ›
                        </span>
                      </div>
                      <div className="text-right z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071f18]/60 border border-[#f0c030]/40 flex flex-col items-center justify-center shadow-xl">
                          <span className="text-2xl sm:text-3xl font-black text-[#ffd84d]">
                            +10%
                          </span>
                          <span className="text-[10px] font-bold text-[#7eb89a] mt-0.5">
                            BONUS BDT
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerSlide === 1 && (
                    <div
                      onClick={() => setActiveView('binary')}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #041510 0%, #0a5c3e 55%, #13a36e 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          MONEYX বাইনারি ট্রেডিং · OTC PRO
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          Binary Options Trading
                          <span className="block text-[#ffd84d]">
                            Up to +96% Instant Profit
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          BTC/USDT · EUR/USD · GOLD · 10s to 60s Expiry
                        </div>
                        <span className="mt-3 inline-block btn-3d-gold px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          Start Trading ›
                        </span>
                      </div>
                      <div className="z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071f18]/70 border border-emerald-400/40 flex flex-col items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                            +96%
                          </span>
                          <span className="text-[10px] font-bold text-white mt-0.5">
                            OTC LIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerSlide === 2 && (
                    <div
                      onClick={() => setActiveView('trading')}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #0a2e22 0%, #0d3d2c 50%, #c89a10 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          MONEYX উইনগো লটারি · 30 SECONDS
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          WinGo 30s Live Draw
                          <span className="block text-[#ffd84d]">
                            Big · Small · Green · Red
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          Non-stop 30 second draws with instant BDT payout
                        </div>
                        <span className="mt-3 inline-block btn-3d-green px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          Play WinGo 30s ›
                        </span>
                      </div>
                      <div className="z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#071f18]/75 border-2 border-[#ffd84d] flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-[#ffd84d]">
                            30s
                          </span>
                          <span className="text-[10px] font-bold text-white">
                            WIN GO
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Slider Pagination Dots */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {[0, 1, 2].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBannerSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          bannerSlide === idx
                            ? 'w-[18px] bg-[#ffd84d]'
                            : 'w-1.5 bg-white/35'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* DEPOSIT, WITHDRAW & APP INSTALL 3D BUTTONS */}
              <div className="flex gap-2 px-2.5 pt-2.5 pb-1">
                <button
                  type="button"
                  onClick={() => handleOpenFundsPage('deposit')}
                  className="btn-3d-green flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[10px] text-sm font-extrabold cursor-pointer"
                >
                  <span className="text-base">⊕</span>
                  <span>Deposit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenFundsPage('withdraw')}
                  className="btn-3d-gold flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[10px] text-sm font-extrabold cursor-pointer"
                >
                  <span className="text-base">⇧</span>
                  <span>Withdraw</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPwaModalOpen(true)}
                  className="bg-[#0d3d2c] border border-[#f0c030]/40 border-b-[3px] border-b-[#071f18] text-[#ffd84d] flex items-center justify-center gap-1.5 py-3 px-3.5 rounded-[10px] text-xs font-black cursor-pointer active:translate-y-0.5"
                >
                  <span>📲</span>
                  <span className="hidden sm:inline">Install</span>
                  <span>App</span>
                </button>
              </div>

              {/* CATEGORY NAVIGATION BAR */}
              <nav className="pt-3 px-2.5 overflow-x-auto whitespace-nowrap no-scrollbar">
                <div className="inline-flex gap-2 pb-2.5">
                  {categoryTabs.map((cat) => {
                    const active = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                          inline-flex items-center gap-1.5 py-[7px] px-3.5 rounded-full text-xs font-bold cursor-pointer transition-all
                          ${
                            active
                              ? 'bg-[#0d7a55] border border-[#13a36e] text-white shadow-[0_2px_10px_rgba(13,122,85,0.4)]'
                              : 'bg-white/[0.05] border border-white/[0.07] text-[#7eb89a] hover:text-white'
                          }
                        `}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* FEATURED TRADING & HOT GAMES SECTION */}
              {(activeCategory === 'ALL' || activeCategory === 'FAV') && (
                <section className="mb-2">
                  <div className="flex items-center justify-between px-3 pt-2 pb-2">
                    <div className="flex items-center gap-2 text-base font-extrabold text-[#ffd84d] uppercase tracking-wide">
                      <span>🔥</span>
                      <span>
                        {activeCategory === 'FAV'
                          ? 'MY FAVORITE GAMES'
                          : 'HOT GAMES & LIVE TRADING'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveCategory('ALL')}
                        className="btn-see-all-gold cursor-pointer"
                      >
                        See All
                      </button>
                    </div>
                  </div>

                  {/* Two Featured Live Trading Mode Cards */}
                  <div className="grid grid-cols-2 gap-2.5 px-2.5 mb-2.5">
                    <div
                      onClick={() => {
                        setActiveView('binary');
                        window.scrollTo(0, 0);
                      }}
                      className="d333-game-card p-3.5 cursor-pointer bg-gradient-to-br from-[#0d3d2c] via-[#0a2e22] to-[#071f18] border border-[#13a36e]/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold text-[#ffd84d] uppercase">
                          OTC PRO · +96%
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">
                          ● LIVE
                        </span>
                      </div>
                      <div className="text-base font-black text-white">
                        Binary Trading
                      </div>
                      <div className="text-[11px] text-[#7eb89a] mt-0.5">
                        BTC · EUR/USD · GOLD Chart
                      </div>
                      <div className="mt-2.5 inline-block btn-3d-green px-3 py-1 rounded-md text-[11px] font-extrabold">
                        ▶ Trade Now
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setWingoSubTab('history');
                        setActiveView('trading');
                        window.scrollTo(0, 0);
                      }}
                      className="d333-game-card p-3.5 cursor-pointer bg-gradient-to-br from-[#0f4530] via-[#0d3d2c] to-[#071f18] border border-[#f0c030]/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold text-[#ffd84d] uppercase">
                          WINGO · 30 SEC
                        </span>
                        <span className="text-xs text-[#ffd84d] font-bold">
                          ● DRAW
                        </span>
                      </div>
                      <div className="text-base font-black text-white">
                        MONEYX WinGo 30s
                      </div>
                      <div className="text-[11px] text-[#7eb89a] mt-0.5">
                        Big/Small &amp; Color Draws
                      </div>
                      <div className="mt-2.5 inline-block btn-3d-gold px-3 py-1 rounded-md text-[11px] font-extrabold">
                        ▶ Play 30s
                      </div>
                    </div>
                  </div>

                  {/* Hot Games 3-Column (6-Column Desktop) Grid */}
                  <div className="px-2.5">
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {(activeCategory === 'FAV'
                        ? GAME_CATALOG.filter((g) => favorites.includes(g.id))
                        : GAME_CATALOG.filter((g) => g.category === 'hot')
                      ).map((game) => (
                        <GameCardItem
                          key={game.id}
                          game={game}
                          isFav={favorites.includes(game.id)}
                          onToggleFav={handleToggleFav}
                          onSelect={handleSelectGame}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* MONEYX ANIMATED JACKPOT COUNTER SECTION */}
              <div
                className="mx-2.5 my-3 rounded-[14px] p-4 text-center relative overflow-hidden border border-[#f0c030]/30 shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                style={{
                  background:
                    'linear-gradient(135deg, #0a2e22 0%, #0d3d2c 50%, #071f18 100%)',
                }}
              >
                <div className="flex items-center justify-center gap-2.5 mb-2.5 relative z-10">
                  <span className="text-3xl plane-fly inline-block">✈️</span>
                  <span
                    className="text-2xl sm:text-3xl font-black italic text-[#ffd84d] tracking-wider uppercase"
                    style={{ textShadow: '0 0 24px rgba(240,192,48,0.55)' }}
                  >
                    MONEYX JACKPOT
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1 flex-wrap relative z-10">
                  {formattedJackpot.split('').map((char, index) =>
                    char === ',' ? (
                      <span
                        key={`sep-${index}`}
                        className="text-xl font-black text-[#ffd84d] mx-0.5 pb-1"
                      >
                        ,
                      </span>
                    ) : (
                      <span key={`d-${index}`} className="jp-digit-box">
                        {char}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* ALL PLAYABLE CATEGORY SECTIONS (Popular, Crash, Live Casino, Sports, Slots, Poker & Fishing, Dice, Lottery, Card & Table) */}
              {(
                [
                  { id: 'popular', title: 'POPULAR GAMES', icon: '🔥' },
                  { id: 'crash', title: 'CRASH & AVIATOR', icon: '🚀' },
                  { id: 'live', title: 'LIVE CASINO', icon: '🎥' },
                  { id: 'sports', title: 'SPORTSBOOK', icon: '⚽' },
                  { id: 'slots', title: 'JILI & PG SLOTS', icon: '🎰' },
                  { id: 'poker', title: 'POKER & FISHING', icon: '🃏' },
                  { id: 'dice', title: 'DICE GAMES', icon: '🎲' },
                  { id: 'lottery', title: 'LOTTERY & KENO', icon: '🎱' },
                  { id: 'card', title: 'CARD & TABLE GAMES', icon: '♠️' },
                ] as const
              )
                .filter(
                  (sec) =>
                    activeCategory === 'ALL' ||
                    activeCategory === sec.id ||
                    (sec.id === 'poker' && activeCategory === 'fishing') ||
                    (sec.id === 'card' && activeCategory === 'table')
                )
                .map((sec) => {
                  const secGames = GAME_CATALOG.filter((g) => {
                    if (sec.id === 'poker') {
                      return g.category === 'poker' || g.category === 'fishing';
                    }
                    if (sec.id === 'card') {
                      return g.category === 'card' || g.category === 'table';
                    }
                    return g.category === sec.id;
                  });
                  return (
                    <section
                      key={sec.id}
                      className="mb-2 bg-[#0d3d2c]/30 border-t border-b border-white/[0.08] pb-2.5"
                    >
                      <div className="flex items-center justify-between px-3 pt-3 pb-2">
                        <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#ffd84d] uppercase tracking-wide">
                          <span>{sec.icon}</span>
                          <span>{sec.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveCategory(
                                activeCategory === sec.id ? 'ALL' : sec.id
                              )
                            }
                            className="btn-see-all-gold cursor-pointer"
                          >
                            {activeCategory === sec.id ? 'Show All' : 'See All'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (secGames[0]) handleSelectGame(secGames[0]);
                            }}
                            className="btn-nav-arrow-3d cursor-pointer"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (secGames[secGames.length - 1])
                                handleSelectGame(secGames[secGames.length - 1]);
                            }}
                            className="btn-nav-arrow-3d cursor-pointer"
                          >
                            ›
                          </button>
                        </div>
                      </div>

                      <div className="px-2.5">
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {secGames.map((game) => (
                            <GameCardItem
                              key={game.id}
                              game={game}
                              isFav={favorites.includes(game.id)}
                              onToggleFav={handleToggleFav}
                              onSelect={handleSelectGame}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })}

              {/* QUICK WALLET & HISTORY CARDS */}
              <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-2.5 my-3">
                <button
                  type="button"
                  onClick={() => setActiveModal('trades_record')}
                  className="bg-[#0d3d2c] border border-white/10 rounded-xl p-3 text-left cursor-pointer hover:border-[#f0c030]/40 transition-colors"
                >
                  <div className="text-xs font-extrabold text-[#ffd84d]">
                    📊 Trade Record
                  </div>
                  <div className="text-[11px] text-[#7eb89a] mt-0.5">
                    Binary &amp; WinGo logs
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('deposit_record')}
                  className="bg-[#0d3d2c] border border-white/10 rounded-xl p-3 text-left cursor-pointer hover:border-[#f0c030]/40 transition-colors"
                >
                  <div className="text-xs font-extrabold text-[#ffd84d]">
                    💳 Deposit Logs
                  </div>
                  <div className="text-[11px] text-[#7eb89a] mt-0.5">
                    bKash Gateway Verify
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('bonus_record')}
                  className="bg-[#0d3d2c] border border-white/10 rounded-xl p-3 text-left cursor-pointer hover:border-[#f0c030]/40 transition-colors"
                >
                  <div className="text-xs font-extrabold text-[#ffd84d]">
                    🎁 Bonus &amp; Gifts
                  </div>
                  <div className="text-[11px] text-[#7eb89a] mt-0.5">
                    Claim daily rewards
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('withdraw_record')}
                  className="bg-[#0d3d2c] border border-white/10 rounded-xl p-3 text-left cursor-pointer hover:border-[#f0c030]/40 transition-colors"
                >
                  <div className="text-xs font-extrabold text-[#ffd84d]">
                    🏦 Withdrawals
                  </div>
                  <div className="text-[11px] text-[#7eb89a] mt-0.5">
                    Cashout records
                  </div>
                </button>
              </section>

              {/* PARTNER & LIVE CHAT SECTION */}
              <div className="px-3 py-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal('invite')}
                  className="flex-1 py-3.5 px-2.5 rounded-[10px] text-center text-sm font-extrabold text-[#ffd84d] cursor-pointer border border-white/15 border-b-2 border-b-white/25 shadow-[0_4px_0_#040f09]"
                  style={{
                    background:
                      'linear-gradient(135deg, #1a3a2e 0%, #0d2a1e 100%)',
                  }}
                >
                  🤝 Partner &amp; Invite
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('support')}
                  className="flex-1 py-3.5 px-2.5 rounded-[10px] text-center text-sm font-extrabold text-[#ffd84d] cursor-pointer border border-white/15 border-b-2 border-b-white/25 shadow-[0_4px_0_#040f09]"
                  style={{
                    background:
                      'linear-gradient(135deg, #1a4a35 0%, #0d3524 100%)',
                  }}
                >
                  💬 Live Chat 24/7
                </button>
              </div>

              {/* GAME CENTER PILLS */}
              <div className="px-3 pt-2 pb-4">
                <div className="text-base font-extrabold text-[#ffd84d] mb-2.5">
                  MONEYX Game Center
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: '📲 Install MONEYX App (+৳150)',
                      action: () => setPwaModalOpen(true),
                    },
                    {
                      label: 'Binary Trading (+96%)',
                      action: () => setActiveView('binary'),
                    },
                    {
                      label: 'WinGo 30s Live',
                      action: () => setActiveView('trading'),
                    },
                    {
                      label: 'SuperAce Slot (JILI)',
                      action: () => {
                        setSelectedSlotGame({
                          name: 'Super Ace',
                          provider: 'JILI',
                          category: 'slots',
                        });
                        setActiveView('slot_game');
                      },
                    },
                    {
                      label: '✈️ Aviator Crash Live',
                      action: () => {
                        setSelectedSlotGame({
                          name: 'Aviator',
                          provider: 'SPRIBE',
                          category: 'crash',
                        });
                        setActiveView('slot_game');
                      },
                    },
                    {
                      label: '🦈 Mega Fishing Shooter',
                      action: () => {
                        setSelectedSlotGame({
                          name: 'Mega Fishing',
                          provider: 'JILI FISHING',
                          category: 'fishing',
                        });
                        setActiveView('slot_game');
                      },
                    },
                    {
                      label: '🎡 Crazy Time Live Casino',
                      action: () => {
                        setSelectedSlotGame({
                          name: 'Crazy Time A',
                          provider: 'EVOLUTION',
                          category: 'live',
                        });
                        setActiveView('slot_game');
                      },
                    },
                    {
                      label: '🎲 Dice Bonanza 3D',
                      action: () => {
                        setSelectedSlotGame({
                          name: 'Dice Bonanza',
                          provider: 'BGAMING',
                          category: 'dice',
                        });
                        setActiveView('slot_game');
                      },
                    },
                    {
                      label: 'Funds Management (Deposit)',
                      action: () => handleOpenFundsPage('deposit'),
                    },
                    {
                      label: 'Withdraw Money Page',
                      action: () => handleOpenFundsPage('withdraw'),
                    },
                    {
                      label: '👑 Owner Kamran Admin (/owner_kamran-admin-panel)',
                      action: handleOpenAdminPanel,
                    },
                  ].map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={pill.action}
                      className="py-2 px-4 rounded-lg text-xs font-bold text-[#13a36e] border border-[#0d7a55]/40 border-b-2 border-b-[#1ec882]/50 bg-[#0d7a55]/10 shadow-[0_3px_0_rgba(0,0,0,0.3)] cursor-pointer active:translate-y-0.5"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MONEYX COMBINED SECTIONS:
                  Product Overview, Who We Are, Daily Challenge Leaderboard,
                  Live Deposit/Withdraw Ticker, Service Speed Gauges & Rich Footer */}
              <NynoDollarCombinedFooterAndLiveSections
                transactions={transactions}
                onSelectCategory={(cat) => setActiveCategory(cat)}
                onNavigateView={(v) => setActiveView(v)}
                onOpenModal={(m) => setActiveModal(m)}
                onOpenAdminPanel={handleOpenAdminPanel}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: BINARY TRADING ==================== */}
      {activeView === 'binary' && (
        <BinaryTradingView
          balance={balance}
          isRefreshing={isRefreshing}
          onRefreshBalance={handleRefreshBalance}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo(0, 0);
          }}
          onOpenRules={() => setActiveModal('rules_binary')}
          binaryTrades={binaryTrades}
          onPlaceBinaryTrade={handlePlaceBinaryTrade}
          onSettleBinaryTrade={handleSettleBinaryTrade}
          onShowToast={triggerToast}
          onShowResultPopup={(data) => setResultPopup(data)}
        />
      )}

      {/* ==================== VIEW 3: TRADING (WINGO 30S) ==================== */}
      {activeView === 'trading' && (
        <WingoTradingView
          balance={balance}
          isRefreshing={isRefreshing}
          onRefreshBalance={handleRefreshBalance}
          onNavigateHome={() => {
            setActiveView('home');
            window.scrollTo(0, 0);
          }}
          onOpenRules={() => setActiveModal('rules_wingo')}
          wingoHistory={wingoHistory}
          wingoBets={wingoBets}
          onOpenBetModal={handleOpenWingoBetModal}
          onResolvePeriod={handleResolveWingoPeriod}
          onShowToast={triggerToast}
          onShowResultPopup={(data) => setResultPopup(data)}
          initialSubTab={wingoSubTab}
          forcedResult={adminSettings.forcedWingoResult}
        />
      )}

      {/* ==================== FLOATING DAILY FREE BONUS WIDGET ==================== */}
      <DailyBonusFloatingWidget
        onClaimDailyBonus={() =>
          handleClaimBonus('Daily Free Gift Bonus', 100)
        }
      />

      {/* ==================== PILL-STYLE BOTTOM NAVIGATION BAR ==================== */}
      <PillBottomNav
        activeView={activeView}
        onNavigateView={(v) => setActiveView(v)}
        onOpenModal={(m) => setActiveModal(m)}
      />

      {/* ==================== MODALS & POPUPS ==================== */}
      <BetConfirmationSheet
        isOpen={betSheetOpen}
        choice={betSheetChoice}
        initialMult={betSheetMult}
        onClose={() => setBetSheetOpen(false)}
        onConfirm={handleConfirmWingoBet}
      />

      <ResultPopupModal
        data={resultPopup}
        onClose={() => setResultPopup(null)}
      />

      <FeatureModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        balance={balance}
        profile={profile}
        onUpdateProfile={(updates) =>
          setProfile((prev) => ({ ...prev, ...updates }))
        }
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onClaimBonus={handleClaimBonus}
        transactions={transactions}
        bonuses={bonuses}
        binaryTrades={binaryTrades}
        wingoBets={wingoBets}
        onShowToast={triggerToast}
        onResetSession={handleResetSession}
      />

      {/* ==================== MONEYX PWA INSTALL MODAL ==================== */}
      <MoneyxPWAInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
        onClaimInstallBonus={() =>
          handleClaimBonus('MONEYX App Install Bonus', 150)
        }
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
