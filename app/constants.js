/////////////////////////////////////////////////////////
//                                                     //
// Purpose: Defines constants within the app           //
//                                                     //
// What it contains:                                   //
//      - Colours Themes                               //
//      - EN/FR Translations                           //
//      - Strings                                      //
//      - Enumerations                                 //
//                                                     //
/////////////////////////////////////////////////////////


// ################## CONSTANTS ###############################

// Different Pages in the App
export const Pages = {
    Home: "Home",
    TrendsOverTime: "TrendsOverTime",
    Overview: "Overview",
    About: "About",
    Contact: "Contact"
}

// File locations for each page
export const PageSrc = {};
PageSrc[Pages.TrendsOverTime] = "./templates/trendsOverTime.html"
PageSrc[Pages.Overview] = "./templates/overview.html"
PageSrc[Pages.About] = "./templates/about.html"
PageSrc[Pages.Contact] = "./templates/contact.html"

// Different sections in the "Trends Over Time" page
export const TrendsOverTimeSections = {
    ByFood: "ByFood",
    ByMicroorganism: "ByMicroorganism"
}

// Different sections in the "Overview" page
export const OverviewSections = {
    ByMicroorganism: "ByMicroorganism",
    ByFood: "ByFood",
    ByOrg: "ByOrg"
}

// Default selected pages and tabs
export const DefaultPage = Pages.TrendsOverTime;
export const DefaultTrendsOverTimeSection = TrendsOverTimeSections.ByFood;
export const DefaultOverviewSection = OverviewSections.ByMicroorganism;

export const DefaultTabs = {};
DefaultTabs[Pages.TrendsOverTime] = DefaultTrendsOverTimeSection;
DefaultTabs[Pages.Overview] = DefaultOverviewSection;

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
    secondaryBorderColour: "#bbbfc5",
    secondaryHover: "#0535d2",
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
    secondary: "#83a1c9",
    secondaryBg: "#cfd1d5",
    secondaryBorderColour: "#d6d8db",
    secondaryHover: "#5179fb",
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
    secondary: "#0c2d48",
    secondaryBg: "#b1d4e0",
    secondaryBorderColour: "#145da0",
    secondaryHover: "#2e8bc0",
    tertiary: "purple",
    link: "#0c4160",
    headerTitleColor: "#333333"
};

// ############################################################
// ################## TRANSLATIONS ############################


const REMPLACER_MOI = "REMPLACER MOI"
const REMPLACER_MOI_AVEC_ARGUMENTS = `${REMPLACER_MOI} - les arguments du texte: `

// ============== ENGLISH =======================

// names for the main navigation pages
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

// names for the "Trends Over Time" sections
const TrendsOverTimeSectionsEN = {};
TrendsOverTimeSectionsEN[TrendsOverTimeSections.ByFood] = "By Food";
TrendsOverTimeSectionsEN[TrendsOverTimeSections.ByMicroorganism] = "By Microorganism";

// names for the "Overview" sections
const OverviewSectionsEN = {};
OverviewSectionsEN[OverviewSections.ByFood] = "By Food";
OverviewSectionsEN[OverviewSections.ByMicroorganism] = "By Microorganism";
OverviewSectionsEN[OverviewSections.ByOrg] = "By Org";

const LangEN = {
    "websiteTitle": "Microbiology Tool",
    "websiteTabTitle": "FSDAT -Microbiology",
    "websiteDescription": "FSDAT -Microbiology",
    "changeLanguage": "Français",
    "changeLanguageValue": Languages.French,
    navigation: NavigationEN,
    themes: ColourThemesEN,
    trendsOverTimeSections: TrendsOverTimeSectionsEN,
    overviewSections: OverviewSectionsEN
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

// names for the "Trends Over Time" sections
const TrendsOverTimeSectionsFR = {};
TrendsOverTimeSectionsFR[TrendsOverTimeSections.ByFood] = REMPLACER_MOI;
TrendsOverTimeSectionsFR[TrendsOverTimeSections.ByMicroorganism] = REMPLACER_MOI;

// names for the "Overview" sections
const OverviewSectionsFR = {};
OverviewSectionsFR[OverviewSections.ByFood] = REMPLACER_MOI;
OverviewSectionsFR[OverviewSections.ByMicroorganism] = REMPLACER_MOI;
OverviewSectionsFR[OverviewSections.ByOrg] = REMPLACER_MOI;

const LangFR = {
    "websiteTitle": REMPLACER_MOI,
    "websiteTabTitle": REMPLACER_MOI,
    "websiteDescription": REMPLACER_MOI,
    "changeLanguage": "English",
    "changeLanguageValue": Languages.English,
    navigation: NavigationFR,
    themes: ColourThemesFR,
    trendsOverTimeSections: TrendsOverTimeSectionsFR,
    overviewSections: OverviewSectionsFR
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################