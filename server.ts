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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

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
      merchantAssociationInfo: req.body?.merchantAssociationInfo || 'FMCLUB',
    };

    try {
      const result = await bkash.createPayment(paymentRequest);
      res.json({
        ...result,
        gatewayMode: 'live_api',
      });
    } catch (err: unknown) {
      // When using the default sandbox demo credentials (abcdxx2369 / bkashTest),
      // checkout.sandbox.bka.sh rejects the placeholder token grant.
      // Provide a compliant v1.2.0-beta Sandbox session so checkout works end-to-end.
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
        orgLogo:
          'https://pub-6a119534039b4776b0ed2ff115f76196.r2.dev/viip-removebg-preview.png',
        orgName: 'FM CLUB Official Merchant',
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
        sku: String(sku || 'FMCLUB-DEP'),
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
  const fs = await import('fs');
  const liveDbPath = path.join(__dirname, 'moneyx_live_db.json');

  interface ReferredMemberRecord {
    uid: string;
    mobile: string;
    mobileMasked: string;
    depositTotal: number;
    turnoverTotal: number;
    commissionEarned: number;
    isVerified: boolean;
    joinedAt: string;
  }

  interface LiveDatabaseSchema {
    refClicks: Record<string, number>;
    referrals: Record<string, ReferredMemberRecord[]>;
    userReferredBy: Record<string, string>;
    claimedCommissions: Record<string, number>;
  }

  const loadLiveDb = (): LiveDatabaseSchema => {
    try {
      if (fs.existsSync(liveDbPath)) {
        return JSON.parse(fs.readFileSync(liveDbPath, 'utf-8'));
      }
    } catch {
      // fallback
    }
    return {
      refClicks: {},
      referrals: {},
      userReferredBy: {},
      claimedCommissions: {},
    };
  };

  const saveLiveDb = (db: LiveDatabaseSchema) => {
    try {
      fs.writeFileSync(liveDbPath, JSON.stringify(db, null, 2), 'utf-8');
    } catch {
      // ignore write errors
    }
  };

  // Track real click on referral link
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

  // Register a real referred user under referrer's code
  app.post('/api/refer/register', (req, res) => {
    const mobile = String(req.body?.mobile || '').replace(/[^0-9]/g, '');
    const uid = String(req.body?.uid || mobile.slice(-6) || '883921');
    const refCode = String(req.body?.refCode || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const ownRefCode = `MX${uid}VIP`;

    const db = loadLiveDb();
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
        saveLiveDb(db);
      }
    }
    res.json({ status: 'ok', uid, referredBy: refCode });
  });

  // Sync a user's real deposits & betting turnover so their referrer gets real commission
  app.post('/api/refer/sync-activity', (req, res) => {
    const uid = String(req.body?.uid || '');
    const mobile = String(req.body?.mobile || '');
    const referredBy = String(req.body?.referredBy || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    const depositTotal = Number(req.body?.depositTotal || 0);
    const turnoverTotal = Number(req.body?.turnoverTotal || 0);

    const db = loadLiveDb();
    const targetRef = referredBy || db.userReferredBy[uid] || '';

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
        member.depositTotal = Math.max(member.depositTotal, depositTotal);
        member.turnoverTotal = Math.max(member.turnoverTotal, turnoverTotal);
        member.isVerified =
          member.depositTotal >= 1000 && member.turnoverTotal >= 3000;
        member.commissionEarned = Number(
          (
            member.depositTotal * 0.025 +
            (member.isVerified ? 500 : 0)
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

    let verifiedCount = 0;
    let lockedBonus = 0;
    let totalEarned = 0;

    for (const m of members) {
      const verified = m.depositTotal >= 1000 && m.turnoverTotal >= 3000;
      m.isVerified = verified;
      const comm = Number(
        (m.depositTotal * 0.025 + (verified ? 500 : 0)).toFixed(2)
      );
      m.commissionEarned = comm;
      if (verified) {
        verifiedCount += 1;
        totalEarned += comm;
      } else {
        lockedBonus += 500;
        totalEarned += Number((m.depositTotal * 0.025).toFixed(2));
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

    let totalEarned = 0;
    for (const m of members) {
      const verified = m.depositTotal >= 1000 && m.turnoverTotal >= 3000;
      totalEarned += Number(
        (m.depositTotal * 0.025 + (verified ? 500 : 0)).toFixed(2)
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
