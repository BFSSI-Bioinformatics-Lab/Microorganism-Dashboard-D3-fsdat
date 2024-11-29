////////////////////////////////////////////////////////////////////
//                                                                //
// Purpose: Handles the overall display of the program            //
//                                                                //
// What it Contains:                                              //
//      - initial setup for header, footer                        //
//      - initial setup for the menu's of the main pages          //
//      - the main function to run the overall program            //
//      - initiliazes the backend of the program                  //
//                                                                //
////////////////////////////////////////////////////////////////////


import { Pages, PageSrc, DefaultLanguage, TranslationObj, ThemeNames, Themes, DefaultTheme,  Inputs, PhylogeneticDelim, SummaryAtts, ModelTimeZone, SVGIcons, Tabs} from "./constants.js"
import { Translation, DateTimeTools, Visuals } from "./tools.js";
import { Model } from "./backend.js";
import { OverviewBarGraph } from "./graphs/overviewBarGraph.js";


// App: The class for the overall application
class App {
    constructor(model) {
        this.model = model;
        this.lang = DefaultLanguage;
        this.theme = DefaultTheme;

        this.menuCollapsed = {};
        this.menuCollapsed[Pages.Overview] = false;
        this.menuCollapsed[Pages.TrendsOverTime] = false;

        this.graphs = {};
        this.graphs[Pages.Overview] = {};
        this.graphs[Pages.TrendsOverTime] = {};
    }

    getGraph({page = undefined, tab = undefined} = {}) { return this.model.getTabbedElement(this.graphs, page, tab); }

    // init(page): Initializes the entire app
    async init(page = undefined) {
        const self = this;
        this.changeLanguage(self.lang);

        // setup the header
        this.setupHeader();

        // global theme variables
        this.themeVars = document.querySelector(':root');
        this.setTheme();

        this.loadMainPage(page);
    }

    // =================== HEADER/FOOTER ===============================

    // setupHeader(): Setup the header needed for the app
    setupHeader() {
        const self = this;
        d3.selectAll(".navBarContainer .nav-item .nav-link")
            .on("click", (event, data) => {
                let selectedHeader = event.target;
                if (selectedHeader.nodeName == "DIV") {
                    selectedHeader = selectedHeader.parentElement;
                }
        
                selectedHeader = d3.select(selectedHeader);
                const activeHeader = d3.select(".navBarContainer .nav-item .nav-link.active");

                const page = selectedHeader.attr("value");
                if (!self.model.loaded && page != Pages.Home) return;
                console.log("BOYYYA");

                self.setSelectedOpt(selectedHeader, activeHeader, data, (selectedOpt, data) => {
                    // load the new page
                    const page = data;
                    if (page && page != Pages.Home) {
                        self.model.pageName = page;
                        self.loadMainPage();
                    }
                });
            });

        // register the link to change the language
        this.headerLink = d3.select(".headerOption:last-child");
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        this.headerLink.on("click", (event) => this.onLanguageChange());

        this.themeDropdown = d3.select("#themeDropdownMenu");

        // add the different options for the theme
        const themeOptions = this.themeDropdown
            .selectAll("li")
            .data(Object.values(ThemeNames))
            .enter()
            .append("li")
            .append("a")
            .attr("class", "dropdown-item themeDropdownItem")
            .attr("href", "#")
            .on("click", (event, theme) => {
                const selectedThemeLink = d3.select(event.target);
                const activeThemeLink = this.themeDropdown.select(".themeDropdownItem.active");

                self.setNavOptInactive(activeThemeLink);
                self.setNavOptActive(selectedThemeLink);

                self.theme = theme;
                self.setTheme();
            });
        
        // set the different options for the theme to be active
        themeOptions.each((theme, ind, elements) => {
            const element = d3.select(elements[ind]);
            if (theme == self.theme) {
                self.setNavOptActive(element);
                return;
            }

            self.setNavOptInactive(element);
        });

        self.updateHeaderText();
    }

    // setNavOptActive(element): Makes some option to be selected
    setNavOptActive(element) {
        element.classed("active", true);
        element.attr("aria-current", "page"); // for assessibility
    }

    // setNavOptInactive(element): Makes some option to be unselected
    setNavOptInactive(element) {
        element.classed("active", false);
        element.attr("aria-current", null); // for assessibility
    }

