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

// Tabs in the "Trends Over Time" page
export const TrendsOverTimeTabs = {
    ByFood: "ByFood",
    ByMicroorganism: "ByMicroorganism"
}

// Tabs in the "Overview" page
export const OverviewTabs = {
    ByMicroorganism: "ByMicroorganism",
    ByFood: "ByFood",
    ByOrg: "ByOrg"
}

// All tabs on the app
export const Tabs = {};
Tabs[Pages.TrendsOverTime] = TrendsOverTimeTabs;
Tabs[Pages.Overview] = OverviewTabs;

// Inputs available
export const Inputs = {
    DataType: "DataType",
    FoodGroup: "FoodGroup",
    Food: "Food",
    MicroOrganism: "Microorganism",
    SurveyType: "SurveyType"
};

// Default selected pages and tabs
export const DefaultPage = Pages.TrendsOverTime;
export const DefaultTrendsOverTimeSection = TrendsOverTimeTabs.ByMicroorganism;
export const DefaultOverviewSection = OverviewTabs.ByMicroorganism;

export const DefaultTabs = {};
DefaultTabs[Pages.TrendsOverTime] = DefaultTrendsOverTimeSection;
DefaultTabs[Pages.Overview] = DefaultOverviewSection;

// Available Languages
export const Languages = {
    English: "en",
    French: "fr"
}

export const DefaultLanguage = Languages.English;

// Data types available for the "select Data Type" filter
export const MicroBioDataTypes = {
    "PresenceAbsence": "presenceAbsence",
    "Concentration": "concentration"
};

// Survey Types
export const SurveyTypes = {
    HC: "HC",
    PHAC: "PHAC",
    CFIA: "CFIA",
    CFSIN: "CFSIN"
};

export const DefaultSurveyTypes = [SurveyTypes.HC, SurveyTypes.PHAC, SurveyTypes.CFIA];

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
    secondaryBgHover: "#d8dadd",
    secondaryBorderColour: "#bbbfc5",
    secondaryHover: "#753350",
    tertiary: "#af3c43",
    link: "#284162",
    headerTitleColor: "#000000"
};

Themes[ThemeNames.Dark] = {
    fontColour: "#ffffff",
    primary: "#26374a",
    primaryBg: "#191919",
    primaryHover: "#444444",
    primaryBgHover: "#ffffff",
    primaryFontColour: "#ffffff",
    primaryBorderColour: "#d6d8db",
    secondary: "#4a74aa",
    secondaryBg: "#cfd1d5", 
    secondaryBgHover: "#d8dadd",
    secondaryBorderColour: "#d6d8db",
    secondaryHover: "#aa4a74",
    tertiary: "#af3c43",
    link: "#6e93c4",
    headerTitleColor: "#ffffff"
};

// Primary ---> Mountain Haze Theme: https://www.canva.com/colors/color-palettes/mountain-haze/
// Secondary --> Mermaid Lagoon Theme: https://www.canva.com/colors/color-palettes/mermaid-lagoon/
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
    secondaryBgHover: "#c0dce6",
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
const TrendsOverTimeTabsEN = {};
TrendsOverTimeTabsEN[TrendsOverTimeTabs.ByFood] = "By Food";
TrendsOverTimeTabsEN[TrendsOverTimeTabs.ByMicroorganism] = "By Microorganism";

// names for the "Overview" sections
const OverviewTabsEN = {};
OverviewTabsEN[OverviewTabs.ByFood] = "By Food";
OverviewTabsEN[OverviewTabs.ByMicroorganism] = "By Microorganism";
OverviewTabsEN[OverviewTabs.ByOrg] = "By Org";

// names for the filters
const FilterNamesEN = {};
FilterNamesEN[Pages.TrendsOverTime] = {};
FilterNamesEN[Pages.Overview] = {};
Object.keys(TrendsOverTimeTabs).forEach((section) => { FilterNamesEN[Pages.TrendsOverTime][section] = {} });
Object.keys(OverviewTabs).forEach((section) => { FilterNamesEN[Pages.TrendsOverTime][section] = {} });

