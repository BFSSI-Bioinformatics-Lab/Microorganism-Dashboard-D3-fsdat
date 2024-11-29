////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// Purpose: Handles the overall backend of the website                                //
//                                                                                    //
// What it contains:                                                                  //
//      - Creates the data needed for the graphs                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////


import { DefaultPage, DefaultTabs, Pages, TrendsOverTimeTabs, Inputs, HCDataCols, PhylogeneticDelim, SurveyTypes } from "./constants.js"
import { FilterOrder, FilterOrderInds, OverviewTabs, MicroBioDataTypes, QuantitativeOps, GroupNames, SampleState } from "./constants.js"
import { SummaryAtts, NumberView, TimeZone, TabInputs, TablePhylogenticDelim, ModelTimeZone } from "./constants.js"
import { Translation, SetTools, MapTools, TableTools, NumberTools, Range, DateTimeTools } from "./tools.js";


// MicroorganismTree: Class for the phylogenetic tree used in the microorganism's naming
//
// Attributes
// ----------
// nodeId: int
//    The current id used for a new node
//
// children: Dict[int, Dict[str, int]]
//    The adjacency list for all the children in the tree. 
//    Outer key is id of node, inner key is name of  child, inner value is id of child.
//
// parents: Dict[int, int]
//    The parents of a node. Key is id of node, value is id of parent.
//
// microorganisms: Set[str]
//    Name of all the microorganisms found in the tree
//
// genuses: Dict[str, str]
//    Names of the genuses for a microrganism. Key are microorganisms and values are genuses
//
// rootNodeId: int
//    id of the root node
export class MicroorganismTree {
    constructor() {
        this.nodeId = -1;

        // You can think of 'children' and 'parents' as the adjacency list for the tree
        // https://www.geeksforgeeks.org/adjacency-list-meaning-definition-in-dsa/
        this.children = {};
        this.parents = {};

        this.nodes = {};
        this.microorganisms = new Set();
        this.genuses = {};

        this.rootNodeId = this.createNode(Translation.translate("allMicroorganisms"));
    }