    // setSelectedOpt(selectedOpt, activeOpt, data, onSelected): Sets the selected option to be
    //  active and disables the previous selected option
    setSelectedOpt(selectedOpt, activeOpt, data, onSelected) {
        if (data === undefined) {
            data = selectedOpt.attr("value");
        }

        this.setNavOptInactive(activeOpt);
        this.setNavOptActive(selectedOpt);
        onSelected(selectedOpt, data);
    }

    // setActiveNavOption(event): Changes which option in the navigation bar is selected
    setActiveNavOption(event) {
        let selectedHeader = event.target;
        if (selectedHeader.nodeName == "DIV") {
            selectedHeader = selectedHeader.parentElement;
        }

        selectedHeader = d3.select(selectedHeader);
        const activeHeader = d3.select(".navBarContainer .nav-item .nav-link.active");

        this.setNavOptInactive(activeHeader);
        this.setNavOptActive(selectedHeader);
        
        // load the new page
        const page = selectedHeader.attr("value");
        if (page) {
            this.model.pageName = page;
            this.loadMainPage();
        }
    }

    // setTheme(): Changes the colour for the theme selected
    setTheme() {
        const themeObj = Themes[this.theme];
        for (const themeKey in themeObj) {
            const themeColour = themeObj[themeKey];
            this.themeVars.style.setProperty(`--${themeKey}`, themeColour);
        }
    }

    // Changes the language registered on the website
    changeLanguage(newLanguage) {
        const website = d3.select("html");
        website.attr("lang", newLanguage);
        i18next.changeLanguage(newLanguage);
        this.lang = newLanguage;
    }

    // onLanguageChange(): Listener when the language of the website changes
    async onLanguageChange() {
        const newLanguage = this.headerLink.attr("value");
        this.changeLanguage(newLanguage);

        this.updateHeaderText();
        this.loadMainPage(Pages.Loading);

        this.model.clear();

        Promise.all([this.model.load()]).then(() => {
            this.loadMainPage();
        });
    }

    // updateHeaderText(): Changes the text in the header based off the language
    updateHeaderText() {
        // metadata about the document
        document.title = Translation.translate("websiteTabTitle");
        document.querySelector('meta[name="description"]').setAttribute("content", Translation.translate("websiteDescriptions"));

        // title for the header
        d3.select(".headerTitle h2")
            .text(Translation.translate("websiteTitle"));

        // link that changes the language
        this.headerLink.text(Translation.translate("changeLanguage"));
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        // navigation links
        const navLinks = d3.selectAll(".navBarContainer .nav-item .nav-link").nodes();
        for (const linkNode of navLinks) {
            const link = d3.select(linkNode);
            const linkTxt = link.select("div");
            const linkValue = link.attr("value");
            linkTxt.text(Translation.translate(`navigation.${linkValue}`));
        }

        // theme names
        d3.selectAll(".themeDropdownItem")
            .text((themeValue) => { return Translation.translate(`themes.${themeValue}`); });
    }

    // =================================================================
    // ==================== MAIN PAGES =================================

    getActiveTab(activeTab) { 
        if (activeTab === undefined) {
            activeTab = this.model.getActiveTab();
        }

        return d3.select(`.menu .tab-pane[value="${activeTab}"]`); 
    }

    // Loads the selected main page for the app
    loadMainPage(page = undefined) {
        const self = this;
        if (page === undefined) {
            page = self.model.pageName;
        }

        $("#mainPage").load(PageSrc[page], function() { self.updateMainPage(page); });

        // flag all the tabs on the page to require a refresh in their UI
        const tabsToRerender = this.model.needsRerender[page];
        if (tabsToRerender === undefined) return;

        // reset the graphs for the page
        this.graphs[page] = {};

        for (const tab in tabsToRerender) {
            tabsToRerender[tab] = true;
        }
    }

    // updateMainPage(): Updates the entire main page without loading its corresponding HTML
    updateMainPage(page = undefined) {
        this.page = d3.select(".pageContainer");
        if (page === undefined) {
            page = this.model.pageName;
        }
        
        if (page == Pages.TrendsOverTime) {
            this.updateTrendsOverTime();
        } else if (page == Pages.Overview) {
            this.updateOverview();
        } else if (page == Pages.Loading) {
            this.updateLoadingPage();
        }

        // load the multiselect options
        // This is a bug in the bootstrap-select library, requiring the multiselect widget to be manually initialized if
        //  the multiselect is dynamically added into the HTML (we dynamically add the multiselect by calling the .load function using JQuery)
        //
        // https://github.com/snapappointments/bootstrap-select/issues/2606
        $(".multiSelect").selectpicker({
            deselectAllText: Translation.translate("deselectAll"), 
            selectAllText: Translation.translate("selectAll")});
    }

