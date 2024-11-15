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
    SurveyType: "SurveyType",
    NumberView: "NumberView"
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
export const DefaultPage = Pages.Overview;
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
export const TablePhylogenticDelim = " > "

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
    IsolateCode: "Isolate Code",
    SurveyType: "Survey Type", // ***
    Microorganism: "Microorganism", // ***
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

// Different states for a sample
export const SampleState = {
    Detected: "detected",
    NotDetected: "not detected",
    NotTested: "not tested",
    InConclusive: "inconclusive"
}

// order to display the states of the samples in the graph
export const SampleStateOrdering = {};
SampleStateOrdering[SampleState.Detected] = 0;
SampleStateOrdering[SampleState.NotDetected] = 1;
SampleStateOrdering[SampleState.NotTested] = 2;

export const SampleStateOrder = Object.values(SampleState).sort((state1, state2) => SampleStateOrdering[state1] - SampleStateOrdering[state2]);

// colour variables for the states
export const SampleStateColours = {};
SampleStateColours[SampleState.Detected] = "var(--detected)";
SampleStateColours[SampleState.NotDetected] = "var(--notDetected)";
SampleStateColours[SampleState.NotTested] = "var(--notTested)";

// Attributes names for the summary data
export const SummaryAtts = {
    FoodName: "foodName",
    Microorganism: "microorganism",
    Samples: "samples",
    Detected: SampleState.Detected,
    NotTested: SampleState.NotTested,
    NotDetected: SampleState.NotDetected,
    Tested: "tested",
    PercentDetected: "percentDetected",
    State: "state",
    StateVal: "stateVal",
    SamplesWithConcentration: "samplesWithConcentrations",
    ConcentrationMean: "concentrationMean",
    ConcentrationRange: "concentrationRange"
}

// DefaultDims: Default dimensions used for certain dimension attributes
export const DefaultDims = {
    fontSize: 12,
    paddingSize: 5,
    pos: 0,
    length: 0,
    borderWidth: 3,
    lineSpacing: 1
};

// Dims: Dimensions used in the visuals
export const Dims = {
    overviewBarGraph: {
        HeadingFontSize: 26,
        AxesFontSize: 18,
        TickFontSize: 12,
        GraphWidth: 900,
        GraphTop: 100,
        GraphBottom: 60,
        GraphLeft: 180,
        GraphRight: 200,
        BarHeight: 50,
        FoodNameWidth: 120,
        LegendSquareSize: 12,
        LegendLeftMargin: 50,
        LegendFontSize: 12
    }
}

// text wrap attributes
export const TextWrap  = {
    NoWrap: "No Wrap",
    Wrap: "Wrap"
};

// Overall display of the data
export const NumberView = {
    Number: "number",
    Percentage: "percentage"
};

// ############################################################
// ################## THEMES ##################################

export const ThemeNames = {
    Light: "light",
    Dark: "dark",
    Blue: "blue"
}

export const DefaultTheme = ThemeNames.Light;

export const Themes = {};


// Note: we base the colour theme from Android's Material UI
// https://m2.material.io/develop/android/theming/color
// https://m2.material.io/design/color/the-color-system.html

// See here for Infobase's colour scheme: https://design-system.alpha.canada.ca/en/styles/colour/
Themes[ThemeNames.Light] = {
    fontColour: "#333333",
    background: "#ffffff",
    surface: "#ffffff",
    secondarySurface: "#fbfcf8",
    error: "#ff0000",
    onBackground: "#000000",
    onSurface: "#000000",
    onSecondarySurface: "#000000",
    onError: "#ffffff",
    primary: "#26374a",
    primaryVariant: "#3B4B5C",
    onPrimary: "#ffffff",
    primaryBorderColour: "#7D828B",
    primaryHover: "#444444",
    onPrimaryHover: "#ffffff",
    secondary: "#335075",
    onSecondary: "#ffffff",
    secondaryHover: "#753350",
    onSecondaryHover: "#d8dadd",
    secondaryBorderColour: "#bbbfc5",
    tertiary: "#af3c43",
    link: "#284162",
    headerTitleColor: "#000000",

    detected: "#C5705D",
    notDetected: "#41B3A2",
    notTested: "#cc9900",
    unknown: "#cccccc"
};

