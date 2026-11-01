import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Keep a global reference in case beforeinstallprompt fires before modal mounts
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
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIsInstalled(isStandalone);

    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
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

  const install = async () => {
    const promptEvent = deferredPrompt || globalDeferredPrompt;
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
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
    isInIframe,
    install,
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
  onNavigateBonusPage: () => void;
  onNavigateRegister: () => void;
}> = ({
  isOpen,
  isLoggedIn,
  onClose,
  onNavigateBonusPage,
  onNavigateRegister,
}) => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } =
    usePWAInstall();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOriginUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  const handleNativeInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setStatusMessage(
          '✓ MONEYX অ্যাপটি আপনার ডিভাইসে সফলভাবে ইনস্টল হয়েছে!'
        );
      }
      return;
    }

    // Download a standalone WebApp Launcher package for the user's device + show native browser instructions
    const launcherHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>MONEYX Official App</title>
<meta http-equiv="refresh" content="0;url=${currentOriginUrl}" />
<style>body{margin:0;background:#071f18;color:#ffd84d;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center}</style>
</head>
<body>
<h2>MONEYX OFFICIAL APP</h2>
<p>Launching MONEYX Secure Server...</p>
<script>window.location.replace("${currentOriginUrl}");</script>
</body>
</html>`;
    const blob = new Blob([launcherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MONEYX-Official-App.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage(
      '📲 ব্রাউজারের উপরে ডানপাশের ⋮ (Three Dots) মেনু থেকে "Install app" বা "Add to Home screen"-এ ট্যাপ করে হোমস্ক্রিনে ইনস্টল সম্পন্ন করুন!'
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-3xl bg-[#0a2e22] border-2 border-[#f0c030]/40 p-6 text-white shadow-2xl relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <img
            src="/icon.svg"
            alt="MONEYX App"
            className="w-16 h-16 rounded-2xl shadow-lg border border-[#ffd84d]/40"
          />
          <div>
            <div className="text-xl font-black italic text-[#ffd84d] tracking-wider">
              MONEY<span className="text-white">X</span> OFFICIAL APP
            </div>
            <div className="text-xs text-[#1de9b6] font-bold">
              Native PWA &amp; Android WebAPK Installer
            </div>
            <div className="text-[11px] text-[#ffd84d] mt-0.5">
              ★★★★★ 4.9 · Verified Security · v2.5 PRO
            </div>
          </div>
        </div>

        <div className="bg-[#071f18] border border-white/10 rounded-2xl p-3.5 text-xs text-[#7eb89a] space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span>📲 স্ট্যান্ডঅ্যালোন ফুল-স্ক্রিন অ্যাপ মোড</span>
            <span className="text-emerald-400 font-bold">✓ Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🔒 বায়োমেট্রিক সিকিউরিটি ও ফাস্ট লোডিং</span>
            <span className="text-emerald-400 font-bold">✓ Verified</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🎁 অ্যাপ ইনস্টল বোনাস (শর্তসাপেক্ষ ভল্ট)</span>
            <span className="text-[#ffd84d] font-black">🔒 ৳১৫০ ভল্ট</span>
          </div>
        </div>

        {/* Notice if inside preview iframe */}
        {isInIframe && !isInstalled && (
          <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-3 text-xs text-emerald-200 mb-3.5 leading-relaxed">
            <div className="font-black text-[#ffd84d] mb-1">
              💡 সরাসরি মোবাইল/ক্রোমে রিয়েল ইনস্টল করতে:
            </div>
            আপনি বর্তমানে প্রিভিউ ফ্রেমে আছেন। নিচের{' '}
            <b>&ldquo;নতুন ট্যাবে ওপেন করে ইনস্টল করুন&rdquo;</b> বাটনে ক্লিক
            করলে আপনার মূল ব্রাউজারে সরাসরি <b>Install MONEYX App</b> অপশন চলে
            আসবে!
            <a
              href={currentOriginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full py-2.5 rounded-lg bg-[#13a36e] hover:bg-[#0d7a55] text-white font-black text-center block shadow-md"
            >
              ↗ নতুন ট্যাবে ওপেন করে সরাসরি ইনস্টল করুন
            </a>
          </div>
        )}

        {isIOS && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-xs text-amber-200 mb-4 leading-relaxed">
            <b>iPhone / iPad (Safari):</b> নিচের <b>Share (⬆️)</b> বাটনে ট্যাপ
            করে <b>&ldquo;Add to Home Screen&rdquo;</b> সিলেক্ট করলে সত্যিকারের
            MONEYX অ্যাপ হোমস্ক্রিনে ইনস্টল হয়ে যাবে।
          </div>
        )}

        {statusMessage && (
          <div className="bg-[#071f18] border border-[#ffd84d]/40 rounded-xl p-3 text-xs text-[#ffd84d] font-bold mb-3.5 leading-relaxed">
            {statusMessage}
          </div>
        )}

        {isInstalled ? (
          <div className="text-center space-y-3">
            <div className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
              ✓ MONEYX অ্যাপটি আপনার ডিভাইসে ইনস্টল করা আছে!
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
            >
              অ্যাপে ফিরে যান
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleNativeInstall}
              className="w-full py-3.5 rounded-xl btn-3d-gold text-sm font-black uppercase cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-download" />
              <span>
                {isInstallable
                  ? 'এখনই সত্যিকারের অ্যাপ ইনস্টল করুন (Native Install)'
                  : 'ডাউনলোড ও ইনস্টল করুন (MONEYX App)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (!isLoggedIn) {
                  onNavigateRegister();
                } else {
                  onNavigateBonusPage();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#7eb89a] cursor-pointer"
            >
              🔒 ইনস্টল বোনাস শর্তাবলী ও ভল্ট দেখুন (/bonus)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