    // setupMenuTabs(): Initial setup needed for the menu tabs
    setupMenuTabs() {
        const activeTab = this.model.activeTabs[this.model.pageName];

        // initial setup of which tab is selected
        this.menuTabs.each((data, ind, elements) => {
            const tab = d3.select(elements[ind]);
            const tabValue = tab.attr("value");

            if (tabValue == activeTab) {
                tab.classed("active", true);
                tab.attr("aria-selected", true);
            } else {
                tab.classed("active", false);
                tab.attr("aria-selected", false);
            }
        });

        // show the corresponding container for the tab that is selected
        this.getActiveTab(activeTab)
            .classed("show", true)
            .classed("active", true);

        // when a tab is switched/clicked
        this.menuTabs.on("click", (event) => {
            const tab = d3.select(event.target);
            const tabValue = tab.attr("value");
            this.model.activeTabs[this.model.pageName] = tabValue;
            this.graphs[this.model.pageName][tabValue] = undefined;
            this.updateTab({updateFilters: false});
        });

        // when the user presses the download graph button]
        const downloadGraphBtn = d3.select("#downloadGraphBtn");
        downloadGraphBtn.on("click", () => {
            const graph = this.getGraph();
            if (graph === undefined || !graph.isDrawn) return;
            Visuals.saveAsImage({svg: graph.svg.node(), title: graph.title});
        });

        // load the data for the tab
        this.updateTab(); 
    }

    // readCheckmarkSelect(selectId): Reads the selected values from a checkmark select widget
    readCheckmarkSelect(selectId) {
        const result = new Set();
        const tab = this.getActiveTab();
        tab.selectAll(`#${selectId} input[checked="true"]`)
            .each((_, ind, elements) => {
                const input = d3.select(elements[ind]);
                result.add(input.attr("value"));
            });

        return result;
    }

    // updateMenuCollapse(btn): Updates the menu collapse
    updateMenuCollapse(btn) {
        const menuCollapsed = this.menuCollapsed[this.model.pageName];
        if (menuCollapsed === undefined) return;

        const btnText = Translation.translate(menuCollapsed ? "showMenu" : "hideMenu");
        const btnIcon = SVGIcons[menuCollapsed ? "EyeClosed" : "EyeOpen"]; 

        btn.select("span").text(btnText);
        btn.select("svg").html(btnIcon);
        btn.classed("collapsed", menuCollapsed);

        btn.on("click", (event) => {
            this.menuCollapsed[this.model.pageName] = !this.menuCollapsed[this.model.pageName];
            btn = this.page.select("#menuCollapseBtn");
            this.updateMenuCollapse(btn);
        });

        // set whether the menu is shown/collapsed
        let collapsible = this.page.select(".mainMenuContainerCollapse").classed("show", !menuCollapsed);

        collapsible = document.getElementById("collapseMenu");
        if (collapsible === null) return;

        collapsible.addEventListener('hidden.bs.collapse', (event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            this.updateVisuals();
        });

        collapsible.addEventListener('shown.bs.collapse', (event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            this.updateVisuals();
        });
    }

    // updateMenuNames(): Updates the names within the menu
    updateMenuNames() {
        const menuCollapseBtn = this.page.select("#menuCollapseBtn");
        this.updateMenuCollapse(menuCollapseBtn);

        // translate names of the filters
        this.page.selectAll(".menuTab").each((tabData, tabInd, tabElements) => {
            const tab = d3.select(tabElements[tabInd]);
            const tabValue = tab.attr("value");

            tab.selectAll(".menuFilterHeading button span").text((filterData, filterInd, filterElements) => {
                const filter = d3.select(filterElements[filterInd]);
                const filterValue = filter.attr("value");
                return Translation.translate(`filterNames.${this.model.pageName}.${tabValue}.${filterValue}`);
            });
        });

        // translate labels/titles
        const labelTranslations = {
            "#foodGroupLabel": "foodGroupLabel",
            "#foodLabel": "foodLabel",
            "#microorganismLabel": "microorganismLabel",
            "#showResultAsLabel": "showResultAsLabel",
            "#tableTitle": "tableTitle",
            "#downloadGraphBtn": "downloadGraph"
        };

        for (const selector in labelTranslations) {
            d3.selectAll(selector).text(Translation.translate(labelTranslations[selector]));
        }
    }

