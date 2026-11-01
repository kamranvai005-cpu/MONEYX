import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
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
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
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
  onClose: () => void;
  onClaimInstallBonus: () => void;
}> = ({ isOpen, onClose, onClaimInstallBonus }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!installing) return;
    const t = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(t);
          setInstalling(false);
          setDone(true);
          onClaimInstallBonus();
          return 100;
        }
        return Math.min(100, prev + 20);
      });
    }, 220);
    return () => clearInterval(t);
  }, [installing, onClaimInstallBonus]);

  if (!isOpen) return null;

  const handleInstallAction = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setDone(true);
        onClaimInstallBonus();
        return;
      }
    }
    setProgress(0);
    setInstalling(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[410px] rounded-3xl bg-[#0a2e22] border-2 border-[#f0c030]/40 p-6 text-white shadow-2xl relative overflow-hidden"
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
              MONEY<span className="text-white">X</span> APP
            </div>
            <div className="text-xs text-[#1de9b6] font-bold">
              Official Android APK &amp; iOS Web App
            </div>
            <div className="text-[11px] text-[#ffd84d] mt-0.5">
              ★★★★★ 4.9 · 10M+ Downloads · +৳150 Bonus
            </div>
          </div>
        </div>

        <div className="bg-[#071f18] border border-white/10 rounded-2xl p-3.5 text-xs text-[#7eb89a] space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span>⚡ Fast 1-Tap Login &amp; Biometric Lock</span>
            <span className="text-emerald-400 font-bold">✓ Ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🎁 Exclusive App Install Reward</span>
            <span className="text-[#ffd84d] font-black">+৳150 BDT</span>
          </div>
          <div className="flex items-center justify-between">
            <span>📲 Instant bKash / Nagad Cashout</span>
            <span className="text-emerald-400 font-bold">2 Min</span>
          </div>
        </div>

        {isIOS && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-xs text-amber-200 mb-4">
            <b>iPhone / iPad Safari Guide:</b> Tap the <b>Share</b> button in
            Safari and select <b>&ldquo;Add to Home Screen&rdquo;</b> to install
            MONEYX.
          </div>
        )}

        {installing ? (
          <div className="space-y-2">
            <div className="w-full h-3 rounded-full bg-[#071f18] overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#1de9b6] to-[#ffd84d] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-center text-xs font-black text-[#ffd84d] font-mono-num">
              INSTALLING MONEYX APP PACKAGE... {progress}%
            </div>
          </div>
        ) : done || isInstalled ? (
          <div className="text-center space-y-3">
            <div className="py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
              ✓ MONEYX App Installed &amp; +৳150 Bonus Credited!
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl btn-3d-gold text-xs font-black uppercase cursor-pointer"
            >
              Launch MONEYX Now
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleInstallAction}
            className="w-full py-3.5 rounded-xl btn-3d-gold text-sm font-black uppercase cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-cloud-arrow-down" />
            <span>Install MONEYX App (+৳150 Bonus)</span>
          </button>
        )}
      </div>
    </div>
  );
};
