////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Purpose: Handles the overall backend of the website                                //
//                                                                                    //
// What it contains:                                                                  //
//      - Creates the data needed for the graphs                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////


import { DefaultPage, DefaultTabs, Tabs, Pages, TrendsOverTimeTabs, Inputs, MicroBioDataTypes, HCDataCols, PhylogeneticDelim, SurveyTypes, InputOrder, InputOrderInds, OverviewTabs } from "./constants.js"


export class Model {
    constructor() {
        this.pageName = DefaultPage;
        this.activeTabs = structuredClone(DefaultTabs);

        this.initInputs();
        this.initGroupings();
        this.initSelections();
    }

    // initInputs(): Initialize the data to hold the inputs
    initInputs() {
        this.inputs = {};
        for (const page in InputOrder) {
            this.inputs[page] = {};
            for (const tab in InputOrder[page]) {
                this.inputs[page][tab] = {};
            }
        }   
    }

    // initGroupings(): Initialize the data to hold the data structure that will optimally
    //  group the data for each tab
    initGroupings() {
        this.groupings = {};
        this.groupings[Pages.TrendsOverTime] = {};
        this.groupings[Pages.Overview] = {};
    }

    // initSelections(): Initialize the available selection options for the input filters
    initSelections() {
        this.selections = {};

        for (const page in InputOrder) {
            const pageInput = InputOrder[page];
            this.selections[page] = {};

            for (const tab in pageInput) {
                const tabInput = pageInput[tab];
                this.selections[page][tab] = {};

                for (const input of tabInput) {
                    this.selections[page][tab][input] = new Set([]);
                }
            }
        }
    }

    // getMicroorganism(dataRow): Retrieves the microorganism name
    static getMicroorganism(dataRow) {
        let result = [dataRow[HCDataCols.Agent], dataRow[HCDataCols.Genus], dataRow[HCDataCols.Species], dataRow[HCDataCols.Subspecies], 
                      dataRow[HCDataCols.Subgenotype], dataRow[HCDataCols.Serotype], dataRow[HCDataCols.OtherTyping]];

        result = result.filter((nodeName) => nodeName != "");
        return result.join(PhylogeneticDelim);
    }

    // isHC(dataRow): Determines if a data row has been surveyed by HC Targeted Surveys
    static isHC(dataRow) {
        return dataRow[HCDataCols.ProjectCode].startsWith("BMH.Surv");
    }

    // isPHAC(dataRow): Determines if a data row has been surveyed by PHAC FoodNet
    static isPHAC(dataRow) {
        return dataRow[HCDataCols.ProjectCode].startsWith("BMH.FoodNet");
    }

    // getSurveyType(dataRow): Determines where the data has been surveyed
    getSurveyType(dataRow) {
        if (Model.isHC(dataRow)) {
            return SurveyTypes.HC;
        } else if (Model.isPHAC(dataRow)) {
            return SurveyTypes.PHAC;
        }

        return "";
    }

    async load() {
        this.data = [];
        await Promise.all([this.loadHealthCanada(), this.loadCFIA()]).then(() => {
            this.dataInds = [];
            this.data.forEach((d, ind) => this.dataInds.push(ind));
        });

        console.log("DATA: ", this.data);
    }

    // loadHealthCanada(): Loads the CSV data that comes from Health Canada
    async loadHealthCanada() {
        let data = await d3.csv(`data/CANLINE Micro - no protB values- export 2022-09-14-${i18next.language}.csv`);
        for (const row of data) {
            row[HCDataCols.SurveyType] = this.getSurveyType(row);
            this.data.push(row);
        }
    }

    // loadCFIA(): Loads the CSV data that comes from CFIA
    async loadCFIA() {
        
    }

    // setupTab(page, tab): Setup the needed data for a particular tabs
    setupTab({page = null, tab = null} = {}) {
        if (page === null) {
            page = this.pageName;
        }

        if (tab === null) {
            tab = this.activeTabs[page];
        }

        if (this.groupings[page] !== undefined && this.groupings[page][tab] === undefined) {
            this.setupGrouping(page, tab);
            this.updateSelections({page, tab});
            this.setupInputs(page, tab);
        }
    }
    
    // setupGrouping(page, tab): Setup the data structure of how to optimally group the data
    //  for a particular tab
    setupGrouping(page, tab) {        
        // Trends Over Time ==> By Microorganism
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            let grouping = d3.group(this.dataInds, 
                ind => Model.getMicroorganism(this.data[ind]),
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = grouping;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            let grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => Model.getMicroorganism(this.data[ind]),
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = grouping;

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            let grouping = d3.group(this.dataInds,
                ind => Model.getMicroorganism(this.data[ind]),
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByMicroorganism] = grouping;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByFood] = grouping;

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            let grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByOrg] = grouping;
        }

        console.log(`GROUPING: ${page} ==> ${tab}: `, this.groupings);
    }

    // updateSelections(input, page, tab): Updates the available selections in the filters on the menu
    updateSelections({input = null, page = undefined, tab = undefined} = {}) {
        if (page === undefined) {
            page = this.pageName;
        }

        if (tab === undefined) {
            tab = this.activeTabs[page];
        }

        const inputOrder = InputOrder[page][tab];
        const grouping = this.groupings[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : InputOrderInds[page][tab][input];

        // clear out the selections for filter inputs that needs to be updated
        for (let i = inputInd + 1; i < inputOrder.length; ++i) {
            const currentInput = inputOrder[i];
            selections[currentInput].clear();
        }

        this._updateSelections(0, inputInd, grouping, inputOrder, selections, inputs);
        console.log(`SELECTIONS ${page} ==> ${tab}: `, this.selections);
    }

    // _updateSelections(currentInd, inputInd, grouping, inputOrder, selections, inputs): Internal function to update the selections
    //  of a certain input
    _updateSelections(currentInd, inputInd, grouping, inputOrder, selections, inputs) {
        const currentInput = inputOrder[currentInd];
        const needsSelectionUpdate = (currentInd > inputInd);
        const selection = selections[currentInput];
        const input = inputs[currentInput];

        // retrieve the new selection
        for (const [childName, child] of grouping) {
            if (!needsSelectionUpdate && !input.has(childName)) continue;

            if (needsSelectionUpdate) {
                selection.add(childName);
            }

            // update the selections for filter inputs that comes after the current input
            if (currentInd < inputOrder.length - 1) {
                this._updateSelections(currentInd + 1, inputInd, grouping.get(childName), inputOrder, selections, inputs);
            }
        }
    }

    // setupInputs(page, tab): Setup the inputs for a particular tab
    setupInputs(page, tab) {
        // Trends Over Time ==> By Microorgansim
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            let inputs = {};
            let selections = this.selections[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism];
            inputs[Inputs.MicroOrganism] = structuredClone(selections[Inputs.MicroOrganism]);
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = inputs;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            let inputs = {};
            let selections = this.selections[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood];
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.MicroOrganism] = structuredClone(selections[Inputs.MicroOrganism]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = inputs;

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            let inputs = {};
            let selections = this.selections[Pages.Overview][OverviewTabs.ByMicroorganism];
            inputs[Inputs.MicroOrganism] = structuredClone(selections[Inputs.MicroOrganism]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByMicroorganism] = inputs;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let inputs = {};
            let selections = this.selections[Pages.Overview][OverviewTabs.ByFood];
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByFood] = inputs;

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            let inputs = {};
            let selections = this.selections[Pages.Overview][OverviewTabs.ByOrg];
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByOrg] = inputs;
        }

        console.log(`INPUTS: ${page} ==> ${tab}: `, this.inputs);
    }
}