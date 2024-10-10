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


import { Pages, DefaultPage, PageSrc, DefaultLanguage, TranslationObj, ThemeNames, Themes, DefaultTheme, DefaultTabs, TrendsOverTimeTabs} from "./constants.js"
import { Translation } from "./tools.js";
import { Model } from "./backend.js";


// App: The class for the overall application
class App {
    constructor(model) {
        this.model = model;
        this.lang = DefaultLanguage;
        this.theme = DefaultTheme;
    }

    // init(): Initializes the entire app
    async init() {
        const self = this;
        this.changeLanguage(self.lang);

        // setup the header
        this.setupHeader();

        // global theme variables
        this.themeVars = document.querySelector(':root');
        this.setTheme();

        this.loadMainPage();
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

                self.setSelectedOpt(selectedHeader, activeHeader, data, (selectedOpt, data) => {
                    // load the new page
                    const page = data;
                    if (page) {
                        self.model.pageName = page;
                        self.loadMainPage();
                    }
                });
            });

        // register the link to change the language
        this.headerLink = d3.select(".headerOption:last-child");
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        this.headerLink.on("click", (event) => { 
            const newLanguage = this.headerLink.attr("value");
            self.changeLanguage(newLanguage);

            self.updateHeaderText();
            self.updateMainPage();
        });

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

    // Loads the selected main page for the app
    loadMainPage() {
        const self = this;
        $("#mainPage").load(PageSrc[self.model.pageName], function() { self.updateMainPage(); });
    }

    // updateMainPage(): Updates the entire main page without loading its corresponding HTML
    updateMainPage() {
        this.page = d3.select(".pageContainer");
        
        if (this.model.pageName == Pages.TrendsOverTime) {
            this.updateTrendsOverTime();
        } else if (this.model.pageName == Pages.Overview) {
            this.updateOverview();
        }

        // load the multiselect options
        // This is a bug in the bootstrap-select library, requiring the multiselect widget to be manually initialized if
        //  the multiselect is dynamically added into the HTML (we dynamically add the multiselect by calling the .load function using JQuery)
        //
        // https://github.com/snapappointments/bootstrap-select/issues/2606
        $(".multiSelect").selectpicker();
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
        d3.select(`.menu .tab-pane[value="${activeTab}"]`)
            .classed("show", true)
            .classed("active", true);

        // when a tab is switched/clicked
        this.menuTabs.on("click", (event) => {
            const tab = d3.select(event.target);
            const tabValue = tab.attr("value");
            this.model.activeTabs[this.model.pageName] = tabValue;
            this.model.setupTab();
        });

        // load the data for the tab
        this.model.setupTab();
    }

    // updateMenuFilterNames(): Updates the names for the filters
    updateMenuFilterNames() {
        this.page.selectAll(".menuTab").each((tabData, tabInd, tabElements) => {
            const tab = d3.select(tabElements[tabInd]);
            const tabValue = tab.attr("value");

            tab.selectAll(".menuFilterHeading button span").text((filterData, filterInd, filterElements) => {
                const filter = d3.select(filterElements[filterInd]);
                const filterValue = filter.attr("value");
                return Translation.translate(`filterNames.${this.model.pageName}.${tabValue}.${filterValue}`);
            });
        });
    }

    // updateTrendsOverTime(): Updates the "Trends Over Time" page
    updateTrendsOverTime() {
        this.menuTabs = this.page.selectAll(".mainMenuContainer .nav-link");
        this.setupMenuTabs();

        function getTree() {
            // Some logic to retrieve, or generate tree structure
            return [{
                text: "All Microrganisms",
                nodes: [
                    {
                        text: "Parent 1",
                        nodes: [
                          {
                            text: "Child 1",
                            nodes: [
                              {
                                text: "Grandchild 1"
                              },
                              {
                                text: "Grandchild 2"
                              }
                            ]
                          },
                          {
                            text: "Child 2"
                          }
                        ]
                      },
                      {
                        text: "Parent 2"
                      },
                      {
                        text: "Parent 3"
                      },
                      {
                        text: "Parent 4"
                      },
                      {
                        text: "Parent 5"
                      }
                ]
            }];
          }
          
        let treeData = getTree();
        let tree = $('#tree');
        tree.treeview({data: treeData,
                       backColor: "var(--primaryBg)",
                       borderColor: "var(--secondaryBorderColour)",
                       color: "var(--fontColour)",
                       onhoverColor: "var(--primaryHover)",
                       selectedBackColor: "var(--primary)",
                       selectedColor: "var(--primaryBgHover)",
                       collapseIcon: 'fas fa-chevron-down',
                       expandIcon: 'fas fa-chevron-right',
                       checkedIcon: 'far fa-check-square',
                       uncheckedIcon: 'far fa-square',
                       showCheckbox: true,
                       showIcon: true,
                       multiSelect: true,
                       levels: 1
        });

        tree.on('nodeChecked', function(event, node) {
            tree.data("treeview").selectNode(node.nodeId, { silent: true });
            if (node.nodes === undefined) return;

            for (const n of node.nodes) {
                tree.data('treeview').checkNode(n.nodeId);
            }
        });

        tree.on('nodeUnchecked', function(event, node) {
            tree.data("treeview").unselectNode(node.nodeId, { silent: true });
            if (node.nodes === undefined) return;

            for (const n of node.nodes) {
                tree.data('treeview').uncheckNode(n.nodeId);
            }
        });

        tree.on("nodeSelected", function(event, node) {
            tree.data('treeview').checkNode(node.nodeId);
        });

        tree.on("nodeUnselected", function(event, node) {
            tree.data('treeview').uncheckNode(node.nodeId);
        });

        /* ------- update the text of the menu ------------ */

        // menu tabs
        this.menuTabs.text((data, ind, elements) => {
            const tab = d3.select(elements[ind]);
            const tabValue = tab.attr("value");
            return Translation.translate(`TrendsOverTimeTabs.${tabValue}`);
        });

        this.updateMenuFilterNames();
        d3.selectAll("#foodGroupLabel").text(Translation.translate("foodGroupLabel"));
        d3.selectAll("#foodLabel").text(Translation.translate("foodLabel"));
        d3.selectAll("#microorganismLabel").text(Translation.translate("microorganismLabel"));

        /* ------------------------------------------------ */
    }

    // updateOverview(): Updates the "overview" page
    updateOverview() {
        this.menuTabs = this.page.selectAll(".mainMenuContainer .nav-link");
        this.setupMenuTabs();

        /* ------- update the text of the menu ------------ */

        this.menuTabs.text((data, ind, elements) => {
            const tab = d3.select(elements[ind]);
            const tabValue = tab.attr("value");
            return Translation.translate(`OverviewTabs.${tabValue}`);
        });

        this.updateMenuFilterNames();

        /* ------------------------------------------------ */
    }

    // =================================================================
}


//////////
// MAIN //
//////////

Translation.register(TranslationObj);
let model = new Model();
await model.load();

let app = new App(model);
await app.init();