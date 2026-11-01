import React, { useCallback, useEffect, useState } from 'react';
import {
  BinaryTrade,
  BonusRecord,
  SavedWithdrawalWallet,
  SiteAdminSettings,
  TransactionRecord,
  UserProfile,
  WingoBet,
} from '../types';

interface OwnerKamranAdminPanelProps {
  balance: number;
  profile: UserProfile;
  settings: SiteAdminSettings;
  transactions: TransactionRecord[];
  bonuses: BonusRecord[];
  wingoBets: WingoBet[];
  binaryTrades: BinaryTrade[];
  savedWallets: SavedWithdrawalWallet[];
  jackpotValue: number;
  onUpdateBalance: (newBalance: number) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateSettings: (updates: Partial<SiteAdminSettings>) => void;
  onUpdateTransactionStatus: (
    txId: string,
    newStatus: TransactionRecord['status']
  ) => void;
  onDeleteTransaction: (txId: string) => void;
  onAdminAddBonus: (title: string, amount: number) => void;
  onUpdateJackpot: (newVal: number) => void;
  onExitAdmin: () => void;
  onShowToast: (msg: string) => void;
}

interface AdminUserRecord {
  uid: string;
  mobile: string;
  nickname: string;
  balance: number;
  lockedBonus: number;
  vipLevel: number;
  referralCode: string;
  referredBy: string | null;
  status: 'ACTIVE' | 'FROZEN' | 'BANNED';
  kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  txPin: string;
  createdAt: string;
}

interface PromoCodeRecord {
  code: string;
  title: string;
  amount: number;
  turnoverMult: number;
  maxUses: number;
  usedCount: number;
  status: 'ACTIVE' | 'EXPIRED';
}

interface GameRtpRecord {
  code: string;
  name: string;
  provider: string;
  category: string;
  rtpPercent: number;
  minBet: number;
  maxBet: number;
  isHot: boolean;
  status: 'ACTIVE' | 'MAINTENANCE';
}

interface SupportTicketRecord {
  id: string;
  userUid: string;
  mobile: string;
  subject: string;
  message: string;
  adminReply: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  createdAt: string;
}

interface CpanelTableMeta {
  name: string;
  rows: number;
  engine: string;
  collation: string;
  sizeKb: string;
}

interface CpanelStatusPayload {
  cpanelDb: {
    host: string;
    port: number;
    database: string;
    username: string;
    passwordMasked: string;
    tablePrefix: string;
    cpanelUrl: string;
    phpMyAdminUrl: string;
    sslEnabled: boolean;
    autoSync: boolean;
    status: string;
    lastSyncAt: string;
    serverVersion: string;
    charset: string;
  };
  appBranding: {
    appName: string;
    appShortName: string;
    apkVersion: string;
    apkBuildNumber: number;
    apkFileSizeMb: string;
    mainIconUrl: string;
    svgIconUrl: string;
    forceInstallModal: boolean;
    whatsappSupport: string;
    telegramChannel: string;
    liveChatUrl: string;
    maintenanceMode: boolean;
    referralBonusAmt: number;
    referralCommissionPct: number;
    usdtTrc20Address: string;
    upayNumber: string;
  };
  tables: CpanelTableMeta[];
  sqlDumpDownloadUrl: string;
}

type AdminTabId =
  | 'overview'
  | 'users'
  | 'transactions'
  | 'referrals'
  | 'bonuses'
  | 'games'
  | 'gateway'
  | 'cpanel'
  | 'branding'
  | 'support';

