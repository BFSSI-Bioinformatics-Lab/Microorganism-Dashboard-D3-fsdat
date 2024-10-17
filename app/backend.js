////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Purpose: Handles the overall backend of the website                                //
//                                                                                    //
// What it contains:                                                                  //
//      - Creates the data needed for the graphs                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////


import { DefaultPage, DefaultTabs, Pages, TrendsOverTimeTabs, Inputs, MicroorganismNodeStates, HCDataCols, PhylogeneticDelim, SurveyTypes, InputOrder, InputOrderInds, OverviewTabs, MicroorganismNodeAtts, MicroBioDataTypes } from "./constants.js"
import { Translation, SetTools } from "./tools.js";


// MicroorganismTree: Class for the phylogenetic tree used in the microorganism's naming
export class MicroorganismTree {
    constructor() {
        this.nodeId = -1;

        // You can think of 'children' and 'parents' as the adjacency list for the tree
        // https://www.geeksforgeeks.org/adjacency-list-meaning-definition-in-dsa/
        this.children = {};
        this.parents = {};

        this.nodes = {};
        this.microorganisms = new Set();

        this.rootNodeId = this.createNode(Translation.translate("allMicroorganisms"));
    }

    // clear(): Clears out all the data in the tree
    clear() {
        this.nodeId = -1;
        this.children = {};
        this.parents = {};
        this.nodes = {};
        this.microorganisms.clear();
        this.rootNodeId = this.createNode(Translation.translate("allMicroorganisms"));
    }

    // createNode(nodeName): Creates a new node
    createNode(nodeName) {
        const result = {};
        result[MicroorganismNodeAtts.Name] = nodeName;
        this.nodeId += 1;
        this.nodes[this.nodeId] = result;
        return this.nodeId;
    }

    // getRoot(): Retrieves the root node
    getRoot() {
        return this.nodes[this.rootNodeId];
    }

    // getChildren(nodeId, createIfEmpty): Gets the children from a node
    getChildren(nodeId, createIfEmpty = false) {
        let children = this.children[nodeId];
        if (!createIfEmpty) {
            return children;
        }

        if (children === undefined) {
            children = {};
            this.children[nodeId] = children;
        }

        return children;
    }

    // addChild(parentNodeId, childNodeId): Adds a child to a parent node
    addChild(parentNodeId, childNodeId) {
        this.getChildren(parentNodeId, true);
        const childName = this.nodes[childNodeId][MicroorganismNodeAtts.Name];
        this.children[parentNodeId][childName] = childNodeId;
        this.parents[childNodeId] = parentNodeId;
    }

    // checkNode(nodeId): Checks off a node
    checkNode(nodeId) {
        const node = this.nodes[nodeId];
        let states = node[MicroorganismNodeAtts.States];
        if (states === undefined) {
            states = {};
            node[MicroorganismNodeAtts.States] = states;
        }

        states[MicroorganismNodeStates.Checked] = true;
        states[MicroorganismNodeStates.Selected] = true;
    }

    // isChecked(node): Determines whether a node is checked off
    isChecked(nodeId) {
        const node = this.nodes[nodeId];
        return (node[MicroorganismNodeAtts.States] !== undefined && 
                node[MicroorganismNodeAtts.States][MicroorganismNodeStates.Checked] !== undefined &&
                node[MicroorganismNodeAtts.States][MicroorganismNodeStates.Checked]);
    }

    // checkSubTree(nodeId): Checks off all the nodes in the subtree with the root being the current node
    checkSubTree(nodeId) {
        this.checkNode(nodeId);
        const children = this.getChildren(nodeId);
        if (children == undefined) return;

        for (const childName in children) {
            this.checkSubTree(children[childName]);
        }
    }

    // getNodeId(microorganism): Retrieves the corresponding node id based off the name 'microorganism'
    getNodeId(microorganism) {
        const allMicroorganismStr = Translation.translate("allMicroorganisms");
        const microoranismParts = microorganism.split(PhylogeneticDelim);
        let nodeId = this.rootNodeId;

        for (const part of microoranismParts) {
            if (part == allMicroorganismStr) continue;
            const children = this.getChildren(nodeId);
            nodeId = children[part];

            if (nodeId === undefined) {
                return null;
            }
        }

        return nodeId === undefined ? null : nodeId;
    }

    // addPath(namePath): Adds a microorganism's full name into the phylogenetic tree
    addPath(namePath) {
        let currentNodeId = this.rootNodeId;
        const allMicroorganismStr = Translation.translate("allMicroorganisms");

        for (const namePart of namePath) {
            if (namePart == allMicroorganismStr) continue;
            let children = this.getChildren(currentNodeId, true);
            let nextNodeId = children[namePart];

            // create the new node if does not exist
            if (nextNodeId === undefined) {
                nextNodeId = this.createNode(namePart);
                this.addChild(currentNodeId, nextNodeId);
            }

            currentNodeId = nextNodeId;
        }

        this.microorganisms.add(namePath.join(PhylogeneticDelim));
    }

