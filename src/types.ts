export type ActiveView =
  | 'home'
  | 'binary'
  | 'trading'
  | 'deposit_page'
  | 'complete_payment'
  | 'withdraw_page'
  | 'slot_game'
  | 'register'
  | 'login'
  | 'admin_panel';

export interface SiteAdminSettings {
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  depositBonusPct: number;
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdraw: number;
  announcementText: string;
  forcedWingoResult: number | null; // null = auto random, 0..9 = forced number
  adminPin: string;
}

export interface SavedWithdrawalWallet {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket';
  accountNumber: string;
  pin: string;
}

export type ModalType =
  | null
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'vip'
  | 'trades_record'
  | 'bonus_record'
  | 'deposit_record'
  | 'withdraw_record'
  | 'invite'
  | 'gifts'
  | 'support'
  | 'profile'
  | 'rules_wingo'
  | 'rules_binary'
  | 'logout';

export interface UserProfile {
  nickname: string;
  uid: string;
  mobile?: string;
  isLoggedIn?: boolean;
  avatar: string;
  vipLevel: number;
  lastLogin: string;
}

export interface WingoResult {
  period: string;
  periodNum: number;
  number_result: number;
  size_result: 'Big' | 'Small';
  color_result: 'Green' | 'Red' | 'Green+Violet' | 'Red+Violet';
  timestamp: string;
}

export interface WingoBet {
  id: string;
  period: string;
  periodNum: number;
  choice: string;
  amount: number;
  multiplier: number;
  status: 'Pending' | 'Win' | 'Lose';
  winAmount: number;
  resultNumber?: number;
  resultSize?: 'Big' | 'Small';
  createdAt: string;
}

export interface BinaryPair {
  symbol: string;
  name: string;
  category: 'Crypto' | 'Forex' | 'Commodity';
  payout: number; // e.g. 96 means +96%
  basePrice: number;
  decimals: number;
  volatility: number;
  change24h: number;
}

export interface BinaryCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface BinaryTrade {
  id: string;
  symbol: string;
  direction: 'CALL' | 'PUT';
  amount: number;
  payoutPercent: number;
  entryPrice: number;
  exitPrice?: number;
  durationSec: number;
  startTime: number;
  endTime: number;
  status: 'OPEN' | 'WIN' | 'LOSE' | 'TIE';
  profit: number;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  type: 'Deposit' | 'Withdraw';
  method: 'bKash' | 'Nagad' | 'Rocket' | 'USDT (TRC20)';
  amount: number;
  account: string;
  trxId: string;
  paymentID?: string;
  orderID?: string;
  status: 'Completed' | 'Processing' | 'Refunded';
  createdAt: string;
}

export interface BonusRecord {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
}

export interface ResultPopupData {
  mode: 'Binary' | 'Trading';
  periodOrPair: string;
  resultText: string;
  winAmount: number;
  isWin: boolean;
}
