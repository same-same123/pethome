'use strict';

const TG = (() => {
  const tg = window.Telegram?.WebApp;

  function init() {
    if (tg) {
      tg.ready();
      tg.expand();
      applyTheme();
    }
  }

  function applyTheme() {
    if (!tg) return;
    const theme = tg.colorScheme;
    document.documentElement.setAttribute('data-theme', theme || 'light');
  }

  function getLanguage() {
    if (tg?.initDataUnsafe?.user?.language_code) {
      return tg.initDataUnsafe.user.language_code.toLowerCase().substring(0, 2);
    }
    const nav = navigator.language || navigator.userLanguage || 'ru';
    return nav.toLowerCase().substring(0, 2);
  }

  function haptic(type) {
    if (!tg?.HapticFeedback) return;
    switch (type) {
      case 'light':   tg.HapticFeedback.impactOccurred('light'); break;
      case 'medium':  tg.HapticFeedback.impactOccurred('medium'); break;
      case 'heavy':   tg.HapticFeedback.impactOccurred('heavy'); break;
      case 'success': tg.HapticFeedback.notificationOccurred('success'); break;
      case 'error':   tg.HapticFeedback.notificationOccurred('error'); break;
      default:        tg.HapticFeedback.impactOccurred('light');
    }
  }

  function openLink(url) {
    if (!url) return;
    if (url.startsWith('tel:')) {
      window.location.href = url;
      return;
    }
    if (tg) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  function showBackButton(callback) {
    if (!tg) return;
    tg.BackButton.show();
    tg.BackButton.onClick(callback);
  }

  function hideBackButton() {
    if (!tg) return;
    tg.BackButton.hide();
  }

  init();

  return { init, getLanguage, haptic, openLink, showBackButton, hideBackButton };
})();