    // updateRadioSelect(selectId, selections, inputs, onChange, translations): Updates the selections for the radio select widget
    updateRadioSelect({selectId, selections, inputs, onChange = undefined, translations = undefined} = {}) {
        let tab = this.getActiveTab();
        let tabName = this.model.getActiveTab();
        const radioSelections = tab.select(`.menuTab[value="${tabName}"] #${selectId}`)
            .html("")
            .selectAll("label")
            .data(selections)
            .enter()
            .append("label")
            .classed("radioContainer", true);

        radioSelections.append("span")
            .text(d => { return translations === undefined ? d : translations[d]});

        radioSelections.append("input")
            .attr("type", "radio")
            .attr("name", `${tabName}_${selectId}`)
            .attr("value", d => `${d}`)
            .attr("checked", d => inputs.has(d) ? true : null)
            .on("click", (event) => {
                const radioInput = d3.select(event.target);
                const radioValue = radioInput.attr("value");

                if (onChange !== undefined) {
                    onChange(radioValue);
                }
            });

        radioSelections.append("span")
            .classed("radioIcon", true);
    }

    // updateCheckmarkSelect(selectId, selections, inputs, onChange, translations): Updates the selections for the checkmark select widget
    updateCheckmarkSelect({selectId, selections, inputs, onChange = undefined, translations = undefined} = {}) {
        let tab = this.getActiveTab();
        let tabName = this.model.getActiveTab();
        const chesckMarkSelections = tab.select(`.menuTab[value="${tabName}"] #${selectId}`)
            .html("")
            .selectAll("label")
            .data(selections)
            .enter()
            .append("label")
            .classed("checkBoxContainer", true);

        chesckMarkSelections.append("span")
            .text(d => { return translations === undefined ? d : translations[d]});

        chesckMarkSelections.append("input")
            .attr("type", "checkbox")
            .attr("value", d => `${d}`)
            .attr("checked", d => inputs.has(d) ? true : null)
            .on("click", (event) => {
                const checkInput = d3.select(event.target);
                const checkValue = checkInput.attr("value"); 
                let isChecked = checkInput.attr("checked");
                let newIsChecked = (isChecked === null || !isChecked) ? true : null;
                checkInput.attr("checked", newIsChecked);

                if (onChange !== undefined) {
                    onChange(checkValue, newIsChecked === null ? false : newIsChecked);
                }
            })

        chesckMarkSelections.append("span")
            .classed("checkmarkIcon", true);
    }

    // updateRangeSlier(selectId, selections, inputs, onChange): Updates the range of the range slider
    updateRangeSlider({selectId, selection, input, onChange = undefined}) {
        let tabName = this.model.getActiveTab();
        const selector = `.menuTab[value="${tabName}"] .rangeSlider #${selectId}`;
        const innerSliderId = `${selectId}Inner`;

        let rangeSlider = $(selector);
        if (input.min === undefined || input.max === undefined || selection.min === undefined || selection.max === undefined) {
            rangeSlider.parent().addClass("d-none");
            return;
        }

        rangeSlider.parent().removeClass("d-none");
        rangeSlider.slider({ id: innerSliderId, min: selection.min, max: selection.max, range: true, value: [input.min, input.max] });
        rangeSlider.slider('refresh', { useCurrentValue: true });
        rangeSlider.on("slideStop", (event) => {
            // This is a bug with the bootstrap-slider library from firing 3 events
            //  after the slider stops moving
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();

            if (onChange !== undefined) {
                onChange(event.value);
            }
        });
    }

