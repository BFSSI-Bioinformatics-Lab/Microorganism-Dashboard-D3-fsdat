import { SummaryAtts, Themes, Dims, Inputs, TimeGroup, NumberView } from "../constants.js";
import { BaseGraph } from "./baseGraph.js";
import { Visuals, Translation } from "../tools.js";


export class TrendsOverTimeGraph extends BaseGraph {
    constructor(app, model, mainSummaryAtt, subSummaryAtt) {
        super(model);
        this.app = app;
        this.mainSummaryAtt = mainSummaryAtt;
        this.subSummaryAtt = subSummaryAtt;
    }

    // setup(): Performs any initial one-time setup on the graph
    // References:
    //  Pannable (scrollable) graph: https://observablehq.com/@d3/pannable-chart
    setup() {
        super.setup();
        this.svg.classed("svgGraph", false)
            .style("position", "absolute")
            .style("display", "flex")
            .style("margin", "auto")
            .style("max-width", "100%");

        this.origWidth = Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.OrigGraphWidth + Dims.trendsOverTimeGraph.GraphRight;

        this.scrollableSvgContainer = this.graph
            .append("div")
            .style("overflow-x", "scroll")
            .style("-webkit-overflow-scrolling", "touch")
            .style("position", "relative");
        
        this.scrollableSvg = this.scrollableSvgContainer
            .append("svg")
            .style("display", "block")
            .style("position", "relative");

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.trendsOverTimeGraph.HeadingFontSize)
            .attr("y", Dims.trendsOverTimeGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");

        // subgraphs
        this.subgraphs = this.svg.append("g")
            .attr("transform", `translate(0, ${Dims.trendsOverTimeGraph.GraphTop})`);

        this.scrollableSubGraphs = this.scrollableSvg.append("g")
            .attr("transform", `translate(0, ${Dims.trendsOverTimeGraph.GraphTop})`);
    }

    // buildSubGraph(keyName, data, subGraphYPos, timeRange, timeGroup, subAtts, maxDetected, maxDetected)
    buildSubGraph(keyName, data, subGraphYPos, timeRange, timeGroup, subAtts, maxDetected, numberView) {
        const subGraph = this.subgraphs.append("g")
            .attr("y", subGraphYPos);

        const graphBottom = Dims.trendsOverTimeGraph.SubGraphHeight - Dims.trendsOverTimeGraph.SubGraphMarginBottom + subGraphYPos;

        const scrollableSubGraph = this.scrollableSubGraphs.append("g")
            .attr("y", subGraphYPos)

        // Prepare the scales for positional and color encodings.
        // Fx encodes the state.
        const fx = d3.scaleBand()
            .domain(timeRange)
            .rangeRound([Dims.trendsOverTimeGraph.GraphLeft, this.scrollableWidth]);

        // Draw the group of bars
        const x = d3.scaleBand()
            .domain(subAtts)
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

        const subAttColours = [];
        const themeGraphColours = Themes[this.app.theme].graphColours;
        const themeMaxGraphColours = themeGraphColours.length;

        // get the different colours for each bar
        for (let i = 0; i < subAtts.size; ++i) {
            const colourInd = i % themeMaxGraphColours; 
            subAttColours.push(`var(--graphColours${colourInd})`);
        }

        const color = d3.scaleOrdinal()
            .domain(subAtts)
            .range(subAttColours)
            .unknown("#ccc");

        // Y encodes the height of the bar.
        const yAxisScale = d3.scaleLinear()
            .domain([0, maxDetected]).nice()
            .rangeRound([Dims.trendsOverTimeGraph.SubGraphHeight - Dims.trendsOverTimeGraph.SubGraphMarginBottom + subGraphYPos, Dims.trendsOverTimeGraph.SubGraphMarginTop + subGraphYPos]);

        // A function to format the value in the tooltip.
        const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

        // label for the name of the subgraph
        const keyText = subGraph.append("text")
            .attr("transform", `translate(0 , ${Dims.trendsOverTimeGraph.SubGraphHeight / 2 + subGraphYPos})`)
        Visuals.drawText({textGroup: keyText, text: keyName, fontSize: Dims.trendsOverTimeGraph.SubGraphKeyFontSize, width: this.getPresevedWidth(Dims.trendsOverTimeGraph.SubGraphKeyWidth, true)});

        // Append a group for each state, and a rect for each age.
        scrollableSubGraph.append("g")
            .selectAll()
            .data(d3.group(data, d => d[SummaryAtts.DateTime]))
            .join("g")
            .attr("transform", ([dateTime]) => {
                if (timeGroup == TimeGroup.Months) dateTime = this.formatMonth(moment(dateTime));
                if (timeGroup == TimeGroup.Years) dateTime = this.formatYear(moment(dateTime));
                return `translate(${fx(dateTime)},0)`
            })
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .attr("x", d => x(d[this.subSummaryAtt]))
            .attr("y", d => yAxisScale(d[SummaryAtts.Detected]))
            .attr("width", x.bandwidth())
            .attr("height", d => yAxisScale(0) - yAxisScale(d[SummaryAtts.Detected]))
            .attr("fill", d => color(d[this.subSummaryAtt]));

        // Append the X-axis
        scrollableSubGraph.append("g")
            .attr("transform", `translate(${-this.graphLeftPos} , ${graphBottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());

        subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            .attr("x", this.width / 2)
            .attr("y", graphBottom + Dims.trendsOverTimeGraph.AxesFontSize * 2)
            .attr("fill", "var(--fontColour)")
            .text(Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.xAxis.${timeGroup}`));

