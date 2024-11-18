import {  SummaryAtts, SampleStateColours, SampleStateOrder, Dims, SampleState, TextWrap, Inputs, NumberView } from "../constants.js";
import { SetTools, Translation, Visuals, NumberTools } from "../tools.js";

export class OverviewBarGraph {
    constructor(model) {
        this.model = model;
        this.isDrawn = false;
    }

    // getPercentageData(data): Converts the data to be used for the percentage view of the graph
    getPercentageData(data) {
        for (const row of data) {
            const numOfSamples = row[SummaryAtts.Samples] - row[SummaryAtts.NotTested];
            row[SummaryAtts.Detected] = NumberTools.toPercent(row[SummaryAtts.Detected], numOfSamples);
            row[SummaryAtts.NotDetected] = NumberTools.toPercent(row[SummaryAtts.NotDetected], numOfSamples);
        }

        return data;
    }

    getGroupedData(data, numberView) {
        const result = [];
        const sampleStates = new Set([SummaryAtts.Detected, SummaryAtts.NotDetected]);
        if (numberView == NumberView.Number) {
            sampleStates.add(SummaryAtts.NotTested);
        }

        for (const state of sampleStates) {
            const keysToRemove = SetTools.difference([sampleStates, new Set([state])], true);

            for (const row of data) {
                let currentRow = structuredClone(row);
                keysToRemove.forEach((key) => delete currentRow[key]);

                currentRow[SummaryAtts.State] = state;
                currentRow[SummaryAtts.StateVal] = currentRow[state];
                delete currentRow[state];
                result.push(currentRow);
            }
        }

        return result;
    }

    // drawLegend(titleToColours, legendXPos): Draws the legend
    drawLegend(titleToColours, legendXPos){

        // ----------------- draws the legend ---------------------
        
        // attributes for the legend
        const legendItemPaddingHor = 0;
        const legendItemPaddingVert = 2;
        const legendItemTextPaddingHor = 5;
        const legendItemTextPaddingVert = 0;
        const legendItemFontSize = Dims.overviewBarGraph.LegendFontSize;
        const legendData = Object.entries(titleToColours);
        const colourBoxWidth = Dims.overviewBarGraph.LegendSquareSize;
        const colourBoxHeight = Dims.overviewBarGraph.LegendSquareSize;
        const legendItems = [];
        let currentLegendItemYPos = 0;
        
        // draw the container to hold the legend
        const legendGroup = this.svg.append("g")
            .attr("transform", `translate(${legendXPos}, ${Dims.overviewBarGraph.GraphTop})`);

        // draw all the keys for the legend
        const legendDataLen = legendData.length;
        for (let i = 0; i < legendDataLen; ++i) {
            let legendKeyText = legendData[i][0];
            let legendKeyColour = legendData[i][1];

            // ***************** draws a key in the legend *********************
            
            const legendItemGroup = legendGroup.append("g")
            .attr("transform", `translate(0, ${currentLegendItemYPos})`);
    
            // draw the coloured box
            const colourBox = legendItemGroup.append("rect")
                .attr("y", legendItemPaddingVert)
                .attr("x", legendItemPaddingHor)
                .attr("width", colourBoxWidth)
                .attr("height", colourBoxHeight)
                .attr("fill", legendKeyColour);
    
            // draw the text
            const textX = legendItemPaddingHor + colourBoxWidth + legendItemTextPaddingHor;
            const textY = legendItemTextPaddingVert;
            const textGroup = legendItemGroup.append("text")
                .attr("y", legendItemPaddingVert)
                .attr("x", textX)
                .attr("font-size", legendItemFontSize)
                .attr("fill", "var(--fontColour)");
    
            Visuals.drawText({textGroup, fontSize: legendItemFontSize, textWrap: TextWrap.NoWrap, text: legendKeyText, textX, textY});

            const legendItem = {group: legendItemGroup, colourBox, textGroup, name: legendKeyText, colour: legendKeyColour};

            // *****************************************************************

            currentLegendItemYPos += legendItemPaddingVert + legendItemGroup.node().getBBox()["height"];
            currentLegendItemYPos += legendItemPaddingVert;


            legendItems.push(legendItem);
        }

        // --------------------------------------------------------
    }

