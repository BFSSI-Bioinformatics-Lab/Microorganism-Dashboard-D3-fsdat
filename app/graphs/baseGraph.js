import { NoDataStates, SVGIcons } from "../constants.js";
import { Translation, NumberTools } from "../tools.js";


export class BaseGraph {
    constructor(model) {
        this.model = model;
        this.isDrawn = false;
        this.noDataDrawn = false;
        this.title = "";
        this.svg;
    }

    // hideTooltip(tooltip): Hides the tooltips
    hideTooltip(tooltip) {
        tooltip.group.attr("opacity", 0)
            .style("pointer-events", "none");
    }

    // drawNoData(): Draws the label and image when there is no data to display for the graph
    drawNoData() {
        const noDataContainer = d3.select(".visualGraph")
        .html("")
        .append("div")
        .classed("emptyGraphsContainer", true)
        .append("div")
        .classed("emptyGraphTextContainer", true);

        // No Data available title
        noDataContainer.append("h1")
            .text(Translation.translate("noData"));

        const descHitRate = NumberTools.randomInt(1, 100);

        let noDataState = NoDataStates.Normal;
        if (descHitRate <= 5) noDataState = NoDataStates.Doggy;
        else if (descHitRate <= 10) noDataState = NoDataStates.Kitty;

        noDataContainer.append("p")
            .text(Translation.translate(`noDataDesc.${noDataState}`));

        if (noDataState == NoDataStates.Normal) {
            noDataContainer.append("svg")
            .classed("emptyGraphIcon", true)
            .attr("viewBox", "0 0 512 512")
            .attr("width", "512")
            .attr("height", "512")
            .html(SVGIcons["MagnifyingGlass"]);
        
        // Easter Egg??!
        } else {
            const imgLink = noDataState == NoDataStates.Doggy ? "assets/puppy.png" : "assets/kitty.png";
            noDataContainer.append("img")
                .classed("emptyGraphIcon", true)
                .attr("src", imgLink);
        }

        this.isDrawn = false;
        this.noDataDrawn = true;
    }

    setup() {
        // create the SVG component
        this.svg = d3.select(".visualGraph")
            .html("")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .classed("svgGraph", true)
            .on("touchstart", (event) => {
                if (this.shownTooltip === undefined) return;
                this.hideTooltip(this.shownTooltip);
                this.shownTooltip = undefined;
            });

        // create the background for the graph
        this.background = this.svg.append("rect")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height);
    }

    update() {

    }
}