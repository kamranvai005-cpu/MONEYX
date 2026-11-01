import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const APP_INSTALLED_KEY = 'moneyx_app_installed_v1';

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(() => globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    const savedInstalled =
      localStorage.getItem(APP_INSTALLED_KEY) === 'true';
    return standalone || savedInstalled;
  });
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    if (standalone) {
      localStorage.setItem(APP_INSTALLED_KEY, 'true');
      setIsInstalled(true);
    }

    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(APP_INSTALLED_KEY, 'true');
      setIsInstalled(true);
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const markInstalledPermanently = () => {
    localStorage.setItem(APP_INSTALLED_KEY, 'true');
    setIsInstalled(true);
  };

  const install = async () => {
    const promptEvent = deferredPrompt || globalDeferredPrompt;
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      markInstalledPermanently();
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!(deferredPrompt || globalDeferredPrompt),
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    install,
    markInstalledPermanently,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[9999] flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-[#2a1500] shadow-xl">
      <span className="h-2.5 w-2.5 rounded-full bg-[#2a1500] animate-ping" />
      Offline Mode — MONEYX Cached Data Active
    </div>
  );
};

export const MoneyxPWAInstallModal: React.FC<{
  isOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onInstalledSuccess: () => void;
}> = ({ isOpen, onClose, onInstalledSuccess }) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    install,
    markInstalledPermanently,
  } = usePWAInstall();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloadingApk, setIsDownloadingApk] = useState<boolean>(false);

  if (!isOpen || isInstalled) return null;

  const currentOriginUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  const hostWithoutProtocol = currentOriginUrl.replace(/^https?:\/\//, '');
  const androidChromeIntentUrl = `intent://${hostWithoutProtocol}/#Intent;scheme=https;package=com.android.chrome;end`;

  const triggerApkDownload = (format: 'apk' | 'webapk' = 'apk') => {
    if (isDownloadingApk) return;
    setIsDownloadingApk(true);
    setDownloadProgress(12);
    setStatusMessage('📦 MONEYX_Official_v2.5.apk ডাউনলোড প্রস্তুত হচ্ছে...');

    const step1 = setTimeout(() => setDownloadProgress(48), 220);
    const step2 = setTimeout(() => setDownloadProgress(85), 480);
    const step3 = setTimeout(() => {
      setDownloadProgress(100);
      const a = document.createElement('a');
      a.href = `/api/app/download-apk?format=${format}`;
      a.download =
        format === 'apk'
          ? 'MONEYX_Official_v2.5.apk'
          : 'MONEYX_Official_WebAPK.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      markInstalledPermanently();
      setIsDownloadingApk(false);
      setStatusMessage(
        '✓ MONEYX_Official_v2.5.apk ডাউনলোড ও ইনস্টল সম্পন্ন হয়েছে!'
      );
      onInstalledSuccess();
      setTimeout(() => {
        onClose();
      }, 1100);
    }, 750);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handlePrimaryInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        onInstalledSuccess();
        onClose();
        return;
      }
    }
    triggerApkDownload('apk');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-3xl bg-[#0a2e22] border-2 border-[#f0c030]/45 p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Official Current MONEYX Main App Icon Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative shrink-0">
            <img
              src="/pwa-192x192.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/icon.svg';
              }}
              alt="MONEYX Main App Icon"
              className="w-16 h-16 rounded-2xl shadow-xl border-2 border-[#ffd84d]"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-[#041f16] text-[9px] font-black px-1.5 py-0.5 rounded-md border border-[#071f18]">
              APK
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black italic text-[#ffd84d] tracking-wider">
                MONEY<span className="text-white">X</span> OFFICIAL
              </span>
            </div>
            <div className="text-xs text-[#1de9b6] font-bold">
              Official Android APK &amp; WebApp (v2.5.0-PRO)
            </div>
            <div className="text-[11px] text-[#ffd84d] mt-0.5">
              ★★★★★ 4.9 · Verified Security · 14.8 MB
            </div>
          </div>
        </div>

        {/* App Perks */}
        <div className="bg-[#071f18] border border-white/10 rounded-2xl p-3.5 text-xs text-[#7eb89a] space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span>👑 বর্তমান MONEYX গোল্ড ক্রাউন মেইন আইকন</span>
            <span className="text-emerald-400 font-bold">✓ Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>📲 ১-ক্লিকে সরাসরি হোম স্ক্রিনে APK/App ইনস্টল</span>
            <span className="text-emerald-400 font-bold">✓ Ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span>⚡ তাৎক্ষণিক বিকাশ, নগদ ও রকেট অটো পেমেন্ট</span>
            <span className="text-[#ffd84d] font-black">২ মিনিট</span>
          </div>
        </div>

        {/* Download Progress Bar */}
        {isDownloadingApk && (
          <div className="mb-3.5 bg-[#071f18] border border-[#ffd84d]/30 rounded-xl p-3">
            <div className="flex justify-between text-[11px] font-bold text-[#ffd84d] mb-1.5">
              <span>Downloading MONEYX_Official_v2.5.apk...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#13a36e] to-[#ffd84d] transition-all duration-200"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {statusMessage && (
          <div className="bg-[#071f18] border border-[#ffd84d]/40 rounded-xl p-3 text-xs text-[#ffd84d] font-bold mb-3.5 text-center">
            {statusMessage}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          {/* 1. Native / One-Click Install */}
          <button
            type="button"
            onClick={handlePrimaryInstall}
            disabled={isDownloadingApk}
            className="w-full py-3.5 rounded-xl btn-3d-gold text-sm font-black uppercase cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <i className="fa-solid fa-mobile-screen-button" />
            <span>
              {isInstallable
                ? '১-ক্লিকে মেইন অ্যাপ ইনস্টল করুন'
                : 'এখনই অফিশিয়াল অ্যাপ ইনস্টল করুন'}
            </span>
          </button>

          {/* 2. Direct Android APK Download */}
          <button
            type="button"
            onClick={() => triggerApkDownload('apk')}
            disabled={isDownloadingApk}
            className="w-full py-3 rounded-xl btn-3d-green text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-android text-base" />
            <span>Download Android APK (MONEYX_Official_v2.5.apk)</span>
          </button>

          {/* 3. Android Chrome Direct Breakout or New Tab Installer */}
          {(isInIframe || isAndroid) && (
            <a
              href={isAndroid ? androidChromeIntentUrl : currentOriginUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                markInstalledPermanently();
                onInstalledSuccess();
              }}
              className="w-full py-2.5 rounded-xl bg-[#071f18] hover:bg-white/10 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs text-center block"
            >
              ↗ Chrome ব্রাউজারে ওপেন করে সরাসরি ইনস্টল করুন
            </a>
          )}

          {isIOS && (
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-xs text-amber-200 leading-relaxed">
              <b>iPhone / iPad:</b> Safari-এর <b>Share</b> বাটনে ট্যাপ করে{' '}
              <b>&ldquo;Add to Home Screen&rdquo;</b> নির্বাচন করুন।
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#7eb89a] cursor-pointer"
          >
            পরে করব
          </button>
        </div>
      </div>
    </div>
  );
};
