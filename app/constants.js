// ################## CONSTANTS ###############################

// Different Pages in the App
export const Pages = {
    Home: "Home",
    TrendsOverTime: "TrendsOverTime",
    Overview: "Overview",
    About: "About",
    Contact: "Contact"
}

export const DefaultPage = Pages.TrendsOverTime;

export const PageSrc = {};
PageSrc[Pages.TrendsOverTime] = "./static/trendsOverTime/trendsOverTime.html"
PageSrc[Pages.Overview] = "./static/overview/overview.html"
PageSrc[Pages.About] = "./static/about/about.html"
PageSrc[Pages.Contact] = "./static/contact/contact.html"


// Available Languages
export const Languages = {
    English: "en",
    French: "fr"
}

export const DefaultLanguage = Languages.English;


// ############################################################
// ################## THEMES ##################################

export const ThemeNames = {
    Light: "light",
    Dark: "dark",
    Blue: "blue"
}

export const DefaultTheme = ThemeNames.Light;

export const Themes = {};


// See here for Infobase's colour scheme: https://design-system.alpha.canada.ca/en/styles/colour/
Themes[ThemeNames.Light] = {
    fontColour: "#333333",
    primary: "#26374a",
    primaryBg: "#ffffff",
    primaryBgHover: "#ffffff",
    primaryHover: "#444444",
    primaryFontColour: "#ffffff",
    primaryBorderColour: "#7D828B",
    secondary: "#335075",
    secondaryBg: "#cfd1d5",
    tertiary: "#af3c43",
    link: "#284162",
    headerTitleColor: "#000000"
};

Themes[ThemeNames.Dark] = {
    fontColour: "#ffffff",
    primary: "#26374a",
    primaryBg: "#000000",
    primaryHover: "#444444",
    primaryBgHover: "#ffffff",
    primaryFontColour: "#ffffff",
    primaryBorderColour: "#d6d8db",
    secondary: "#335075",
    secondaryBg: "#cfd1d5",
    tertiary: "#af3c43",
    link: "#6e93c4",
    headerTitleColor: "#ffffff"
};

// Mountain Haze Theme: https://www.canva.com/colors/color-palettes/mountain-haze/
Themes[ThemeNames.Blue] = {
    fontColour: "#333333",
    primary: "#738fa7",
    primaryBg: "#ffffff",
    primaryHover: "#0c4160",
    primaryBgHover: "#ffffff",
    primaryFontColour: "#ffffff",
    primaryBorderColour: "#7D828B",
    secondary: "red",
    secondaryBg: "blue",
    tertiary: "purple",
    link: "#0c4160",
    headerTitleColor: "#333333"
};

// ############################################################
// ################## TRANSLATIONS ############################


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
    "websiteDescription": "FSDAT -Microbiology",
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
ColourThemesFR[ThemeNames.Dark] = "Foncé"
ColourThemesFR[ThemeNames.Blue] = "Bleu"

const LangFR = {
    "websiteTitle": REMPLACER_MOI,
    "websiteTabTitle": REMPLACER_MOI,
    "websiteDescription": REMPLACER_MOI,
    "changeLanguage": "English",
    "changeLanguageValue": Languages.English,
    navigation: NavigationFR,
    themes: ColourThemesFR
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################