Themes[ThemeNames.Dark] = {
    fontColour: "#ffffff",
    background: "#120E0B",
    surface: "#191919",
    secondarySurface: "#252525",
    error: "#ff0000",
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    onSecondarySurface: "#ffffff",
    onError: "#ffffff",
    primary: "#515F6E",
    primaryVariant: "#626f7c",
    onPrimary: "#ffffff",
    primaryBorderColour: "#d6d8db",
    primaryHover: "#7c7c7c",
    onPrimaryHover: "#ffffff",
    secondary: "#5781b6",
    onSecondary: "#ffffff",
    secondaryHover: "#b65781",
    onSecondaryHover: "#d8dadd",
    secondaryBorderColour: "#d6d8db",
    tertiary: "#af3c43",
    link: "#3e6598",
    headerTitleColor: "#ffffff",

    detected: "#C5705D",
    notDetected: "#41B3A2",
    notTested: "#cc9900",
    unknown: "#cccccc"
};

// Primary ---> Mountain Haze Theme: https://www.canva.com/colors/color-palettes/mountain-haze/
// Secondary --> Mermaid Lagoon Theme: https://www.canva.com/colors/color-palettes/mermaid-lagoon/
Themes[ThemeNames.Blue] = {
    fontColour: "#333333",
    background: "#ffffff",
    surface: "#ffffff",
    secondarySurface: "#fbfcf8",
    error: "#ff0000",
    onBackground: "#000000",
    onSurface: "#000000",
    onSecondarySurface: "#000000",
    onError: "#ffffff",
    primary: "#738fa7",
    primaryVariant: "#678096",
    onPrimary: "#ffffff",
    primaryBorderColour: "#7D828B",
    primaryHover: "#0c4160",
    onPrimaryHover: "#ffffff",
    secondary: "#0c2d48",
    onSecondary: "#b1d4e0",
    secondaryHover: "#2e8bc0",
    onSecondaryHover: "#c0dce6",
    secondaryBorderColour: "#145da0",
    tertiary: "purple",
    link: "#284162",
    headerTitleColor: "#333333",

    detected: "#cc6600",
    notDetected: "#009999",
    notTested: "#666699",
    unknown: "#cccccc"
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

// names for the percentage/number views
const NumberViewEn = {};
NumberViewEn[NumberView.Number] = "# positive";
NumberViewEn[NumberView.Percentage] = "% positive";

// name of the group for 'All Microorganisms' on the microroganism tree
const allMicroorganismsEN = "All Microorganisms";

// Genuses used in the Denominator calculations
// Note: Copy the exact values from the [Agent] and [Genus] column in "CANLINE Micro -no... .csv"
const denomGenusesEN = [[allMicroorganismsEN, "Bacteria", "Vibrio"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Salmonella"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Escherichia"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Listeria"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Hepatovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Norovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Orthohepevirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Rotavirus"].join(PhylogeneticDelim)];

// Different options for the qualitative results
// Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
const QualitaiveResultsEN = {};
QualitaiveResultsEN[SampleState.Detected] = "detected";
QualitaiveResultsEN[SampleState.NotDetected] = "not detected";
QualitaiveResultsEN[SampleState.NotTested] = "not tested";
QualitaiveResultsEN[SampleState.InConclusive] = "inconclusive";

// labels for the x-axis of the overview bar graph
const overviewBarGraphXAxisEN = {};
overviewBarGraphXAxisEN[NumberView.Number] = "Count";
overviewBarGraphXAxisEN[NumberView.Percentage] = "Percentage";

// names for the columns on the table
const tableColsEN = {};
tableColsEN[SummaryAtts.FoodName] = "Food Name";
tableColsEN[SummaryAtts.Microorganism] = "Pathogen Branch";
tableColsEN[SummaryAtts.PercentDetected] = "% Detected";
tableColsEN[SummaryAtts.Detected] = "# Detected";
tableColsEN[SummaryAtts.Samples] = "# Samples";
tableColsEN[SummaryAtts.SamplesWithConcentration] = "# Samples with Conc. Data"
tableColsEN[SummaryAtts.ConcentrationMean] = "Conc. Mean (cfu/g)"
tableColsEN[SummaryAtts.ConcentrationRange] = "Conc. Range (cfu/g)"

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
    "allMicroorganisms": allMicroorganismsEN,
    "nonSpeciated": "Non Speciated",
    "selectAll": "Select All",
    "deselectAll": "Deselect All",
    "noResultsFound": "No results matched {0}",
    "noData": "No Data",

    "foodGroupLabel": "Food Groups:",
    "foodLabel": "Foods:",
    "microorganismLabel": "Microorganisms:",

    "showResultAsLabel": "Show Result As:",

    surveyTypes: SurveyTypesEN,
    dataTypes: DataTypeNamesEN,
    qualitativeResults: QualitaiveResultsEN,
    numberview: NumberViewEn,

    denomGenuses: denomGenusesEN,

    tableCols: tableColsEN,
    overviewByMicroorganism: {
        "graphTitle": "Selected Qualitative Result by Microorganisms",
        "xAxis": overviewBarGraphXAxisEN,
        "yAxis": "Food Name"
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

// names for the percentage/number views
const NumberViewFR = {};
NumberViewFR[NumberView.Number] = REMPLACER_MOI;
NumberViewFR[NumberView.Percentage] = REMPLACER_MOI;

// name of the group for 'All Microorganisms' on the microroganism tree
const allMicroorganismsFR = REMPLACER_MOI;

// Genuses used in the Denominator calculations
// Note: Copy the exact values from the [Agent] and [Genus] column in "CANLINE Micro -no... .csv"
const denomGenusesFR = [[allMicroorganismsFR, "Bacteria", "Vibrio"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Salmonella"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Escherichia"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Listeria"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Hepatovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Norovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Orthohepevirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Rotavirus"].join(PhylogeneticDelim)];

// Different options for the qualitative results
// Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
const QualitaiveResultsFR = {};
QualitaiveResultsFR[SampleState.Detected] = REMPLACER_MOI;
QualitaiveResultsFR[SampleState.NotDetected] = REMPLACER_MOI;
QualitaiveResultsFR[SampleState.NotTested] = REMPLACER_MOI;
QualitaiveResultsFR[SampleState.InConclusive] = REMPLACER_MOI;

// labels for the x-axis of the overview bar graph
const overviewBarGraphXAxisFR = {};
overviewBarGraphXAxisFR[NumberView.Number] = REMPLACER_MOI;
overviewBarGraphXAxisFR[NumberView.Percentage] = REMPLACER_MOI;

// names for the columns on the table
const tableColsFR = {};
tableColsFR[SummaryAtts.FoodName] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Microorganism] = REMPLACER_MOI;
tableColsFR[SummaryAtts.PercentDetected] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Detected] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Samples] = REMPLACER_MOI;
tableColsFR[SummaryAtts.SamplesWithConcentration] = REMPLACER_MOI;
tableColsFR[SummaryAtts.ConcentrationMean] = "Conc. Mean (cfu/g)"
tableColsFR[SummaryAtts.ConcentrationRange] = "Conc. Range (cfu/g)"

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
    "allMicroorganisms": allMicroorganismsFR,
    "nonSpeciated": REMPLACER_MOI,
    "selectAll": REMPLACER_MOI,
    "deselectAll": REMPLACER_MOI,
    "noResultsFound": `${REMPLACER_MOI_AVEC_ARGUMENTS} {0}`,
    "noData": "No Data",

    "foodGroupLabel": REMPLACER_MOI,
    "foodLabel": REMPLACER_MOI,
    "microorganismLabel": REMPLACER_MOI,

    "showResultAsLabel": REMPLACER_MOI,

    surveyTypes: SurveyTypesFR,
    dataTypes: DataTypeNamesFR,
    qualitativeResults: QualitaiveResultsFR,
    denomGenuses: denomGenusesFR,
    numberview: NumberViewFR,

    tableCols: tableColsFR,
    overviewByMicroorganism: {
        "graphTitle": REMPLACER_MOI,
        "xAxis": overviewBarGraphXAxisFR,
        "yAxis": REMPLACER_MOI
    }
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################