// Filter names for "Trends Over Time" ==> "By Food"
FilterNamesEN[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = {
    "food": "1. Select Food(s)",
    "microorganism": "2. Select Microorganism",
    "dataType": "3. Select DataType",
    "surveyType": "4. Select Survey Type",
    "adjustGraph": "5. Adjust Graph"
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesEN[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "microorganism": "1. Select Microorganism",
    "food": "2. Select Food(s)",
    "dataType": "3. Select DataType",
    "surveyType": "4. Select Survey Type",
    "adjustGraph": "5. Adjust Graph"
}

// Filter names for "Overview" ==> "By Microorganism"
FilterNamesEN[Pages.Overview][OverviewTabs.ByMicroorganism] = {
    "microorganism": "1. Select Microorganism",
    "surveyType": "2. Select Survey Type",
    "adjustGraph": "3. Adjust Graph"
}

// Filter names for "Overview" ==> "By Food"
FilterNamesEN[Pages.Overview][OverviewTabs.ByFood] = {
    "food": "1. Select Food(s)",
    "surveyType": "2. Select Survey Type"
}

// Filter names for "Overview" ==> "By Org"
FilterNamesEN[Pages.Overview][OverviewTabs.ByOrg] = {
    "surveyType": "1. Select Survey Type"
}

const LangEN = {
    "websiteTitle": "Microbiology Tool",
    "websiteTabTitle": "FSDAT -Microbiology",
    "websiteDescription": "FSDAT -Microbiology",
    "changeLanguage": "Français",
    "changeLanguageValue": Languages.French,
    
    navigation: NavigationEN,
    themes: ColourThemesEN,
    TrendsOverTimeTabs: TrendsOverTimeTabsEN,
    OverviewTabs: OverviewTabsEN,
    filterNames: FilterNamesEN,

    "allFoodGroups": "All Food Groups",
    "allFoods": "All Foods",
    "allMicroorganisms": "All Microorganisms"
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
const TrendsOverTimeTabsFR = {};
TrendsOverTimeTabsFR[TrendsOverTimeTabs.ByFood] = REMPLACER_MOI;
TrendsOverTimeTabsFR[TrendsOverTimeTabs.ByMicroorganism] = REMPLACER_MOI;

// names for the "Overview" sections
const OverviewTabsFR = {};
OverviewTabsFR[OverviewTabs.ByFood] = REMPLACER_MOI;
OverviewTabsFR[OverviewTabs.ByMicroorganism] = REMPLACER_MOI;
OverviewTabsFR[OverviewTabs.ByOrg] = REMPLACER_MOI;

// names for the filters
const FilterNamesFR = {};
FilterNamesFR[Pages.TrendsOverTime] = {};
FilterNamesFR[Pages.Overview] = {};
Object.keys(TrendsOverTimeTabs).forEach((section) => { FilterNamesFR[Pages.TrendsOverTime][section] = {} });
Object.keys(OverviewTabs).forEach((section) => { FilterNamesFR[Pages.TrendsOverTime][section] = {} });

// Filter names for "Trends Over Time" ==> "By Food"
FilterNamesFR[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = {
    "food": REMPLACER_MOI,
    "microorganism": REMPLACER_MOI,
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesFR[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "microorganism": REMPLACER_MOI,
    "food": REMPLACER_MOI,
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Microorganism"
FilterNamesFR[Pages.Overview][OverviewTabs.ByMicroorganism] = {
    "microorganism": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Food"
FilterNamesFR[Pages.Overview][OverviewTabs.ByFood] = {
    "food": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Org"
FilterNamesFR[Pages.Overview][OverviewTabs.ByOrg] = {
    "surveyType": REMPLACER_MOI
}

const LangFR = {
    "websiteTitle": REMPLACER_MOI,
    "websiteTabTitle": REMPLACER_MOI,
    "websiteDescription": REMPLACER_MOI,
    "changeLanguage": "English",
    "changeLanguageValue": Languages.English,

    navigation: NavigationFR,
    themes: ColourThemesFR,
    TrendsOverTimeTabs: TrendsOverTimeTabsFR,
    OverviewTabs: OverviewTabsFR,
    filterNames: FilterNamesFR,

    "allFoodGroups": REMPLACER_MOI,
    "allFoods": REMPLACER_MOI,
    "allMicroorganisms": REMPLACER_MOI
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################