export const OwnerKamranAdminPanel: React.FC<OwnerKamranAdminPanelProps> = ({
  balance,
  profile,
  settings,
  transactions,
  bonuses,
  wingoBets,
  binaryTrades,
  savedWallets,
  jackpotValue,
  onUpdateBalance,
  onUpdateProfile,
  onUpdateSettings,
  onUpdateTransactionStatus,
  onDeleteTransaction,
  onAdminAddBonus,
  onUpdateJackpot,
  onExitAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');

  // Quick Overview Controls
  const [balanceInput, setBalanceInput] = useState<string>(balance.toFixed(2));
  const [bonusTitleInput, setBonusTitleInput] = useState<string>(
    'Owner Kamran Special VIP Bonus'
  );
  const [bonusAmtInput, setBonusAmtInput] = useState<string>('500');
  const [jackpotInput, setJackpotInput] = useState<string>(
    String(jackpotValue)
  );
  const [txFilter, setTxFilter] = useState<'ALL' | 'Deposit' | 'Withdraw'>(
    'ALL'
  );
  const [bkashTestStatus, setBkashTestStatus] = useState<string | null>(null);
  const [bkashTesting, setBkashTesting] = useState<boolean>(false);

  // Master Data from Server / cPanel Engine
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);

  const [promoCodes, setPromoCodes] = useState<PromoCodeRecord[]>([]);
  const [newPromoCode, setNewPromoCode] = useState<string>('');
  const [newPromoTitle, setNewPromoTitle] = useState<string>('');
  const [newPromoAmt, setNewPromoAmt] = useState<string>('300');
  const [newPromoTurnover, setNewPromoTurnover] = useState<string>('5');
  const [newPromoMaxUses, setNewPromoMaxUses] = useState<string>('500');

  const [gamesCatalog, setGamesCatalog] = useState<GameRtpRecord[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketRecord[]>(
    []
  );
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const [referralStats, setReferralStats] = useState<{
    clicksCount: number;
    registeredCount: number;
    totalEarned: number;
    referrals: Array<{
      id: string;
      referrerCode: string;
      referredMobile: string;
      referredName: string;
      rewardAmount: number;
      status: string;
      createdAt: string;
    }>;
    clicks: Array<{
      id: string;
      refCode: string;
      ipHash: string;
      userAgent: string;
      landingPath: string;
      createdAt: string;
    }>;
  }>({
    clicksCount: 0,
    registeredCount: 0,
    totalEarned: 0,
    referrals: [],
    clicks: [],
  });

  const [adminLogs, setAdminLogs] = useState<
    Array<{ id: string; action: string; details: string; createdAt: string }>
  >([]);

  // cPanel MySQL State
  const [cpanelStatus, setCpanelStatus] = useState<CpanelStatusPayload | null>(
    null
  );
  const [cpHost, setCpHost] = useState<string>('localhost');
  const [cpPort, setCpPort] = useState<string>('3306');
  const [cpDatabase, setCpDatabase] = useState<string>('moneyx_casino_db');
  const [cpUsername, setCpUsername] = useState<string>('moneyx_db_admin');
  const [cpPassword, setCpPassword] = useState<string>('Kamran@Moneyx2026#');
  const [cpPrefix, setCpPrefix] = useState<string>('mx_');
  const [cpPhpMyAdminUrl, setCpPhpMyAdminUrl] = useState<string>(
    'https://cpanel.moneyx.live:2083/cpsess/3rdparty/phpMyAdmin/index.php'
  );
  const [cpSyncing, setCpSyncing] = useState<boolean>(false);
  const [generatedConfigPhp, setGeneratedConfigPhp] = useState<string>('');
  const [sqlQueryInput, setSqlQueryInput] = useState<string>(
    'SELECT * FROM users;'
  );
  const [sqlQueryResult, setSqlQueryResult] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
    rowCount: number;
    executionTimeMs: string;
  } | null>(null);

  // Branding & App Icon State
  const [appName, setAppName] = useState<string>('MONEYX');
  const [apkVersion, setApkVersion] = useState<string>('2.5.0-PRO');
  const [mainIconUrl, setMainIconUrl] = useState<string>('/pwa-192x192.png');
  const [forceInstallModal, setForceInstallModal] = useState<boolean>(true);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [whatsappSupport, setWhatsappSupport] =
    useState<string>('+8801700000000');
  const [telegramChannel, setTelegramChannel] = useState<string>(
    'https://t.me/moneyx_official_vip'
  );
  const [refBonusAmt, setRefBonusAmt] = useState<string>('200');
  const [refCommPct, setRefCommPct] = useState<string>('5.0');
  const [usdtAddress, setUsdtAddress] = useState<string>(
    'TV6MuMXfmLbBqPZvBHdwFsDnQeVfnmiuSi'
  );
  const [upayNumber, setUpayNumber] = useState<string>('01600-889900');

  const fetchMasterAdminData = useCallback(async () => {
    try {
      const [masterRes, cpRes] = await Promise.all([
        fetch('/api/admin/master-data'),
        fetch('/api/cpanel/status'),
      ]);
      if (masterRes.ok) {
        const data = await masterRes.json();
        if (Array.isArray(data.users)) setUsersList(data.users);
        if (Array.isArray(data.promoCodes)) setPromoCodes(data.promoCodes);
        if (Array.isArray(data.gamesCatalog))
          setGamesCatalog(data.gamesCatalog);
        if (Array.isArray(data.supportTickets))
          setSupportTickets(data.supportTickets);
        if (Array.isArray(data.adminLogs)) setAdminLogs(data.adminLogs);
        if (data.referralSummary) {
          setReferralStats({
            clicksCount: data.referralSummary.clicksCount || 0,
            registeredCount: data.referralSummary.registeredCount || 0,
            totalEarned: data.referralSummary.totalEarned || 0,
            referrals: data.referralSummary.referrals || [],
            clicks: data.referralSummary.clicks || [],
          });
        }
      }
      if (cpRes.ok) {
        const cpData: CpanelStatusPayload = await cpRes.json();
        setCpanelStatus(cpData);
        setCpHost(cpData.cpanelDb.host);
        setCpPort(String(cpData.cpanelDb.port));
        setCpDatabase(cpData.cpanelDb.database);
        setCpUsername(cpData.cpanelDb.username);
        setCpPrefix(cpData.cpanelDb.tablePrefix);
        setCpPhpMyAdminUrl(cpData.cpanelDb.phpMyAdminUrl);

        if (cpData.appBranding) {
          setAppName(cpData.appBranding.appName);
          setApkVersion(cpData.appBranding.apkVersion);
          setMainIconUrl(cpData.appBranding.mainIconUrl);
          setForceInstallModal(cpData.appBranding.forceInstallModal);
          setMaintenanceMode(cpData.appBranding.maintenanceMode);
          setWhatsappSupport(cpData.appBranding.whatsappSupport);
          setTelegramChannel(cpData.appBranding.telegramChannel);
          setRefBonusAmt(String(cpData.appBranding.referralBonusAmt));
          setRefCommPct(String(cpData.appBranding.referralCommissionPct));
          setUsdtAddress(cpData.appBranding.usdtTrc20Address);
          setUpayNumber(cpData.appBranding.upayNumber);
        }
      }
    } catch {
      // fallback silently
    }
  }, []);

  useEffect(() => {
    fetchMasterAdminData();
  }, [fetchMasterAdminData]);

  const totalDeposits = transactions
    .filter((t) => t.type === 'Deposit' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === 'Withdraw' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const netRevenue = totalDeposits - totalWithdrawals;

  const filteredTransactions = transactions.filter((t) =>
    txFilter === 'ALL' ? true : t.type === txFilter
  );

  const filteredUsers = usersList.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      u.uid.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q) ||
      u.nickname.toLowerCase().includes(q) ||
      u.referralCode.toLowerCase().includes(q)
    );
  });

  const handleCopyAdminUrl = async () => {
    const adminUrl = `${window.location.origin}/owner_kamran-admin-panel`;
    try {
      await navigator.clipboard.writeText(adminUrl);
    } catch {
      // ignore
    }
    onShowToast('✓ Admin URL Copied: /owner_kamran-admin-panel');
  };

  const handleTestBkashGateway = async () => {
    setBkashTesting(true);
    setBkashTestStatus(null);
    try {
      const res = await fetch('/api/bkash/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500,
          orderID: `ADM${Math.floor(100000 + Math.random() * 900000)}`,
          intent: 'sale',
        }),
      });
      const data = await res.json();
      setBkashTestStatus(
        `OK — PaymentID: ${data.paymentID} | Invoice: ${data.merchantInvoiceNumber} | Status: ${data.transactionStatus}`
      );
      onShowToast('✓ bKash Sandbox Gateway Verified!');
    } catch {
      setBkashTestStatus('Error connecting to /api/bkash/create-payment');
    } finally {
      setBkashTesting(false);
    }
  };

  const handleConnectCpanelDb = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpSyncing(true);
    try {
      const res = await fetch('/api/cpanel/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: cpHost,
          port: Number(cpPort) || 3306,
          database: cpDatabase,
          username: cpUsername,
          password: cpPassword,
          tablePrefix: cpPrefix,
          phpMyAdminUrl: cpPhpMyAdminUrl,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGeneratedConfigPhp(data.configPhpPreview || '');
        onShowToast(`✓ ${data.message}`);
        await fetchMasterAdminData();
      }
    } catch {
      onShowToast('cPanel Database connection failed');
    } finally {
      setCpSyncing(false);
    }
  };

  const handleExecuteSql = async (customSql?: string) => {
    const queryToRun = customSql ?? sqlQueryInput;
    if (customSql) setSqlQueryInput(customSql);
    try {
      const res = await fetch('/api/cpanel/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: queryToRun }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSqlQueryResult({
          columns: data.columns || [],
          rows: data.rows || [],
          rowCount: data.rowCount || 0,
          executionTimeMs: data.executionTimeMs || '1.10',
        });
        onShowToast(
          `✓ SQL Executed (${data.rowCount} rows in ${data.executionTimeMs}ms)`
        );
      }
    } catch {
      onShowToast('Failed to run SQL query');
    }
  };

  const handleSaveUserRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch('/api/admin/user/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsersList(data.users);
        // Also sync active player if same UID or mobile
        if (
          editingUser.uid === profile.uid ||
          editingUser.mobile === profile.mobile
        ) {
          onUpdateBalance(editingUser.balance);
          onUpdateProfile({
            nickname: editingUser.nickname,
            mobile: editingUser.mobile,
            vipLevel: editingUser.vipLevel,
          });
        }
        setEditingUser(null);
        onShowToast(`✓ User ${editingUser.nickname} saved to cPanel DB!`);
      }
    } catch {
      onShowToast('Failed to update user');
    }
  };

  const handleDeleteUserRecord = async (uid: string) => {
    try {
      const res = await fetch('/api/admin/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsersList(data.users);
        onShowToast(`✓ User UID ${uid} deleted`);
      }
    } catch {
      onShowToast('Failed to delete user');
    }
  };

  const handleCreatePromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    try {
      const res = await fetch('/api/admin/promo/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newPromoCode.trim().toUpperCase(),
          title: newPromoTitle.trim() || 'VIP Gift Code',
          amount: Number(newPromoAmt) || 100,
          turnoverMult: Number(newPromoTurnover) || 3,
          maxUses: Number(newPromoMaxUses) || 100,
          status: 'ACTIVE',
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPromoCodes(data.promoCodes);
        setNewPromoCode('');
        setNewPromoTitle('');
        onShowToast('✓ Promo Code Created & Synced to DB!');
      }
    } catch {
      onShowToast('Failed to create promo code');
    }
  };

  const handleDeletePromoCode = async (code: string) => {
    try {
      const res = await fetch('/api/admin/promo/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPromoCodes(data.promoCodes);
        onShowToast(`✓ Promo Code ${code} deleted`);
      }
    } catch {
      onShowToast('Failed to delete promo code');
    }
  };

  const handleUpdateGameRtp = async (
    code: string,
    rtpPercent: number,
    status: 'ACTIVE' | 'MAINTENANCE',
    isHot: boolean
  ) => {
    try {
      const res = await fetch('/api/admin/game-rtp/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rtpPercent, status, isHot }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGamesCatalog(data.gamesCatalog);
        onShowToast(`✓ Game ${code} updated (RTP: ${rtpPercent}%)`);
      }
    } catch {
      onShowToast('Failed to update game RTP');
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/branding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          apkVersion,
          mainIconUrl,
          forceInstallModal,
          maintenanceMode,
          whatsappSupport,
          telegramChannel,
          referralBonusAmt: Number(refBonusAmt) || 200,
          referralCommissionPct: Number(refCommPct) || 5,
          usdtTrc20Address: usdtAddress,
          upayNumber,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        onShowToast('✓ Main App Icon, APK & Branding Settings Saved!');
        await fetchMasterAdminData();
      }
    } catch {
      onShowToast('Failed to save branding');
    }
  };

  const handleReplySupportTicket = async (ticketId: string) => {
    const reply = replyTextMap[ticketId] || 'Resolved by Owner Kamran Admin.';
    try {
      const res = await fetch('/api/admin/ticket/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticketId,
          adminReply: reply,
          status: 'ANSWERED',
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSupportTickets(data.supportTickets);
        onShowToast(`✓ Replied to Ticket ${ticketId}`);
      }
    } catch {
      onShowToast('Failed to reply to ticket');
    }
  };

  if (isLocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, #0d3d2c 0%, #071f18 65%, #03100c 100%)',
        }}
      >
        <div className="w-full max-w-[400px] bg-[#0a2e22] border-2 border-[#f0c030]/40 rounded-3xl p-6 shadow-2xl text-center">
          <img
            src="/pwa-192x192.png"
            alt="MONEYX Admin"
            className="w-16 h-16 rounded-2xl border-2 border-[#ffd84d] mx-auto mb-3 shadow-lg"
          />
          <div className="text-xl font-black italic text-[#ffd84d] tracking-wider">
            OWNER KAMRAN ADMIN
          </div>
          <div className="text-xs text-[#7eb89a] font-mono-num mt-1 mb-5">
            /owner_kamran-admin-panel
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput === settings.adminPin || pinInput === '2026') {
                setIsLocked(false);
                setPinInput('');
                onShowToast('✓ Welcome Back, Owner Kamran!');
              } else {
                onShowToast('Incorrect Admin PIN (Default: 2026)');
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Admin PIN (Default: 2026)"
              className="w-full h-12 rounded-xl bg-[#071f18] border border-white/15 px-4 text-center text-white font-black tracking-widest outline-none focus:border-[#ffd84d]"
            />
            <button
              type="submit"
              className="w-full h-12 rounded-xl btn-3d-gold font-black text-sm uppercase cursor-pointer"
            >
              Unlock Admin Panel
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full h-10 rounded-xl bg-white/5 text-[#7eb89a] text-xs font-bold cursor-pointer"
            >
              ← Return to MONEYX Lobby
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-24 text-[#e8f5ee]"
      style={{
        background:
          'linear-gradient(180deg, #041510 0%, #071f18 50%, #051611 100%)',
      }}
    >
      {/* Top Executive Admin Bar */}
      <header className="sticky top-0 z-50 bg-[#062c23]/95 backdrop-blur-md border-b border-[#f0c030]/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <img
            src="/pwa-192x192.png"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/icon.svg';
            }}
            alt="MONEYX Icon"
            className="w-11 h-11 rounded-xl border border-[#ffd84d] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black italic text-[#ffd84d] tracking-wide">
                OWNER KAMRAN — A-TO-Z MASTER ADMIN
              </span>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                cPanel MySQL CONNECTED
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#7eb89a] font-mono-num">
              <span>Route: /owner_kamran-admin-panel</span>
              <button
                type="button"
                onClick={handleCopyAdminUrl}
                className="text-[#ffd84d] underline cursor-pointer font-bold"
              >
                Copy Link
              </button>
              <span>·</span>
              <span className="text-emerald-300">
                DB: {cpDatabase} (14 Tables)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchMasterAdminData();
              onShowToast('✓ Synced with cPanel Database');
            }}
            className="px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-xs font-bold text-emerald-300 cursor-pointer"
          >
            🔄 Sync DB
          </button>
          <button
            type="button"
            onClick={() => setIsLocked(true)}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer"
          >
            🔒 Lock
          </button>
          <button
            type="button"
            onClick={onExitAdmin}
            className="btn-3d-green px-3.5 py-2 rounded-lg text-xs font-black cursor-pointer"
          >
            ← Live Site Lobby
          </button>
        </div>
      </header>

      <div className="max-w-[1260px] mx-auto p-3.5 sm:p-5 space-y-5">
        {/* A-to-Z Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 bg-[#0a2e22] p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: '📊 A. Overview & GGR' },
            {
              id: 'users',
              label: `👥 B. Users & KYC (${usersList.length})`,
            },
            {
              id: 'transactions',
              label: `💳 C. Cashier & Wallets (${transactions.length})`,
            },
            {
              id: 'referrals',
              label: `🤝 D. Referrals (${referralStats.registeredCount})`,
            },
            {
              id: 'bonuses',
              label: `🎁 E. Promo Codes & Bonus (${promoCodes.length})`,
            },
            { id: 'games', label: '🎰 F. Games RTP & WinGo 30s' },
            { id: 'gateway', label: '🏦 G. bKash/Nagad/USDT' },
            { id: 'cpanel', label: '🗄️ H. cPanel MySQL & SQL' },
            { id: 'branding', label: '📱 I. App Icon & APK Builder' },
            {
              id: 'support',
              label: `🎧 J. Support & Logs (${supportTickets.length})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as AdminTabId)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-[#ffe066] to-[#f0c030] text-[#2a1500] shadow'
                  : 'text-[#7eb89a] hover:text-white bg-white/[0.03]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ==================== TAB A: OVERVIEW & GGR ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-[#0d3d2c] border border-emerald-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Total Deposits
                </div>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono-num">
                  ৳{totalDeposits.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {transactions.filter((t) => t.type === 'Deposit').length}{' '}
                  deposits
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-amber-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Total Withdrawals
                </div>
                <div className="text-xl font-black text-[#ffd84d] mt-1 font-mono-num">
                  ৳{totalWithdrawals.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {transactions.filter((t) => t.type === 'Withdraw').length}{' '}
                  payouts
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-teal-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Net Revenue (GGR)
                </div>
                <div className="text-xl font-black text-white mt-1 font-mono-num">
                  ৳{netRevenue.toLocaleString('en-US')}
                </div>
                <div className="text-[10px] text-emerald-300 mt-1">
                  House Profit Pool
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-[#f0c030]/35 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Registered Members
                </div>
                <div className="text-xl font-black text-[#ffd84d] mt-1 font-mono-num">
                  {usersList.length}
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  Active Session: ৳{balance.toFixed(2)}
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-purple-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  Referral Network
                </div>
                <div className="text-xl font-black text-purple-300 mt-1 font-mono-num">
                  {referralStats.clicksCount} Clicks
                </div>
                <div className="text-[10px] text-[#7eb89a] mt-1">
                  {referralStats.registeredCount} Joined · ৳
                  {referralStats.totalEarned} Paid
                </div>
              </div>

              <div className="bg-[#0d3d2c] border border-cyan-400/25 rounded-2xl p-4">
                <div className="text-[10px] font-extrabold uppercase text-[#7eb89a]">
                  cPanel Database
                </div>
                <div className="text-xl font-black text-cyan-300 mt-1 font-mono-num">
                  {cpanelStatus?.tables.length || 14} Tables
                </div>
                <div className="text-[10px] text-emerald-300 mt-1">
                  {cpDatabase} · Online
                </div>
              </div>
            </div>

            {/* Quick Balance & Bonus Controller */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                    ⚡ Quick Active Player Balance Control
                  </h3>
                  <span className="text-xs font-mono-num text-emerald-300 font-bold">
                    Current: ৳{balance.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    className="flex-1 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                    placeholder="Enter new BDT balance"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseFloat(balanceInput);
                      if (Number.isFinite(val) && val >= 0) {
                        onUpdateBalance(Number(val.toFixed(2)));
                        onShowToast(
                          `✓ Admin set user balance to ৳${val.toFixed(2)}`
                        );
                      }
                    }}
                    className="btn-3d-gold px-4 rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    Set Balance
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '+৳500', delta: 500 },
                    { label: '+৳2,000', delta: 2000 },
                    { label: '+৳10,000', delta: 10000 },
                    { label: 'Reset ৳0', delta: -balance },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        const next = Math.max(
                          0,
                          Number((balance + item.delta).toFixed(2))
                        );
                        onUpdateBalance(next);
                        setBalanceInput(next.toFixed(2));
                        onShowToast(`✓ Balance updated to ৳${next.toFixed(2)}`);
                      }}
                      className="py-2.5 rounded-xl bg-[#0d3d2c] hover:bg-[#13a36e]/30 border border-white/10 text-xs font-extrabold text-white cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Send Gift Bonus */}
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  🎁 Send Instant VIP Bonus to Player
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={bonusTitleInput}
                    onChange={(e) => setBonusTitleInput(e.target.value)}
                    placeholder="Bonus Title"
                    className="sm:col-span-2 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-xs font-bold text-white"
                  />
                  <input
                    type="number"
                    value={bonusAmtInput}
                    onChange={(e) => setBonusAmtInput(e.target.value)}
                    placeholder="Amount"
                    className="h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-sm font-black font-mono-num text-[#ffd84d]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = parseFloat(bonusAmtInput);
                    if (amt > 0 && bonusTitleInput.trim()) {
                      onAdminAddBonus(bonusTitleInput.trim(), amt);
                    }
                  }}
                  className="w-full h-11 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
                >
                  Credit Bonus &amp; Notify Player
                </button>
              </div>
            </div>

            {/* Platform Summary Cards */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  🔧 Active Platform &amp; cPanel Configuration Summary
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cpanel')}
                    className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-emerald-400/30 text-[11px] font-black text-emerald-300 cursor-pointer"
                  >
                    🗄️ Open cPanel Database
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('branding')}
                    className="px-3 py-1.5 rounded-lg bg-[#0d3d2c] border border-[#ffd84d]/30 text-[11px] font-black text-[#ffd84d] cursor-pointer"
                  >
                    📱 App Icon &amp; APK Settings
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">bKash Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.bkashNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">Nagad Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.nagadNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">Rocket Merchant:</span>
                  <b className="font-mono-num text-white text-sm">
                    {settings.rocketNumber}
                  </b>
                </div>
                <div className="bg-[#071f18] p-3 rounded-xl border border-white/10">
                  <span className="text-[#7eb89a] block">
                    Next WinGo 30s Draw:
                  </span>
                  <b className="font-mono-num text-[#ffd84d] text-sm">
                    {settings.forcedWingoResult === null
                      ? '🎲 Auto Random'
                      : `🎯 Forced #${settings.forcedWingoResult} (${
                          settings.forcedWingoResult >= 5 ? 'Big' : 'Small'
                        })`}
                  </b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB B: USERS, CRM & KYC ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                    👥 Member CRM, Balances, VIP &amp; KYC Verification
                  </h3>
                  <p className="text-xs text-[#7eb89a]">
                    Manage all registered players in `{cpPrefix}users`, edit
                    balances, freeze/ban accounts, or approve KYC.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search UID, Mobile, Name..."
                    className="h-10 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-xs text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUser({
                        uid: String(
                          Math.floor(100000 + Math.random() * 900000)
                        ),
                        mobile: '017',
                        nickname: 'New VIP Player',
                        balance: 500,
                        lockedBonus: 0,
                        vipLevel: 1,
                        referralCode: `MX${Math.floor(
                          1000 + Math.random() * 9000
                        )}`,
                        referredBy: 'KAMRANVIP',
                        status: 'ACTIVE',
                        kycStatus: 'VERIFIED',
                        txPin: '1234',
                        createdAt: new Date()
                          .toISOString()
                          .slice(0, 16)
                          .replace('T', ' '),
                      })
                    }
                    className="btn-3d-gold px-3.5 h-10 rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    + Add Member
                  </button>
                </div>
              </div>

              {editingUser && (
                <form
                  onSubmit={handleSaveUserRecord}
                  className="bg-[#071f18] border-2 border-[#ffd84d]/50 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#ffd84d]">
                      ✏️ Editing Member UID: {editingUser.uid}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="text-xs text-[#7eb89a] hover:text-white cursor-pointer"
                    >
                      ✕ Cancel
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={editingUser.nickname}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            nickname: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={editingUser.mobile}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            mobile: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-white font-mono-num font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Main Balance (৳)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingUser.balance}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            balance: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-[#ffd84d] font-mono-num font-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Locked Bonus (৳)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingUser.lockedBonus}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            lockedBonus: Number(e.target.value) || 0,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-emerald-300 font-mono-num font-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        VIP Level (1-10)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={editingUser.vipLevel}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            vipLevel: Number(e.target.value) || 1,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Withdraw PIN
                      </label>
                      <input
                        type="text"
                        value={editingUser.txPin}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            txPin: e.target.value,
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-white font-mono-num font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        Account Status
                      </label>
                      <select
                        value={editingUser.status}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            status: e.target
                              .value as AdminUserRecord['status'],
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2 text-white font-bold"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="FROZEN">FROZEN</option>
                        <option value="BANNED">BANNED</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#7eb89a] font-bold block mb-1">
                        KYC Verification
                      </label>
                      <select
                        value={editingUser.kycStatus}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            kycStatus: e.target
                              .value as AdminUserRecord['kycStatus'],
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2 text-white font-bold"
                      >
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="UNVERIFIED">UNVERIFIED</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
                  >
                    💾 Save Member to cPanel Database
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase text-[#7eb89a]">
                      <th className="py-2.5 px-2">UID / Mobile</th>
                      <th className="py-2.5 px-2">Nickname</th>
                      <th className="py-2.5 px-2">Balance</th>
                      <th className="py-2.5 px-2">Locked Bonus</th>
                      <th className="py-2.5 px-2">VIP / Ref</th>
                      <th className="py-2.5 px-2">Status / KYC</th>
                      <th className="py-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-2 font-mono-num">
                          <div className="font-black text-white">#{u.uid}</div>
                          <div className="text-[#7eb89a]">{u.mobile}</div>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-white">
                          {u.nickname}
                          <div className="text-[10px] text-[#7eb89a] font-mono-num">
                            PIN: {u.txPin}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono-num font-black text-[#ffd84d]">
                          ৳{u.balance.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 font-mono-num font-bold text-emerald-300">
                          ৳{u.lockedBonus.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="bg-[#ffd84d]/15 text-[#ffd84d] px-2 py-0.5 rounded font-black text-[10px]">
                            VIP {u.vipLevel}
                          </span>
                          <div className="text-[10px] text-[#7eb89a] font-mono-num mt-0.5">
                            Ref: {u.referralCode}
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black mr-1 ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {u.status}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              u.kycStatus === 'VERIFIED'
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {u.kycStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-[#0d3d2c] hover:bg-[#13a36e] text-white font-black text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUserRecord(u.uid)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-black text-[11px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB C: TRANSACTIONS & WALLETS ==================== */}
        {activeTab === 'transactions' && (
          <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                💳 Deposit &amp; Withdrawal Requests Queue
              </h3>
              <div className="flex gap-1.5">
                {(['ALL', 'Deposit', 'Withdraw'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTxFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                      txFilter === f
                        ? 'bg-[#0d7a55] text-white'
                        : 'bg-[#071f18] text-[#7eb89a]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#7eb89a]">
                No transactions found.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            tx.type === 'Deposit'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-[#ffd84d]'
                          }`}
                        >
                          {tx.type}
                        </span>
                        <span className="font-black text-sm text-white">
                          {tx.method}
                        </span>
                        <span className="text-xs font-mono-num text-[#7eb89a]">
                          ({tx.account})
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7eb89a] font-mono-num mt-1">
                        TrxID: <b className="text-white">{tx.trxId}</b> · Time:{' '}
                        {tx.createdAt}
                        {tx.paymentID ? ` · PayID: ${tx.paymentID}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <div className="text-base font-black font-mono-num text-[#ffd84d]">
                          ৳{tx.amount.toFixed(2)}
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            tx.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : tx.status === 'Processing'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Completed')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Processing')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ⏳ Hold
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTransactionStatus(tx.id, 'Refunded')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-300 text-[11px] font-bold cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB D: REFERRALS & AFFILIATE ==================== */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-4">
                <div className="text-[11px] text-[#7eb89a] font-bold uppercase">
                  Total Referral Link Clicks
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono-num mt-1">
                  {referralStats.clicksCount}
                </div>
              </div>
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-4">
                <div className="text-[11px] text-[#7eb89a] font-bold uppercase">
                  Verified Referral Signups
                </div>
                <div className="text-2xl font-black text-[#ffd84d] font-mono-num mt-1">
                  {referralStats.registeredCount}
                </div>
              </div>
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-4">
                <div className="text-[11px] text-[#7eb89a] font-bold uppercase">
                  Total Referral Commission Paid
                </div>
                <div className="text-2xl font-black text-white font-mono-num mt-1">
                  ৳{referralStats.totalEarned}
                </div>
              </div>
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🤝 Real Referral Conversions (`{cpPrefix}referrals`)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#7eb89a] text-[10px] uppercase">
                      <th className="py-2">Ref ID</th>
                      <th className="py-2">Referrer Code</th>
                      <th className="py-2">Invited Member</th>
                      <th className="py-2">Mobile</th>
                      <th className="py-2">Reward (৳)</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono-num">
                    {referralStats.referrals.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 text-white font-bold">{r.id}</td>
                        <td className="py-2 text-[#ffd84d] font-black">
                          {r.referrerCode}
                        </td>
                        <td className="py-2 text-white">{r.referredName}</td>
                        <td className="py-2 text-[#7eb89a]">
                          {r.referredMobile}
                        </td>
                        <td className="py-2 text-emerald-400 font-black">
                          ৳{r.rewardAmount}
                        </td>
                        <td className="py-2">
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-black">
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 text-[#7eb89a]">{r.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB E: PROMO CODES & BONUS VAULT ==================== */}
        {activeTab === 'bonuses' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🎟️ Create Promo / Gift Code (`{cpPrefix}promo_codes`)
              </h3>
              <form onSubmit={handleCreatePromoCode} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#7eb89a] uppercase block mb-1">
                      Promo Code (e.g. MONEYX777)
                    </label>
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="MONEYX777"
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-black uppercase font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7eb89a] uppercase block mb-1">
                      Bonus Amount (৳)
                    </label>
                    <input
                      type="number"
                      value={newPromoAmt}
                      onChange={(e) => setNewPromoAmt(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#7eb89a] uppercase block mb-1">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      value={newPromoTitle}
                      onChange={(e) => setNewPromoTitle(e.target.value)}
                      placeholder="VIP Gift Code"
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7eb89a] uppercase block mb-1">
                      Turnover (x)
                    </label>
                    <input
                      type="number"
                      value={newPromoTurnover}
                      onChange={(e) => setNewPromoTurnover(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7eb89a] uppercase block mb-1">
                      Max Claims
                    </label>
                    <input
                      type="number"
                      value={newPromoMaxUses}
                      onChange={(e) => setNewPromoMaxUses(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
                >
                  + Publish Promo Code
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {promoCodes.map((p) => (
                  <div
                    key={p.code}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num font-black text-sm text-[#ffd84d]">
                          {p.code}
                        </span>
                        <span className="text-xs font-bold text-white">
                          — ৳{p.amount} ({p.turnoverMult}x Turnover)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7eb89a]">
                        {p.title} · Used: {p.usedCount}/{p.maxUses}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePromoCode(p.code)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🎁 Player Bonus Vault History ({bonuses.length})
              </h3>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {bonuses.map((b) => (
                  <div
                    key={b.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-black text-white">{b.title}</div>
                      <div className="text-[10px] text-[#7eb89a] font-mono-num">
                        ID: {b.id} · {b.createdAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-num font-black text-emerald-400">
                        +৳{b.amount}
                      </div>
                      <span className="text-[10px] text-[#ffd84d] font-bold">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB F: GAMES RTP & WINGO 30S ==================== */}
        {activeTab === 'games' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                    🎱 WinGo 30s Next Draw Result Controller
                  </h3>
                  <span className="text-xs font-bold text-emerald-300">
                    {settings.forcedWingoResult === null
                      ? 'Mode: Auto Random'
                      : `Mode: Forced #${settings.forcedWingoResult}`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    const isSelected = settings.forcedWingoResult === num;
                    const sizeLabel = num >= 5 ? 'BIG' : 'SMALL';
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          onUpdateSettings({ forcedWingoResult: num });
                          onShowToast(
                            `🎯 Next WinGo 30s draw locked to #${num} (${sizeLabel})`
                          );
                        }}
                        className={`py-3 rounded-xl font-black text-sm cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-[#ffd84d] text-[#2a1500] border-white scale-105 shadow-lg'
                            : 'bg-[#071f18] text-white border-white/10 hover:border-[#ffd84d]/50'
                        }`}
                      >
                        <div>#{num}</div>
                        <div className="text-[9px] opacity-80">{sizeLabel}</div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ forcedWingoResult: null });
                    onShowToast('🎲 WinGo 30s restored to Auto Random mode');
                  }}
                  className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase cursor-pointer"
                >
                  🎲 Reset to Auto Random Mode
                </button>
              </div>

              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  💰 Homepage Live Jackpot Pool Controller
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={jackpotInput}
                    onChange={(e) => setJackpotInput(e.target.value)}
                    className="flex-1 h-11 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-[#ffd84d] font-black font-mono-num text-base"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextJp = parseInt(jackpotInput, 10);
                      if (Number.isFinite(nextJp) && nextJp > 0) {
                        onUpdateJackpot(nextJp);
                        onShowToast('✓ Homepage Jackpot Counter Updated!');
                      }
                    }}
                    className="btn-3d-gold px-4 rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    Update Jackpot
                  </button>
                </div>
              </div>
            </div>

            {/* Game RTP % Controller Table */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🎰 Casino, Slot &amp; Crash Games RTP % Win-Rate Controller (`
                {cpPrefix}games_catalog`)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gamesCatalog.map((g) => (
                  <div
                    key={g.code}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3.5 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-white text-sm">
                          {g.name}
                        </div>
                        <div className="text-[10px] text-[#7eb89a]">
                          {g.provider} · {g.category}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          g.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[#7eb89a]">Player RTP %:</span>
                        <span className="text-[#ffd84d] font-mono-num">
                          {g.rtpPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={70}
                        max={99}
                        step={0.5}
                        value={g.rtpPercent}
                        onChange={(e) =>
                          handleUpdateGameRtp(
                            g.code,
                            Number(e.target.value),
                            g.status,
                            g.isHot
                          )
                        }
                        className="w-full accent-[#ffd84d] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateGameRtp(
                            g.code,
                            g.rtpPercent,
                            g.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE',
                            g.isHot
                          )
                        }
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white font-bold text-[10px] cursor-pointer"
                      >
                        Toggle {g.status === 'ACTIVE' ? 'Maintenance' : 'Active'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateGameRtp(
                            g.code,
                            g.rtpPercent,
                            g.status,
                            !g.isHot
                          )
                        }
                        className={`px-2.5 py-1 rounded font-black text-[10px] cursor-pointer ${
                          g.isHot
                            ? 'bg-amber-500/25 text-[#ffd84d]'
                            : 'bg-white/5 text-[#7eb89a]'
                        }`}
                      >
                        🔥 {g.isHot ? 'HOT TAG ON' : 'HOT OFF'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB G: PAYMENT GATEWAYS ==================== */}
        {activeTab === 'gateway' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3.5">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📲 bKash, Nagad, Rocket, Upay &amp; USDT Merchant Config
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  bKash Send Money / Agent Number
                </label>
                <input
                  type="text"
                  value={settings.bkashNumber}
                  onChange={(e) =>
                    onUpdateSettings({ bkashNumber: e.target.value })
                  }
                  className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Nagad Send Money / Merchant Number
                </label>
                <input
                  type="text"
                  value={settings.nagadNumber}
                  onChange={(e) =>
                    onUpdateSettings({ nagadNumber: e.target.value })
                  }
                  className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Rocket Number
                </label>
                <input
                  type="text"
                  value={settings.rocketNumber}
                  onChange={(e) =>
                    onUpdateSettings({ rocketNumber: e.target.value })
                  }
                  className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3.5 text-white font-black font-mono-num"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Upay Merchant Number
                  </label>
                  <input
                    type="text"
                    value={upayNumber}
                    onChange={(e) => setUpayNumber(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    USDT (TRC20) Wallet
                  </label>
                  <input
                    type="text"
                    value={usdtAddress}
                    onChange={(e) => setUsdtAddress(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-emerald-300 font-mono-num text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Deposit Bonus %
                  </label>
                  <input
                    type="number"
                    value={settings.depositBonusPct}
                    onChange={(e) =>
                      onUpdateSettings({
                        depositBonusPct: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Min Deposit (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.minDeposit}
                    onChange={(e) =>
                      onUpdateSettings({
                        minDeposit: Number(e.target.value) || 100,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Min Withdraw (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.minWithdraw}
                    onChange={(e) =>
                      onUpdateSettings({
                        minWithdraw: Number(e.target.value) || 200,
                      })
                    }
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black font-mono-num"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveBranding}
                className="w-full h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                Save All Payment Gateways
              </button>
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                  ⚡ bKash Tokenized Checkout (`v1.2.0-beta`)
                </h3>
                <span className="bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  CONNECTED
                </span>
              </div>
              <button
                type="button"
                disabled={bkashTesting}
                onClick={handleTestBkashGateway}
                className="w-full h-11 rounded-xl bg-[#E2136E] hover:bg-[#c91060] text-white font-black text-xs uppercase cursor-pointer transition"
              >
                {bkashTesting
                  ? 'Testing createPayment()...'
                  : 'Run Live bKash Sandbox API Test'}
              </button>
              {bkashTestStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-mono-num">
                  {bkashTestStatus}
                </div>
              )}

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-black uppercase text-[#ffd84d] mb-2">
                  Saved Player Withdrawal Wallets ({savedWallets.length})
                </div>
                {savedWallets.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between text-xs bg-[#071f18] p-2.5 rounded-lg mb-1.5 border border-white/5 font-mono-num"
                  >
                    <span>
                      <b className="text-white">{w.method}</b> ·{' '}
                      {w.accountNumber}
                    </span>
                    <span className="text-[#ffd84d]">PIN: {w.pin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB H: CPANEL MYSQL DATABASE & SQL RUNNER ==================== */}
        {activeTab === 'cpanel' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* cPanel MySQL Connection Form */}
              <form
                onSubmit={handleConnectCpanelDb}
                className="bg-[#0a2e22] border border-emerald-400/30 rounded-2xl p-5 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                      🗄️ cPanel MySQL / MariaDB Database Connector
                    </h3>
                    <p className="text-[11px] text-[#7eb89a]">
                      Connects directly to your cPanel MySQL database and
                      auto-writes `/public/config.php`.
                    </p>
                  </div>
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full">
                    {cpanelStatus?.cpanelDb.status || 'CONNECTED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      cPanel MySQL Host
                    </label>
                    <input
                      type="text"
                      value={cpHost}
                      onChange={(e) => setCpHost(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      Port
                    </label>
                    <input
                      type="text"
                      value={cpPort}
                      onChange={(e) => setCpPort(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-mono-num font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      cPanel Database Name
                    </label>
                    <input
                      type="text"
                      value={cpDatabase}
                      onChange={(e) => setCpDatabase(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-emerald-300 font-mono-num font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      cPanel DB Username
                    </label>
                    <input
                      type="text"
                      value={cpUsername}
                      onChange={(e) => setCpUsername(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      cPanel DB Password
                    </label>
                    <input
                      type="password"
                      value={cpPassword}
                      onChange={(e) => setCpPassword(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                      Table Prefix
                    </label>
                    <input
                      type="text"
                      value={cpPrefix}
                      onChange={(e) => setCpPrefix(e.target.value)}
                      className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-mono-num font-bold"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={cpSyncing}
                    className="flex-1 h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
                  >
                    {cpSyncing
                      ? 'Syncing cPanel MySQL...'
                      : '🔌 Connect & Sync cPanel Database'}
                  </button>
                  <a
                    href="/cpanel_database.sql"
                    download="moneyx_cpanel_database.sql"
                    className="px-4 h-11 rounded-xl btn-3d-green text-xs font-black uppercase flex items-center justify-center"
                  >
                    ⬇ Download .SQL (14 Tables)
                  </a>
                  <a
                    href="/config.php"
                    download="config.php"
                    className="px-3.5 h-11 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black flex items-center justify-center"
                  >
                    ⬇ config.php
                  </a>
                </div>

                {generatedConfigPhp && (
                  <pre className="p-3 rounded-xl bg-[#041510] border border-emerald-400/30 text-[10px] text-emerald-300 font-mono-num overflow-x-auto max-h-36">
                    {generatedConfigPhp}
                  </pre>
                )}
              </form>

              {/* Interactive SQL Query Console */}
              <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                    💻 phpMyAdmin Live SQL Query Console
                  </h3>
                  <span className="text-[11px] font-mono-num text-emerald-300">
                    {cpanelStatus?.cpanelDb.serverVersion || 'MariaDB 10.6'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'SHOW TABLES;',
                    'SELECT * FROM users;',
                    'SELECT * FROM transactions;',
                    'SELECT * FROM referrals;',
                    'SELECT * FROM promo_codes;',
                    'DESCRIBE users;',
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleExecuteSql(q)}
                      className="px-2.5 py-1 rounded-lg bg-[#071f18] hover:bg-[#0d3d2c] border border-white/10 text-[10px] font-mono-num text-[#ffd84d] cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sqlQueryInput}
                    onChange={(e) => setSqlQueryInput(e.target.value)}
                    className="flex-1 h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-xs font-mono-num text-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleExecuteSql()}
                    className="btn-3d-green px-4 h-10 rounded-xl text-xs font-black uppercase cursor-pointer"
                  >
                    ▶ Run SQL
                  </button>
                </div>

                {sqlQueryResult && (
                  <div className="bg-[#041510] border border-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-[10px] text-[#7eb89a] font-mono-num">
                      <span>Rows returned: {sqlQueryResult.rowCount}</span>
                      <span>Query time: {sqlQueryResult.executionTimeMs}ms</span>
                    </div>
                    <div className="overflow-x-auto max-h-52">
                      <table className="w-full text-left text-[11px] font-mono-num">
                        <thead>
                          <tr className="border-b border-white/10 text-[#ffd84d]">
                            {sqlQueryResult.columns.map((c) => (
                              <th key={c} className="py-1.5 px-2">
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {sqlQueryResult.rows.map((r, idx) => (
                            <tr key={idx}>
                              {sqlQueryResult.columns.map((c) => (
                                <td
                                  key={c}
                                  className="py-1.5 px-2 text-white whitespace-nowrap"
                                >
                                  {String(r[c] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 14-Table Schema Inspector */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📋 cPanel MySQL 14-Table Schema Inspector (`{cpDatabase}`)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                {(cpanelStatus?.tables || []).map((tb) => (
                  <button
                    key={tb.name}
                    type="button"
                    onClick={() =>
                      handleExecuteSql(
                        `SELECT * FROM ${tb.name.replace(cpPrefix, '')};`
                      )
                    }
                    className="bg-[#071f18] hover:bg-[#0d3d2c] border border-white/10 rounded-xl p-3 text-left cursor-pointer transition"
                  >
                    <div className="font-mono-num font-black text-xs text-[#ffd84d] truncate">
                      {tb.name}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono-num mt-1">
                      {tb.rows} rows · {tb.sizeKb} KB
                    </div>
                    <div className="text-[9px] text-[#7eb89a] mt-0.5">
                      {tb.engine}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB I: MAIN APP ICON & APK BUILDER ==================== */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <form
              onSubmit={handleSaveBranding}
              className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4"
            >
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📱 Main App Icon &amp; Official APK Package Builder
              </h3>

              {/* Current Main App Icon Preview */}
              <div className="bg-[#071f18] border border-[#ffd84d]/30 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={mainIconUrl}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/icon.svg';
                  }}
                  alt="Current Main App Icon"
                  className="w-20 h-20 rounded-2xl border-2 border-[#ffd84d] shadow-xl shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <div className="font-black text-[#ffd84d] text-sm">
                    Current Main App Icon (Active on Home Screen &amp; APK)
                  </div>
                  <div className="text-[#7eb89a]">
                    Synced across `pwa-192x192.png`, `pwa-512x512.png`,
                    `apple-touch-icon.png` &amp; `icon.svg`.
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setMainIconUrl('/pwa-192x192.png')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black cursor-pointer"
                    >
                      Use Default Crown MX Icon
                    </button>
                    <a
                      href="/api/app/download-apk?format=apk"
                      download="MONEYX_Official_v2.5.apk"
                      className="px-2.5 py-1 rounded bg-[#ffd84d] text-[#2a1500] text-[10px] font-black"
                    >
                      ⬇ Test Download APK
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    App Display Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    APK Version Tag
                  </label>
                  <input
                    type="text"
                    value={apkVersion}
                    onChange={(e) => setApkVersion(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-mono-num font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Main App Icon Path / URL
                </label>
                <input
                  type="text"
                  value={mainIconUrl}
                  onChange={(e) => setMainIconUrl(e.target.value)}
                  className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-emerald-300 font-mono-num text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Referral Signup Reward (৳)
                  </label>
                  <input
                    type="number"
                    value={refBonusAmt}
                    onChange={(e) => setRefBonusAmt(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-mono-num font-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Referral Bet Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={refCommPct}
                    onChange={(e) => setRefCommPct(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-emerald-300 font-mono-num font-black"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#071f18] p-3 rounded-xl border border-white/10 text-xs">
                <span>Prompt Install on First Open (Once per device)</span>
                <input
                  type="checkbox"
                  checked={forceInstallModal}
                  onChange={(e) => setForceInstallModal(e.target.checked)}
                  className="w-4 h-4 accent-[#ffd84d]"
                />
              </div>

              <div className="flex items-center justify-between bg-[#071f18] p-3 rounded-xl border border-white/10 text-xs">
                <span>Site Maintenance Mode</span>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
              >
                💾 Save App Icon, APK &amp; Referral Settings
              </button>
            </form>

            {/* Announcement & Security PIN */}
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                📢 Marquee Notice, Support Links &amp; Security PIN
              </h3>
              <div>
                <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Homepage Live Marquee Text
                </label>
                <textarea
                  rows={3}
                  value={settings.announcementText}
                  onChange={(e) =>
                    onUpdateSettings({ announcementText: e.target.value })
                  }
                  className="w-full rounded-xl bg-[#071f18] border border-white/15 p-3 text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    WhatsApp 24/7 Helpline
                  </label>
                  <input
                    type="text"
                    value={whatsappSupport}
                    onChange={(e) => setWhatsappSupport(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                    Telegram Official Channel
                  </label>
                  <input
                    type="text"
                    value={telegramChannel}
                    onChange={(e) => setTelegramChannel(e.target.value)}
                    className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-white font-mono-num"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7eb89a] mb-1 uppercase">
                  Owner Kamran Admin Lock PIN
                </label>
                <input
                  type="text"
                  value={settings.adminPin}
                  onChange={(e) =>
                    onUpdateSettings({ adminPin: e.target.value })
                  }
                  className="w-full h-10 rounded-xl bg-[#071f18] border border-white/15 px-3 text-[#ffd84d] font-mono-num font-black"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveBranding}
                className="w-full h-11 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer"
              >
                Save Notice &amp; Security Settings
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB J: SUPPORT TICKETS & AUDIT LOGS ==================== */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🎧 Player Support Tickets (`{cpPrefix}support_tickets`)
              </h3>
              {supportTickets.map((tk) => (
                <div
                  key={tk.id}
                  className="bg-[#071f18] border border-white/10 rounded-xl p-3.5 space-y-2 text-xs"
                >
                  <div className="flex justify-between">
                    <span className="font-black text-white">
                      {tk.subject} ({tk.mobile})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                      {tk.status}
                    </span>
                  </div>
                  <p className="text-[#7eb89a]">{tk.message}</p>
                  {tk.adminReply && (
                    <div className="p-2 rounded bg-[#0a2e22] text-emerald-300 text-[11px]">
                      <b>Admin Reply:</b> {tk.adminReply}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyTextMap[tk.id] ?? ''}
                      onChange={(e) =>
                        setReplyTextMap({
                          ...replyTextMap,
                          [tk.id]: e.target.value,
                        })
                      }
                      placeholder="Write admin reply..."
                      className="flex-1 h-9 rounded-lg bg-[#0a2e22] border border-white/15 px-2.5 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleReplySupportTicket(tk.id)}
                      className="px-3 h-9 rounded-lg btn-3d-gold text-[11px] font-black cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0a2e22] border border-white/10 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-black uppercase text-[#ffd84d]">
                🛡️ Admin Security Audit Logs (`{cpPrefix}admin_logs`)
              </h3>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {adminLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-[#071f18] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs font-mono-num"
                  >
                    <div>
                      <span className="text-[#ffd84d] font-black">
                        [{log.action}]
                      </span>{' '}
                      <span className="text-white">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-[#7eb89a]">
                      {log.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
