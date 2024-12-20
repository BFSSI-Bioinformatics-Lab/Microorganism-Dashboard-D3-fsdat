import { SummaryAtts, Themes, Dims } from "../constants.js";
import { BaseGraph } from "./baseGraph.js";


export class TrendsOverTimeGraph extends BaseGraph {
    constructor(app, model, mainSummaryAtt, subSummaryAtt) {
        super(model);
        this.app = app;
        this.mainSummaryAtt = mainSummaryAtt;
        this.subSummaryAtt = subSummaryAtt;
    }

    setup() {
        super.setup();

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.trendsOverTimeGraph.HeadingFontSize)
            .attr("x", Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth / 2)
            .attr("y", Dims.trendsOverTimeGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");
    }

    buildSubGraph(data) {
        // Specify the chart’s dimensions.
        const width = 928;
        const height = 600;
        const marginTop = 10;
        const marginRight = 10;
        const marginBottom = 20;
        const marginLeft = 40;

        console.log("BOOOOYYYYAYAAYAY");

        // Prepare the scales for positional and color encodings.
        // Fx encodes the state.
        const fx = d3.scaleBand()
            .domain(new Set(data.map(d => d[SummaryAtts.DateTime])))
            .rangeRound([marginLeft, width - marginRight])
            .paddingInner(0.1);

        // Both x and color encode the age class.
        const subAtts = new Set(data.map(d => d[this.subSummaryAtt]));
        console.log("AGE SIZEEEEE: ", subAtts.size);

        const x = d3.scaleBand()
            .domain(subAtts)
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

        const subAttColours = [];
        const themeGraphColours = Themes[this.app.theme].graphColours;
        const themeMaxGraphColours = themeGraphColours.length;

        // get the different colours for each bar
        for (let i = 0; i < subAtts.size; ++i) {
            console.log("IDDER: ", i);
            const colourInd = i % themeMaxGraphColours; 
            subAttColours.push(`var(--graphColours${colourInd})`);
        }

        const color = d3.scaleOrdinal()
            .domain(subAtts)
            .range(subAttColours)
            .unknown("#ccc");

        // Y encodes the height of the bar.
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[SummaryAtts.Detected])]).nice()
            .rangeRound([height - marginBottom, marginTop]);

        // A function to format the value in the tooltip.
        const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

        // Append a group for each state, and a rect for each age.
        this.svg.append("g")
            .selectAll()
            .data(d3.group(data, d => d[SummaryAtts.DateTime]))
            .join("g")
            .attr("transform", ([dateTime]) => `translate(${fx(dateTime)},0)`)
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .attr("x", d => x(d[this.subSummaryAtt]))
            .attr("y", d => y(d[SummaryAtts.Detected]))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d[SummaryAtts.Detected]))
            .attr("fill", d => color(d[this.subSummaryAtt]));

        // Append the horizontal axis.
        this.svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());

        // Append the vertical axis.
        this.svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove());

        // Return the chart with the color scale as a property (for the legend).
        return Object.assign(this.svg.node(), {scales: {color}});
    }

    update() {
        let data = structuredClone(this.model.getGraphData());
        const inputs = this.model.getInputs();

        const dataEmpty = $.isEmptyObject(data);

        // Display the "No Data" text when no data is available
        if (dataEmpty && !this.noDataDrawn) {
            this.drawNoData();
        }

        if (dataEmpty) return;

        // get the dimensions of the container holding the graph
        const graphContainer = d3.select(".visualGraph").node();
        const graphContainerDims = graphContainer.getBoundingClientRect();
        Dims.overviewBarGraph.GraphWidth = Math.max(Dims.trendsOverTimeGraph.minGraphWidth, graphContainerDims.width - Dims.trendsOverTimeGraph.GraphLeft - Dims.trendsOverTimeGraph.GraphRight); 

        // Compute the height from the number of stacks and compute the width based off the screen.
        const prevWidth = this.width;
        this.height = 600;
        this.width = Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth + Dims.trendsOverTimeGraph.GraphRight;

        if (!this.isDrawn) {
            this.setup();
            this.isDrawn = true;
            this.noDataDrawn = false;
        }

        for (const mainKey in data) {
            this.buildSubGraph(data[mainKey]);
            break;
        }
    }
}