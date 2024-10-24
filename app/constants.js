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

// Further groups the data for each tab apart from the grouping based on the tabs inputs
export const GroupNames = {
    SampleCode: "Sample Code"
}

// order for the filter inputs for each tab
export const InputOrder = {};
InputOrder[Pages.TrendsOverTime] = {};
InputOrder[Pages.Overview] = {};
InputOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = [Inputs.DataType, Inputs.SurveyType, Inputs.MicroOrganism, Inputs.FoodGroup, Inputs.Food];
InputOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = [Inputs.DataType, Inputs.SurveyType, Inputs.FoodGroup, Inputs.Food, Inputs.MicroOrganism];
InputOrder[Pages.Overview][OverviewTabs.ByMicroorganism] = [Inputs.MicroOrganism, Inputs.SurveyType];
InputOrder[Pages.Overview][OverviewTabs.ByFood] = [Inputs.FoodGroup, Inputs.Food, Inputs.SurveyType];
InputOrder[Pages.Overview][OverviewTabs.ByOrg] = [Inputs.SurveyType];


// indices for the order of the filter inputs in each tab
export const InputOrderInds = {};
for (const page in InputOrder) {
    const pageInputOrders = InputOrder[page];
    InputOrderInds[page] = {};

    for (const tab in pageInputOrders) {
        const tabInputOrder = pageInputOrders[tab];
        const tabOrderInds = {};
        tabInputOrder.forEach((input, ind) => {tabOrderInds[input] = ind});
        InputOrderInds[page][tab] = tabOrderInds;
    }
}

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
    HC: "HC Targeted Surveys",
    PHAC: "PHAC FoodNet",
    CFIA: "CFIA Surveys",
    CFSIN: "CFSIN"
};

// Delimeter for joining each node in the Phylogentic tree
export const PhylogeneticDelim = "==>"

// Columns in the Health Canada Data
// Note: Copy the exact column names from "CANLINE Micro -no... .csv" except for the Columns with 3 stars (***)
export const HCDataCols = {
    Agent: "Agent",
    Genus: "Genus",
    Species: "Species",
    Subspecies: "Subspecies/Genogroup",
    Genotype: "Genotype",
    Subgenotype: "Subgenotype",
    Serotype: "Serotype",
    OtherTyping: "Other typing",
    FoodGroup: "Food Group",
    FoodName: "Food Name",
    ProjectCode: "Project Code",
    SampleCode: "Sample Code",
    QualitativeResult: "Qualitative Result",
    QuantitativeOperator: "Quantitative Result Operator",
    QuantitativeResult: "Quantitative Result",
    QuantitativeUnit: "Quantitative Result Unit",
    SurveyType: "Survey Type", // ***
}

// Different types of operators for the quantitative results
export const QuantitativeOps = {
    Eq: "=",
    Lt: "<",
    Gt: ">",
    Le: "<=",
    Ge: ">=",
    Approx: "~"
}

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
    headerTitleColor: "#000000",
    error: "#ff0000"
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
    headerTitleColor: "#ffffff",
    error: "#ff0000"
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
    headerTitleColor: "#333333",
    error: "#ff0000"
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
    "dataType": "1. Select DataType",
    "surveyType": "2. Select Survey Type",
    "food": "3. Select Food(s)",
    "microorganism": "4. Select Microorganism",
    "adjustGraph": "5. Adjust Graph"
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesEN[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "dataType": "1. Select DataType",
    "surveyType": "2. Select Survey Type",
    "microorganism": "3. Select Microorganism",
    "food": "4. Select Food(s)",
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

// Survey Types
const SurveyTypesEN = {};
SurveyTypesEN[SurveyTypes.HC] = "HC Targeted Surveys";
SurveyTypesEN[SurveyTypes.PHAC] = "PHAC FoodNet";
SurveyTypesEN[SurveyTypes.CFIA] = "CFIA Surveys";
SurveyTypesEN[SurveyTypes.CFSIN] = "CFSIN";

// names for the Data Types
const DataTypeNamesEN = {};
DataTypeNamesEN[MicroBioDataTypes.PresenceAbsence] = "Presence/Absence"
DataTypeNamesEN[MicroBioDataTypes.Concentration] = "Concentration"

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
    "allMicroorganisms": "All Microorganisms",
    "nonSpeciated": "Non Speciated",
    "selectAll": "Select All",
    "deselectAll": "Deselect All",
    "noResultsFound": "No results matched {0}",

    "foodGroupLabel": "Food Groups:",
    "foodLabel": "Foods:",
    "microorganismLabel": "Microorganisms:",

    surveyTypes: SurveyTypesEN,
    dataTypes: DataTypeNamesEN,

    // Different options for the qualitative results
    // Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
    qualitativeResults: {
        "Detected": "detected",
        "NotDetected": "not detected",
        "NotTested": "not tested",
        "Inconclusive": "inconclusive"
    }
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
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "food": REMPLACER_MOI,
    "microorganism": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesFR[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "microorganism": REMPLACER_MOI,
    "food": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
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

// Survey Types
const SurveyTypesFR = {};
SurveyTypesFR[SurveyTypes.HC] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.PHAC] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.CFIA] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.CFSIN] = REMPLACER_MOI;

// names for the Data Types
const DataTypeNamesFR = {};
DataTypeNamesFR[MicroBioDataTypes.PresenceAbsence] = REMPLACER_MOI;
DataTypeNamesFR[MicroBioDataTypes.Concentration] = REMPLACER_MOI;

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
    "allMicroorganisms": REMPLACER_MOI,
    "nonSpeciated": REMPLACER_MOI,
    "selectAll": REMPLACER_MOI,
    "deselectAll": REMPLACER_MOI,
    "noResultsFound": `${REMPLACER_MOI_AVEC_ARGUMENTS} {0}`,

    "foodGroupLabel": REMPLACER_MOI,
    "foodLabel": REMPLACER_MOI,
    "microorganismLabel": REMPLACER_MOI,

    surveyTypes: SurveyTypesFR,
    dataTypes: DataTypeNamesFR,

    // Different options for the qualitative results
    // Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
    qualitativeResults: {
        "Detected": REMPLACER_MOI,
        "NotDetected": REMPLACER_MOI,
        "NotTested": REMPLACER_MOI,
        "Inconclusive": REMPLACER_MOI
    }
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################