    // setup(): Initializes the graph
    setup() {
        // create the SVG component
        this.svg = d3.select(".visualGraph")
            .html("")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .attr("style", "max-width: 100%; height: auto;");

        // create the background for the graph
        this.svg.append("rect")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height)

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.overviewBarGraph.HeadingFontSize)
            .attr("x", Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth / 2)
            .attr("y", Dims.overviewBarGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");

        this.axes = this.svg.append("g");

        // x-axis
        this.xAxis = this.axes.append("g");
        this.xAxisLine = this.xAxis.append("g")
            .attr("transform", `translate(0, ${Dims.overviewBarGraph.GraphTop})`);

        this.xAxisLabel = this.xAxis.append("text").attr("font-size", Dims.overviewBarGraph.AxesFontSize)
            .attr("x", Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth / 2)
            .attr("y", Dims.overviewBarGraph.GraphTop - Dims.overviewBarGraph.AxesFontSize * 2)
            .attr("fill", "var(--fontColour)");

        this.xAxisScale = d3.scaleLinear()
            .range([Dims.overviewBarGraph.GraphLeft, Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth]);

        // y-axis
        this.yAxis = this.axes.append("g")
        this.yAxisLine = this.yAxis.append("g")
            .attr("transform", `translate(${Dims.overviewBarGraph.GraphLeft}, 0)`);

        this.yAxisLabel = this.yAxis.append("text").attr("font-size", Dims.overviewBarGraph.AxesFontSize)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("y", Dims.overviewBarGraph.GraphLeft / 4)
            .attr("x", -(this.height / 2))
            .attr("fill", "var(--fontColour)");

        this.yAxisScale =  d3.scaleBand()
            .range([Dims.overviewBarGraph.GraphTop, this.height - Dims.overviewBarGraph.GraphBottom])
            .padding(0.08);

        // bars in the graph
        this.bars = this.svg.append("g");
    }

    // reference: https://observablehq.com/@d3/stacked-horizontal-bar-chart/2
    update() {
        let data = structuredClone(this.model.getGraphData());
        const inputs = this.model.getInputs();

        if (data.length == 0) {
            d3.select(".visualGraph")
            .html("")
            .append("h1")
            .text(Translation.translate("noData"));

            this.isDrawn = false;
            return
        }

        // update the data to percentage view
        const numberView = inputs[Inputs.NumberView];
        if (numberView !== undefined && numberView == NumberView.Percentage) {
            data = this.getPercentageData(data, numberView);
        }

        data = this.getGroupedData(data, numberView);

        // Determine the series that need to be stacked.
        let seriesKeys = new Set(SampleStateOrder);
        seriesKeys.delete(SampleState.InConclusive);
        if (numberView == NumberView.Percentage) {
            seriesKeys.delete(SampleState.NotTested);
        }

        const series = d3.stack()
        .keys(seriesKeys) // distinct series keys, in input order
        .value(([, D], key) => D.get(key)[SummaryAtts.StateVal]) // get value for each series key and stack
        (d3.index(data, d => d[SummaryAtts.FoodName], d => d[SummaryAtts.State])); // group by stack then series key

        // Compute the height from the number of stacks.
        this.height = series[0].length * Dims.overviewBarGraph.BarHeight + Dims.overviewBarGraph.GraphTop + Dims.overviewBarGraph.GraphBottom;
        this.width = Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth + Dims.overviewBarGraph.GraphRight;

        if (!this.isDrawn) {
            this.setup();
            this.isDrawn = true;
        }

        // # of samples in x-axis
        this.xAxisScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        this.xAxisLine
            .call(d3.axisTop(this.xAxisScale).ticks(Dims.overviewBarGraph.GraphWidth / 100, "s"))
            .attr("font-size", Dims.overviewBarGraph.TickFontSize);

        // food names in the y-axis
        // sort by "risk" defined by the sorting order below:
        // 1. Sort by % detected (descending)
        // 2. Sort by # samples (descending)
        // 3. Sort by Name (alphabetical order)
        this.yAxisScale.domain(d3.groupSort(data, (group1, group2) => {
            const percentDetected1 = group1[0][SummaryAtts.PercentDetected];
            const percentDetected2 = group2[0][SummaryAtts.PercentDetected];
            if (percentDetected1 > percentDetected2) {
                return -1;
            } else if (percentDetected1 < percentDetected2) {
                return 1;
            }

            const samples1 = group1[0][SummaryAtts.Samples];
            const samples2 = group2[0][SummaryAtts.Samples];
            if (samples1 > samples2) {
                return -1
            } else if (samples1 < samples2) {
                return 1;
            }

            const name1 = group1[0][SummaryAtts.FoodName];
            const name2 = group2[0][SummaryAtts.FoodName];
            if (name1 > name2) {
                return 1;
            } else if (name1 < name2) {
                return -1;
            }

            return 0;
        }, d => d[SummaryAtts.FoodName]));

        this.yAxisLine
            .call(d3.axisLeft(this.yAxisScale).tickSizeOuter(0))
            .attr("font-size", Dims.overviewBarGraph.TickFontSize);

        // draw the wrapped text for the food names
        this.yAxisLine.selectAll(".tick text").each((data, ind, textElements) => {
            const textGroup = d3.select(textElements[ind]);
            const textWidth = Dims.overviewBarGraph.FoodNameWidth;
            textGroup.text("").attr("dy", null);

            let textY = -Dims.overviewBarGraph.TickFontSize * 3 / 4;
            const textResult = Visuals.drawText({textGroup: textGroup, text: data, width: textWidth, fontSize: Dims.overviewBarGraph.TickFontSize, 
                                                 textY, textX: -10});
            
            if (textResult.numLines > 1) {
                textY = -(textResult.numLines / 2 * Dims.overviewBarGraph.TickFontSize);
                textGroup.attr("transform", `translate(0, ${textY})`);
            }
        });

        // colours of the graph
        const stateColours = SampleStateOrder.map((state) => SampleStateColours[state]);
        const color = d3.scaleOrdinal()
            .domain(SampleStateOrder)
            .range(stateColours)
            .unknown("var(--unknown)");

        // text for the heading and axis labels
        this.heading.text(Translation.translate("overviewByMicroorganism.graphTitle"));
        this.xAxisLabel.text(Translation.translate(`overviewByMicroorganism.xAxis.${numberView}`));
        this.yAxisLabel.text(Translation.translate("overviewByMicroorganism.yAxis"));

        // Append a group for each series, and a rect for each element in the series.
        this.bars.append("g")
            .selectAll()
            .data(series)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(D => D.map(d => (d.key = D.key, d)))
            .join("rect")
            .attr("x", d => this.xAxisScale(d[0]))
            .attr("y", d => this.yAxisScale(d.data[0]))
            .attr("height", this.yAxisScale.bandwidth())
            .attr("width", d => this.xAxisScale(d[1]) - this.xAxisScale(d[0]))
            .append("title")
            .text(d => `${d.data[0]} ${d.key}\n${d.data[1].get(d.key)[SummaryAtts.StateVal]}`);

        // colours for the legend
        const legendStates = [SampleState.Detected, SampleState.NotDetected];
        if (numberView == NumberView.Number) {
            legendStates.push(SampleState.NotTested);
        }

        const legendColours = {};
        for (const state of legendStates) {
            legendColours[Translation.translate(`qualitativeResults.${state}`)] = SampleStateColours[state];
        }

        // draw the legend
        const legendX = Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth + Dims.overviewBarGraph.LegendLeftMargin;
        this.drawLegend(legendColours, legendX);

        // Return the chart with the color scale as a property (for the legend).
        return Object.assign(this.svg.node(), {scales: {color}});
    }
}