    // _getLeaves(node, currentName, result): Internal function to get all the names of the microorganisms that are located at the leaves of the phylogenetic tree
    _getLeaves(nodeId, currentName, result) {
        const node = this.nodes[nodeId];
        const nodeName = node[MicroorganismNodeAtts.Name];
        currentName = currentName ? `${currentName}${PhylogeneticDelim}${nodeName}` : nodeName;
        const children = this.getChildren(nodeId);

        // add the microorganism at the leaf of the tree
        if (children === undefined) {
            result.add(currentName);
            return;
        }

        // recurse until we get to the leaves of the tree
        for (const childName in children) {
            this._getLeaves(children[childName], currentName, result);
        }
    }

    // getLeaves(): Retrieves the names of all the micororganisms that are located at the leaves of the phylogenetic tree
    getLeaves() {
        const result = new Set();
        this._getLeaves(this.rootNodeId, "", result);    
        return result;
    }

    // checkMicroorganisms(microorganisms): Checks off all the corresponding nodes to the given microorganisms
    checkMicroorganisms(microorganisms) {
        // check all microorganism nodes and their children
        const microorganismNodeIds = [];
        for (const microorganism of microorganisms) {
            const nodeId = this.getNodeId(microorganism);
            microorganismNodeIds.push(nodeId);
            this.checkSubTree(nodeId);
        }

        // check the parent nodes of the microorganism if all the children of the parent are checked
        for (const nodeId of microorganismNodeIds) {
            let parentId = this.parents[nodeId];
            while(parentId !== undefined) {
                let childrenIds = Object.values(this.getChildren(parentId));

                let checkedChildrenIds = childrenIds.filter((childId) => {
                    let states = this.nodes[childId][MicroorganismNodeAtts.States];
                    return (states !== undefined && states[MicroorganismNodeStates.Checked]);
                });

                if (checkedChildrenIds.length == childrenIds.length) {
                    this.checkNode(parentId);
                }

                parentId = this.parents[parentId];
            }
        }
    }

    // addNonSpeciated(): Adds the non speciated nodes to phylogenetic tree
    addNonSpeciated() {
        const nonSpeciatedStr = Translation.translate("nonSpeciated");
        const leafMicroorganisms = this.getLeaves();
        const nonSpeciated = SetTools.difference(this.microorganisms, leafMicroorganisms, true);
        
        const nonSpeciatedDict = {};
        for (const microorganism of nonSpeciated) {
            nonSpeciatedDict[microorganism] = `${microorganism}${PhylogeneticDelim}${nonSpeciatedStr}`;
        }

        // add the non speciated microorganisms into the tree
        for (const miccroorganism in nonSpeciatedDict) {
            const nodeId = this.getNodeId(miccroorganism);
            const nonSpeciatedNodeId = this.createNode(nonSpeciatedStr);
            this.addChild(nodeId, nonSpeciatedNodeId);
        }
    }

    // _toTreeSelectData(nodeId, result): Internal function to transform the tree nodes into
    //  nodes needed by the Bootstrap treeview library
    _toTreeSelectData(nodeId, result) {
        const node = this.nodes[nodeId];
        const treeSelectNode = structuredClone(node);

        const children = this.getChildren(nodeId);
        if (children !== undefined) {
            const treeSelectNodeChildren = [];
            for (const childName in children) {
                this._toTreeSelectData(children[childName], treeSelectNodeChildren);
            }

            treeSelectNode[MicroorganismNodeAtts.Nodes] = treeSelectNodeChildren;
        }

        result.push(treeSelectNode);
    }

    // toTreeSelectData(): Transforms the tree into the structure needed by
    //  Bootstrap's treeview library
    //
    // Reference: https://github.com/jonmiles/bootstrap-treeview
    toTreeSelectData() {
        const result = [];
        this._toTreeSelectData(this.rootNodeId, result);
        return result;
    }
}