    // updateDropdownSelect(selectId, selections, inputs, onChange, translations): Updates the selections for the dropdown select widget
    updateDropdownSelect({selectId, selections, inputs, onChange = undefined, noneSelectedText = ""} = {}) {
        let tab = this.getActiveTab();
        let tabName = this.model.getActiveTab();
        const dropdownSelector = `.menuTab[value="${tabName}"] #${selectId}.multiSelect`;

        // destroy the select picker, so that when adding the new selections
        //  to the dropdown, the dropdown will not fire extra events
        let dropdown = $(dropdownSelector);
        dropdown.selectpicker('destroy');

        tab.select(dropdownSelector)
            .html("")
            .selectAll("option")
            .data(selections)
            .enter()
            .append("option")
            .text((d) => d);

        dropdown = $(dropdownSelector).selectpicker({
            deselectAllText: Translation.translate("deselectAll"), 
            selectAllText: Translation.translate("selectAll"),
            noneSelectedText,
            noneResultsText: Translation.translate("noResultsFound")});

        dropdown.selectpicker('val', Array.from(inputs));
        dropdown.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
            if (onChange !== undefined) {
                onChange(dropdown.val());
            }
        });
    }

    // selectSubTree(event, node, selectNodeFunc, checkNodeFunc): Selects/unselects a subtree in the tree select
    selectSubTree(event, node, selectNodeFunc, checkNodeFunc) {
        selectNodeFunc(node.nodeId, { silent: true });
        checkNodeFunc(node.nodeId, { silent: true });
        if (node.nodes === undefined) return;

        for (const n of node.nodes) {
            this.selectSubTree(event, n, selectNodeFunc, checkNodeFunc);
        }
    }

    // selectParents(event, node, tree, selectNodeFunc, checkNodeFunc, isSelectedFunc, allChildrenSelectedFunc): Selects/unselects the parent
    //  nodes of the selected node depending on whether the children of the parent are selected/unselected
    selectParents(event, node, tree, selectNodeFunc, checkNodeFunc, isSelectedFunc, allChildrenSelectedFunc) {
        let parent = tree.data("treeview").getParent(node.nodeId);
        while (parent !== undefined) {
            let children = parent.nodes;
            let selectedChildren = children.filter((child) => isSelectedFunc(child));

            if (allChildrenSelectedFunc(children, selectedChildren)) {
                selectNodeFunc(parent.nodeId, { silent: true });
                checkNodeFunc(parent.nodeId, { silent: true });
            }

            parent = tree.data("treeview").getParent(parent.nodeId);
        }
    }

    // updateTreeSelect(selectId, selections, inputs, onChange, translations): 
    updateTreeSelect({selectId, selections, inputs, onChange = undefined} = {}) {
        const microorganismTree = this.model.getMicroOrganismTree();
        const treeData = microorganismTree.toTreeSelectData();
        let tabName = this.model.getActiveTab();

        let tree = $(`.menuTab[value="${tabName}"] #${selectId}`);
        if (!tree.is(':empty')) {
            tree.treeview('remove');
        }

        tree.treeview({data: treeData,
                       backColor: "var(--background)",
                       borderColor: "var(--secondaryBorderColour)",
                       color: "var(--fontColour)",
                       onhoverColor: "var(--primaryHover)",
                       selectedBackColor: "var(--primaryVariant)",
                       selectedColor: "var(--onPrimaryHover)",
                       collapseIcon: 'fas fa-chevron-down',
                       expandIcon: 'fas fa-chevron-right',
                       checkedIcon: 'far fa-check-square',
                       uncheckedIcon: 'far fa-square',
                       showTags: true,
                       showCheckbox: true,
                       showIcon: true,
                       multiSelect: true,
                       levels: 1
        });

        tree.on('nodeChecked', (event, node) => {
            this.selectSubTree(event, node,  tree.data("treeview").selectNode,  tree.data("treeview").checkNode);
            this.selectParents(event, node, tree, tree.data("treeview").selectNode, tree.data("treeview").checkNode, 
                              (child) => child.state !== undefined && child.state["checked"], 
                              (children, selectedChildren) => children.length == selectedChildren.length);

            const selected = tree.data("treeview").getSelected();
            if (onChange !== undefined) {
                onChange(selected, tree);
            }
        });

        tree.on('nodeUnchecked', (event, node) => {
            this.selectSubTree(event, node,  tree.data("treeview").unselectNode,  tree.data("treeview").uncheckNode);
            this.selectParents(event, node, tree, tree.data("treeview").unselectNode, tree.data("treeview").uncheckNode, 
                              (child) => child.state !== undefined && child.state["checked"], 
                              (children, selectedChildren) => children.length > selectedChildren.length);

            const selected = tree.data("treeview").getSelected();
            if (onChange !== undefined) {
                onChange(selected, tree);
            }
        });

        tree.on("nodeSelected", function(event, node) {
            tree.data('treeview').checkNode(node.nodeId);
        });

        tree.on("nodeUnselected", function(event, node) {
            tree.data('treeview').uncheckNode(node.nodeId);
        });
    }

    // readMicroorganisms(selectedNodes, tree): Reads all the microorganisms at the leaves of the tree
    readMicroorganisms(selectedNodes, tree) {
        const result = new Set();
        const nonSpeciatedStr = Translation.translate("nonSpeciated");

        // get the full names of the microrganisms
        for (const node of selectedNodes) {
            if (node.nodes !== undefined && node.nodes.length > 0) continue;

            let microorganism = node.text == nonSpeciatedStr ? "" : node.text;
            let parent = tree.data("treeview").getParent(node.nodeId);

            while (parent !== undefined) {
                microorganism = microorganism != "" ? `${parent.text}${PhylogeneticDelim}${microorganism}` : parent.text;
                parent = tree.data("treeview").getParent(parent.nodeId);
            }

            result.add(microorganism);
        }

        return result;
    }

    setupMenuFilters() {
        const inputOrderInds = this.model.getFilterOrderInds();
    }

    // updateGraphOptions(): Updates the options for the graph
    updateGraphOptions() {
        let selections = this.model.getSelection();
        let inputs = this.model.getInputs();

        // number/percentage view
        if (inputs[Inputs.NumberView] !== undefined) {
            this.updateRadioSelect({selectId: Inputs.NumberView, selections: selections[Inputs.NumberView], inputs: new Set([inputs[Inputs.NumberView]]),
                                    translations: Translation.translate("numberview", { returnObjects: true }),
                                    onChange: (radioValue) => {
                                        inputs[Inputs.NumberView] = radioValue;
                                        this.updateVisuals();
                                    }
            })
        }

        // year select
        if (inputs[Inputs.Year] !== undefined) {
            let inputRange = DateTimeTools.rangeToDate(inputs[Inputs.Year], ModelTimeZone, true);
            if (inputRange.min !== undefined) inputRange.min = inputRange.min.year();
            if (inputRange.max !== undefined) inputRange.max = inputRange.max.year();

            let selectionRange = DateTimeTools.rangeToDate(selections[Inputs.Year], ModelTimeZone, true);
            if (selectionRange.min !== undefined) selectionRange.min = selectionRange.min.year();
            if (selectionRange.max !== undefined) selectionRange.max = selectionRange.max.year();
            
            this.updateRangeSlider({selectId: Inputs.Year, selection: selectionRange, input: inputRange,
                                    onChange: (sliderValue) => {
                                        inputs = this.model.getInputs();
                                        selections = this.model.getSelection();

                                        const selectionYear = DateTimeTools.rangeToDate(selections[Inputs.Year], ModelTimeZone, true);
                                        const inputYear = inputs[Inputs.Year];

                                        if (sliderValue[0] < selectionYear.min.year()) {
                                            inputYear.min = selectionYear.min;
                                        } else if (sliderValue[0] > selectionYear.max.year()) {
                                            inputYear.min = DateTimeTools.getYearStart(selectionYear.max.year());
                                        } else {
                                            inputYear.min = DateTimeTools.getYearStart(sliderValue[0]);
                                        }

                                        if (sliderValue[1] > selectionYear.max.year()) {
                                            inputYear.max = selectionYear.max;
                                        } else if (sliderValue[1] < selectionYear.min.year()) {
                                            inputYear.max = DateTimeTools.getYearEnd(selectionYear.min.year());
                                        } else {
                                            inputYear.max = DateTimeTools.getYearEnd(sliderValue[1]);   
                                        }

                                        DateTimeTools.rangeToStr(inputYear);
                                        this.updateTab({input: Inputs.Year});
                                    }
            })
        }
    }

    // updateMenuFilters(inputs): Updates the filters on the menu
    updateMenuFilters(input = null) {
        const inputOrderInds = this.model.getFilterOrderInds();
        const inputInd = input === null ? -1 : inputOrderInds[input];
        const selections = this.model.getSelection();
        const inputs = this.model.getInputs();

        if (inputInd === undefined) return;

        // data type filter
        if (inputOrderInds[Inputs.DataType] !== undefined && inputOrderInds[Inputs.DataType] > inputInd) {
            this.updateRadioSelect({selectId: Inputs.DataType, selections: selections[Inputs.DataType], inputs: inputs[Inputs.DataType],
                                    translations: Translation.translate("dataTypes", { returnObjects: true }),
                                    onChange: (checkedVal) => {
                                        inputs[Inputs.DataType] = new Set([checkedVal]);
                                        this.updateTab({input: Inputs.DataType});
                                    }});
        }

        // survey type filter
        if (inputOrderInds[Inputs.SurveyType] !== undefined && inputOrderInds[Inputs.SurveyType] > inputInd) {
            this.updateCheckmarkSelect({selectId: Inputs.SurveyType, selections: selections[Inputs.SurveyType], inputs: inputs[Inputs.SurveyType], 
                                        translations: Translation.translate("surveyTypes", { returnObjects: true }), 
                                        onChange: (checkedVal, isChecked) => {
                                            if (isChecked) {
                                                inputs[Inputs.SurveyType].add(checkedVal);
                                            } else {
                                                inputs[Inputs.SurveyType].delete(checkedVal);
                                            }

                                            this.updateTab({input: Inputs.SurveyType});
                                        }});
        }

        // microorganism filter
        if (inputOrderInds[Inputs.MicroOrganism] !== undefined && inputOrderInds[Inputs.MicroOrganism] > inputInd) {
            this.updateTreeSelect({selectId: Inputs.MicroOrganism, selections: selections[Inputs.MicroOrganism], inputs: inputs[Inputs.MicroOrganism], 
                                   onChange: (selectedNodes, tree) => {
                                        const newInputs = this.readMicroorganisms(selectedNodes, tree);
                                        inputs[Inputs.MicroOrganism] = newInputs;
                                        this.updateTab({input: Inputs.MicroOrganism});
                                   }});
        }

        // food group selection
        if (inputOrderInds[Inputs.FoodGroup] !== undefined && inputOrderInds[Inputs.FoodGroup] > inputInd) {
            this.updateDropdownSelect({selectId: Inputs.FoodGroup, selections: selections[Inputs.FoodGroup], inputs: inputs[Inputs.FoodGroup], 
                                       noneSelectedText: Translation.translate("allFoodGroups"),
                                       onChange: (selectedOptions) => {
                                            inputs[Inputs.FoodGroup] = new Set(selectedOptions);
                                            this.updateTab({input: Inputs.FoodGroup});
                                       }});
        }

        // food selection
        if (inputOrderInds[Inputs.Food] !== undefined && inputOrderInds[Inputs.Food] > inputInd) {
            this.updateDropdownSelect({selectId: Inputs.Food, selections: selections[Inputs.Food], inputs: inputs[Inputs.Food], 
                                       noneSelectedText: Translation.translate("allFoods"),
                                       onChange: (selectedOptions) => {
                                            inputs[Inputs.Food] = new Set(selectedOptions);
                                            this.updateTab({input: Inputs.Food});
                                       }});
        }
    }

    
    // updateTable(data, selector): Updates the data in the table
    // Note:
    // - based off Jquery's Datatables: https://datatables.net/
    updateTable(selector, columnInfo, data) {
        let dataTable;
        if (DataTable.isDataTable(selector)) {
            dataTable = $(selector).DataTable();
            dataTable.destroy();
        }

        const dataTableTranslations = Translation.translate("dataTable", { returnObjects: true });
        dataTable = $(selector).DataTable({
            language: dataTableTranslations,
            columns: columnInfo,
            scrollCollapse: true,
            scrollX: true,
            scrollY: '300px'
        });

        dataTable.clear();
        dataTable.rows.add(data);
        dataTable.draw();
    }

    // updateVisuals(): Updates the visuals in the app
    updateVisuals() {
        // update the tables
        const tableData = this.model.getTableData();
        if (tableData !== undefined) {
            const translations = Translation.translate("tableCols",{ returnObjects: true });
            const tableColInfo = [
                {title: translations[SummaryAtts.FoodName], data: SummaryAtts.FoodName},
                {title: translations[SummaryAtts.Microorganism], data: SummaryAtts.Microorganism},
                {title: translations[SummaryAtts.PercentDetected], data: SummaryAtts.PercentDetected},
                {title: translations[SummaryAtts.Detected], data: SummaryAtts.Detected},
                {title: translations[SummaryAtts.Samples], data: SummaryAtts.Samples},
                {title: translations[SummaryAtts.ConcentrationMean], data: SummaryAtts.ConcentrationMean},
                {title: translations[SummaryAtts.ConcentrationRange], data: SummaryAtts.ConcentrationRange},
                {title: translations[SummaryAtts.SamplesWithConcentration], data: SummaryAtts.SamplesWithConcentration}
            ];

            this.updateTable("#visualTable", tableColInfo, tableData);
        }

        const graphData = this.model.getGraphData();
        const tab = this.model.getActiveTab();
        let summaryAtt;

        if (graphData !== undefined && tab == Tabs[Pages.Overview].ByMicroorganism) {
            summaryAtt = SummaryAtts.FoodName;
            const tableColInfo = [
                {title: "Food Name", data: SummaryAtts.FoodName},
                {title: "# of Samples", data: SummaryAtts.Samples},
                {title: "# of Detected", data: SummaryAtts.Detected},
                {title: "# of Not Detected", data: SummaryAtts.NotDetected},
                {title: "# of Not Tested", data: SummaryAtts.NotTested}
            ];

            this.updateTable("#tempGraphTable", tableColInfo, graphData);

        } else if (tab == Tabs[Pages.Overview].ByFood) {
            summaryAtt = SummaryAtts.Microorganism;
            const tableColInfo = [
                {title: "Microorganism", data: SummaryAtts.Microorganism},
                {title: "# of Samples", data: SummaryAtts.Samples},
                {title: "# of Detected", data: SummaryAtts.Detected},
                {title: "# of Not Detected", data: SummaryAtts.NotDetected},
                {title: "# of Not Tested", data: SummaryAtts.NotTested}
            ];

            this.updateTable("#tempGraphTable", tableColInfo, graphData);
        }

        if (graphData !== undefined) {
            let overviewGraph = this.graphs[this.model.pageName][tab];
            if (overviewGraph === undefined) {
                overviewGraph = new OverviewBarGraph(this.model, summaryAtt);
                this.graphs[this.model.pageName][tab] = overviewGraph;
            }

            overviewGraph.update();
        }
    }

    // updateTab(input): Updates visuals on a certain tab
    updateTab({input = null, updateFilters = true} = {}) {
        this.updateMenuNames();
        const page = this.model.pageName;
        const tab = this.model.activeTabs[page];

        // update the filters
        let justInitialized = this.model.setupTab();
        let needsRerender = this.model.getNeedsRerender();

        if (!justInitialized && updateFilters) {
            this.model.updateTab({input});
        }

        if (needsRerender || updateFilters || justInitialized) {
            this.updateMenuFilters(input);
            this.updateGraphOptions();
            this.model.needsRerender[page][tab] = false;
        }

        this.updateVisuals();
    }

    // updateTrendsOverTime(): Updates the "Trends Over Time" page
    updateTrendsOverTime() {
        this.model.pageName = Pages.TrendsOverTime;
        this.menuTabs = this.page.selectAll(".mainMenuContainer .nav-link");

        /* ------- update the text of the menu ------------ */

        // menu tabs
        this.menuTabs.text((data, ind, elements) => {
            const tab = d3.select(elements[ind]);
            const tabValue = tab.attr("value");
            return Translation.translate(`TrendsOverTimeTabs.${tabValue}`);
        });

        this.updateMenuNames();

        /* ------------------------------------------------ */

        this.setupMenuTabs();
    }

    // updateOverview(): Updates the "overview" page
    updateOverview() {
        this.model.pageName = Pages.Overview;
        this.menuTabs = this.page.selectAll(".mainMenuContainer .nav-link");

        /* ------- update the text of the menu ------------ */

        this.menuTabs.text((data, ind, elements) => {
            const tab = d3.select(elements[ind]);
            const tabValue = tab.attr("value");
            return Translation.translate(`OverviewTabs.${tabValue}`);
        });

        this.updateMenuNames();

        /* ------------------------------------------------ */

        this.setupMenuTabs();
    }

    // updateLoadingPage(): Updates the "loading" page
    updateLoadingPage() {
        // change the text of the loading bubbles for accessbility purposes
        d3.selectAll(".loadingContainer .spinner-grow span").text(Translation.translate("loading"));
    }

    // =================================================================
}


//////////
// MAIN //
//////////

Translation.register(TranslationObj);
let model = new Model();

let app = new App(model);
app.init(Pages.Loading);

Promise.all([model.load()]).then(() => {
    app.loadMainPage();
});