////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Purpose: Handles the overall backend of the website                                //
//                                                                                    //
// What it contains:                                                                  //
//      - Creates the data needed for the graphs                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////


import { DefaultPage, DefaultTabs, Pages, TrendsOverTimeTabs, Inputs, HCDataCols, PhylogeneticDelim, SurveyTypes, InputOrder, InputOrderInds, OverviewTabs, MicroBioDataTypes, QuantitativeOps, GroupNames, SampleState } from "./constants.js"
import { Translation, SetTools, MapTools, TableTools } from "./tools.js";


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
    //
    // Note: A node contains the following structure:
    //
    // {
    //   text: str,
    //   state: {
    //         checked: bool,
    //         selected: bool
    //   }
    // }
    //
    // The naming the node attributes and states of the nodes above are based off Bootstrap's treeview library
    //  https://github.com/jonmiles/bootstrap-treeviesw
    createNode(nodeName) {
        const result = {};
        result.text = nodeName;
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
        const childName = this.nodes[childNodeId].text;
        this.children[parentNodeId][childName] = childNodeId;
        this.parents[childNodeId] = parentNodeId;
    }

    // checkNode(nodeId): Checks off a node
    checkNode(nodeId) {
        const node = this.nodes[nodeId];
        let states = node.state;
        if (states === undefined) {
            states = {};
            node.state = states;
        }

        states.checked  = true;
        states.selected = true;
    }

    // uncheckNode(nodeId): Unchecks a node
    uncheckNode(nodeId) {
        const node = this.nodes[nodeId];
        let states = node.state;
        if (states !== undefined) {
            states.checked = false;
            states.selected = false;
        }
    }

    // expandNode(nodeId): Displays the children nodes of the node
    expandNode(nodeId) {
        const node = this.nodes[nodeId];
        let states = node.state;
        if (states === undefined) {
            states = {};
            node.state = states;
        }

        states.expanded = true;
    }

    // isChecked(node): Determines whether a node is checked off
    isChecked(nodeId) {
        const node = this.nodes[nodeId];
        return (node.state !== undefined && 
                node.state.checked !== undefined &&
                node.state.checked);
    }

    // checkSubTree(nodeId): Checks/unchecks all the nodes in the subtree with the root being the current node
    checkOffSubTree(nodeId, checkFunc) {
        checkFunc(nodeId);
        const children = this.getChildren(nodeId);
        if (children == undefined) return;

        for (const childName in children) {
            this.checkOffSubTree(children[childName], checkFunc);
        }
    }

    // checkSubTree(nodeId): Checks all the nodes in the subtree with the root being the current node
    checkSubTree(nodeId) {
        this.checkOffSubTree(nodeId, (nodeId) => this.checkNode(nodeId));
    }

    // uncheckSubTree(nodeId): Unchecks all the nodes in the subtree with the root being the current node
    uncheckSubTree(nodeId) {
        this.checkOffSubTree(nodeId, (nodeId) => this.uncheckNode(nodeId));
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
    
    // getFullName(nodeId): Retrieves the full name of a microorganism
    getFullName(nodeId) {
        let node = this.nodes[nodeId];
        if (node === undefined) return undefined;

        let result = node.text;
        let parentId = this.parents[nodeId];

        while (parentId !== undefined) {
            const parent = this.nodes[parentId];
            result = `${parent.text}${PhylogeneticDelim}${result}`;
            
            node = parent;
            nodeId = parentId;
            parentId = this.parents[nodeId];
        }

        return result;
    }

    // _getLeaves(node, currentName, result): Internal function to get all the names of the microorganisms that are located at the leaves of the phylogenetic tree
    _getLeaves(nodeId, currentName, result) {
        const node = this.nodes[nodeId];
        const nodeName = node.text;
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
    getLeaves(nodeId = undefined) {
        const result = new Set();
        let namePrefix = "";

        if (nodeId === undefined) {
            nodeId = this.rootNodeId;
        } else {
            const node = this.nodes[nodeId];
            if (node === undefined) return result;
            namePrefix = this.getFullName(nodeId);
        }

        this._getLeaves(this.rootNodeId, namePrefix, result);
        return result;
    }

    // checkOffMicroorganisms(microorganisms, checkSubTreeFunc, checkNodeFunc, isCheckedFunc, allChildrenCheckedFunc):
    //  Checks/unchecks all the corresponding nodes to the given microorganisms
    checkOffMicroorganisms(microorganisms, checkSubTreeFunc, checkNodeFunc, isCheckedFunc, allChildrenCheckedFunc) {
        // check all microorganism nodes and their children
        const microorganismNodeIds = [];
        for (const microorganism of microorganisms) {
            let nodeId = this.getNodeId(microorganism);
            const children = this.getChildren(nodeId);

            if (children !== undefined) {
                nodeId = children[Translation.translate("nonSpeciated")];
            }

            microorganismNodeIds.push(nodeId);
            checkSubTreeFunc(nodeId);
        }

        // check the parent nodes of the microorganism if all the children of the parent are checked
        for (const nodeId of microorganismNodeIds) {
            let parentId = this.parents[nodeId];
            while(parentId !== undefined) {
                let childrenIds = Object.values(this.getChildren(parentId));
                let checkedChildrenIds = childrenIds.filter((childId) => isCheckedFunc(childId));

                if (allChildrenCheckedFunc(childrenIds, checkedChildrenIds)) {
                    checkNodeFunc(parentId);
                }

                parentId = this.parents[parentId];
            }
        }
    }

    // checkMicroorganisms(microorganisms): Checks off all the corresponding nodes to the given microorganisms
    checkMicroorganisms(microorganisms) {
        if (microorganisms === undefined) {
            microorganisms = this.microorganisms;
        }

        this.checkOffMicroorganisms(microorganisms, 
                                    (nodeId) => this.checkSubTree(nodeId), 
                                    (nodeId) => this.checkNode(nodeId), 
                                    (nodeId) => this.isChecked(nodeId), 
                                    (childrenIds, checkedChildrenIds) => checkedChildrenIds.length == childrenIds.length);
    }

    // uncheckMicroorganisms(microorganisms): Unchecks all the corresponding nodes to the given microroganisms
    uncheckMicroorganisms(microorganisms) {
        if (microorganisms === undefined) {
            microorganisms = this.microorganisms;
        }

        this.checkOffMicroorganisms(microorganisms, 
                                    (nodeId) => this.uncheckSubTree(nodeId), 
                                    (nodeId) => this.uncheckNode(nodeId), 
                                    (nodeId) => !this.isChecked(nodeId),    
                                    (childrenIds, checkedChildrenIds) => checkedChildrenIds.length > 0);
    }

    // _minimalExpand(nodeId): internal function for the 'minimalExpand' method
    _minimalExpand(nodeId) {
        const children = this.getChildren(nodeId);
        if (children === undefined) {
            return this.isChecked(nodeId);
        }

        const directChildrenIds = Object.values(this.getChildren(nodeId));
        const checkedDirectChildrenIds = directChildrenIds.filter((childId) => this.isChecked(childId));
        let hasCheckedChildren = false;

        // check if the node has any children checked
        for (const childId of directChildrenIds) {
            const subTreeHasChildren = this._minimalExpand(childId);
            if (!hasCheckedChildren && subTreeHasChildren) {
                hasCheckedChildren = true;
            }
        }

        // expand the node if it has a checked children in its subtree and not all its direct children are checked
        if (hasCheckedChildren && directChildrenIds.length > checkedDirectChildrenIds.length) {
            this.expandNode(nodeId);
        }

        return hasCheckedChildren;
    }

    // minimalExpand(): Shows the nodes in the tree such that only the deepest node with all its children selected and the
    //  ancestors of this node will be shown
    //
    // eg. For the tree below:
    //
    // root --+--> child1
    //        |
    //        +--> child2 --+--> grandchild1 --> greatgrandchild1
    //                      |
    //                      +--> grandchild2  
    //
    // - if all nodes are checked, 
    //      then only the node 'root' is shown
    // - if the all nodes except for 'root' and 'child1' are checked, 
    //      then 'root', 'child1' AND 'child2' are shown
    // - if 'grandchild1' and 'greatgrandchild1' are checked, 
    //      then 'root', 'child1', 'child2', 'grandchild1' are shown
    //
    // assume: - if a parent node is checked, all its children are checked
    //         - if all children nodes are checked, then the parent node is also checked
    minimalExpand() {
        this._minimalExpand(this.rootNodeId);
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
        let microorganismCount = 0;

        const children = this.getChildren(nodeId);
        if (children !== undefined) {
            const treeSelectNodeChildren = [];
            for (const childName in children) {
                microorganismCount += this._toTreeSelectData(children[childName], treeSelectNodeChildren);
            }

            treeSelectNode.nodes = treeSelectNodeChildren;
            treeSelectNode.tags = [`${microorganismCount}`];
        }

        result.push(treeSelectNode);

        if (children === undefined) {
            return 1;
        }

        return microorganismCount;
    }

    // toTreeSelectData(): Transforms the tree into the structure needed by
    //  Bootstrap's treeview library
    //
    // Reference: https://github.com/jonmiles/bootstrap-treeview
    toTreeSelectData() {
        const result = [];
        if (this.microorganisms.size > 0) {
            this._toTreeSelectData(this.rootNodeId, result);
        }

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
        this.summaryData = {};
        this.visualData = {};

        for (const page in InputOrder) {
            this.inputs[page] = {};
            this.microorganismTrees[page] = {};
            this.summaryData = {};
            this.visualData[page] = {};

            for (const tab in InputOrder[page]) {
                this.inputs[page][tab] = {};
                this.microorganismTrees[page][tab] = new MicroorganismTree();
                this.summaryData[page][tab] = {};
                this.visualData[page][tab] = {};
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

    getGrouping({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.groupings, page, tab); }
    getSelection({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.selections, page, tab); }
    getDatResults({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.visualData, page, tab); }
    getInputs({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.inputs, page, tab); }
    getInputOrderInds({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(InputOrderInds, page, tab); }
    getInputOrder({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(InputOrder, page, tab); }
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

    // cleanTxt(txt): Normalizes the text
    static cleanTxt(txt) {
        return txt.trim().toLowerCase();
    }

    // getSampleState(sampleRowInds): Retrieves the state of the sample
    //
    // Note:
    //  'Detected' is determined by: 
    //      - if a single row in the sample has its [Qualitative Result] column saying "Detected" OR
    //      - a single row in the sample has the [Qualitative Result] column is empty AND the [Quantitative Result] column 
    //            is a positive number AND [Quantitative Operator] is one of {>, =, ~, >=}
    //
    // 'Not Tested' is determined by:
    //      - if all the rows in the sample have the [Qualitative Result] column saying "Not Tested"
    //
    // For everything else, a sample is considered 'Not Detected'
    getSampleState(sampleRowInds) {
        let result = SampleState.NotTested;

        for (const ind of sampleRowInds) {
            const row = this.data[ind];
            const qualitative = Model.cleanTxt(row[HCDataCols.QualitativeResult]);
            const quantitative = row[HCDataCols.QualitativeResult];
            const qualitativeIsEmpty = qualitative === "";
            const quantitativeIsEmpty = isNaN(quantitative);

            if (!qualitativeIsEmpty && qualitative == Translation.translate("qualitativeResults.Detected")) {
                return SampleState.Detected;
            } else if (!qualitativeIsEmpty && result == SampleState.NotTested && qualitative != Translation.translate("qualitativeResults.NotTested")) {
                result = SampleState.NotDetected;
            }

            const quantitativeOp = Model.cleanTxt(row[HCDataCols.QuantitativeOperator]);

            if (qualitativeIsEmpty && !quantitativeIsEmpty && 
                (quantitative > 0 || quantitativeOp == QuantitativeOps.Gt || quantitativeOp == QuantitativeOps.Eq || 
                 quantitativeOp == QuantitativeOps.Approx || quantitativeOp == QuantitativeOps.Ge)) {
                return SampleState.Detected;

            } else if (qualitativeIsEmpty && result == SampleState.NotTested) {
                result = SampleState.NotDetected;
            }
        }

        return result;
    }

    // isGraphed(sampleRows): Determines whether the data should be displayed on the graph
    isGraphed(sampleRowInds) {
        let isBlank = true;

        // check if all the sample rows are blank
        for (const ind of sampleRowInds) {
            const row = this.data[ind];
            const qualitative = Model.cleanTxt(row[HCDataCols.QualitativeResult]);

            // check if one of the rows have the "inconclusive" qualitative result
            if (qualitative == Translation.translate("qualitativeResults.Inconclusive")) {
                return false;
            }

            if (qualitative !== "" && isBlank) {
                isBlank = false;
            }
        }

        return !isBlank;
    }

    async load() {
        this.data = [];
        this.samples = {};

        await Promise.all([this.loadHealthCanada(), this.loadCFIA()]).then(() => {
            this.dataInds = [];

            this.data.forEach((row, ind) => {
                this.dataInds.push(ind);
            });

            this.samples = this.createSampleObjs(this.dataInds);
        });
    }

    // loadHealthCanada(): Loads the CSV data that comes from Health Canada
    async loadHealthCanada() {
        let data = await d3.csv(`data/CANLINE Micro - no protB values- export 2022-09-14-${i18next.language}.csv`);
        for (const row of data) {
            row[HCDataCols.SurveyType] = this.getSurveyType(row);
            row[HCDataCols.QuantitativeResult] = parseFloat(row[HCDataCols.QuantitativeResult]);
            row[HCDataCols.Microorganism] = this.getMicroorganism(row);
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
            this.setupSelections(page, tab);
            this.setupInputs(page, tab);
            this.updateVisualData({page, tab});
            setupDone = true;
        }

        console.log("GROUPING: ", this.groupings);
        console.log("INPUTS: ", this.inputs);
        console.log("SELECTIONS: ", this.selections);

        return setupDone;
    }

    // updateTab(input, page, tab): Updates the data for the tabs
    updateTab({input = null, page = undefined, tab = undefined} = {}) {
        this.updateSelections({input, page, tab});
        this.updateInputs({input, page, tab});
        this.updateVisualData({page, tab});
    }
    
    // setupGrouping(page, tab): Setup the data structure of how to optimally group the data
    //  for a particular tab
    setupGrouping(page, tab) {
        let grouping = null;
        
        // Trends Over Time ==> By Microorganism
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            let presenceGrouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.SurveyType],
                ind => this.data[ind][HCDataCols.Microorganism],
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName]
            ]);
            
            // TODO: complete logic for grouping concentration
            let concentrationGrouping = {};

            grouping = {};
            grouping[MicroBioDataTypes.PresenceAbsence] = presenceGrouping;
            grouping[MicroBioDataTypes.Concentration] = concentrationGrouping;
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = grouping;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            let presenceGrouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.SurveyType],
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.Microorganism]
            ]);
            
            // TODO: complete logic for grouping concentration
            let concentrationGrouping = {};

            grouping = {};
            grouping[MicroBioDataTypes.PresenceAbsence] = presenceGrouping;
            grouping[MicroBioDataTypes.Concentration] = concentrationGrouping;
            this.groupings[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = grouping;

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.Microorganism],
                ind => this.data[ind][HCDataCols.SurveyType] 
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByMicroorganism] = grouping;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.SurveyType]
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByFood] = grouping;

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.SurveyType]
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByOrg] = grouping;
        }
    }

    // setupSelections(page, tab): Initializes the selections when a tab first loads
    setupSelections(page, tab) {
        this.updateSelections({page, tab});

        // Trends Over Time ==> By Microorgansim
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            let selections = this.selections[page][tab];
            selections[Inputs.FoodGroup] = new Set();
            selections[Inputs.Food] = new Set();

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            let selections = this.selections[page][tab];
            selections[Inputs.SurveyType] = new Set();
        }
    }

    // updateSelections(input, page, tab): Updates the available selections in the filters on the menu
    updateSelections({input = null, page = undefined, tab = undefined} = {}) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;

        const inputOrder = InputOrder[page][tab];
        const inputOrderInds = InputOrderInds[page][tab];
        const grouping = this.groupings[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : inputOrderInds[input];

        if (inputInd == undefined) return;

        // clear out the selections for filter inputs that needs to be updated
        for (let i = inputInd + 1; i < inputOrder.length; ++i) {
            const currentInput = inputOrder[i];
            selections[currentInput].clear();
        }

        this._updateSelections(0, inputInd, grouping, inputOrder, selections, inputs);
        
        // update the microorganism tree
        if (inputOrder.includes(Inputs.MicroOrganism) && inputOrderInds[Inputs.MicroOrganism] > inputInd) {
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
        for (const childName in grouping) {
            const hasChild = (input !== undefined && input.has(childName));
            if (!needsSelectionUpdate && !hasChild) continue;

            if (needsSelectionUpdate) {
                selection.add(childName);
            }

            // update the selections for filter inputs that comes after the current input
            if (currentInd < inputOrder.length - 1 && (input === undefined || hasChild)) {
                this._updateSelections(currentInd + 1, inputInd, grouping[childName], inputOrder, selections, inputs);
            }
        }
    }

    // setupInputs(page, tab): setup the inputs for a particular tab
    setupInputs(page, tab) {
        let inputs = {};

        // Trends Over Time ==> By Microorgansim
        if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByMicroorganism) {
            let selections = this.selections[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism];
            inputs[Inputs.DataType] = new Set([MicroBioDataTypes.PresenceAbsence]);
            inputs[Inputs.MicroOrganism] = new Set();
            inputs[Inputs.FoodGroup] = new Set();
            inputs[Inputs.Food] = new Set();
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = inputs;

        // Trends Over Time ==> By Food
        } else if (page == Pages.TrendsOverTime && tab == TrendsOverTimeTabs.ByFood) {
            let selections = this.selections[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood];
            inputs[Inputs.DataType] = new Set([MicroBioDataTypes.PresenceAbsence]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.MicroOrganism] = new Set();
            this.inputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = inputs;

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            let selections = this.selections[Pages.Overview][OverviewTabs.ByMicroorganism];
            inputs[Inputs.MicroOrganism] = new Set();
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByMicroorganism] = inputs;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let selections = this.selections[Pages.Overview][OverviewTabs.ByFood];
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByFood] = inputs;

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            let selections = this.selections[Pages.Overview][OverviewTabs.ByOrg];
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            this.inputs[Pages.Overview][OverviewTabs.ByOrg] = inputs;
        }
    }

    // updateInputs(input, page, tab): Updates other inputs that depend on the inputs that the user has selected
    updateInputs({input = null, page = undefined, tab = undefined} = {}) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;

        const inputOrder = InputOrder[page][tab];
        const inputOrderInds = InputOrderInds[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : inputOrderInds[input];
        const microorganismInputInd = (inputOrderInds[Inputs.MicroOrganism] === undefined) ? -1 : inputOrderInds[Inputs.MicroOrganism];

        if (inputInd == undefined) return;

        // update the inputs where their corresponding selections have been updated
        for (let i = inputInd + 1; i < inputOrder.length; ++i) {
            const currentInput = inputOrder[i];
            inputs[currentInput] = SetTools.intersection(inputs[currentInput], selections[currentInput]);

            // update the microorganism tree
            if (microorganismInputInd == i) {
                const tree = this.getMicroOrganismTree({page, tab});
                tree.checkMicroorganisms(inputs[currentInput]);
                tree.minimalExpand();
            }
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

        const microorganismTree = this.microorganismTrees[page][tab];
        microorganismTree.clear();

        // construct the new microorganism tree
        for (const microorganism of selections) {
            const microoranismParts = microorganism.split(PhylogeneticDelim);
            microorganismTree.addPath(microoranismParts);
        }

        // add the non speciated microorganisms into the tree
        microorganismTree.addNonSpeciated();
    }

    // _getFilteredData(inputOrderInd, inputOrder, inputs, result, grouping): Internal function
    //  to get all the rows based off the selected filters
    _getFilteredData(inputOrderInd, inputOrder, inputs, result, grouping) {
        // get the sample from the grouping
        if (inputOrderInd >= inputOrder.length) {
            for (const sampleId in grouping) {
                if (result[sampleId !== undefined]) continue;
                result[sampleId] = grouping[sampleId];
            }
            return
        }

        const input = inputOrder[inputOrderInd];
        const currentInputs = inputs[input];

        for (const currentInput of currentInputs) {
            const newGrouping = grouping[currentInput];
            if (newGrouping === undefined) {
                continue;
            }

            this._getFilteredData(inputOrderInd + 1, inputOrder, inputs, result, newGrouping);
        }
    }

    // getFilteredData(page, tab): Retrieves the filtered data rows based off the user selected filters
    getFilteredData({page = undefined, tab = undefined} = {}) {
        if (page === undefined) {
            page = this.pageName;
        }

        if (tab === undefined) {
            tab = this.activeTabs[page];
        }

        const result = {};
        const inputOrder = InputOrder[page][tab];
        const inputs = this.inputs[page][tab];
        const grouping = this.groupings[page][tab];
        this._getFilteredData(0, inputOrder, inputs, result, grouping);
        
        return result;
    }

    // createSampleObj(sampleRowInds): Creates the object to hold aggregate data about a sample
    //
    // Note: The object contains the following structure:
    //
    // {
    //   states: Dict[str, SampleState]  --> by microorganism
    //   detected: Set[str] --> of microorganisms
    //   notTested: Set[str] --> of microorganisms
    //   data: List[int]
    // }
    createSampleObj(sampleRowInds) {
        const result = {};
        result.data = sampleRowInds
        result.states = {};
        result.detected = new Set();
        result.notTested = new Set();

        const ByMicroorganism = MapTools.toDict(d3.group(sampleRowInds, ind => this.data[ind][HCDataCols.Microorganism]));

        // retrieve the states (detected, not detected, not tested) of each microorganism
        for (const microorganism in ByMicroorganism) {
            const sampleMicroorganismRowInds = ByMicroorganism[microorganism];
            const sampleMicroorganismState = this.getSampleState(sampleMicroorganismRowInds);

            result.states[microorganism] = sampleMicroorganismState;
            if (sampleMicroorganismState == SampleState.Detected) {
                result.detected.add(microorganism);
            }

            if (sampleMicroorganismState == SampleState.NotTested) {
                result.notTested.add(microorganism);
            }
        }

        //result.graphed = this.isGraphed(sampleRowInds);
        return result;
    }

    // createSampleObjs(grouping): Creates the aggregates for each microorganism sample
    createSampleObjs(dataRowInds) {
        const samples = MapTools.toDict(d3.group(dataRowInds, ind => this.data[ind][GroupNames.SampleCode]));
        for (const sampleName in samples) {
            const sampleObj = this.createSampleObj(samples[sampleName]);
            samples[sampleName] = sampleObj;
        }

        return samples;
    }

    getSummaryData() {
        
    }

    // updateVisualData(page, tab): Gets the updated data needed for the graphs/tables
    updateVisualData({page = undefined, tab = undefined} = {}) {
        if (page === undefined) {
            page = this.pageName;
        }

        if (tab === undefined) {
            tab = this.activeTabs[page];
        }

        let samples = this.getFilteredData({page, tab});

        console.log("FILTERED SAMPLES: ", samples);

        /*
        samples = this.createSampleObjs(samples);
        samples = TableTools.groupAggregates(samples, (aggregate) => aggregate.data, [
            (ind) => this.data[ind][HCDataCols.SurveyType],
            (ind) => this.data[ind][HCDataCols.FoodName],
            (ind) => this.data[ind][HCDataCols.Microorganism]
        ]);

        console.log("SAMPLES: ", samples);

        this.visualData[page][tab] = {data: samples};*/
    }

    // clear(): Clears all the saved data in the backend
    // Note:
    //  This function is mostly used when changing between languages since the program needs
    //      to load in new data specific for the language
    clear() {
        this.initInputs();
        this.initGroupings();
        this.initSelections();
    }
}