// components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    // Force le re-render de toute l'application
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <button
      onClick={toggleLanguage}
      style={styles.button}
      title={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      <span style={{ fontSize: "14px" }}>{currentLang === 'fr' ? '🇬🇧' : '🇫🇷'}</span>
      <span>{currentLang === 'fr' ? 'EN' : 'FR'}</span>
    </button>
  );
}

const styles = {
  button: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "480",
    color: "#F8FAFC",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    width: "100%",
    justifyContent: "center",
  },
};

export default LanguageSwitcher;