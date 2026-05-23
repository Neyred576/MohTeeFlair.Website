import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, Plus, Compass } from 'lucide-react';
import './PWAInstallPrompt.css';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState(null); // 'standard' | 'ios-safari' | 'ios-chrome' | 'ios-inapp'

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
      
    if (isStandalone) {
      return;
    }

    // 2. Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa-prompt-dismissed') === 'true';
    if (isDismissed) {
      return;
    }

    // 3. User Agent Detections
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    
    // Detect iOS Chrome (contains CriOS), iOS Firefox (contains FxiOS), iOS Opera (contains OPiOS)
    const isIOSChrome = isIOS && /CriOS/i.test(ua);
    const isIOSFirefox = isIOS && /FxiOS/i.test(ua);
    
    // Safari is WebKit, but other browsers on iOS also use WebKit.
    // Pure iOS Safari will have 'Safari' and NOT 'CriOS', 'FxiOS', etc.
    const isSafari = isIOS && /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|mercury|EdgiOS|Dolphin|UCBrowser|Focus/i.test(ua);
    
    // Detect In-App Browsers (Instagram, Facebook, Twitter/X, Pinterest, Threads, etc.)
    const isInApp = isIOS && (/FBAN|FBAV|Instagram|Threads|Twitter|Pinterest|LinkedIn|Line|Messenger/i.test(ua) 
      || (!isSafari && !isIOSChrome && !isIOSFirefox && !window.navigator.standalone));

    if (isIOS) {
      if (isInApp) {
        setPromptType('ios-inapp');
      } else if (isSafari) {
        setPromptType('ios-safari');
      } else {
        setPromptType('ios-chrome'); // Catch-all for Chrome/Firefox/Edge on iOS
      }
      
      // Delay showing the prompt slightly for a premium feel
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Android / Chrome Desktop
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setPromptType('standard');
        
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Install choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="pwa-prompt"
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="pwa-prompt__card card-glass">
            <button 
              className="pwa-prompt__close" 
              onClick={handleDismiss} 
              aria-label="Close installation prompt"
            >
              <X size={16} />
            </button>
            
            <div className="pwa-prompt__body">
              <div className="pwa-prompt__logo-container">
                <img 
                  src="/images/moh/mtf-logo.png" 
                  alt="Moh Tee Flair Brand Logo" 
                  className="pwa-prompt__logo" 
                />
              </div>
              
              <div className="pwa-prompt__content">
                <h4 className="pwa-prompt__title">Moh Tee Flair</h4>
                
                {/* 1. Android / Desktop Chrome */}
                {promptType === 'standard' && (
                  <>
                    <p className="pwa-prompt__desc">
                      Install our official app on your home screen for quick access and offline shopping.
                    </p>
                    <div className="pwa-prompt__actions">
                      <button className="btn btn-primary pwa-prompt__btn" onClick={handleInstall}>
                        <Download size={14} /> Install
                      </button>
                    </div>
                  </>
                )}

                {/* 2. iOS Safari */}
                {promptType === 'ios-safari' && (
                  <>
                    <p className="pwa-prompt__desc">
                      Install the app on your iPhone for the ultimate luxury beauty experience.
                    </p>
                    <div className="pwa-prompt__instructions">
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">1</span>
                        <span>
                          Tap the Safari Share button <Share size={13} className="pwa-prompt__inline-icon" /> at the bottom.
                        </span>
                      </div>
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">2</span>
                        <span>
                          Select <strong>Add to Home Screen</strong> <Plus size={13} className="pwa-prompt__inline-icon-border" />.
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* 3. iOS In-App Browsers (Instagram/Facebook/etc.) */}
                {promptType === 'ios-inapp' && (
                  <>
                    <p className="pwa-prompt__desc warning-text">
                      Please open this site in <strong>Safari</strong> to install the app on your iPhone.
                    </p>
                    <div className="pwa-prompt__instructions">
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">1</span>
                        <span>
                          Tap the three dots <span className="pwa-prompt__inline-dots">•••</span> or share icon at the top right.
                        </span>
                      </div>
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">2</span>
                        <span>
                          Select <strong>Open in Safari</strong> <Compass size={13} className="pwa-prompt__inline-icon" />.
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* 4. iOS Chrome or Other browsers */}
                {promptType === 'ios-chrome' && (
                  <>
                    <p className="pwa-prompt__desc">
                      Install the app on your iPhone home screen from your browser.
                    </p>
                    <div className="pwa-prompt__instructions">
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">1</span>
                        <span>
                          Tap the Share icon <Share size={13} className="pwa-prompt__inline-icon" /> near the address bar.
                        </span>
                      </div>
                      <div className="pwa-prompt__step">
                        <span className="pwa-prompt__step-num">2</span>
                        <span>
                          Scroll down and select <strong>Add to Home Screen</strong> <Plus size={13} className="pwa-prompt__inline-icon-border" />.
                        </span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
