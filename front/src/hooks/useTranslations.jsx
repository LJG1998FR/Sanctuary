import { useState, useEffect, createContext, useContext } from 'react';
import en from '../locales/en.json';

// ============================================================================
// Configuration
// ============================================================================

const translations = {
  en,
  // fr,  // Décommente quand le fichier existe
};

const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'sanctuary_lang';

// ============================================================================
// Context (pour partager la langue entre tous les composants)
// ============================================================================

const TranslationContext = createContext({
  currentLang: DEFAULT_LANG,
  setCurrentLang: () => {},
});

export function TranslationProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    // Récupérer la langue sauvegardée dans le localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && translations[saved] ? saved : DEFAULT_LANG;
  });

  // Sauvegarder la langue dans le localStorage quand elle change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentLang);
  }, [currentLang]);

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

// ============================================================================
// Hook principal
// ============================================================================

/**
 * Hook pour accéder aux traductions
 * 
 * @returns {Object} - { t, currentLang, changeLang, availableLangs }
 */
export function useTranslation() {
  const { currentLang, setCurrentLang } = useContext(TranslationContext);

  /**
   * Fonction de traduction
   * 
   * @param {string} key - Clé de traduction (ex: 'auth.login.title')
   * @param {Object} params - Paramètres à interpoler (ex: { username: 'John' })
   * @returns {string} - Texte traduit
   * 
   * @example
   * t('auth.login.title') // "Log in to your account"
   * t('admin.dashboard.welcome', { username: 'John' }) // "Welcome, John"
   */
  const t = (key, params = {}) => {
    // Récupérer la traduction depuis l'objet imbriqué
    const keys = key.split('.');
    let value = translations[currentLang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Clé non trouvée - retourner la clé elle-même (utile pour le debug)
        console.warn(`Translation key not found: ${key} (lang: ${currentLang})`);
        return key;
      }
    }

    // Si la valeur n'est pas une string, c'est une erreur de structure
    if (typeof value !== 'string') {
      console.warn(`Translation key is not a string: ${key} (lang: ${currentLang})`);
      return key;
    }

    // Interpoler les paramètres (remplacer {param} par sa valeur)
    return interpolate(value, params);
  };

  /**
   * Changer la langue actuelle
   * 
   * @param {string} lang - Code de la langue (ex: 'en', 'fr')
   * 
   * @example
   * changeLang('fr') // Change la langue en français
   */
  const changeLang = (lang) => {
    if (!translations[lang]) {
      console.error(`Language not available: ${lang}`);
      return;
    }
    setCurrentLang(lang);
  };

  /**
   * Liste des langues disponibles
   */
  const availableLangs = Object.keys(translations);

  return {
    t,
    currentLang,
    changeLang,
    availableLangs,
  };
}

// ============================================================================
// Fonction utilitaire : interpolation des paramètres
// ============================================================================

/**
 * Remplace les placeholders {param} dans une chaîne
 * 
 * @param {string} text - Texte avec placeholders
 * @param {Object} params - Valeurs à injecter
 * @returns {string} - Texte interpolé
 * 
 * @example
 * interpolate("Welcome, {username}", { username: "John" })
 * // → "Welcome, John"
 */
function interpolate(text, params) {
  return text.replace(/{(\w+)}/g, (match, param) => {
    return params[param] !== undefined ? params[param] : match;
  });
}

export function useLanguageSelector() {
  const { currentLang, changeLang, availableLangs } = useTranslation();

  const LanguageSelector = ({ className = '' }) => (
    <select
      value={currentLang}
      onChange={(e) => changeLang(e.target.value)}
      className={`language-selector ${className}`}
      aria-label="Select language"
    >
      {availableLangs.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );

  return { LanguageSelector };
}