    // clear(): Clears out all the data in the tree
    clear() {
        this.nodeId = -1;
        this.children = {};
        this.parents = {};
        this.nodes = {};
        this.microorganisms.clear();
        this.genuses = {};
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

        const microorganismName = namePath.join(PhylogeneticDelim);
        this.microorganisms.add(microorganismName);

        if (namePath.length >= 3) {
            this.genuses[microorganismName] = namePath.slice(0, 3).join(PhylogeneticDelim);
        }
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
        const nonSpeciated = SetTools.difference([this.microorganisms, leafMicroorganisms], true);
        
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

// Sample: Class for a unique sample
//
// Attributes
// ----------
// states: Dict[str, SampleState]
//    The state of each microorganism for the sample
//
// detected: Set[str]
//    The microorganisms for the sample that are considered as detected
//
// notTested: Set[str]
//    The microorganisms for the sample that are considered as not tested
//
// data: List[int]
//    The rows (trials) for each sample
//
// surveyTypes: Set[str]
//    The survey types that this sample belongs to
//
// sampleDate: Range[Moment]
//    The range of dates when this sample was collected/sampled
export class Sample {
    constructor(model, sampleRowInds) {
        this.data = sampleRowInds
        this.states = {};
        this.detected = new Set();
        this.notTested = new Set();

        const BySurveyType = MapTools.toDict(d3.group(sampleRowInds, ind => model.data[ind][HCDataCols.SurveyType]));
        this.surveyTypes = new Set(Object.keys(BySurveyType));

        const ByMicroorganism = MapTools.toDict(d3.group(sampleRowInds, ind => model.data[ind][HCDataCols.Microorganism]));

        // retrieve the states (detected, not detected, not tested) of each microorganism
        for (const microorganism in ByMicroorganism) {
            const sampleMicroorganismRowInds = ByMicroorganism[microorganism];
            const sampleMicroorganismState = model.getSampleState(sampleMicroorganismRowInds);

            this.states[microorganism] = sampleMicroorganismState;
            if (sampleMicroorganismState == SampleState.Detected) {
                this.detected.add(microorganism);
            }

            if (sampleMicroorganismState == SampleState.NotTested) {
                this.notTested.add(microorganism);
            }
        }

        // get the range of dates when the data was sampled
        const sampleDates = [];
        this.data.forEach((rowInd) => sampleDates.push(model.data[rowInd][HCDataCols.SampleDate]));
        const minDate = moment.min(sampleDates);
        const maxDate = moment.max(sampleDates);
        this.sampleDate = new Range(minDate, maxDate);

        //this.graphed = this.isGraphed(sampleRowInds);
    }
}


// GroupingStat: Class to store some statistics about a group of samples
//
// Attributes
// ----------
// year: Range[Moment]
//    The year range for the sample
export class GroupingStat {
    constructor() {
        this.year = new Range(0, 0);
    }

    update(sampleGroup) {
        const minDates = [];
        const maxDates = [];
        for (const sampleCode in sampleGroup) {
            const sample = sampleGroup[sampleCode];
            minDates.push(sample.sampleDate.min);
            maxDates.push(sample.sampleDate.max); 
        }
        
        const minDate = moment.min(minDates);
        const maxDate = moment.max(maxDates);
        this.year.min = DateTimeTools.getYearStart(minDate.year());
        this.year.max = DateTimeTools.getYearEnd(maxDate.year());
    }
}


// Model: The class for the overall backend of the app
export class Model {
    constructor() {
        this.loaded = false;
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
        this.tableData = {};
        this.graphData = {};
        this.needsRerender = {};

        for (const page in FilterOrder) {
            this.inputs[page] = {};
            this.microorganismTrees[page] = {};
            this.summaryData[page] = {};
            this.tableData[page] = {};
            this.graphData[page] = {};
            this.needsRerender[page] = {};

            for (const tab in FilterOrder[page]) {
                this.inputs[page][tab] = {};
                this.microorganismTrees[page][tab] = new MicroorganismTree();
                this.summaryData[page][tab] = {};
                this.tableData[page][tab] = [];
                this.graphData[page][tab] = [];
                this.needsRerender[page][tab] = false;
            }
        }   
    }

    // initGroupings(): Initialize the data to hold the data structure that will optimally
    //  group the data for each tab
    initGroupings() {
        this.groupings = {};
        this.groupingStats = {};

        this.groupings[Pages.TrendsOverTime] = {};
        this.groupings[Pages.Overview] = {};
        this.groupingStats[Pages.TrendsOverTime] = {};
        this.groupingStats[Pages.Overview] = {};
    }

    // initSelections(): Initialize the available selection options for the input filters
    initSelections() {
        this.selections = {};

        for (const page in FilterOrder) {
            const pageInput = FilterOrder[page];
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

    // getDisplayMicroorganism(microorganism): Retrieves the name of the microorganism to be displayed
    //  on the website
    static getDisplayMicroorganism(microorganism) {
        const allMicroorganismsPrefix = Translation.translate("allMicroorganisms") + PhylogeneticDelim;
        let result = microorganism.substring(allMicroorganismsPrefix.length);
        result = result.replaceAll(PhylogeneticDelim, TablePhylogenticDelim);
        return result;
    }

    // getTabbedElement(att, page, tab): Retrieves the element for partitioned by tabs
    getTabbedElement(obj, page, tab) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;
        return obj[page][tab];
    }

    getGrouping({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.groupings, page, tab); }
    getSelection({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.selections, page, tab); }
    getGraphData({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.graphData, page, tab); }
    getTableData({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.tableData, page, tab); }
    getInputs({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.inputs, page, tab); }
    getFilterOrderInds({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(FilterOrderInds, page, tab); }
    getFilterOrder({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(FilterOrder, page, tab); }
    getMicroOrganismTree({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.microorganismTrees, page, tab); }
    getNeedsRerender({page = undefined, tab = undefined} = {}) { return this.getTabbedElement(this.needsRerender, page, tab); }
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
    static cleanTxt(txt, caseSensitve = true) {
        let result = txt.trim();
        return caseSensitve ? result.toLowerCase() : result;
    }

    // getSampleState(sampleRowInds): Retrieves the state of the sample
    //
    // Note:
    //  'Detected' is determined by: 
    //      - if a single row in the sample has its [Qualitative Result] column saying "Detected" OR
    //      - a single row in the sample has the [Qualitative Result] column is empty
    //           the [Quantitative Result] column is a positive number AND [Quantitative Operator] is one of {>, =, ~, >=}
    //      - if none of the rows have any [Qualitative Result], but their exist a row where [Isolate Code] is not empty
    //
    // 'Not Tested' is determined by:
    //      - if all the rows in the sample have the [Qualitative Result] column saying "Not Tested"
    //
    // For everything else, a sample is considered 'Not Detected'
    getSampleState(sampleRowInds) {
        let result = "";
        let foundIsolate = false;
        let isAllNotTested = true;

        for (const ind of sampleRowInds) {
            const row = this.data[ind];
            const qualitative = Model.cleanTxt(row[HCDataCols.QualitativeResult]);
            const quantitative = row[HCDataCols.QuantitativeResult];
            const qualitativeIsEmpty = qualitative === "";
            const quantitativeIsEmpty = isNaN(quantitative);

            if (!qualitativeIsEmpty && qualitative == Translation.translate(`qualitativeResults.${SampleState.Detected}`)) {
                return SampleState.Detected;
            } else if (!qualitativeIsEmpty && qualitative == Translation.translate(`qualitativeResults.${SampleState.NotDetected}`)) {
                result = SampleState.NotDetected;
                isAllNotTested = false;
            }

            const quantitativeOp = Model.cleanTxt(row[HCDataCols.QuantitativeOperator]);
            const isolateCode = Model.cleanTxt(row[HCDataCols.IsolateCode]);
            const isolateCodeIsEmpty = isolateCode === "";

            if (qualitativeIsEmpty && !quantitativeIsEmpty && 
                (quantitative > 0 || quantitativeOp == QuantitativeOps.Gt || quantitativeOp == QuantitativeOps.Eq || 
                 quantitativeOp == QuantitativeOps.Approx || quantitativeOp == QuantitativeOps.Ge)) {
                return SampleState.Detected;

            } else if (qualitativeIsEmpty && !quantitativeIsEmpty) {
                result = SampleState.NotDetected;
                isAllNotTested = false;
            } else if (qualitativeIsEmpty && quantitativeIsEmpty && !isolateCodeIsEmpty) {
                foundIsolate = true;
                isAllNotTested = false;
            } else if (qualitativeIsEmpty && quantitativeIsEmpty && isAllNotTested) {
                isAllNotTested = false;
            }
        }

        let resultIsBlank = result == "";
        if (resultIsBlank && isAllNotTested) {
            result = SampleState.NotTested;
        } else if (resultIsBlank && foundIsolate) {
            result = SampleState.Detected;
        } else if (resultIsBlank) {
            result = SampleState.NotDetected;
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
            if (qualitative == Translation.translate(`qualitativeResults.${SampleState.InConclusives}`)) {
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
            this.loaded = true;
        });
    }

    // loadHealthCanada(): Loads the CSV data that comes from Health Canada
    async loadHealthCanada() {
        let data = await d3.csv(`data/CANLINE Micro w quant data - no protB values- export 2022-09-14-${i18next.language}.csv`);
        for (const row of data) {
            row[HCDataCols.SurveyType] = this.getSurveyType(row);
            row[HCDataCols.QuantitativeResult] = parseFloat(row[HCDataCols.QuantitativeResult]);
            row[HCDataCols.Microorganism] = this.getMicroorganism(row);
            row[HCDataCols.SampleDate] = moment.tz(moment.tz(row[HCDataCols.SampleDate], TimeZone[row[HCDataCols.SurveyType]]), ModelTimeZone);
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
            this.updateInputDependents({page, tab});
            this.updateVisualData({page, tab});
            setupDone = true;
        }

        return setupDone;
    }

    // updateTab(input, page, tab): Updates the data for the tabs
    updateTab({input = null, page = undefined, tab = undefined} = {}) {
        this.updateSelections({input, page, tab});
        this.updateInputs({input, page, tab});
        this.updateInputDependents({page, tab});
        this.updateVisualData({page, tab});
    }

    // setupGroupingStat(page, tab, groupOrder, initGroupStat, accumulateGroupStat)
    setupGroupingStat(page, tab, groupOrder, initGroupStat, accumulateGroupStat) {
        const grouping = this.getGrouping({page, tab});
        if (grouping == undefined) return;

        let groupingStats = {};
        const lastGroup = groupOrder.at(-1);
        TableTools.forGroup(grouping, groupOrder, (keys, values) => {
            const aggregate = values[lastGroup];

            // initialize the grouping statistics
            let currentGroupStat = groupingStats;
            for (let i = 0; i < groupOrder.length; ++i) {
                const groupName = groupOrder[i];
                const currentKey = keys[groupName];
                if (currentGroupStat[currentKey] === undefined) currentGroupStat[currentKey] = i < groupOrder.length - 1 ? {} : initGroupStat();
                currentGroupStat = currentGroupStat[currentKey];
            }

            accumulateGroupStat(currentGroupStat, aggregate);
        });

        this.groupingStats[page][tab] = groupingStats;
    }
    
    // setupGrouping(page, tab): Setup the data structure of how to optimally group the data
    //  for a particular tab
    setupGrouping(page, tab) {
        let grouping = null;
        let filterOrder = this.getFilterOrder();
        let initGroupStat = () => new GroupingStat();
        let accumulateGroupStat = (groupStat, sample) => groupStat.update(sample);
        
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
            this.setupGroupingStat(page, tab, filterOrder, initGroupStat, accumulateGroupStat);

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
            this.setupGroupingStat(page, tab, filterOrder, initGroupStat, accumulateGroupStat);

        // Overview ==> By Microorganism
        } else if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.Microorganism],
                ind => this.data[ind][HCDataCols.SurveyType] 
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByMicroorganism] = grouping;
            this.setupGroupingStat(page, tab, filterOrder, initGroupStat, accumulateGroupStat);

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.FoodGroup],
                ind => this.data[ind][HCDataCols.FoodName],
                ind => this.data[ind][HCDataCols.SurveyType]
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByFood] = grouping;
            this.setupGroupingStat(page, tab, filterOrder, initGroupStat, accumulateGroupStat);

        // Overview ==> By Org
        } else if (page == Pages.Overview && tab == OverviewTabs.ByOrg) {
            grouping = TableTools.groupAggregates(this.samples, (aggregate) => aggregate.data, [
                ind => this.data[ind][HCDataCols.SurveyType]
            ]);

            this.groupings[Pages.Overview][OverviewTabs.ByOrg] = grouping;
            this.setupGroupingStat(page, tab, filterOrder, initGroupStat, accumulateGroupStat);
        }
    }

    // setupSelections(page, tab): Initializes the selections for the filters when a tab first loads
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
            selections[Inputs.NumberView] = new Set([NumberView.Number, NumberView.Percentage]);
        
        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let selections = this.selections[page][tab];
            selections[Inputs.NumberView] = new Set([NumberView.Number, NumberView.Percentage]);
        }
    }

    // updateYearSelection(): Updates the selection for the year range
    updateYearSelection({page = undefined, tab = undefined} = {}) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;

        const filterOrder = FilterOrder[page][tab];
        const groupStats = this.groupingStats[page][tab];
        const inputs = this.inputs[page][tab];
        const selections = this.selections[page][tab];
        const availableInputs = TabInputs[page][tab];

        if (availableInputs !== undefined && availableInputs.has(Inputs.Year)) {
            const minDates = [];
            const maxDates = [];

            const filterInnerKey = filterOrder.at(-1);
            TableTools.forFilteredGroup(groupStats, filterOrder, inputs, (keys, values) => {
                const sampleGroupStat = values[filterInnerKey];
                minDates.push(sampleGroupStat.year.min);
                maxDates.push(sampleGroupStat.year.max);
            });

            if (selections[Inputs.Year] === undefined) {
                selections[Inputs.Year] = new Range();
            }
    
            const yearSelection = selections[Inputs.Year];
            yearSelection.min = minDates.length == 0 ? undefined : moment.min(minDates).format();
            yearSelection.max = maxDates.length == 0 ? undefined : moment.max(maxDates).format();
        }
    }


    // updateSelections(input, page, tab): Updates the available selections in the filters on the menu
    updateSelections({input = null, page = undefined, tab = undefined} = {}) {
        page = page === undefined ? this.pageName : page;
        tab = tab === undefined ? this.activeTabs[page] : tab;

        const filterOrder = FilterOrder[page][tab];
        const filterOrderInds = FilterOrderInds[page][tab];
        const grouping = this.groupings[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : filterOrderInds[input];

        if (inputInd !== undefined) {
            // clear out the selections for filter inputs that needs to be updated
            for (let i = inputInd + 1; i < filterOrder.length; ++i) {
                const currentInput = filterOrder[i];
                selections[currentInput].clear();
            }

            this._updateSelections(0, inputInd, grouping, filterOrder, selections, inputs);
            
            // update the microorganism tree
            if (filterOrder.includes(Inputs.MicroOrganism) && filterOrderInds[Inputs.MicroOrganism] > inputInd) {
                const microorganisms = selections[Inputs.MicroOrganism];
                this.updateMicroorganismTree({microorganisms, page, tab});
            }
        }

        this.updateYearSelection({page, tab});
    }

    // _updateSelections(currentInd, inputInd, grouping, filterOrder, selections, inputs): Internal function to update the selections
    //  of a certain input
    _updateSelections(currentInd, inputInd, grouping, filterOrder, selections, inputs) {
        const currentInput = filterOrder[currentInd];
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
            if (currentInd < filterOrder.length - 1 && (input === undefined || hasChild)) {
                this._updateSelections(currentInd + 1, inputInd, grouping[childName], filterOrder, selections, inputs);
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
            inputs[Inputs.NumberView] = NumberView.Number;
            inputs[Inputs.Year] = structuredClone(selections[Inputs.Year]);
            this.inputs[Pages.Overview][OverviewTabs.ByMicroorganism] = inputs;

        // Overview ==> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let selections = this.selections[Pages.Overview][OverviewTabs.ByFood];
            inputs[Inputs.FoodGroup] = structuredClone(selections[Inputs.FoodGroup]);
            inputs[Inputs.Food] = structuredClone(selections[Inputs.Food]);
            inputs[Inputs.SurveyType] = structuredClone(selections[Inputs.SurveyType]);
            inputs[Inputs.Year] = structuredClone(selections[Inputs.Year]);
            inputs[Inputs.NumberView] = NumberView.Number;
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

        const filterOrder = FilterOrder[page][tab];
        const filterOrderInds = FilterOrderInds[page][tab];
        const selections = this.selections[page][tab];
        const inputs = this.inputs[page][tab];
        const inputInd = input === null ? -1 : filterOrderInds[input];
        const microorganismInputInd = (filterOrderInds[Inputs.MicroOrganism] === undefined) ? -1 : filterOrderInds[Inputs.MicroOrganism];

        if (inputInd == undefined) return;

        // update the inputs where their corresponding selections have been updated
        for (let i = inputInd + 1; i < filterOrder.length; ++i) {
            const currentInput = filterOrder[i];
            inputs[currentInput] = SetTools.intersection(inputs[currentInput], selections[currentInput]);

            // update the microorganism tree
            if (microorganismInputInd == i) {
                const tree = this.getMicroOrganismTree({page, tab});
                tree.checkMicroorganisms(inputs[currentInput]);
                tree.minimalExpand();
            }
        }

        // update the year input
        if (inputs[Inputs.Year] !== undefined && !selections[Inputs.Year] !== undefined) {
            const selection = selections[Inputs.Year];
            const input = inputs[Inputs.Year];

            if (selection.min !== undefined && !selection.has(input.min, DateTimeTools.datetimeStrCmpFunc)) {
                input.min = selection.min;
            } else if (selection.min === undefined) {
                input.min = undefined;
            }

            if (selection.max !== undefined && !selection.has(input.max, DateTimeTools.datetimeStrCmpFunc)) {
                input.max = selection.max;
            } else if (selection.max === undefined) {
                input.max = undefined;
            }
        }
    }

    // updateInputDependents(page, tab): Update any other sdata that depends on both the selections and the inputs
    updateInputDependents({page = undefined, tab = undefined} = {}) {
        const inputs = this.getInputs({page, tab});
        const selections = this.getSelection({page, tab});
        const filterOrder = this.getFilterOrder({page, tab});
        const grouping = this.getGrouping({page, tab});

        const yearSelection = selections[Inputs.Year];

        // update the year range selections/inputs if previously no year range was found
        if (yearSelection !== undefined && (yearSelection.min === undefined || yearSelection.max === undefined)) {
            this.updateYearSelection();
            inputs[Inputs.Year] = structuredClone(selections[Inputs.Year]);
        }

        // update the microorganism tree for tabs do not explicitely have any microorganism inputs for the user to select
        if (!filterOrder.includes(Inputs.MicroOrganism)) {
            const microorganisms = new Set();
            const innerKey = filterOrder.at(-1);

            TableTools.forFilteredGroup(grouping, filterOrder, inputs, (keys, values) => {
                const sampleGroup = values[innerKey];
                for (const sampleName in sampleGroup) {
                    const sample = sampleGroup[sampleName];
                    const sampleMicroorganisms = new Set(Object.keys(sample.states));
                    SetTools.union(microorganisms, sampleMicroorganisms);
                }
            });

            this.updateMicroorganismTree({microorganisms, page, tab});
        }
    }

    updateMicroorganismTree({microorganisms, page = undefined, tab = undefined} = {}) {
        if (microorganisms === undefined) return;

        const microorganismTree = this.getMicroOrganismTree({page, tab});
        microorganismTree.clear();

        // construct the new microorganism tree
        for (const microorganism of microorganisms) {
            const microoranismParts = microorganism.split(PhylogeneticDelim);
            microorganismTree.addPath(microoranismParts);
        }

        // add the non speciated microorganisms into the tree
        microorganismTree.addNonSpeciated();
    }

    // getFilteredData(page, tab, forDenom): Retrieves the filtered data rows based off the user selected filters
    getFilteredData({page = undefined, tab = undefined, forDenom = false} = {}) {
        if (page === undefined) {
            page = this.pageName;
        }

        if (tab === undefined) {
            tab = this.activeTabs[page];
        }

        const result = {};
        const filterOrder = FilterOrder[page][tab];

        let inputs = this.inputs[page][tab];
        let denomGenuses, microorganismTree;

        // add in the other microrganisms for the genuses in Health Canada data
        const microorganismInputs = inputs[Inputs.MicroOrganism];
        forDenom = forDenom && microorganismInputs !== undefined;
        if (forDenom) {
            denomGenuses = new Set(Translation.translate("denomGenuses", { returnObjects: true }));
            microorganismTree = this.microorganismTrees[page][tab];
            inputs = structuredClone(inputs);
            
            for (const microorganism of microorganismTree.microorganisms) {
                const genus = microorganismTree.genuses[microorganism];
                if (denomGenuses.has(genus)) {
                    inputs[Inputs.MicroOrganism].add(microorganism);
                }
            }
        }

        // get the filtered data
        const grouping = this.groupings[page][tab];
        const filterInnerKey = filterOrder.at(-1);
        TableTools.forFilteredGroup(grouping, filterOrder, inputs, (keys, values) => {
            const sampleGroup = values[filterInnerKey];
            for (const sampleId in sampleGroup) {
                if (result[sampleId] !== undefined) continue;
                result[sampleId] = sampleGroup[sampleId];
            }
        });

        const inputYear = structuredClone(inputs[Inputs.Year]);
        let sampleNamesToRemove = new Set();

        // filter by years
        if (inputYear !== undefined && inputYear.min !== undefined && inputYear.max !== undefined) {
            inputYear.min = moment.tz(inputYear.min, ModelTimeZone);
            inputYear.max = moment.tz(inputYear.max, ModelTimeZone);
    
            for (const sampleName in result) {
                const sample = result[sampleName];
                if (sample.sampleDate.within(inputYear, (date1, date2) => date1.diff(date2))) continue;
                sampleNamesToRemove.add(sampleName);
            }
    
            for (const sampleName of sampleNamesToRemove) {
                delete result[sampleName];
            }
        }

        if (!forDenom) {
            return result;
        }

        let healthCanadaSurveyTypes = new Set([SurveyTypes.HC, SurveyTypes.PHAC]);
        inputs = this.inputs[page][tab];

        // remove samples of not Health Canada data that the user did not select from the denominator calculations
        sampleNamesToRemove.clear();
        for (const sampleName in result) {
            const sample = result[sampleName];
            const notHealthCanadaSurveyTypes = SetTools.difference([sample.surveyTypes, healthCanadaSurveyTypes], true);
            if (notHealthCanadaSurveyTypes.size == 0) continue;

            const sampleUserMicroorganisms = SetTools.intersection(microorganismInputs, new Set(Object.keys(sample.states)));
            if (sampleUserMicroorganisms.size > 0) continue;

            sampleNamesToRemove.add(sampleName);
        }

        for (const sampleName of sampleNamesToRemove) {
            delete result[sampleName];
        }

        return result;
    }

    // createSampleObjs(grouping): Creates the aggregates for each microorganism sample
    createSampleObjs(dataRowInds) {
        const samples = MapTools.toDict(d3.group(dataRowInds, ind => this.data[ind][GroupNames.SampleCode]));
        for (const sampleName in samples) {
            const sampleObj = new Sample(this, samples[sampleName]);
            samples[sampleName] = sampleObj;
        }

        return samples;
    }

    // getDenomSamples(groupedSamples, microorganismTree): Retrieves all the samples used for the denominators of each food
    //
    // Note:
    //  For Health Canada Data:
    //      - denominators of some microorganisms are based off the genus of the selected food
    //      - for other microorganisms, the denominator is based off the exact name of the microorganism of the selected food
    getDenomSamples(groupedSamples, microorganismTree) {
        const result = {}
        const genuses = new Set(Translation.translate("denomGenuses", { returnObjects: true }));

        // get the unique samples
        TableTools.forGroup(groupedSamples, ["surveyType", "foodName", "microorganism"], (keys, values) => {
            const microorganismSamples = new Set(Object.keys(values.microorganism));
            const genus = microorganismTree.genuses[keys.microorganism];
            const isHealthCanada = keys.surveyType == SurveyTypes.HC || keys.surveyType == SurveyTypes.PHAC;

            if (result[keys.surveyType] === undefined) result[keys.surveyType] = {};
            if (result[keys.surveyType][keys.foodName] == undefined) result[keys.surveyType][keys.foodName] = {};
            const foodDenoms = result[keys.surveyType][keys.foodName];

            // accumulate the unique samples
            if (isHealthCanada && genuses.has(genus)) {
                if (foodDenoms[genus] === undefined) {
                    foodDenoms[genus] =  microorganismSamples;
                } else {
                    foodDenoms[genus] = SetTools.union(foodDenoms[genus], microorganismSamples, false);
                }
            } else if (isHealthCanada) {
                foodDenoms[keys.microorganism] = microorganismSamples;
            }
        });

        return result;   
    }

    // getSummary(samples, page, tab): Creates the summary for samples detected/not detected/not tested for
    //  each food 
    // 
    // Note:
    //  The data structure for the object within the summary is:
    //   {
    //      total: int,
    //      detected: int,
    //      notDetected: int,
    //      notTested: int
    //   }
    getSummary({samples, denomSamples, page = undefined, tab = undefined} = {}) {
        let groupedSamples = TableTools.groupAggregates(samples, (aggregate) => aggregate.data, [
            ind => this.data[ind][HCDataCols.SurveyType],
            ind => this.data[ind][HCDataCols.FoodName],
            ind => this.data[ind][HCDataCols.Microorganism],
        ]);

        let denomGroupedSamples = TableTools.groupAggregates(denomSamples, (aggregate) => aggregate.data, [
            ind => this.data[ind][HCDataCols.SurveyType],
            ind => this.data[ind][HCDataCols.FoodName],
            ind => this.data[ind][HCDataCols.Microorganism],
        ]);

        const microorganismTree = this.getMicroOrganismTree({page, tab});
        denomSamples = this.getDenomSamples(denomGroupedSamples, microorganismTree);
        const inputs = this.getInputs({page, tab});

        const summary = {};
        TableTools.forGroup(groupedSamples, ["surveyType", "foodName", "microorganism"], (keys, values) => {
            const microorganismInput = inputs[Inputs.MicroOrganism];
            if (microorganismInput !== undefined && !microorganismInput.has(keys.microorganism)) return;

            const microorganismSamples = values.microorganism;
            const genus = microorganismTree.genuses[keys.microorganism];
            const microorganismSummary = {};
            const foodSamples = denomSamples[keys.surveyType][keys.foodName];

            let detected = new Set();
            let notTested = new Set();

            // count the number of unique samples for 'detected' and 'not tested'
            for (const sampleCode in microorganismSamples) {
                const sample = microorganismSamples[sampleCode];
                if (sample.detected.has(keys.microorganism)) detected.add(sampleCode);
                if (sample.notTested.has(keys.microorganism)) notTested.add(sampleCode);
            }

            microorganismSummary[SummaryAtts.Samples] = foodSamples[keys.microorganism] !== undefined ? foodSamples[keys.microorganism] : foodSamples[genus];
            microorganismSummary[SummaryAtts.Detected] = detected;
            microorganismSummary[SummaryAtts.NotTested] = notTested;
            microorganismSummary[SummaryAtts.NotDetected] = SetTools.difference([microorganismSummary[SummaryAtts.Samples], detected, notTested], true);

            if (summary[keys.surveyType] === undefined) summary[keys.surveyType] = {};
            if (summary[keys.surveyType][keys.foodName] === undefined) summary[keys.surveyType][keys.foodName] = {};
            summary[keys.surveyType][keys.foodName][keys.microorganism] = microorganismSummary;
        });

        return summary;
    }

    // combineSummaryData(srcSummaryData, newSummaryData): Combines 2 summary data toghether
    combineSummaryData(srcSummaryData, newSummaryData) {
        let result = Object.assign({}, srcSummaryData, newSummaryData);
        result[SummaryAtts.Samples] = SetTools.union(srcSummaryData[SummaryAtts.Samples], newSummaryData[SummaryAtts.Samples], true);
        result[SummaryAtts.Detected] = SetTools.union(srcSummaryData[SummaryAtts.Detected], newSummaryData[SummaryAtts.Detected], true);

        result[SummaryAtts.NotTested] = SetTools.union(srcSummaryData[SummaryAtts.NotTested], newSummaryData[SummaryAtts.NotTested], true);
        SetTools.difference([result[SummaryAtts.NotTested], result[SummaryAtts.Detected]]);

        result[SummaryAtts.NotDetected] = SetTools.difference([result[SummaryAtts.Samples], result[SummaryAtts.Detected], result[SummaryAtts.NotTested]], true);
        return result;
    }

    // computeTableData(summaryData): Retrieves the table data needed to be displayed on the website
    computeTableData(summaryData) {
        let tableData = {};
        const microorganismTree = this.getMicroOrganismTree();
        const nonSpeciated = Translation.translate("nonSpeciated");

        // get the table data
        TableTools.forGroup(summaryData, ["surveyType", "foodName", "microorganism"], (keys, values) => {
            if (tableData[keys.foodName] === undefined) tableData[keys.foodName] = {};
            const microorganismSummary = values.microorganism;
            const genus = microorganismTree.genuses[keys.microorganism];

            let microorganismKey = keys.microorganism;
            if (microorganismKey == genus) {
                microorganismKey = `${microorganismKey}${PhylogeneticDelim}${nonSpeciated}`;
            }
            
            // for each food/microorganism combination
            if (tableData[keys.foodName][microorganismKey] === undefined) {
                let newTableData = structuredClone(microorganismSummary);
                newTableData[SummaryAtts.FoodName] = keys.foodName;
                newTableData[SummaryAtts.Microorganism] = Model.getDisplayMicroorganism(microorganismKey);
                tableData[keys.foodName][microorganismKey] = newTableData;
            } else {
                tableData[keys.foodName][microorganismKey] = this.combineSummaryData(tableData[keys.foodName][microorganismKey], microorganismSummary);
            }

            // for each food/genus combination
            if (tableData[keys.foodName][genus] === undefined) {
                let newTableData = structuredClone(microorganismSummary);
                newTableData[SummaryAtts.FoodName] = keys.foodName;
                newTableData[SummaryAtts.Microorganism] = Model.getDisplayMicroorganism(genus);
                tableData[keys.foodName][genus] = newTableData;
            } else {
                tableData[keys.foodName][genus] = this.combineSummaryData(tableData[keys.foodName][genus], microorganismSummary);
            }
        });

        TableTools.forGroup(tableData, ["foodName", "microorganism"], (keys, values) => {
            const currentData = values.microorganism;
            currentData[SummaryAtts.Detected] = currentData[SummaryAtts.Detected].size;
            currentData[SummaryAtts.NotDetected] = currentData[SummaryAtts.NotDetected].size;
            currentData[SummaryAtts.NotTested] = currentData[SummaryAtts.NotTested].size;
            currentData[SummaryAtts.Tested] = currentData[SummaryAtts.Detected] + currentData[SummaryAtts.NotDetected];
            currentData[SummaryAtts.Samples] = currentData[SummaryAtts.Samples].size;
            currentData[SummaryAtts.PercentDetected] = `${NumberTools.toPercent(currentData[SummaryAtts.Detected], currentData[SummaryAtts.Tested], 2)}%`;
            currentData[SummaryAtts.SamplesWithConcentration] = "";
            currentData[SummaryAtts.ConcentrationMean] = "";
            currentData[SummaryAtts.ConcentrationRange] = "";
        });

        tableData = Object.values(tableData).map((microorganismRows) => Object.values(microorganismRows));
        tableData = tableData.flat();
        return tableData;
    }

    // computeOverviewGraphData(summaryKeyName, summaryAtt, summaryData, getSummaryKeyDisplay): Retrieves the graph data for the overview page
    computeOverviewGraphData(summaryKeyName, summaryAtt, summaryData, getSummaryKeyDisplay) {
        if (getSummaryKeyDisplay === undefined) {
            getSummaryKeyDisplay = (summaryKey) => summaryKey;
        }

        let graphData = {};
        TableTools.forGroup(summaryData, ["surveyType", "foodName", "microorganism"], (keys, values) => {
            const microorganismSummary = values.microorganism;
            const summaryKey = keys[summaryKeyName];

            if (graphData[summaryKey] === undefined) {
                let newGraphData = structuredClone(microorganismSummary);
                newGraphData[summaryAtt] = getSummaryKeyDisplay(summaryKey);
                graphData[summaryKey] = newGraphData;
            } else {
                graphData[summaryKey] = this.combineSummaryData(graphData[summaryKey], microorganismSummary);
            }
        });
        
        TableTools.forGroup(graphData, [summaryKeyName], (keys, values) => {
            const currentData = values[summaryKeyName];
            currentData[SummaryAtts.Detected] = currentData[SummaryAtts.Detected].size;
            currentData[SummaryAtts.NotDetected] = currentData[SummaryAtts.NotDetected].size;
            currentData[SummaryAtts.NotTested] = currentData[SummaryAtts.NotTested].size;
            currentData[SummaryAtts.Tested] = currentData[SummaryAtts.Detected] + currentData[SummaryAtts.NotDetected];
            currentData[SummaryAtts.Samples] = currentData[SummaryAtts.Samples].size;
            currentData[SummaryAtts.PercentDetected] = NumberTools.toPercent(currentData[SummaryAtts.Detected], currentData[SummaryAtts.Tested]);
        });

        graphData = Object.values(graphData);
        return graphData;
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
        let denomSamples = this.getFilteredData({page, tab, forDenom: true});

        const summaryData = this.getSummary({samples, denomSamples, page, tab});
        this.summaryData[page][tab] = summaryData;

        // get the data needed for the graphs and tables
        // Overview --> By Microorganism
        if (page == Pages.Overview && tab == OverviewTabs.ByMicroorganism) {
            let graphData = this.computeOverviewGraphData("foodName", SummaryAtts.FoodName, summaryData);
            let tableData = this.computeTableData(summaryData);

            this.graphData[page][tab] = graphData;
            this.tableData[page][tab] = tableData;
        
        // Overview --> By Food
        } else if (page == Pages.Overview && tab == OverviewTabs.ByFood) {
            let graphData = this.computeOverviewGraphData("microorganism", SummaryAtts.Microorganism, summaryData, (summaryKey) => Model.getDisplayMicroorganism(summaryKey));
            let tableData = this.computeTableData(summaryData);

            this.graphData[page][tab] = graphData;
            this.tableData[page][tab] = tableData;
        }
    }

    // clear(): Clears all the saved data in the backend
    // Note:
    //  This function is mostly used when changing between languages since the program needs
    //      to load in new data specific for the language
    clear() {
        this.loaded = false;
        this.initInputs();
        this.initGroupings();
        this.initSelections();
    }
}