// Model: The class for the overall backend of the app
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
        this.microorganismTrees = {};

        for (const page in InputOrder) {
            this.inputs[page] = {};
            this.microorganismTrees[page] = {};

            for (const tab in InputOrder[page]) {
                this.inputs[page][tab] = {};
                this.microorganismTrees[page][tab] = new MicroorganismTree();
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
    getMicroorganism(dataRow) {
        let result = [dataRow[HCDataCols.Agent], dataRow[HCDataCols.Genus], dataRow[HCDataCols.Species], dataRow[HCDataCols.Subspecies], 
                      dataRow[HCDataCols.Subgenotype], dataRow[HCDataCols.Serotype], dataRow[HCDataCols.OtherTyping]];

        result = result.filter((nodeName) => nodeName != "");
        result.unshift(Translation.translate("allMicroorganisms"));
        result = result.join(PhylogeneticDelim);
        return result;
    }

    // isHC(dataRow): Determines if a data row has been surveyed by HC Targeted Surveys
    static isHC(dataRow) {
        return dataRow[HCDataCols.ProjectCode].startsWith("BMH.Surv");
    }

    // isPHAC(dataRow): Determines if a data row has been surveyed by PHAC FoodNet
    static isPHAC(dataRow) {
        return dataRow[HCDataCols.ProjectCode].startsWith("BMH.FoodNet");
    }

    // getTabbedElement(att, page, tab): Retrieves the element for partitioned by tabs
    getTabbedElement(obj, page, tab) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;
        return obj[page][tab];
    }

    getSelection({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.selections, page, tab); }
    getInputs({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.inputs, page, tab); }
    getInputOrderInds({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(InputOrderInds, page, tab); }
    getMicroOrganismTree({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.microorganismTrees, page, tab); }
    getActiveTab(page) { return this.activeTabs[page === undefined ? this.pageName : page]; };

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
        let setupDone = false;
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
            setupDone = true;
        }

        return setupDone;
    }
    
    // setupGrouping(page, tab): Setup the data structure of how to optimally group the data
    //  for a particular tab
    setupGrouping(page, tab) {
        let grouping = null;
        
        // Trends Over Time ==> By Microorganism
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            grouping = d3.group(this.dataInds, 
                ind => this.data[ind][HCDataCols.SurveyType],
                ind => this.getMicroorganism(this.data[ind]),
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName]);
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = grouping;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.SurveyType],
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.getMicroorganism(this.data[ind]));
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = grouping;

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            grouping = d3.group(this.dataInds,
                ind => this.getMicroorganism(this.data[ind]),
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByMicroorganism] = grouping;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByFood] = grouping;

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            grouping = d3.group(this.dataInds,
                ind => this.data[ind][HCDataCols.SurveyType]);
            this.groupings[Pages.Overview][OverviewTabs.ByOrg] = grouping;
        }
    }

    // updateSelections(input, page, tab): Updates the available selections in the filters on the menu
    updateSelections({input = null, page = undefined, tab = undefined} = {}) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;

        const inputOrder = InputOrder[page][tab];
        const grouping = this.groupings[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : InputOrderInds[page][tab][input];

        if (inputInd == undefined) return;

        // clear out the selections for filter inputs that needs to be updated
        for (let i = inputInd + 1; i < inputOrder.length; ++i) {
            const currentInput = inputOrder[i];
            selections[currentInput].clear();
        }

        this._updateSelections(0, inputInd, grouping, inputOrder, selections, inputs);

        // update the inputs for the updated selections
        for (let i = inputInd + 1; i < inputOrder.length; ++i) {
            const currentInput = inputOrder[i];
            inputs[currentInput] = structuredClone(selections[currentInput]);
        }
        
        // update the microorganism tree
        if (inputOrder.includes(Inputs.MicroOrganism) && InputOrderInds[page][tab][Inputs.MicroOrganism] > inputInd) {
            this.updateMicroorganismTree({page, tab});
        }
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
            inputs[Inputs.DataType] = MicroBioDataTypes.PresenceAbsence;
            inputs[Inputs.MicroOrganism] = structuredClone(selections[Inputs.MicroOrganism]);
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = inputs;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            let inputs = {};
            let selections = this.selections[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood];
            inputs[Inputs.DataType] = MicroBioDataTypes.PresenceAbsence;
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
    }


    updateMicroorganismTree({page = undefined, tab = undefined} = {}) {
        if (page === undefined) {
            page = this.pageName;
        }

        if (tab === undefined) {
            tab = this.activeTabs[page];
        }

        let selections = this.selections[page][tab][Inputs.MicroOrganism];
        if (selections === undefined) return;

        let inputs = this.inputs[page][tab][Inputs.MicroOrganism];
        const microorganismTree = this.microorganismTrees[page][tab];
        microorganismTree.clear();
        
        // construct the new microorganism tree
        for (const microorganism of selections) {
            const microoranismParts = microorganism.split(PhylogeneticDelim);
            microorganismTree.addPath(microoranismParts);
        }

        // add the non speciated microorganisms into the tree
        microorganismTree.addNonSpeciated();

        // check off which microorganisms are selected in the tree
        microorganismTree.checkMicroorganisms(inputs);
    }
}