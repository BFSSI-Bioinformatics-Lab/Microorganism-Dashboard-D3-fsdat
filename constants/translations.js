import { Languages, Pages } from "./constants.js"
import { ThemeNames } from "./themes.js";


const REMPLACER_MOI = "REMPLACER MOI"
const REMPLACER_MOI_AVEC_ARGUMENTS = `${REMPLACER_MOI} - les arguments du texte: `

// ============== ENGLISH =======================

// names for the main navigation options
const NavigationEN = {};
NavigationEN[Pages.Home] = "Home";
NavigationEN[Pages.TrendsOverTime] = "Trends Over Time";
NavigationEN[Pages.Overview] = "Overview";
NavigationEN[Pages.About] = "About";
NavigationEN[Pages.Contact] = "Contact";

// names for colour themes
const ColourThemesEN = {};
ColourThemesEN[ThemeNames.Light] = "Light"
ColourThemesEN[ThemeNames.Dark] = "Dark"
ColourThemesEN[ThemeNames.Blue] = "Blue"

const LangEN = {
    "websiteTitle": "Microbiology Tool",
    "websiteTabTitle": "FSDAT -Microbiology",
    "changeLanguage": "Français",
    "changeLanguageValue": Languages.French,
    navigation: NavigationEN,
    themes: ColourThemesEN
}

// ==============================================
// ============== FRENCH ========================

// names for the main navigation options
const NavigationFR = {};
NavigationFR[Pages.Home] = REMPLACER_MOI;
NavigationFR[Pages.TrendsOverTime] = REMPLACER_MOI;
NavigationFR[Pages.Overview] = REMPLACER_MOI;
NavigationFR[Pages.About] = REMPLACER_MOI;
NavigationFR[Pages.Contact] = REMPLACER_MOI;

// names for colour themes
const ColourThemesFR = {};
ColourThemesFR[ThemeNames.Light] = "Clair"
ColourThemesFR[ThemeNames.Dark] = "Foncée"
ColourThemesFR[ThemeNames.Blue] = "Bleu"

const LangFR = {
    "websiteTitle": REMPLACER_MOI,
    "websiteTabTitle": REMPLACER_MOI,
    "changeLanguage": "English",
    "changeLanguageValue": Languages.English,
    navigation: NavigationFR,
    themes: ColourThemesFR
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};