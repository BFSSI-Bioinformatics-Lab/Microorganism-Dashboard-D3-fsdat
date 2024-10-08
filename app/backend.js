////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Purpose: Handles the overall backend of the website                                //
//                                                                                    //
// What it contains:                                                                  //
//      - Creates the data needed for the graphs                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////


import { DefaultPage, DefaultTabs, Tabs, Pages, TrendsOverTimeTabs, Inputs, MicroBioDataTypes, DefaultSurveyTypes } from "./constants.js"


export class Model {
    constructor() {
        this.pageName = DefaultPage;
        this.activeTabs = JSON.parse(JSON.stringify(DefaultTabs)); // get a deepcopy of the default tabs
    }

    async init() {
        await this.load();
    }

    async load() {
        this.data = [];
        await Promise.all([this.loadHealthCanada(), this.loadCFIA()]);
        console.log("DATA: ", this.data);
    }

    async loadHealthCanada() {
        let data = await d3.csv(`data/CANLINE Micro - no protB values- export 2022-09-14-${i18next.language}.csv`);
        for (const row of data) {
            this.data.push(row);
        }
    }

    async loadCFIA() {

    }

    // setupInputs(): Setup the default inputs for each tab when the app first loads
    setupInputs() {
        // saved inputs for each tab
        this.inputs = {};
        for (const page in Tabs) {
            this.inputs[page] = {};
            for (const tab in Tabs[page]) {
                this.inputs[Tabs[page][tab]] = {};
            }
        }

        // Trends Over Time ==> By Microorganism
        let inputs = {};

        // Trends Over TIme
    }
}