import { Pages, DefaultPage, PageSrc, Languages, DefaultLanguage, TranslationObj, ThemeNames, Themes, DefaultTheme } from "./constants.js"
import { Translation } from "./tools.js";


class App {
    constructor() {
        this.page = DefaultPage;
        this.lang = DefaultLanguage;
        this.theme = DefaultTheme;
    }

    // init(): Initializes the entire app
    init() {
        const self = this;
        Translation.register(TranslationObj);
        this.changeLanguage(self.lang);

        // load all the seperate HTML pages needed
        $("#header").load("./static/header/header.html", () => { self.setupHeader(); }); 
        $("#footer").load("./static/footer/footer.html");

        this.loadMainPage();
    }

    // setupHeader(): Setup the header needed for the app
    setupHeader() {
        const self = this;
        d3.selectAll(".navBarContainer .nav-item .nav-link")
            .on("click", (event) => {self.setActiveNavOption(event);}); 

        // register the link to change the language
        this.headerLink = d3.select(".headerOption:last-child");
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        this.headerLink.on("click", (event) => { 
            const newLanguage = this.headerLink.attr("value");
            self.changeLanguage(newLanguage);
            self.updateText();
        });

        // add the different options for the theme
        d3.select("#themeDropdownMenu")
            .selectAll("li")
            .data(Object.values(ThemeNames))
            .enter()
            .append("li")
            .append("a")
            .attr("class", "dropdown-item themeDropdownItem")
            .attr("href", "#")
            .attr("value", (d) => d)
            .on("click", (event) => {
                const themeLink = d3.select(event.target);
                self.theme = themeLink.attr("value");
                console.log(self.theme);
            })

        self.updateText();
    }

    // setActiveNavOption(event): Changes which option in the navigation bar is selected
    setActiveNavOption(event) {
        let selectedHeader = event.target;
        if (selectedHeader.nodeName == "DIV") {
            selectedHeader = selectedHeader.parentElement;
        }

        selectedHeader = d3.select(selectedHeader);
        const activeHeader = d3.select(".navBarContainer .nav-item .nav-link.active");

        activeHeader.classed("active", false);
        selectedHeader.classed("active", true);
        
        // load the new page
        const page = selectedHeader.attr("value");
        if (page) {
            this.page = page;
            this.loadMainPage();
        }
    }

    setActiveTheme(event) {

    }

    // Changes the language registered on the website
    changeLanguage(newLanguage) {
        const website = d3.select("html");
        website.attr("lang", newLanguage);
        i18next.changeLanguage(newLanguage);
        this.lang = newLanguage;
    }
    
    // updateText(): Updates the text throughout the document
    updateText() {
        document.title = Translation.translate("websiteTabTitle");
        document.querySelector('meta[name="description"]').setAttribute("content", Translation.translate("websiteDescriptions"));

        this.updateHeaderText();
    }

    // updateHeaderText(): Changes the text in the header based off the language
    updateHeaderText() {
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

    // Loads the selected main page for the app
    loadMainPage() {
        const self = this;
        $("#mainPage").load(PageSrc[self.page], function() { self.setupMainPage(); });
    }

    setupMainPage() {
        if (this.page == Pages.PrevalenceOverTime) {
            this.setupPrevalenceOverTime();
        } else if (this.page == Pages.PrevalenceOverview) {
            this.setupPrevalenveOverview();
        }
    }

    setupPrevalenceOverTime() {

    }

    setupPrevalenveOverview() {

    }
}


//////////
// MAIN //
//////////

let app = new App();
app.init();