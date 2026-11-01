import React, { useEffect, useState } from 'react';
import { AuthViews } from './components/AuthViews';
import { BinaryTradingView } from './components/BinaryTradingView';
import {
  CompletePaymentView,
  PendingDepositData,
  WithdrawMoneyView,
} from './components/CompletePaymentAndWithdrawViews';
import {
  MemberAccountCenterPageView,
  ProfessionalBonusVaultView,
  PromoPictureDetailPageView,
  ReferAndAffiliatePageView,
  buildLongOptionUrl,
} from './components/DedicatedPagesView';
import {
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
  BALANCE: 'moneyx_strict_balance_v2',
  PROFILE: 'moneyx_strict_profile_v2',
  WINGO_BETS: 'moneyx_wingo_bets_v2',
  BINARY_TRADES: 'moneyx_binary_trades_v2',
  TRANSACTIONS: 'moneyx_transactions_v2',
  BONUSES: 'moneyx_bonuses_v2',
  FAVORITES: 'moneyx_favorites_v2',
  SAVED_WALLETS: 'moneyx_saved_wallets_v2',
  ADMIN_SETTINGS: 'moneyx_admin_settings_v2',
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
  slug: string;
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
    slug: 'binary-otc-pro',
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
    slug: 'wingo-30s-live',
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
    slug: 'aviator',
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
    slug: 'super-ace',
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
    slug: 'fortune-gems',
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
    slug: 'bti-gaming',
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
    slug: 'super-ace-deluxe',
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
    slug: 'revenge-of-loki',
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
    slug: 'mega-ace',
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
    slug: 'jili-caishen',
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
    slug: 'extra-juicy-megaways',
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
    slug: 'mega-fishing',
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
    slug: 'aviator-pro',
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
    slug: 'air-jet',
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
    slug: 'fortune-crash',
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
    slug: 'aviafly',
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
    slug: 'astronaut',
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
    slug: 'aviamasters',
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
    slug: 'crazy-time-a',
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
    slug: 'mega-roulette',
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
    slug: 'speed-baccarat-3',
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
    slug: 'italian-mega-roulette',
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
    slug: 'baccarat-8',
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
    slug: 'cash-or-crash',
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
    slug: 'lucksport-gaming',
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
    slug: 'saba-sports',
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
    slug: 'sbo-sportsbook',
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
    slug: 'cricket-exchange-live',
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
    slug: 'agent-ace',
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
    slug: 'ali-baba',
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
    slug: 'boxing-king',
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
    slug: 'charge-buffalo',
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
    slug: 'book-of-gold',
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
    slug: 'crazy-hunter',
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
    slug: 'all-in-poker',
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
    slug: 'crystal-poker',
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
    slug: 'video-poker',
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
    slug: 'all-star-fishing',
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
    slug: 'bombing-fishing',
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
    slug: 'jackpot-fishing',
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
    slug: 'aztec-claw-wild-dice',
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
    slug: 'bonus-dice',
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
    slug: 'dice-bonanza',
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
    slug: 'dice-clash',
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
    slug: 'wingo-30s-color',
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
    slug: 'cq9-lottery',
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
    slug: 'magic-keno',
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
    slug: 'dragon-tiger-joker',
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
    slug: 'pusoy-rush',
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
    slug: 'tongits-go',
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
    slug: 'classic-blackjack',
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
    slug: 'european-roulette-vip',
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
    slug: 'texas-holdem-3d',
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

const VIEW_TO_PATH: Record<ActiveView, string> = {
  home: '/',
  register: '/register',
  login: '/login',
  refer_page: '/refer',
  bonus_page: '/bonus',
  account_page: '/account',
  vip_page: '/vip',
  deposit_page: '/deposit',
  withdraw_page: '/withdraw',
  complete_payment: '/complete-payment',
  binary: '/binary',
  trading: '/wingo',
  slot_game: '/game/super-ace',
  promo_detail: '/promo/welcome-vault-200',
  php_github_page: '/php-github',
  admin_panel: '/owner_kamran-admin-panel',
};

function resolveViewFromLocation(): {
  view: ActiveView;
  promoSlug?: string;
  gameSlug?: string;
} {
  if (typeof window === 'undefined') return { view: 'home' };
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (
    path.includes('/owner_kamran-admin-panel') ||
    hash.includes('owner_kamran-admin-panel')
  ) {
    return { view: 'admin_panel' };
  }
  if (path.startsWith('/register')) return { view: 'register' };
  if (path.startsWith('/login')) return { view: 'login' };
  if (path.startsWith('/refer')) return { view: 'refer_page' };
  if (path.startsWith('/bonus') || path.startsWith('/promotion')) {
    return { view: 'bonus_page' };
  }
  if (path.startsWith('/account') || path.startsWith('/member')) {
    return { view: 'account_page' };
  }
  if (path.startsWith('/deposit')) return { view: 'deposit_page' };
  if (path.startsWith('/withdraw')) return { view: 'withdraw_page' };
  if (path.startsWith('/complete-payment')) return { view: 'complete_payment' };
  if (path.startsWith('/binary')) return { view: 'binary' };
  if (path.startsWith('/wingo') || path.startsWith('/trading')) {
    return { view: 'trading' };
  }
  if (path.startsWith('/php-github')) return { view: 'php_github_page' };
  if (path.startsWith('/promo/')) {
    const slug = path.replace('/promo/', '').split('/')[0];
    return { view: 'promo_detail', promoSlug: slug || 'welcome-vault-200' };
  }
  if (path.startsWith('/game/')) {
    const slug = path.replace('/game/', '').split('/')[0];
    return { view: 'slot_game', gameSlug: slug || 'super-ace' };
  }
  return { view: 'home' };
}

const GameCardItem: React.FC<{
  game: GameItem;
  isFav: boolean;
  isLoggedIn: boolean;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onSelect: (game: GameItem) => void;
}> = ({ game, isFav, isLoggedIn, onToggleFav, onSelect }) => {
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

        {/* Play / Lock Hover Overlay Badge */}
        <div className="absolute inset-0 z-[2] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1 rounded-full bg-gradient-to-b from-[#ffd84d] to-[#c89a10] text-[#1a0f00] text-[10px] font-black uppercase shadow-lg">
            {isLoggedIn ? '▶ PLAY NOW' : '🔒 REGISTER TO PLAY'}
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
  const initialRoute = resolveViewFromLocation();
  const [activeView, setActiveView] = useState<ActiveView>(initialRoute.view);
  const [activePromoSlug, setActivePromoSlug] = useState<string>(
    initialRoute.promoSlug || 'welcome-vault-200'
  );
  const [fundsInitialTab, setFundsInitialTab] = useState<
    'deposit' | 'withdraw'
  >('deposit');
  const [wingoSubTab, setWingoSubTab] = useState<'history' | 'chart' | 'my'>(
    'history'
  );
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pwaModalOpen, setPwaModalOpen] = useState<boolean>(() => {
    try {
      const alreadyInstalled =
        localStorage.getItem('moneyx_app_installed_v1') === 'true';
      const alreadyPrompted =
        sessionStorage.getItem('moneyx_first_open_prompted_v1') === 'true';
      if (!alreadyInstalled && !alreadyPrompted) {
        sessionStorage.setItem('moneyx_first_open_prompted_v1', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });
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

  // Strict User Balance: starts at 0.00! Cannot have balance without registering & depositing.
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return saved !== null ? parseFloat(saved) : 0.0;
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
      nickname: 'Guest Visitor',
      uid: '883921',
      mobile: '',
      isLoggedIn: false,
      lockedBonusBalance: 0,
      referralToken: '9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c883921',
      avatar:
        'https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/viip-removebg-preview.png',
      vipLevel: 0,
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
    return saved ? JSON.parse(saved) : [];
  });

  const [bonuses, setBonuses] = useState<BonusRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BONUSES);
    return saved ? JSON.parse(saved) : [];
  });

  // Bet Sheet & Result Popup states
  const [betSheetOpen, setBetSheetOpen] = useState<boolean>(false);
  const [betSheetChoice, setBetSheetChoice] = useState<string>('Big');
  const [betSheetMult, setBetSheetMult] = useState<number>(1);
  const [resultPopup, setResultPopup] = useState<ResultPopupData | null>(null);

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
    slug?: string;
  }>(() => {
    if (initialRoute.gameSlug) {
      const found = GAME_CATALOG.find((g) => g.slug === initialRoute.gameSlug);
      if (found) {
        return {
          name: found.name,
          provider: found.provider,
          category: found.category,
          slug: found.slug,
        };
      }
    }
    return {
      name: 'Super Ace',
      provider: 'JILI',
      category: 'slots',
      slug: 'super-ace',
    };
  });

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
      return [];
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
        'Welcome to MONEYX — বাংলাদেশের শীর্ষস্থানীয় এবং বিশ্বস্ত লাইভ ক্যাসিনো, স্পোর্টস বেটিং, JILI স্লট, ক্র্যাশ ও ফিশিং গেমিং প্ল্যাটফর্ম!',
      forcedWingoResult: null,
      adminPin: '2026',
    };
  });

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
  };

  // Sync referred member's real deposit & turnover activity to the server
  const syncReferralActivityToServer = (
    depositDelta = 0,
    turnoverDelta = 0
  ) => {
    if (!profile.isLoggedIn || !profile.uid) return;
    fetch('/api/refer/sync-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: profile.uid,
        mobile: profile.mobile,
        depositDelta,
        turnoverDelta,
      }),
    }).catch(() => {});
  };

  // Build long cryptographic URL path for each separate option page
  const getLongPathForView = (
    targetView: ActiveView,
    customPath?: string
  ): string => {
    if (customPath && customPath.includes('?')) return customPath;
    if (targetView === 'admin_panel') return '/owner_kamran-admin-panel';
    if (targetView === 'home') return '/';

    const optionMap: Partial<
      Record<
        ActiveView,
        | 'refer'
        | 'bonus'
        | 'account'
        | 'deposit'
        | 'withdraw'
        | 'register'
        | 'login'
        | 'vip'
      >
    > = {
      refer_page: 'refer',
      bonus_page: 'bonus',
      account_page: 'account',
      deposit_page: 'deposit',
      withdraw_page: 'withdraw',
      register: 'register',
      login: 'login',
      vip_page: 'vip',
    };

    const optKey = optionMap[targetView];
    if (optKey && typeof window !== 'undefined') {
      try {
        const fullUrl = new URL(buildLongOptionUrl(optKey, profile));
        return `${fullUrl.pathname}${fullUrl.search}`;
      } catch {
        // fallback below
      }
    }
    return customPath || VIEW_TO_PATH[targetView] || '/';
  };

  // Push browser URL and navigate, enforcing the STRICT Auth Gate before registration/login!
  const navigateToView = (
    targetView: ActiveView,
    customPath?: string,
    bypassAuth = false
  ) => {
    const publicViews: ActiveView[] = [
      'home',
      'register',
      'login',
      'admin_panel',
      'php_github_page',
    ];

    if (
      !bypassAuth &&
      !profile.isLoggedIn &&
      !publicViews.includes(targetView)
    ) {
      triggerToast(
        '🔒 রেজিস্ট্রেশন ছাড়া ব্যালেন্স, গেম খেলা বা কোনো লেনদেন করা যাবে না! অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন করুন।'
      );
      const regPath = getLongPathForView('register');
      try {
        window.history.pushState({}, '', regPath);
      } catch {
        // ignore
      }
      setActiveView('register');
      window.scrollTo(0, 0);
      return;
    }

    const nextUrl = getLongPathForView(targetView, customPath);
    try {
      if (window.location.pathname + window.location.search !== nextUrl) {
        window.history.pushState({}, '', nextUrl);
      }
    } catch {
      // ignore if restricted
    }
    setActiveView(targetView);
    window.scrollTo(0, 0);
  };

  const handleOpenPromoPicturePage = (slug: string) => {
    if (!profile.isLoggedIn) {
      triggerToast(
        '🔒 প্রমোশন ও বোনাস ভল্ট দেখতে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!'
      );
      navigateToView('register', '/register', true);
      return;
    }
    setActivePromoSlug(slug);
    navigateToView('promo_detail', `/promo/${slug}`);
  };

  const handleOpenModalWithAuth = (m: ModalType) => {
    if (!m) {
      setActiveModal(null);
      return;
    }
    if (!profile.isLoggedIn && m !== 'support') {
      triggerToast(
        '🔒 এই ফিচারটি ব্যবহার করতে অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!'
      );
      navigateToView('register', '/register', true);
      return;
    }
    if (m === 'invite') {
      navigateToView('refer_page');
      return;
    }
    if (m === 'gifts') {
      navigateToView('bonus_page');
      return;
    }
    if (m === 'wallet' || m === 'vip') {
      navigateToView('account_page');
      return;
    }
    setActiveModal(m);
  };

  // Listen to browser Back/Forward buttons (popstate) for all routes
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveViewFromLocation();
      if (resolved.promoSlug) setActivePromoSlug(resolved.promoSlug);
      if (resolved.gameSlug) {
        const g = GAME_CATALOG.find((item) => item.slug === resolved.gameSlug);
        if (g) {
          setSelectedSlotGame({
            name: g.name,
            provider: g.provider,
            category: g.category,
            slug: g.slug,
          });
        }
      }
      setActiveView(resolved.view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdminPanel = () => {
    navigateToView('admin_panel', '/owner_kamran-admin-panel', true);
  };

  const handleExitAdminPanel = () => {
    navigateToView('home', '/', true);
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

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const handleRefreshBalance = () => {
    if (!profile.isLoggedIn) {
      triggerToast('🔒 ব্যালেন্স দেখতে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!');
      navigateToView('register', '/register', true);
      return;
    }
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Balance Synchronized');
    }, 600);
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.isLoggedIn) {
      triggerToast('🔒 অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!');
      navigateToView('register', '/register', true);
      return;
    }
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      triggerToast(exists ? 'Removed from Favorites' : '♥ Added to Favorites');
      return next;
    });
  };

  // Every single game card in MONEYX requires login first, then opens its dedicated URL (/game/:slug, /binary, /wingo)
  const handleSelectGame = (game: GameItem) => {
    if (!profile.isLoggedIn) {
      triggerToast(
        '🔒 গেম খেলতে অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!'
      );
      navigateToView('register', '/register', true);
      return;
    }
    if (game.id === 'binary-pro') {
      navigateToView('binary', '/binary');
      return;
    }
    if (game.id === 'wingo-30s' || game.category === 'lottery') {
      setWingoSubTab('history');
      navigateToView('trading', '/wingo');
      return;
    }
    setSelectedSlotGame({
      name: game.name,
      provider: game.provider,
      category: game.category,
      slug: game.slug,
    });
    navigateToView('slot_game', `/game/${game.slug}`);
  };

  const handleOpenFundsPage = (tab: 'deposit' | 'withdraw') => {
    if (!profile.isLoggedIn) {
      triggerToast(
        '🔒 ডিপোজিট বা উত্তোলন করতে প্রথমে রেজিস্ট্রেশন বা লগইন করুন!'
      );
      navigateToView('register', '/register', true);
      return;
    }
    if (tab === 'withdraw') {
      navigateToView('withdraw_page', '/withdraw');
    } else {
      setFundsInitialTab('deposit');
      navigateToView('deposit_page', '/deposit');
    }
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
      triggerToast('পর্যাপ্ত ব্যালেন্স নেই! অনুগ্রহ করে ডিপোজিট করুন।');
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
    syncReferralActivityToServer(0, totalAmount);
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
      triggerToast('পর্যাপ্ত ব্যালেন্স নেই! অনুগ্রহ করে ডিপোজিট করুন।');
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
    syncReferralActivityToServer(0, tradeInput.amount);
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
    syncReferralActivityToServer(amount, 0);
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

  // Strict Anti-Abuse Bonus Handler:
  // General bonus triggers add to the Locked Bonus Vault (/bonus) instead of main balance!
  const handleAddLockedBonusVault = (title: string, amount: number) => {
    const bon: BonusRecord = {
      id: `bon-${Date.now()}`,
      title: `${title} (Locked Vault)`,
      amount,
      status: 'Locked',
      requiredDeposit: 1000,
      requiredTurnover: amount * 5,
      createdAt: new Date().toLocaleTimeString(),
    };
    setBonuses((prev) => [bon, ...prev]);
    setProfile((prev) => ({
      ...prev,
      lockedBonusBalance: Number(
        ((prev.lockedBonusBalance ?? 0) + amount).toFixed(2)
      ),
    }));
    triggerToast(
      `🔐 +৳${amount} লকড বোনাস ভল্টে জমা হয়েছে! ডিপোজিট ও টার্নওভার শেষে আনলক হবে।`
    );
  };

  const handleClaimRealReferralCommission = (amount: number) => {
    const rec: TransactionRecord = {
      id: `ref-comm-${Date.now()}`,
      type: 'Deposit',
      method: 'bKash',
      amount,
      account: profile.mobile || profile.uid,
      trxId: `REF${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      createdAt: new Date().toLocaleTimeString(),
    };
    setTransactions((prev) => [rec, ...prev]);
    setBalance((prev) => Number((prev + amount).toFixed(2)));
  };

  // Only used when 100% of deposit + turnover requirements are verified in Bonus Vault or by Admin
  const handleUnlockVerifiedBonus = (title: string, amount: number) => {
    const bon: BonusRecord = {
      id: `bon-verified-${Date.now()}`,
      title: `${title} (Verified Unlocked)`,
      amount,
      status: 'Claimed',
      createdAt: new Date().toLocaleTimeString(),
    };
    setBonuses((prev) => [bon, ...prev]);
    setBalance((prev) => Number((prev + amount).toFixed(2)));
    setProfile((prev) => ({
      ...prev,
      lockedBonusBalance: Math.max(
        0,
        Number(((prev.lockedBonusBalance ?? 0) - amount).toFixed(2))
      ),
    }));
    triggerToast(`✓ শর্ত যাচাই সম্পন্ন! +BDT ${amount.toFixed(2)} মূল ব্যালেন্সে যোগ হয়েছে!`);
  };

  const handleSuccessAuth = (
    mobile: string,
    isNewUser: boolean,
    referralCode?: string
  ) => {
    const generatedUid = mobile.slice(-6) || '883921';
    const token = `9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c_${generatedUid}`;

    setProfile((prev) => ({
      ...prev,
      uid: generatedUid,
      mobile,
      nickname: `MONEYX VIP ${mobile.slice(-4)}`,
      isLoggedIn: true,
      vipLevel: 1,
      referredBy: referralCode || prev.referredBy,
      referralToken: token,
      lockedBonusBalance: isNewUser
        ? 200
        : (prev.lockedBonusBalance ?? 200),
    }));

    if (isNewUser) {
      // Do NOT add free spendable balance! Put ৳200 in Locked Bonus Vault (/bonus).
      const welcomeBon: BonusRecord = {
        id: `bon-welcome-${Date.now()}`,
        title: 'MONEYX Welcome Vault Bonus (Locked - 5x Turnover)',
        amount: 200,
        status: 'Locked',
        requiredDeposit: 1000,
        requiredTurnover: 5000,
        createdAt: new Date().toLocaleTimeString(),
      };
      setBonuses((prev) => [welcomeBon, ...prev]);
      triggerToast(
        '✓ রেজিস্ট্রেশন সফল! ৳২০০ স্বাগতম বোনাস আপনার বোনাস ভল্টে জমা হয়েছে।'
      );
    } else {
      triggerToast(`✓ স্বাগতম! ${mobile} হিসেবে লগইন সম্পন্ন হয়েছে।`);
    }
    navigateToView('home', '/', true);
  };

  const handleResetSession = () => {
    setBalance(0.0);
    setBinaryTrades([]);
    setWingoBets([]);
    setTransactions([]);
    setProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
      mobile: '',
      nickname: 'Guest Visitor',
      lockedBonusBalance: 0,
    }));
    triggerToast('লগআউট সম্পন্ন হয়েছে।');
    navigateToView('login', '/login', true);
  };

  const formattedJackpot = jackpotValue.toLocaleString('en-US');

  const totalVerifiedDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRealTurnover =
    wingoBets.reduce((sum, b) => sum + b.amount, 0) +
    binaryTrades.reduce((sum, t) => sum + t.amount, 0);

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

  // ==================== 1. OWNER KAMRAN ADMIN PANEL (/owner_kamran-admin-panel) ====================
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
          onAdminAddBonus={handleUnlockVerifiedBonus}
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

  // ==================== 2. REGISTER & LOGIN PAGES (/register & /login) ====================
  if (activeView === 'register' || activeView === 'login') {
    return (
      <>
        <OfflineIndicator />
        <AuthViews
          mode={activeView}
          onSwitchMode={(m) => navigateToView(m, `/${m}`, true)}
          onBack={() => navigateToView('home', '/', true)}
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

  // ==================== 3. DEDICATED REFER PAGE ====================
  if (activeView === 'refer_page') {
    return (
      <>
        <OfflineIndicator />
        <ReferAndAffiliatePageView
          profile={profile}
          transactions={transactions}
          onBackHome={() => navigateToView('home', '/')}
          onOpenPromoDetail={handleOpenPromoPicturePage}
          onNavigateBonusVault={() => navigateToView('bonus_page')}
          onClaimRealReferralCommission={handleClaimRealReferralCommission}
          onShowToast={triggerToast}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // ==================== 4. DEDICATED BONUS VAULT PAGE ====================
  if (activeView === 'bonus_page') {
    return (
      <>
        <OfflineIndicator />
        <ProfessionalBonusVaultView
          profile={profile}
          balance={balance}
          transactions={transactions}
          wingoBets={wingoBets}
          binaryTrades={binaryTrades}
          bonuses={bonuses}
          onBackHome={() => navigateToView('home', '/')}
          onNavigateDeposit={() => handleOpenFundsPage('deposit')}
          onNavigateRefer={() => navigateToView('refer_page')}
          onOpenPromoDetail={handleOpenPromoPicturePage}
          onUnlockVerifiedBonus={handleUnlockVerifiedBonus}
          onShowToast={triggerToast}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // ==================== 4B. DEDICATED STANDALONE MEMBER ACCOUNT CENTER ====================
  if (activeView === 'account_page' || activeView === 'php_github_page') {
    return (
      <>
        <OfflineIndicator />
        <MemberAccountCenterPageView
          profile={profile}
          balance={balance}
          transactions={transactions}
          wingoBets={wingoBets}
          binaryTrades={binaryTrades}
          bonuses={bonuses}
          savedWallets={savedWallets}
          onUpdateProfile={(updates) =>
            setProfile((prev) => ({ ...prev, ...updates }))
          }
          onAddWallet={(w) => {
            const created: SavedWithdrawalWallet = {
              ...w,
              id: `w-${Date.now()}`,
            };
            setSavedWallets((prev) => [created, ...prev]);
          }}
          onNavigateDeposit={() => handleOpenFundsPage('deposit')}
          onNavigateWithdraw={() => handleOpenFundsPage('withdraw')}
          onNavigateRefer={() => navigateToView('refer_page')}
          onNavigateBonus={() => navigateToView('bonus_page')}
          onBackHome={() => navigateToView('home', '/')}
          onLogout={handleResetSession}
          onShowToast={triggerToast}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // ==================== 5. DEDICATED PROMO PICTURE DETAIL PAGE ====================
  if (activeView === 'promo_detail') {
    return (
      <>
        <OfflineIndicator />
        <PromoPictureDetailPageView
          slug={activePromoSlug}
          totalVerifiedDeposits={totalVerifiedDeposits}
          totalRealTurnover={totalRealTurnover}
          onBack={() => navigateToView('home', '/')}
          onNavigateDeposit={() => handleOpenFundsPage('deposit')}
          onNavigateRefer={() => navigateToView('refer_page')}
          onNavigateBonusVault={() => navigateToView('bonus_page')}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
        />
        {toastMsg && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-sm font-extrabold z-[9999] shadow-2xl whitespace-nowrap">
            {toastMsg}
          </div>
        )}
      </>
    );
  }

  // ==================== 7. UNIVERSAL PLAYABLE GAME ARENA (/game/:slug) ====================
  if (activeView === 'slot_game') {
    return (
      <>
        <OfflineIndicator />
        <SuperAceSlotView
          gameName={selectedSlotGame.name}
          provider={selectedSlotGame.provider}
          gameCategory={selectedSlotGame.category}
          balance={balance}
          onBack={() => navigateToView('home', '/')}
          onUpdateBalance={(delta) => {
            if (delta < 0) {
              syncReferralActivityToServer(0, Math.abs(delta));
            }
            setBalance((prev) =>
              Math.max(0, Number((prev + delta).toFixed(2)))
            );
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

  // ==================== 8. COMPLETE PAYMENT SCREEN (/complete-payment) ====================
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
          onBack={() => navigateToView('deposit_page', '/deposit')}
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
              handleAddLockedBonusVault(
                `${method} +${adminSettings.depositBonusPct}% Deposit Vault`,
                gatewayBonus + promoBonus
              );
            }
            navigateToView('home', '/');
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

  // ==================== 9. WITHDRAW MONEY PAGE (/withdraw) ====================
  if (activeView === 'withdraw_page') {
    const totalBonusBalance = profile.lockedBonusBalance ?? 0;

    return (
      <>
        <OfflineIndicator />
        <WithdrawMoneyView
          balance={balance}
          bonusBalance={totalBonusBalance}
          turnoverDone={totalRealTurnover}
          savedWallets={savedWallets}
          transactions={transactions}
          onBack={() => navigateToView('home', '/')}
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
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
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
          onClaimBonus={handleAddLockedBonusVault}
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

  // ==================== 10. DEPOSIT / FUNDS MANAGEMENT PAGE (/deposit) ====================
  if (activeView === 'deposit_page') {
    return (
      <>
        <OfflineIndicator />
        <FundsManagementView
          initialTab={fundsInitialTab}
          balance={balance}
          onBack={() => navigateToView('home', '/')}
          onProceedToCompletePayment={(data) => {
            setPendingDeposit(data);
            navigateToView('complete_payment', '/complete-payment');
          }}
          onSwitchToWithdrawPage={() => {
            navigateToView('withdraw_page', '/withdraw');
          }}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onClaimBonus={handleAddLockedBonusVault}
          onShowToast={triggerToast}
        />
        <PillBottomNav
          activeView={activeView}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
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
          onClaimBonus={handleAddLockedBonusVault}
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
            onClick={() => navigateToView('home', '/', true)}
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

        {/* Right Actions: Strict Auth Gate -> Shows Balance ONLY after Registration/Login! */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setPwaModalOpen(true)}
            title="Install MONEYX App"
            className="inline-flex items-center gap-1 bg-[#0d3d2c] hover:bg-[#13a36e]/30 border border-[#1ec882]/40 text-[#e8f5ee] px-2 py-1 rounded-md text-[10px] font-extrabold cursor-pointer transition-colors"
          >
            <span>📲</span>
            <span className="hidden sm:inline">App</span>
          </button>

          {profile.isLoggedIn ? (
            <>
              <div
                onClick={handleRefreshBalance}
                className="bg-[#0d3d2c] border border-[#f0c030]/35 rounded-md px-2 py-1 flex items-center gap-1 cursor-pointer"
              >
                <span className="text-[11px] font-extrabold text-[#ffd84d] font-mono-num whitespace-nowrap">
                  ৳{balance.toFixed(2)}
                </span>
                <span
                  className={`text-[#7eb89a] text-xs inline-block ${
                    isRefreshing ? 'refresh-spin' : ''
                  }`}
                >
                  ↻
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenFundsPage('deposit')}
                className="btn-3d-green px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-extrabold cursor-pointer whitespace-nowrap"
              >
                + Deposit
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigateToView('login', '/login', true)}
                className="btn-3d-green px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-extrabold cursor-pointer whitespace-nowrap"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => navigateToView('register', '/register', true)}
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
          balance={profile.isLoggedIn ? balance : 0}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onNavigateView={(v) => navigateToView(v)}
          onOpenModal={handleOpenModalWithAuth}
          onOpenInstallModal={() => setPwaModalOpen(true)}
          onClaimWheelReward={handleAddLockedBonusVault}
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

          {/* Unregistered Visitor Strict Gate Notice Strip */}
          {!profile.isLoggedIn && (
            <div className="mx-2.5 mt-2.5 rounded-xl bg-gradient-to-r from-[#0d3d2c] via-[#092b1f] to-[#071f18] border border-[#f0c030]/40 p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-[#e8f5ee]">
                <b className="text-[#ffd84d]">🔒 মেম্বার ভেরিফিকেশন আবশ্যক:</b>{' '}
                রেজিস্ট্রেশন বা লগইন করার আগে ব্যালেন্স, গেম খেলা, ডিপোজিট ও
                উত্তোলন সম্পূর্ণ লক করা আছে।
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigateToView('register', undefined, true)}
                  className="px-3 py-1.5 rounded-lg btn-3d-gold text-[11px] font-black cursor-pointer"
                >
                  রেজিস্ট্রেশন
                </button>
                <button
                  type="button"
                  onClick={() => navigateToView('login', undefined, true)}
                  className="px-3 py-1.5 rounded-lg btn-3d-green text-[11px] font-black cursor-pointer"
                >
                  লগইন
                </button>
              </div>
            </div>
          )}

          <div className="flex max-w-[1260px] mx-auto">
            {/* 2-Column 3D Tactile Sidebar */}
            <TactileTwoColumnSidebar
              isOpen={sidebarOpen}
              activeCategory={activeCategory}
              onClose={() => setSidebarOpen(false)}
              onSelectCategory={(cat) => setActiveCategory(cat)}
              onNavigateView={(v) => navigateToView(v)}
              onOpenModal={handleOpenModalWithAuth}
              onOpenInstallModal={() => setPwaModalOpen(true)}
            />

            {/* Main Lobby Content (PURE GAMES ON HOME SCREEN) */}
            <div className="flex-1 min-w-0">
              {/* Game Hero Slider */}
              <div className="pt-2.5 px-2.5 pb-1">
                <div className="relative rounded-xl overflow-hidden h-[175px] sm:h-[210px] border border-[#f0c030]/25 shadow-lg">
                  {bannerSlide === 0 && (
                    <div
                      onClick={() => {
                        const superAce = GAME_CATALOG.find(
                          (g) => g.slug === 'super-ace'
                        );
                        if (superAce) handleSelectGame(superAce);
                      }}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #071f18 0%, #0d7a55 55%, #0a2e22 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          JILI OFFICIAL SLOTS · 1024 WAYS
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          SUPER ACE &amp; FORTUNE GEMS
                          <span className="block text-[#ffd84d]">
                            গোল্ডেন কার্ড ক্যাসকেড জ্যাকপট!
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          সরাসরি ফুল-স্ক্রিন স্লট এবং ৫x মাল্টিপ্লায়ার রিল উপভোগ করুন
                        </div>
                        <span className="mt-3 inline-block btn-3d-gold px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          এখনই খেলুন ›
                        </span>
                      </div>
                      <div className="text-right z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071f18]/60 border border-[#f0c030]/40 flex flex-col items-center justify-center shadow-xl">
                          <span className="text-xl sm:text-2xl font-black text-[#ffd84d]">
                            🃏 ACE
                          </span>
                          <span className="text-[10px] font-bold text-[#7eb89a] mt-0.5">
                            1024 WAYS
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerSlide === 1 && (
                    <div
                      onClick={() => {
                        const aviator = GAME_CATALOG.find(
                          (g) => g.slug === 'aviator'
                        );
                        if (aviator) handleSelectGame(aviator);
                      }}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #041510 0%, #0a5c3e 55%, #13a36e 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          SPRIBE &amp; EVOLUTION · LIVE ARENA
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          AVIATOR CRASH &amp; CRAZY TIME
                          <span className="block text-[#ffd84d]">
                            ১০০x মাল্টিপ্লায়ার লাইভ গেমিং!
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          তাৎক্ষণিক ক্যাশআউট এবং লাইভ ডিলার ক্যাসিনো টেবিল
                        </div>
                        <span className="mt-3 inline-block btn-3d-gold px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          গেম চালু করুন ›
                        </span>
                      </div>
                      <div className="z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071f18]/70 border border-emerald-400/40 flex flex-col items-center justify-center">
                          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                            ✈️
                          </span>
                          <span className="text-[10px] font-bold text-white mt-0.5">
                            100X CRASH
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {bannerSlide === 2 && (
                    <div
                      onClick={() => navigateToView('binary', '/binary')}
                      className="w-full h-full p-5 flex items-center justify-between cursor-pointer relative overflow-hidden"
                      style={{
                        background:
                          'linear-gradient(125deg, #0a2e22 0%, #0d3d2c 50%, #c89a10 100%)',
                      }}
                    >
                      <div className="z-10 max-w-[68%]">
                        <div className="text-[11px] font-black uppercase tracking-widest text-[#ffd84d] mb-1">
                          MONEYX ORIGINAL · LIVE TRADING
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white leading-tight">
                          BINARY OTC +96% &amp; WINGO 30S
                          <span className="block text-[#ffd84d]">
                            ৩০ সেকেন্ডে রিয়েল-টাইম ফলাফল
                          </span>
                        </div>
                        <div className="text-xs text-[#e8f5ee]/90 mt-1.5">
                          BTC/USDT চার্ট ট্রেডিং এবং নন-স্টপ কালার প্রেডিকশন
                        </div>
                        <span className="mt-3 inline-block btn-3d-green px-4 py-1.5 rounded-lg text-xs font-black uppercase">
                          ট্রেডিং শুরু করুন ›
                        </span>
                      </div>
                      <div className="z-10 pr-2">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#071f18]/75 border-2 border-[#ffd84d] flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-[#ffd84d]">
                            📈
                          </span>
                          <span className="text-[10px] font-bold text-white">
                            +96% OTC
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

              {/* QUICK GAME WALLET & ACCOUNT BAR (NO BONUS MENTIONS ON HOME) */}
              <div className="grid grid-cols-3 gap-2 px-2.5 pt-2.5 pb-1">
                <button
                  type="button"
                  onClick={() => handleOpenFundsPage('deposit')}
                  className="btn-3d-green flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-[10px] text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  <span>⊕</span>
                  <span>ডিপোজিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenFundsPage('withdraw')}
                  className="btn-3d-gold flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-[10px] text-xs sm:text-sm font-extrabold cursor-pointer"
                >
                  <span>⇧</span>
                  <span>উত্তোলন</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateToView('account_page')}
                  className="bg-[#0d3d2c] border border-[#1ec882]/40 border-b-[3px] border-b-[#071f18] text-[#1de9b6] flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-[10px] text-xs sm:text-sm font-black cursor-pointer active:translate-y-0.5"
                >
                  <span>👤</span>
                  <span>অ্যাকাউন্ট</span>
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
                      onClick={() => navigateToView('binary', '/binary')}
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
                        {profile.isLoggedIn ? '▶ Trade Now' : '🔒 Register First'}
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setWingoSubTab('history');
                        navigateToView('trading', '/wingo');
                      }}
                      className="d333-game-card p-3.5 cursor-pointer bg-gradient-to-br from-[#0f4530] via-[#0d3d2c] to-[#071f18] border border-[#f0c030]/40"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold text-[#ffd84d] uppercase">
                          WINGO · 30 SEC
                        </span>
                        <span className="text-xs text-[#ffd84d] font-bold">
                          ● LIVE
                        </span>
                      </div>
                      <div className="text-base font-black text-white">
                        MONEYX WinGo 30s
                      </div>
                      <div className="text-[11px] text-[#7eb89a] mt-0.5">
                        Big/Small &amp; Color Draws
                      </div>
                      <div className="mt-2.5 inline-block btn-3d-gold px-3 py-1 rounded-md text-[11px] font-extrabold">
                        {profile.isLoggedIn ? '▶ Play 30s' : '🔒 Register First'}
                      </div>
                    </div>
                  </div>

                  {/* Hot Games Grid */}
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
                          isLoggedIn={!!profile.isLoggedIn}
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

              {/* ALL PLAYABLE CATEGORY SECTIONS */}
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
                              isLoggedIn={!!profile.isLoggedIn}
                              onToggleFav={handleToggleFav}
                              onSelect={handleSelectGame}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })}

              {/* MONEYX COMBINED SECTIONS */}
              <NynoDollarCombinedFooterAndLiveSections
                transactions={transactions}
                onSelectCategory={(cat) => setActiveCategory(cat)}
                onNavigateView={(v) => navigateToView(v)}
                onOpenModal={handleOpenModalWithAuth}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: BINARY TRADING (/binary) ==================== */}
      {activeView === 'binary' && (
        <BinaryTradingView
          balance={balance}
          isRefreshing={isRefreshing}
          onRefreshBalance={handleRefreshBalance}
          onNavigateHome={() => navigateToView('home', '/')}
          onOpenRules={() => setActiveModal('rules_binary')}
          binaryTrades={binaryTrades}
          onPlaceBinaryTrade={handlePlaceBinaryTrade}
          onSettleBinaryTrade={handleSettleBinaryTrade}
          onShowToast={triggerToast}
          onShowResultPopup={(data) => setResultPopup(data)}
        />
      )}

      {/* ==================== VIEW 3: TRADING (WINGO 30S - /wingo) ==================== */}
      {activeView === 'trading' && (
        <WingoTradingView
          balance={balance}
          isRefreshing={isRefreshing}
          onRefreshBalance={handleRefreshBalance}
          onNavigateHome={() => navigateToView('home', '/')}
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

      {/* ==================== PILL-STYLE BOTTOM NAVIGATION BAR ==================== */}
      <PillBottomNav
        activeView={activeView}
        onNavigateView={(v) => navigateToView(v)}
        onOpenModal={handleOpenModalWithAuth}
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
        onClaimBonus={handleAddLockedBonusVault}
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
        isLoggedIn={!!profile.isLoggedIn}
        onClose={() => setPwaModalOpen(false)}
        onInstalledSuccess={() =>
          triggerToast('✓ MONEYX অফিশিয়াল অ্যাপ সফলভাবে ইনস্টল হয়েছে!')
        }
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#071f18]/95 border border-[#f0c030]/50 text-[#ffd84d] py-3 px-5 rounded-full text-xs sm:text-sm font-extrabold z-[9999] shadow-2xl max-w-[92vw] text-center">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
