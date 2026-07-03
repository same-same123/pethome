/**
 * ============================================================
 * PetHome — Telegram WebApp Integration
 * telegram.js
 *
 * Handles:
 *   - Telegram WebApp API initialization
 *   - Theme detection (light / dark)
 *   - Safe area insets
 *   - Language detection from Telegram user
 *   - Back button handling
 *   - Haptic feedback
 * ============================================================
 */

/**
 * TelegramApp — wrapper for Telegram WebApp API
 * Gracefully degrades when running outside Telegram
 */
const TelegramApp = (function () {
  'use strict';

  /* ── State ── */
  const tg = window.Telegram?.WebApp || null;
  let isInsideTelegram = false;

  /**
   * Initialize Telegram WebApp
   * Must be called before any other method
   */
  function init() {
    if (!tg) {
      console.info('[TelegramApp] Running outside Telegram — using fallback behavior.');
      return;
    }

    isInsideTelegram = true;

    /* Tell Telegram the app is ready */
    tg.ready();

    /* Expand to full height */
    tg.expand();

    /* Disable vertical swipe (prevents accidental close) */
    if (typeof tg.disableVerticalSwipes === 'function') {
      tg.disableVerticalSwipes();
    }

    /* Apply Telegram theme */
    applyTheme();

    /* Listen for theme changes */
    tg.onEvent('themeChanged', applyTheme);

    console.info('[TelegramApp] Initialized. Theme:', tg.colorScheme);
  }

  /**
   * Apply Telegram color scheme to the document
   */
  function applyTheme() {
    if (!tg) return;

    const scheme = tg.colorScheme; // 'light' | 'dark'
    document.documentElement.setAttribute('data-theme', scheme);

    /* Update meta theme-color */
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        scheme === 'dark' ? '#121210' : '#FAFAF8'
      );
    }
  }

  /**
   * Get user's language code from Telegram
   * Returns: 'ru' | 'sr' | 'en'
   */
  function getLanguageCode() {
    if (!tg || !tg.initDataUnsafe?.user) return null;

    const langCode = tg.initDataUnsafe.user.language_code || 'en';

    /* Map Telegram language codes to our supported languages */
    const langMap = {
      ru: 'ru',
      be: 'ru',  // Belarusian → Russian
      uk: 'ru',  // Ukrainian → Russian (close enough for now)
      sr: 'sr',
      bs: 'sr',  // Bosnian → Serbian
      hr: 'sr',  // Croatian → Serbian
      me: 'sr',  // Montenegrin → Serbian
      en: 'en',
    };

    return langMap[langCode] || 'en';
  }

  /**
   * Show Telegram native back button
   * @param {Function} callback — called when back button is pressed
   */
  function showBackButton(callback) {
    if (!tg) return;
    tg.BackButton.show();
    tg.BackButton.onClick(callback);
  }

  /**
   * Hide Telegram native back button
   */
  function hideBackButton() {
    if (!tg) return;
    tg.BackButton.hide();
  }

  /**
   * Haptic feedback — light tap
   */
  function hapticLight() {
    if (!tg?.HapticFeedback) return;
    tg.HapticFeedback.impactOccurred('light');
  }

  /**
   * Haptic feedback — medium impact
   */
  function hapticMedium() {
    if (!tg?.HapticFeedback) return;
    tg.HapticFeedback.impactOccurred('medium');
  }

  /**
   * Haptic feedback — success notification
   */
  function hapticSuccess() {
    if (!tg?.HapticFeedback) return;
    tg.HapticFeedback.notificationOccurred('success');
  }

  /**
   * Open external link
   * @param {string} url
   */
  function openLink(url) {
    if (tg) {
      tg.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Open Telegram link (t.me/...)
   * @param {string} url
   */
  function openTelegramLink(url) {
    if (tg) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Close the Mini App
   */
  function close() {
    if (tg) {
      tg.close();
    }
  }

  /**
   * Check if running inside Telegram
   */
  function isInTelegram() {
    return isInsideTelegram;
  }

  /**
   * Get raw Telegram WebApp instance
   */
  function getRaw() {
    return tg;
  }

  /* Public API */
  return {
    init,
    applyTheme,
    getLanguageCode,
    showBackButton,
    hideBackButton,
    hapticLight,
    hapticMedium,
    hapticSuccess,
    openLink,
    openTelegramLink,
    close,
    isInTelegram,
    getRaw,
  };
})();

/* Export to window for use in other modules */
window.TelegramApp = TelegramApp;