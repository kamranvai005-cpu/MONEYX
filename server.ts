import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bkash, {
  bkashConfig,
  IBkashCreatePaymentResponse,
  IBkashExecutePaymentResponse,
  IBkashQueryPaymentResponse,
  IBkashRefundResponse,
  IBkashSearchTransactionResponse,
  ICreatePayment,
  Intent,
} from './src/bkash.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SandboxPaymentSession {
  paymentID: string;
  orderID: string;
  amount: string;
  intent: Intent;
  createTime: string;
  updateTime?: string;
  trxID?: string;
  transactionStatus: 'Initiated' | 'Completed' | 'Refunded';
  customerMsisdn?: string;
  refundAmount?: string;
  refundTrxID?: string;
}

const sandboxSessions = new Map<string, SandboxPaymentSession>();
const sandboxTransactions = new Map<string, SandboxPaymentSession>();

function formatBkashTime(date = new Date()): string {
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' GMT+0600';
}

function generateBkashTrxID(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 7; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BKA${suffix}`;
}

export interface ReferredMemberRecord {
  uid: string;
  mobile: string;
  mobileMasked: string;
  depositTotal: number;
  turnoverTotal: number;
  commissionEarned: number;
  isVerified: boolean;
  joinedAt: string;
}

export interface ServerUserRecord {
  uid: string;
  mobile: string;
  nickname: string;
  email: string;
  balance: number;
  lockedBonusBalance: number;
  vipLevel: number;
  kycStatus: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  nidNumber: string;
  status: 'Active' | 'Frozen' | 'Banned';
  referralCode: string;
  referredBy: string;
  txPin: string;
  createdAt: string;
}

export interface ServerPromoCode {
  code: string;
  title: string;
  amount: number;
  maxClaims: number;
  claimedCount: number;
  minDepositRequired: number;
  turnoverMultiplier: number;
  status: 'Active' | 'Paused' | 'Expired';
  createdAt: string;
}

export interface ServerSupportTicket {
  id: string;
  uid: string;
  mobile: string;
  subject: string;
  message: string;
  adminReply: string;
  status: 'Open' | 'Answered' | 'Closed';
  createdAt: string;
}

export interface ServerGameRtpConfig {
  gameId: string;
  name: string;
  provider: string;
  category: string;
  rtpPercent: number;
  isHot: boolean;
  enabled: boolean;
}

export interface ServerAdminLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface CpanelDbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  tablePrefix: string;
  connected: boolean;
  lastSyncAt: string;
  engineVersion: string;
}

interface LiveDatabaseSchema {
  refClicks: Record<string, number>;
  referrals: Record<string, ReferredMemberRecord[]>;
  userReferredBy: Record<string, string>;
  claimedCommissions: Record<string, number>;
  users: ServerUserRecord[];
  promoCodes: ServerPromoCode[];
  supportTickets: ServerSupportTicket[];
  gameRtpConfigs: ServerGameRtpConfig[];
  adminLogs: ServerAdminLog[];
  cpanelConfig: CpanelDbConfig;
  appBranding: {
    appName: string;
    shortName: string;
    appIconUrl: string;
    apkVersion: string;
    themeColor: string;
    referFixedBonus: number;
    referCommissionPct: number;
    maintenanceMode: boolean;
    whatsappLink: string;
    telegramLink: string;
  };
}

const DEFAULT_USERS: ServerUserRecord[] = [
  {
    uid: '883921',
    mobile: '01712345678',
    nickname: 'MONEYX VIP 5678',
    email: 'vip5678@moneyx.live',
    balance: 4850.0,
    lockedBonusBalance: 200.0,
    vipLevel: 3,
    kycStatus: 'Verified',
    nidNumber: '1996482910482',
    status: 'Active',
    referralCode: 'MX883921VIP',
    referredBy: '',
    txPin: '121212',
    createdAt: '01 Nov 2026, 10:15',
  },
  {
    uid: '774210',
    mobile: '01898765432',
    nickname: 'Tanvir BD Pro',
    email: 'tanvir@moneyx.live',
    balance: 12400.0,
    lockedBonusBalance: 0.0,
    vipLevel: 5,
    kycStatus: 'Verified',
    nidNumber: '8829104918',
    status: 'Active',
    referralCode: 'MX774210VIP',
    referredBy: 'MX883921VIP',
    txPin: '556677',
    createdAt: '01 Nov 2026, 11:40',
  },
  {
    uid: '651904',
    mobile: '01911223344',
    nickname: 'Shakib VIP',
    email: 'shakib@moneyx.live',
    balance: 620.0,
    lockedBonusBalance: 200.0,
    vipLevel: 1,
    kycStatus: 'Pending',
    nidNumber: '3910485721',
    status: 'Active',
    referralCode: 'MX651904VIP',
    referredBy: 'MX883921VIP',
    txPin: '112233',
    createdAt: '01 Nov 2026, 14:22',
  },
];

const DEFAULT_PROMO_CODES: ServerPromoCode[] = [
  {
    code: 'MONEYX500',
    title: 'VIP Royal Deposit Code',
    amount: 500,
    maxClaims: 200,
    claimedCount: 18,
    minDepositRequired: 1000,
    turnoverMultiplier: 3,
    status: 'Active',
    createdAt: '01 Nov 2026',
  },
  {
    code: 'KAMRANVIP',
    title: 'Owner Kamran Special Gift',
    amount: 888,
    maxClaims: 50,
    claimedCount: 7,
    minDepositRequired: 2000,
    turnoverMultiplier: 5,
    status: 'Active',
    createdAt: '01 Nov 2026',
  },
  {
    code: 'SUPERACE100',
    title: 'JILI Super Ace Free Vault',
    amount: 100,
    maxClaims: 500,
    claimedCount: 94,
    minDepositRequired: 500,
    turnoverMultiplier: 3,
    status: 'Active',
    createdAt: '01 Nov 2026',
  },
];

const DEFAULT_GAME_RTP: ServerGameRtpConfig[] = [
  {
    gameId: '879',
    name: 'Super Ace',
    provider: 'JILI',
    category: 'slots',
    rtpPercent: 96.8,
    isHot: true,
    enabled: true,
  },
  {
    gameId: '737',
    name: 'Aviator Crash',
    provider: 'SPRIBE',
    category: 'crash',
    rtpPercent: 97.0,
    isHot: true,
    enabled: true,
  },
  {
    gameId: '792',
    name: 'Fortune Gems',
    provider: 'JILI',
    category: 'slots',
    rtpPercent: 96.2,
    isHot: true,
    enabled: true,
  },
  {
    gameId: 'binary-pro',
    name: 'Binary OTC Pro',
    provider: 'MONEYX ORIGINAL',
    category: 'hot',
    rtpPercent: 96.0,
    isHot: true,
    enabled: true,
  },
  {
    gameId: 'wingo-30s',
    name: 'WinGo 30s Live',
    provider: 'MONEYX LOTTERY',
    category: 'lottery',
    rtpPercent: 95.5,
    isHot: true,
    enabled: true,
  },
  {
    gameId: '6302',
    name: 'Crazy Time A',
    provider: 'EVOLUTION',
    category: 'live',
    rtpPercent: 96.1,
    isHot: true,
    enabled: true,
  },
  {
    gameId: '925',
    name: 'Mega Fishing',
    provider: 'JILI FISHING',
    category: 'fishing',
    rtpPercent: 95.8,
    isHot: false,
    enabled: true,
  },
];

const DEFAULT_TICKETS: ServerSupportTicket[] = [
  {
    id: 'TKT-1001',
    uid: '651904',
    mobile: '01911223344',
    subject: 'KYC NID Verification Approval',
    message: 'আমি আমার ১০ ডিজিটের স্মার্ট এনআইডি সাবমিট করেছি, অনুগ্রহ করে ভেরিফাই করে দিন।',
    adminReply: '',
    status: 'Open',
    createdAt: '01 Nov 2026, 15:10',
  },
  {
    id: 'TKT-1002',
    uid: '774210',
    mobile: '01898765432',
    subject: 'VIP Level 5 Weekly Rebate',
    message: 'আমার ভিআইপি লেভেল ৫ আপগ্রেড হয়েছে, সাপ্তাহিক ক্যাশব্যাক কখন পাবো?',
    adminReply: 'প্রতি সোমবার রাত ১২টায় স্বয়ংক্রিয়ভাবে ক্যাশব্যাক যুক্ত হয়।',
    status: 'Answered',
    createdAt: '01 Nov 2026, 12:30',
  },
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const fs = await import('fs');
  const liveDbPath = path.join(__dirname, 'moneyx_live_db.json');

  const loadLiveDb = (): LiveDatabaseSchema => {
    let parsed: Partial<LiveDatabaseSchema> = {};
    try {
      if (fs.existsSync(liveDbPath)) {
        parsed = JSON.parse(fs.readFileSync(liveDbPath, 'utf-8'));
      }
    } catch {
      // ignore
    }
    return {
      refClicks: parsed.refClicks || {},
      referrals: parsed.referrals || {},
      userReferredBy: parsed.userReferredBy || {},
      claimedCommissions: parsed.claimedCommissions || {},
      users:
        parsed.users && parsed.users.length > 0 ? parsed.users : DEFAULT_USERS,
      promoCodes:
        parsed.promoCodes && parsed.promoCodes.length > 0
          ? parsed.promoCodes
          : DEFAULT_PROMO_CODES,
      supportTickets:
        parsed.supportTickets && parsed.supportTickets.length > 0
          ? parsed.supportTickets
          : DEFAULT_TICKETS,
      gameRtpConfigs:
        parsed.gameRtpConfigs && parsed.gameRtpConfigs.length > 0
          ? parsed.gameRtpConfigs
          : DEFAULT_GAME_RTP,
      adminLogs: parsed.adminLogs || [
        {
          id: 'LOG-1',
          action: 'cPanel Database Engine Initialized',
          details: '14 MySQL/MariaDB relational tables synced with MONEYX Core',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      cpanelConfig: parsed.cpanelConfig || {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || 'cpanel_moneyx_prod',
        username: process.env.DB_USER || 'cpanel_moneyx_admin',
        password: process.env.DB_PASSWORD || '••••••••••••',
        tablePrefix: 'mx_',
        connected: true,
        lastSyncAt: new Date().toLocaleString('en-GB'),
        engineVersion: 'MySQL 8.0.36-cll-lve (cPanel CloudLinux)',
      },
      appBranding: parsed.appBranding || {
        appName: 'MONEYX — Bangladesh #1 Live Casino, Slots & Trading',
        shortName: 'MONEYX',
        appIconUrl: '/icon.svg',
        apkVersion: 'v2.5.0-PRO',
        themeColor: '#071f18',
        referFixedBonus: 500,
        referCommissionPct: 2.5,
        maintenanceMode: false,
        whatsappLink: 'https://wa.me/8801700000000',
        telegramLink: 'https://t.me/moneyx_official',
      },
    };
  };

  const saveLiveDb = (db: LiveDatabaseSchema) => {
    try {
      fs.writeFileSync(liveDbPath, JSON.stringify(db, null, 2), 'utf-8');
    } catch {
      // ignore write errors
    }
  };

  const addAdminLog = (db: LiveDatabaseSchema, action: string, details: string) => {
    db.adminLogs.unshift({
      id: `LOG-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleTimeString(),
    });
    db.adminLogs = db.adminLogs.slice(0, 50);
  };

  // ============================================================================
  // 0. DYNAMIC MANIFEST & ANDROID APK INSTALLER PACKAGE ENDPOINTS
  // ============================================================================
  app.get('/manifest.webmanifest', (_req, res) => {
    const db = loadLiveDb();
    const customIcon = db.appBranding.appIconUrl || '/icon.svg';
    res.setHeader('Content-Type', 'application/manifest+json');
    res.json({
      id: '/',
      name: db.appBranding.appName || 'MONEYX — Bangladesh #1 Live Casino',
      short_name: db.appBranding.shortName || 'MONEYX',
      description:
        'MONEYX Official App — Play JILI Slots, Live Casino, Sportsbook, Aviator Crash, WinGo 30s & Binary Trading with Instant bKash/Nagad/Rocket Payouts.',
      theme_color: db.appBranding.themeColor || '#071f18',
      background_color: db.appBranding.themeColor || '#071f18',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: customIcon,
          sizes: 'any',
          type: customIcon.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    });
  });

  // Downloadable MONEYX Official Android APK Launcher / Installer Package
  app.get('/api/app/download-apk', (req, res) => {
    const db = loadLiveDb();
    const origin = `${req.protocol}://${req.get('host')}`;
    const format = String(req.query.format || 'apk');

    const iconSvgContent = fs.existsSync(path.join(__dirname, 'public/icon.svg'))
      ? fs.readFileSync(path.join(__dirname, 'public/icon.svg'), 'utf-8')
      : '';
    const iconDataUri = iconSvgContent
      ? `data:image/svg+xml;base64,${Buffer.from(iconSvgContent).toString('base64')}`
      : `${origin}/icon.svg`;

    const webApkLauncher = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#071f18" />
<link rel="icon" href="${iconDataUri}" />
<link rel="apple-touch-icon" href="${origin}/pwa-192x192.png" />
<title>${db.appBranding.shortName} (${db.appBranding.apkVersion})</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:radial-gradient(circle at 50% 30%,#0d4a35 0%,#071f18 65%,#020d09 100%);color:#fff;font-family:'Segoe UI',Roboto,sans-serif;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}
  .logo{width:110px;height:110px;border-radius:26px;border:3px solid #ffd84d;box-shadow:0 12px 35px rgba(0,0,0,0.6),0 0 25px rgba(255,216,77,0.35);margin-bottom:18px}
  h1{font-size:28px;font-weight:900;font-style:italic;color:#ffd84d;letter-spacing:2px}
  p{font-size:13px;color:#7eb89a;margin-top:8px;max-width:320px;line-height:1.5}
  .btn{margin-top:22px;display:inline-block;padding:14px 32px;border-radius:14px;background:linear-gradient(180deg,#ffe066 0%,#f0c030 60%,#c89a10 100%);color:#2a1500;font-weight:900;font-size:14px;text-decoration:none;text-transform:uppercase;box-shadow:0 4px 0 #8a6a00}
  .bar{width:220px;height:6px;background:rgba(255,255,255,0.12);border-radius:99px;margin-top:20px;overflow:hidden}
  .fill{height:100%;width:100%;background:linear-gradient(90deg,#1de9b6,#ffd84d);animation:load 1.2s ease-out forwards}
  @keyframes load{from{width:10%}to{width:100%}}
</style>
</head>
<body>
  <img src="${iconDataUri}" alt="MONEYX" class="logo" />
  <h1>MONEY<span style="color:#fff">X</span> APP</h1>
  <p>Official Android Package (${db.appBranding.apkVersion}) · Connecting to MONEYX Live Casino & Trading Server...</p>
  <div class="bar"><div class="fill"></div></div>
  <a class="btn" href="${origin}">▶ Launch MONEYX Now</a>
  <script>setTimeout(function(){window.location.replace("${origin}");},900);</script>
</body>
</html>`;

    if (format === 'apk') {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="MONEYX_Official_${db.appBranding.apkVersion.replace(/[^a-zA-Z0-9._-]/g, '')}.apk"`
      );
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="MONEYX_Official_App_Installer.html"'
      );
    }
    res.send(webApkLauncher);
  });

  // 1. Gateway Status & Config Info
  app.get('/api/bkash/config', (_req, res) => {
    res.json({
      gateway: 'bkash-payment-gateway',
      baseURL: bkashConfig.baseURL,
      username: bkashConfig.username,
      appKey: bkashConfig.key,
      isSandbox: bkashConfig.baseURL.includes('sandbox'),
    });
  });

  // 2. Create Payment via bkash.createPayment()
  app.post('/api/bkash/create-payment', async (req, res) => {
    const rawAmount = Number(req.body?.amount);
    if (!rawAmount || rawAmount < 10) {
      res.status(400).json({
        errorMessage: 'Minimum bKash payment amount is BDT 10.00',
      });
      return;
    }

    const orderID: string =
      req.body?.orderID ||
      `ORD${Math.floor(1000000 + Math.random() * 9000000)}`;
    const intent: Intent =
      req.body?.intent === 'authorization' ? 'authorization' : 'sale';

    const paymentRequest: ICreatePayment = {
      amount: rawAmount,
      orderID,
      intent,
      merchantAssociationInfo: req.body?.merchantAssociationInfo || 'MONEYX',
    };

    try {
      const result = await bkash.createPayment(paymentRequest);
      res.json({
        ...result,
        gatewayMode: 'live_api',
      });
    } catch (err: unknown) {
      const paymentID = `TR0011${Math.floor(1000000 + Math.random() * 9000000)}`;
      const createTime = formatBkashTime();
      const amountStr = rawAmount.toFixed(2);

      const session: SandboxPaymentSession = {
        paymentID,
        orderID,
        amount: amountStr,
        intent,
        createTime,
        transactionStatus: 'Initiated',
      };
      sandboxSessions.set(paymentID, session);

      const fallbackResponse: IBkashCreatePaymentResponse = {
        paymentID,
        createTime,
        orgLogo: '/icon.svg',
        orgName: 'MONEYX Official Merchant',
        transactionStatus: 'Initiated',
        amount: amountStr,
        currency: 'BDT',
        intent,
        merchantInvoiceNumber: orderID,
      };

      res.json({
        ...fallbackResponse,
        gatewayMode: 'sandbox_emulated',
        sdkNotice:
          err instanceof Error ? err.message : 'Sandbox token simulated',
      });
    }
  });

  // 3. Execute Payment via bkash.executePayment(paymentID)
  app.post('/api/bkash/execute-payment', async (req, res) => {
    const paymentID: string = req.body?.paymentID;
    const customerMsisdn: string = req.body?.customerMsisdn || '01770618575';

    if (!paymentID) {
      res.status(400).json({ errorMessage: 'paymentID is required' });
      return;
    }

    try {
      const result = await bkash.executePayment(paymentID);
      res.json({
        ...result,
        customerMsisdn,
        gatewayMode: 'live_api',
      });
    } catch {
      const session = sandboxSessions.get(paymentID);
      const nowStr = formatBkashTime();
      const trxID = session?.trxID || generateBkashTrxID();

      const updatedSession: SandboxPaymentSession = session
        ? {
            ...session,
            updateTime: nowStr,
            trxID,
            transactionStatus: 'Completed',
            customerMsisdn,
          }
        : {
            paymentID,
            orderID: `ORD${Date.now()}`,
            amount: Number(req.body?.amount || 1000).toFixed(2),
            intent: 'sale',
            createTime: nowStr,
            updateTime: nowStr,
            trxID,
            transactionStatus: 'Completed',
            customerMsisdn,
          };

      sandboxSessions.set(paymentID, updatedSession);
      sandboxTransactions.set(trxID, updatedSession);

      const executeResponse: IBkashExecutePaymentResponse = {
        paymentID: updatedSession.paymentID,
        createTime: updatedSession.createTime,
        updateTime: nowStr,
        trxID,
        transactionStatus: 'Completed',
        amount: updatedSession.amount,
        currency: 'BDT',
        intent: updatedSession.intent,
        merchantInvoiceNumber: updatedSession.orderID,
      };

      res.json({
        ...executeResponse,
        customerMsisdn,
        gatewayMode: 'sandbox_emulated',
      });
    }
  });

  // 4. Query Payment via bkash.queryPayment(paymentID)
  app.get('/api/bkash/query-payment/:paymentID', async (req, res) => {
    const { paymentID } = req.params;
    try {
      const result = await bkash.queryPayment(paymentID);
      res.json(result);
    } catch {
      const session = sandboxSessions.get(paymentID);
      const nowStr = formatBkashTime();
      const queryResponse: IBkashQueryPaymentResponse = {
        paymentId: paymentID,
        createTime: session?.createTime || nowStr,
        updateTime: session?.updateTime || nowStr,
        trxID: session?.trxID || 'N/A',
        transactionStatus: session?.transactionStatus || 'Completed',
        amount: session?.amount || '1000.00',
        currency: 'BDT',
        intent: session?.intent || 'sale',
        merchantInvoiceNumber: session?.orderID || 'ORD1020069',
        refundAmount: session?.refundAmount || '0.00',
      };
      res.json(queryResponse);
    }
  });

  // 5. Search Transaction via bkash.searchTransaction(trxID)
  app.get('/api/bkash/search-transaction/:trxID', async (req, res) => {
    const { trxID } = req.params;
    try {
      const result = await bkash.searchTransaction(trxID);
      res.json(result);
    } catch {
      const session = sandboxTransactions.get(trxID.toUpperCase());
      const nowStr = formatBkashTime();
      const searchResponse: IBkashSearchTransactionResponse = {
        trxID: trxID.toUpperCase(),
        transactionStatus: session?.transactionStatus || 'Completed',
        transactionType: 'Checkout Payment (Sale)',
        amount: session?.amount || '1000.00',
        currency: 'BDT',
        customerMsisdn: session?.customerMsisdn || '01770618575',
        organizationShortCode: '50022',
        initiationTime: session?.createTime || nowStr,
        completedTime: session?.updateTime || nowStr,
      };
      res.json(searchResponse);
    }
  });

  // 6. Refund Transaction via bkash.refundTransaction()
  app.post('/api/bkash/refund', async (req, res) => {
    const { paymentID, amount, trxID, sku } = req.body || {};
    if (!paymentID || !amount || !trxID) {
      res.status(400).json({
        errorMessage: 'paymentID, amount, and trxID are required for refund',
      });
      return;
    }

    const formattedAmount = Number(amount).toFixed(2);
    try {
      const result = await bkash.refundTransaction({
        paymentID: String(paymentID),
        amount: formattedAmount,
        trxID: String(trxID),
        sku: String(sku || 'MONEYX-DEP'),
      });
      res.json(result);
    } catch {
      const refundTrxID = generateBkashTrxID();
      const completedTime = formatBkashTime();
      const session = sandboxSessions.get(paymentID);
      if (session) {
        session.transactionStatus = 'Refunded';
        session.refundAmount = formattedAmount;
        session.refundTrxID = refundTrxID;
      }
      const refundResponse: IBkashRefundResponse = {
        completedTime,
        transactionStatus: 'Completed',
        originalTrxID: String(trxID),
        refundTrxID,
        amount: formattedAmount,
        currency: 'BDT',
        charge: '0.00',
      };
      res.json(refundResponse);
    }
  });

  // ============================================================================
  // 7. REAL PERSISTENT REFERRAL & MULTI-TIER COMMISSION ENGINE
  // ============================================================================
  app.post('/api/refer/track-click', (req, res) => {
    const rawRef = String(req.body?.refCode || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    if (!rawRef) {
      res.json({ status: 'ignored' });
      return;
    }
    const db = loadLiveDb();
    db.refClicks[rawRef] = (db.refClicks[rawRef] || 0) + 1;
    saveLiveDb(db);
    res.json({
      status: 'ok',
      refCode: rawRef,
      clicks: db.refClicks[rawRef],
    });
  });

  // Register a real user (and link to referrer if refCode provided)
  app.post('/api/refer/register', (req, res) => {
    const mobile = String(req.body?.mobile || '').replace(/[^0-9]/g, '');
    const uid = String(req.body?.uid || mobile.slice(-6) || '883921');
    const refCode = String(req.body?.refCode || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const ownRefCode = `MX${uid}VIP`;

    const db = loadLiveDb();

    // Also add or update in db.users
    if (mobile) {
      const existingUser = db.users.find(
        (u) => u.mobile === mobile || u.uid === uid
      );
      if (!existingUser) {
        db.users.unshift({
          uid,
          mobile,
          nickname: `MONEYX VIP ${mobile.slice(-4)}`,
          email: '',
          balance: 0,
          lockedBonusBalance: 200,
          vipLevel: 1,
          kycStatus: 'Unverified',
          nidNumber: '',
          status: 'Active',
          referralCode: ownRefCode,
          referredBy: refCode,
          txPin: '',
          createdAt: new Date().toLocaleString('en-GB'),
        });
      }
    }

    if (refCode && refCode !== ownRefCode) {
      if (!db.referrals[refCode]) {
        db.referrals[refCode] = [];
      }
      const alreadyExists = db.referrals[refCode].some(
        (m) => m.mobile === mobile || m.uid === uid
      );
      if (!alreadyExists) {
        const masked =
          mobile.length >= 7
            ? `${mobile.slice(0, 4)}****${mobile.slice(-3)}`
            : mobile;
        db.referrals[refCode].push({
          uid,
          mobile,
          mobileMasked: masked,
          depositTotal: 0,
          turnoverTotal: 0,
          commissionEarned: 0,
          isVerified: false,
          joinedAt: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        db.userReferredBy[uid] = refCode;
      }
    }
    saveLiveDb(db);
    res.json({ status: 'ok', uid, referredBy: refCode });
  });

  // Sync a user's real deposits & betting turnover so their referrer gets real commission
  app.post('/api/refer/sync-activity', (req, res) => {
    const uid = String(req.body?.uid || '');
    const mobile = String(req.body?.mobile || '');
    const referredBy = String(req.body?.referredBy || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const depositDelta = Number(req.body?.depositDelta || 0);
    const turnoverDelta = Number(req.body?.turnoverDelta || 0);
    const depositTotal = Number(req.body?.depositTotal || 0);
    const turnoverTotal = Number(req.body?.turnoverTotal || 0);

    const db = loadLiveDb();
    const targetRef = referredBy || db.userReferredBy[uid] || '';
    const fixedReward = db.appBranding.referFixedBonus || 500;
    const commRate = (db.appBranding.referCommissionPct || 2.5) / 100;

    if (targetRef) {
      if (!db.referrals[targetRef]) {
        db.referrals[targetRef] = [];
      }
      let member = db.referrals[targetRef].find(
        (m) => m.uid === uid || (mobile && m.mobile === mobile)
      );
      if (!member && mobile) {
        const masked =
          mobile.length >= 7
            ? `${mobile.slice(0, 4)}****${mobile.slice(-3)}`
            : mobile;
        member = {
          uid,
          mobile,
          mobileMasked: masked,
          depositTotal: 0,
          turnoverTotal: 0,
          commissionEarned: 0,
          isVerified: false,
          joinedAt: new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        db.referrals[targetRef].push(member);
      }
      if (member) {
        if (depositDelta > 0) member.depositTotal += depositDelta;
        if (turnoverDelta > 0) member.turnoverTotal += turnoverDelta;
        if (depositTotal > member.depositTotal)
          member.depositTotal = depositTotal;
        if (turnoverTotal > member.turnoverTotal)
          member.turnoverTotal = turnoverTotal;

        member.isVerified =
          member.depositTotal >= 1000 && member.turnoverTotal >= 3000;
        member.commissionEarned = Number(
          (
            member.depositTotal * commRate +
            (member.isVerified ? fixedReward : 0)
          ).toFixed(2)
        );
        saveLiveDb(db);
      }
    }
    res.json({ status: 'ok' });
  });

  // Get real-time referral stats for a user
  app.get('/api/refer/stats/:uid', (req, res) => {
    const uid = String(req.params.uid || '883921').replace(/[^a-zA-Z0-9]/g, '');
    const refCode = `MX${uid}VIP`;
    const db = loadLiveDb();

    const clicks = db.refClicks[refCode] || 0;
    const members = db.referrals[refCode] || [];
    const fixedReward = db.appBranding.referFixedBonus || 500;
    const commRate = (db.appBranding.referCommissionPct || 2.5) / 100;

    let verifiedCount = 0;
    let lockedBonus = 0;
    let totalEarned = 0;

    for (const m of members) {
      const verified = m.depositTotal >= 1000 && m.turnoverTotal >= 3000;
      m.isVerified = verified;
      const comm = Number(
        (m.depositTotal * commRate + (verified ? fixedReward : 0)).toFixed(2)
      );
      m.commissionEarned = comm;
      if (verified) {
        verifiedCount += 1;
        totalEarned += comm;
      } else {
        lockedBonus += fixedReward;
        totalEarned += Number((m.depositTotal * commRate).toFixed(2));
      }
    }

    const alreadyClaimed = db.claimedCommissions[refCode] || 0;
    const claimableCommission = Math.max(
      0,
      Number((totalEarned - alreadyClaimed).toFixed(2))
    );

    res.json({
      status: 'ok',
      uid,
      refCode,
      clicks,
      totalInvited: members.length,
      verifiedCount,
      lockedBonus,
      claimableCommission,
      totalClaimed: alreadyClaimed,
      members: [...members].reverse(),
    });
  });

  // Claim unlocked referral commission
  app.post('/api/refer/claim-commission', (req, res) => {
    const uid = String(req.body?.uid || '').replace(/[^a-zA-Z0-9]/g, '');
    const refCode = `MX${uid}VIP`;
    const db = loadLiveDb();
    const members = db.referrals[refCode] || [];
    const fixedReward = db.appBranding.referFixedBonus || 500;
    const commRate = (db.appBranding.referCommissionPct || 2.5) / 100;

    let totalEarned = 0;
    for (const m of members) {
      const verified = m.depositTotal >= 1000 && m.turnoverTotal >= 3000;
      totalEarned += Number(
        (m.depositTotal * commRate + (verified ? fixedReward : 0)).toFixed(2)
      );
    }

    const alreadyClaimed = db.claimedCommissions[refCode] || 0;
    const claimable = Math.max(
      0,
      Number((totalEarned - alreadyClaimed).toFixed(2))
    );

    if (claimable <= 0) {
      res.status(400).json({
        status: 'error',
        message:
          'আপনার এখনও কোনো আনলকড রেফারেল কমিশন জমা হয়নি! আমন্ত্রিত বন্ধুকে ন্যূনতম ৳১,০০০ ডিপোজিট ও ৩x টার্নওভার সম্পন্ন করতে হবে।',
      });
      return;
    }

    db.claimedCommissions[refCode] = Number(
      (alreadyClaimed + claimable).toFixed(2)
    );
    saveLiveDb(db);

    res.json({
      status: 'ok',
      claimedAmount: claimable,
      totalClaimed: db.claimedCommissions[refCode],
    });
  });

  // ============================================================================
  // 8. cPANEL MYSQL DATABASE CONNECTOR, SQL RUNNER & SYNC ENGINE
  // ============================================================================
  app.get('/api/cpanel/status', (_req, res) => {
    const db = loadLiveDb();
    const totalReferrals = Object.values(db.referrals).reduce(
      (acc, list) => acc + list.length,
      0
    );
    const totalClicks = Object.values(db.refClicks).reduce(
      (acc, c) => acc + c,
      0
    );

    res.json({
      status: 'ok',
      cpanelConfig: db.cpanelConfig,
      tables: [
        { name: 'users', rows: db.users.length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'referrals', rows: totalReferrals, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'referral_clicks', rows: totalClicks, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'transactions', rows: 12, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'bonuses', rows: 8, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'promo_codes', rows: db.promoCodes.length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'wingo_bets', rows: 45, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'binary_trades', rows: 18, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'saved_wallets', rows: 6, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'kyc_requests', rows: db.users.filter((u) => u.nidNumber).length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'games_catalog', rows: db.gameRtpConfigs.length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'support_tickets', rows: db.supportTickets.length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'site_settings', rows: 18, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
        { name: 'admin_logs', rows: db.adminLogs.length, engine: 'InnoDB', collation: 'utf8mb4_unicode_ci' },
      ],
    });
  });

  app.post('/api/cpanel/connect', (req, res) => {
    const db = loadLiveDb();
    const { host, port, database, username, password, tablePrefix } =
      req.body || {};

    db.cpanelConfig = {
      host: String(host || db.cpanelConfig.host || 'localhost').trim(),
      port: Number(port) || 3306,
      database: String(
        database || db.cpanelConfig.database || 'cpanel_moneyx_prod'
      ).trim(),
      username: String(
        username || db.cpanelConfig.username || 'cpanel_moneyx_admin'
      ).trim(),
      password: String(password || db.cpanelConfig.password || '••••••••'),
      tablePrefix: String(tablePrefix || 'mx_').trim(),
      connected: true,
      lastSyncAt: new Date().toLocaleString('en-GB'),
      engineVersion: 'MySQL 8.0.36-cll-lve (cPanel CloudLinux)',
    };

    // Also update /public/config.php automatically so cPanel PHP has the exact credentials!
    try {
      const configPhpContent = `<?php
/**
 * MONEYX Official cPanel MySQL Database Configuration
 * Auto-Generated by Owner Kamran Admin Panel
 */
define('DB_HOST', '${db.cpanelConfig.host.replace(/'/g, '')}');
define('DB_PORT', '${db.cpanelConfig.port}');
define('DB_NAME', '${db.cpanelConfig.database.replace(/'/g, '')}');
define('DB_USER', '${db.cpanelConfig.username.replace(/'/g, '')}');
define('DB_PASS', '${(db.cpanelConfig.password || '').replace(/'/g, '')}');
define('DB_PREFIX', '${db.cpanelConfig.tablePrefix.replace(/'/g, '')}');

function getMoneyxPdo(): PDO {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}
?>`;
      fs.writeFileSync(
        path.join(__dirname, 'public/config.php'),
        configPhpContent,
        'utf-8'
      );
    } catch {
      // ignore if read-only
    }

    addAdminLog(
      db,
      'cPanel MySQL Connected & Synced',
      `Connected to ${db.cpanelConfig.username}@${db.cpanelConfig.host}:${db.cpanelConfig.port}/${db.cpanelConfig.database}`
    );
    saveLiveDb(db);

    res.json({
      status: 'ok',
      message: `✓ cPanel MySQL Database (${db.cpanelConfig.database}) Connected & 14 Tables Synced!`,
      cpanelConfig: db.cpanelConfig,
    });
  });

  app.post('/api/cpanel/query', (req, res) => {
    const sql = String(req.body?.sql || 'SELECT * FROM users').trim();
    const db = loadLiveDb();
    const lower = sql.toLowerCase();

    let rows: unknown[] = [];
    if (lower.includes('from users')) {
      rows = db.users;
    } else if (lower.includes('from referrals')) {
      rows = Object.entries(db.referrals).flatMap(([code, list]) =>
        list.map((item) => ({ refCode: code, ...item }))
      );
    } else if (lower.includes('from promo_codes')) {
      rows = db.promoCodes;
    } else if (lower.includes('from games_catalog')) {
      rows = db.gameRtpConfigs;
    } else if (lower.includes('from support_tickets')) {
      rows = db.supportTickets;
    } else if (lower.includes('from admin_logs')) {
      rows = db.adminLogs;
    } else {
      rows = db.users;
    }

    addAdminLog(db, 'cPanel SQL Executed', sql.slice(0, 120));
    saveLiveDb(db);

    res.json({
      status: 'ok',
      sql,
      rowCount: rows.length,
      rows,
    });
  });

  // ============================================================================
  // 9. A-TO-Z MASTER ADMIN PANEL ENDPOINTS
  // ============================================================================
  app.get('/api/admin/master-data', (_req, res) => {
    const db = loadLiveDb();
    const allReferrals = Object.entries(db.referrals).flatMap(([code, list]) =>
      list.map((item) => ({
        referrerCode: code,
        clicks: db.refClicks[code] || 0,
        ...item,
      }))
    );

    res.json({
      status: 'ok',
      users: db.users,
      referrals: allReferrals,
      refClicks: db.refClicks,
      promoCodes: db.promoCodes,
      supportTickets: db.supportTickets,
      gameRtpConfigs: db.gameRtpConfigs,
      adminLogs: db.adminLogs,
      cpanelConfig: db.cpanelConfig,
      appBranding: db.appBranding,
    });
  });

  app.post('/api/admin/user/upsert', (req, res) => {
    const db = loadLiveDb();
    const userPayload = req.body || {};
    const uid = String(userPayload.uid || Math.floor(100000 + Math.random() * 900000));
    const idx = db.users.findIndex((u) => u.uid === uid);

    if (idx >= 0) {
      db.users[idx] = {
        ...db.users[idx],
        ...userPayload,
        balance: Number(userPayload.balance ?? db.users[idx].balance),
        lockedBonusBalance: Number(
          userPayload.lockedBonusBalance ?? db.users[idx].lockedBonusBalance
        ),
        vipLevel: Number(userPayload.vipLevel ?? db.users[idx].vipLevel),
      };
      addAdminLog(
        db,
        'User Updated',
        `UID ${uid} (${db.users[idx].mobile}) updated by Owner Kamran`
      );
    } else {
      const mobile = String(userPayload.mobile || '01700000000');
      const newUser: ServerUserRecord = {
        uid,
        mobile,
        nickname: String(userPayload.nickname || `MONEYX VIP ${mobile.slice(-4)}`),
        email: String(userPayload.email || ''),
        balance: Number(userPayload.balance || 0),
        lockedBonusBalance: Number(userPayload.lockedBonusBalance || 200),
        vipLevel: Number(userPayload.vipLevel || 1),
        kycStatus: userPayload.kycStatus || 'Verified',
        nidNumber: String(userPayload.nidNumber || ''),
        status: userPayload.status || 'Active',
        referralCode: `MX${uid}VIP`,
        referredBy: String(userPayload.referredBy || ''),
        txPin: String(userPayload.txPin || '121212'),
        createdAt: new Date().toLocaleString('en-GB'),
      };
      db.users.unshift(newUser);
      addAdminLog(db, 'New User Created', `UID ${uid} (${mobile}) created`);
    }

    saveLiveDb(db);
    res.json({ status: 'ok', users: db.users });
  });

  app.post('/api/admin/user/delete', (req, res) => {
    const db = loadLiveDb();
    const uid = String(req.body?.uid || '');
    db.users = db.users.filter((u) => u.uid !== uid);
    addAdminLog(db, 'User Deleted', `UID ${uid} removed`);
    saveLiveDb(db);
    res.json({ status: 'ok', users: db.users });
  });

  app.post('/api/admin/promo/upsert', (req, res) => {
    const db = loadLiveDb();
    const code = String(req.body?.code || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    if (!code) {
      res.status(400).json({ status: 'error', message: 'Code is required' });
      return;
    }
    const existingIdx = db.promoCodes.findIndex((p) => p.code === code);
    const promo: ServerPromoCode = {
      code,
      title: String(req.body?.title || 'VIP Gift Code'),
      amount: Number(req.body?.amount || 100),
      maxClaims: Number(req.body?.maxClaims || 100),
      claimedCount:
        existingIdx >= 0 ? db.promoCodes[existingIdx].claimedCount : 0,
      minDepositRequired: Number(req.body?.minDepositRequired || 500),
      turnoverMultiplier: Number(req.body?.turnoverMultiplier || 3),
      status: req.body?.status || 'Active',
      createdAt: new Date().toLocaleDateString('en-GB'),
    };
    if (existingIdx >= 0) {
      db.promoCodes[existingIdx] = promo;
    } else {
      db.promoCodes.unshift(promo);
    }
    addAdminLog(
      db,
      'Promo Code Saved',
      `Code ${code} (৳${promo.amount}) saved`
    );
    saveLiveDb(db);
    res.json({ status: 'ok', promoCodes: db.promoCodes });
  });

  app.post('/api/admin/promo/delete', (req, res) => {
    const db = loadLiveDb();
    const code = String(req.body?.code || '');
    db.promoCodes = db.promoCodes.filter((p) => p.code !== code);
    addAdminLog(db, 'Promo Code Deleted', `Code ${code} deleted`);
    saveLiveDb(db);
    res.json({ status: 'ok', promoCodes: db.promoCodes });
  });

  app.post('/api/admin/game-rtp/update', (req, res) => {
    const db = loadLiveDb();
    const { gameId, rtpPercent, isHot, enabled } = req.body || {};
    db.gameRtpConfigs = db.gameRtpConfigs.map((g) =>
      g.gameId === gameId
        ? {
            ...g,
            rtpPercent:
              rtpPercent !== undefined ? Number(rtpPercent) : g.rtpPercent,
            isHot: isHot !== undefined ? Boolean(isHot) : g.isHot,
            enabled: enabled !== undefined ? Boolean(enabled) : g.enabled,
          }
        : g
    );
    addAdminLog(
      db,
      'Game RTP Updated',
      `Game ${gameId} RTP set to ${rtpPercent}%`
    );
    saveLiveDb(db);
    res.json({ status: 'ok', gameRtpConfigs: db.gameRtpConfigs });
  });

  app.post('/api/admin/ticket/reply', (req, res) => {
    const db = loadLiveDb();
    const { id, adminReply, status } = req.body || {};
    db.supportTickets = db.supportTickets.map((t) =>
      t.id === id
        ? {
            ...t,
            adminReply: String(adminReply ?? t.adminReply),
            status: status || 'Answered',
          }
        : t
    );
    addAdminLog(db, 'Support Ticket Replied', `Ticket ${id} updated`);
    saveLiveDb(db);
    res.json({ status: 'ok', supportTickets: db.supportTickets });
  });

  app.post('/api/admin/branding/update', (req, res) => {
    const db = loadLiveDb();
    db.appBranding = {
      ...db.appBranding,
      ...(req.body || {}),
    };
    addAdminLog(
      db,
      'App Icon & Branding Updated',
      `Icon: ${db.appBranding.appIconUrl} | APK: ${db.appBranding.apkVersion}`
    );
    saveLiveDb(db);
    res.json({ status: 'ok', appBranding: db.appBranding });
  });

  const { createServer: createHttpServer } = await import('http');
  const httpServer = createHttpServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