        // Append the Y-axis
        subGraph.append("g")
            .attr("transform", `translate(${this.graphLeftPos},0)`)
            .call(d3.axisLeft(yAxisScale).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove());

        subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("y", this.graphLeftPos - 30)
            .attr("x", -(subGraphYPos + Dims.trendsOverTimeGraph.SubGraphHeight / 2))
            .attr("fill", "var(--fontColour)")
            .text(Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.yAxis.${numberView}`));

        subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            

        // Return the chart with the color scale as a property (for the legend).
        return Object.assign(this.svg.node(), {scales: {color}});
    }

    // formatMonth(dateMoment): Retrieves the pretty string for displaying months
    formatMonth(dateMoment) {
        return dateMoment.format("YYYY MMM");
    }

    // formatYear(dateMoment): Retrieves the pretty string for displaying years
    formatYear(dateMoment) {
        return dateMoment.format("YYYY");
    }

    // getTimeRange(timeGroup, data): Retrieves the min/max datetime in the data
    getTimeRange(timeGroup, data) {
        if (timeGroup == TimeGroup.Overall) return [TimeGroup.Overall];

        const result = [];
        let minDate = null;
        let maxDate = null;
        
        // get the min and max dates in the data
        for (const mainKey in data) {
            const mainKeyData = data[mainKey];
            for (const dataPoint of mainKeyData) {
                const currentDate = dataPoint[SummaryAtts.DateTime];
                if (minDate === null || currentDate < minDate) minDate = currentDate;
                if (maxDate === null || currentDate > maxDate) maxDate = currentDate;
            }
        }

        // don't want the case of skipping a month when filling the months between the min and max date
        // eg. if the min date has its date of the month as 30, we will be skipping February (since February only has 28/29 days)
        minDate.setDate(1);
        maxDate.setDate(1);

        const timeGroupedByMonths = timeGroup == TimeGroup.Months;
        const timeGroupedByYears = timeGroup == TimeGroup.Years;
        
        // retrive the difference between the min and max dates
        const dateDiffUnits = timeGroupedByMonths ? 'months' : 'years';
        let dateDiff = moment(maxDate).diff(moment(minDate), dateDiffUnits, true);
        dateDiff = Math.ceil(dateDiff);
        
        // add in the other months/years in between the min and max date
        if (timeGroupedByMonths) {
            result.push(this.formatMonth(moment(minDate)));
        } else if (timeGroupedByYears) {
            result.push(this.formatYear(moment(minDate)));
        }
        
        const currentDate = new Date(minDate);

        for (let i = 0; i < dateDiff; ++i) {
            if (timeGroupedByMonths) {
                result.push(this.formatMonth(moment(currentDate.setMonth(currentDate.getMonth() + 1))));
            } else if (timeGroupedByYears) {
                result.push(this.formatYear(moment(currentDate.setFullYear(currentDate.getFullYear() + 1))));
            }
        }

        return result;
    }

    // getSubKeys(data): Retrieves all the keys for the subcategory of the graph
    getSubKeys(data) {
        const result = new Set();
        for (const mainKey in data) {
            const mainKeyData = data[mainKey];
            for (const dataPoint of mainKeyData) {
                result.add(dataPoint[this.subSummaryAtt]);
            }
        }

        return result;
    }

    // getMaxDetected(data): Retrieves the highest detected count out of all the data points
    getMaxDetected(data) {
        let result = null;
        for (const mainKey in data) {
            const mainKeyData = data[mainKey];
            for (const dataPoint of mainKeyData) {
                const currentDetected = dataPoint[SummaryAtts.Detected];
                if (result === null || currentDetected > result) {
                    result = currentDetected;
                }
            }
        }

        return result;
    }

    getPresevedWidth(width, isMinWidth = false) {
        const result = width / this.origWidth * this.width;
        if (isMinWidth) return Math.min(width, result);
        return result;
    }

    // onWindowResize(): Update the width of the graph when the browser window changes size
    onWindowResize() {
        if (!this.isDrawn) return;

        const graphContainer = d3.select(".visualGraph").node();
        const graphContainerDims = graphContainer.getBoundingClientRect();
        const newWidth = Dims.trendsOverTimeGraph.GraphLeft + Math.max(Dims.trendsOverTimeGraph.minGraphWidth, graphContainerDims.width - Dims.trendsOverTimeGraph.GraphLeft - Dims.trendsOverTimeGraph.GraphRight) + Dims.trendsOverTimeGraph.GraphRight;

        if (newWidth == this.width) return;
        this.update();
    }

    update() {
        super.update();

        this.app.windowResizeHandlers["trendsOverTimeGraph"] = () => this.onWindowResize();

        let data = structuredClone(this.model.getGraphData());
        const inputs = this.model.getInputs();
        const timeGroup = inputs[Inputs.TimeGroup];
        const numberView = inputs[Inputs.NumberView];

        const dataEmpty = $.isEmptyObject(data);

        // Display the "No Data" text when no data is available
        if (dataEmpty && !this.noDataDrawn) {
            this.drawNoData();
        }

        if (dataEmpty) return;

        // get the dimensions of the container holding the graph
        const graphContainer = d3.select(".visualGraph").node();
        const graphContainerDims = graphContainer.getBoundingClientRect();
        Dims.trendsOverTimeGraph.GraphWidth = Math.max(Dims.trendsOverTimeGraph.minGraphWidth, graphContainerDims.width - Dims.trendsOverTimeGraph.GraphLeft - Dims.trendsOverTimeGraph.GraphRight); 

        // Compute the height from the number of stacks and compute the width based off the screen.
        const dataKeysLen = Object.keys(data).length;
        this.height = Dims.trendsOverTimeGraph.GraphTop + dataKeysLen *  Dims.trendsOverTimeGraph.SubGraphHeight + Dims.trendsOverTimeGraph.GraphBottom;
        this.width = Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth + Dims.trendsOverTimeGraph.GraphRight;

        if (!this.isDrawn) {
            this.setup();
            this.isDrawn = true;
            this.noDataDrawn = false;
        }

        const timeRange = this.getTimeRange(timeGroup, data);
        const subKeys = this.getSubKeys(data);
        const maxDetected = numberView == NumberView.Number ? this.getMaxDetected(data) : 100;

        this.svg.attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", null); 

        this.graphLeftPos = this.getPresevedWidth(Dims.trendsOverTimeGraph.GraphLeft, true);
        this.scrollableWidth = Math.max(this.width, ((subKeys.size * Dims.trendsOverTimeGraph.SubGraphBarWidth) +  2 * Dims.trendsOverTimeGraph.SubGraphBarGroupMargin) * timeRange.length);

        this.scrollableSvgContainer
            .style("left", `${this.graphLeftPos}px`);

        this.scrollableSvg
            .attr("width", this.scrollableWidth)
            .attr("height", this.height)
            .attr("left", this.graphLeftPos);

        this.background.attr("width", this.width)
            .attr("height", this.height);

        // text for the heading and axis labels
        this.title = Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.graphTitle`);
        this.heading.text(this.title)
            .transition()
            .attr("x",  Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth / 2);

        this.subgraphs.selectAll("*").remove();
        this.scrollableSubGraphs.selectAll("*").remove();

        let currentSubGraphYPos = 0;
        for (const mainKey in data) {
            this.buildSubGraph(mainKey, data[mainKey], currentSubGraphYPos, timeRange, timeGroup, subKeys, maxDetected, numberView);
            currentSubGraphYPos += Dims.trendsOverTimeGraph.SubGraphHeight;
        }
    }
}