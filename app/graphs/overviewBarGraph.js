import {  SummaryAtts, SampleStateColours, SampleStateOrder, Dims, SampleState, TextWrap, Inputs, NumberView } from "../constants.js";
import { SetTools, Translation, Visuals, NumberTools } from "../tools.js";
import { BaseGraph } from "./baseGraph.js";

export class OverviewBarGraph extends BaseGraph {
    constructor(model, summaryAtt) {
        super(model);
        this.summaryAtt = summaryAtt;
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
    drawLegend(id, titleToColours, legendXPos){

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
        d3.select(`#${id}`).remove();
        const legendGroup = this.svg
            .append("g")
            .attr("id", id)
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
        super.setup();

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

        this.xAxisLabel = this.xAxis.append("text").attr("font-size", Dims.overviewBarGraph.AxesFontSize)
            .attr("x", Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth / 2)
            .attr("y", Dims.overviewBarGraph.GraphTop - Dims.overviewBarGraph.AxesFontSize * 2)
            .attr("fill", "var(--fontColour)");

        this.xAxisDomain = [0, 100];
        this.xAxisScale = d3.scaleLinear()
            .range([Dims.overviewBarGraph.GraphLeft, Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth])
            .domain(this.xAxisDomain);

        this.xAxisFunc = d3.axisTop(this.xAxisScale);
        this.xAxisLine = this.xAxis.append("g")
            .attr("transform", `translate(0, ${Dims.overviewBarGraph.GraphTop})`)
            .call(this.xAxisFunc);

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

        // source text
        this.sourceTextContainer = this.svg.append("g")
            .attr("transform", `translate(${Dims.overviewBarGraph.GraphLeft}, ${this.height - Dims.overviewBarGraph.GraphBottom})`);

        this.sourceText = this.sourceTextContainer.append("text")
            .attr("transform", `translate(${Dims.overviewBarGraph.FooterPaddingHor}, ${Dims.overviewBarGraph.FooterPaddingTop})`)
            .attr("font-size", Dims.overviewBarGraph.FooterFontSize)
            .attr("visibility", "hidden");

        // bars in the graph
        this.bars = this.svg.append("g");

        // tooltips
        this.tooltips = {};
        this.shownTooltip;
        this.tooltipGroup = this.svg.append("g")
    }

    /* Creates tooltip for hovering over bars */
    hoverTooltip({data, state, numberView, hide = false} = {}){
        const groupName = data[0];
        const stateData = data[1].get(state);
        const stateValue = stateData[SummaryAtts.StateVal];

        const colour = SampleStateColours[state];

        let numberDisplay = Translation.translateNum(`${stateValue}`);
        if (numberView == NumberView.Percentage) {
            numberDisplay += " %"
        } else if(numberView == NumberView.Number) {
            numberDisplay += " / " + Translation.translateNum(`${stateData[SummaryAtts.Samples]}`);
        }

        const lines = Translation.translate("overviewBarGraph.tooltip", { 
            returnObjects: true, 
            state,
            number: numberDisplay
        });
        
        // ------- draw the tooltip ------------

        // attributes for the tool tip
        const toolTip = {};
        let toolTipWidth = Dims.overviewBarGraph.TooltipMinWidth;
        let toolTipHeight = Dims.overviewBarGraph.TooltipHeight;
        const textGroupPosX = Dims.overviewBarGraph.TooltipBorderWidth + Dims.overviewBarGraph.TooltipPaddingHor +  Dims.overviewBarGraph.TooltipTextPaddingHor;
        let currentTextGroupPosY = Dims.overviewBarGraph.TooltipPaddingVert + Dims.overviewBarGraph.TooltipTextPaddingVert;

        const toolTipHighlightXPos = Dims.overviewBarGraph.TooltipPaddingHor + Dims.overviewBarGraph.TooltipBorderWidth / 2;

        // draw the container for the tooltip
        toolTip.group = this.tooltipGroup.append("g")
            .attr("opacity", hide ? 0 : 1)
            .on("touchstart", (event, data) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();

                if (this.shownTooltip === undefined) return;

                let currentOpacity = this.shownTooltip.group.attr("opacity");
                let newOpacity = Math.abs(currentOpacity - 1);
                this.shownTooltip.group
                    .attr("opacity", newOpacity)
                    .style("pointer-events", newOpacity ? "auto": "none");

                if (newOpacity == 0) {
                    this.shownTooltip = undefined;
                }
            });

        // draw the background for the tooltip
        toolTip.background = toolTip.group.append("rect")
            .attr("height", toolTipHeight)
            .attr("width", toolTipWidth)
            .attr("fill", "var(--surface)")
            .attr("stroke", colour)
            .attr("stroke-width", 1)
            .attr("rx", 5);

        // draw the highlight
        toolTip.highlight = toolTip.group.append("line")
            .attr("x1", toolTipHighlightXPos)
            .attr("x2", toolTipHighlightXPos)
            .attr("y1", Dims.overviewBarGraph.TooltipPaddingVert)
            .attr("y2", toolTipHeight - Dims.overviewBarGraph.TooltipPaddingVert)
            .attr("stroke", colour) 
            .attr("stroke-width", Dims.overviewBarGraph.TooltipBorderWidth)
            .attr("stroke-linecap", "round");

        // draw the title
        toolTip.titleGroup = toolTip.group.append("text")
            .attr("font-size", Dims.overviewBarGraph.TooltipFontSize)
            .attr("font-weight", "bold")
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const titleDims = Visuals.drawText({textGroup: toolTip.titleGroup, text: groupName, fontSize: Dims.overviewBarGraph.TooltipFontSize, 
                                            textWrap: TextWrap.NoWrap, padding: Dims.overviewBarGraph.TooltipPaddingVert});

        currentTextGroupPosY += titleDims.textBottomYPos + Dims.overviewBarGraph.TooltipTitleMarginBtm;

        // draw the text
        toolTip.textGroup = toolTip.group.append("text")
            .attr("font-size", Dims.overviewBarGraph.TooltipFontSize)
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const textDims = Visuals.drawText({textGroup: toolTip.textGroup, text: lines, fontSize: Dims.overviewBarGraph.TooltipFontSize, 
                                           textWrap: TextWrap.NoWrap, padding: Dims.overviewBarGraph.TooltipPaddingVert});

        currentTextGroupPosY += textDims.textBottomYPos;

        // update the height of the tooltip to be larger than the height of all the text
        toolTipHeight = Math.max(toolTipHeight, currentTextGroupPosY + Dims.overviewBarGraph.TooltipPaddingVert + Dims.overviewBarGraph.TooltipTextPaddingVert);
        toolTip.background.attr("height", toolTipHeight);
        toolTip.highlight.attr("y2", toolTipHeight - Dims.overviewBarGraph.TooltipPaddingVert);

        // update the width of the tooltip to be larger than the width of all the text
        toolTipWidth = Math.max(toolTipWidth, 2 * Dims.overviewBarGraph.TooltipPaddingHor + Dims.overviewBarGraph.TooltipBorderWidth + 2 * Dims.overviewBarGraph.TooltipTextPaddingHor + Math.max(titleDims.width, textDims.width));
        toolTip.background.attr("width", toolTipWidth);

        // -------------------------------------
        
        if (this.tooltips[groupName] === undefined) this.tooltips[groupName] = {};
        this.tooltips[groupName][state] = toolTip;
        return toolTip;
    }

    // onBarHover(event, data): Show the tooltip when the user hovers over the bar
    onBarHover(event, data) {
        const groupName = data.data[0];
        const state = data.key;

        if (this.tooltips[groupName] === undefined || this.tooltips[groupName][state] === undefined) return;

        if (this.shownTooltip !== undefined) {
            this.shownTooltip.group
                .attr("opacity", 0)
                .style("pointer-events", "none");
        }

        const tooltip = this.tooltips[groupName][state];
        const mousePos = d3.pointer(event);

        tooltip.group
            .attr("opacity", 1)
            .attr("transform", `translate(${mousePos[0]}, ${mousePos[1]})`)
            .style("pointer-events", "auto");

        d3.select(event.target).style("cursor", "pointer");
        this.shownTooltip = tooltip;
    }

    // hideTooltip(tooltip): Hides the tooltips
    hideTooltip(tooltip) {
        tooltip.group.attr("opacity", 0)
            .style("pointer-events", "none");
    }

    // onBarUnHover(event, data): Hides the tooltip when the user unhovers from the bar
    onBarUnHover(event, data){
        const groupName = data.data[0];
        const state = data.key;

        if (this.tooltips[groupName] === undefined || this.tooltips[groupName][state] === undefined) return;

        const tooltip = this.tooltips[groupName][state];
        this.hideTooltip(tooltip);

        d3.select(event.target).style("cursor", "default");
        this.shownTooltip = undefined;
    }

    // reference: https://observablehq.com/@d3/stacked-horizontal-bar-chart/2
    update() {
        super.update();
        let data = structuredClone(this.model.getGraphData());
        const inputs = this.model.getInputs();

        // Display the "No Data" text when no data is available
        if (data.length == 0 && !this.noDataDrawn) {
            this.drawNoData();
        }

        if (data.length == 0) return;

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
        (d3.index(data, d => d[this.summaryAtt], d => d[SummaryAtts.State])); // group by stack then series key

        // get the dimensions of the container holding the graph
        const graphContainer = d3.select(".visualGraph").node();
        const graphContainerDims = graphContainer.getBoundingClientRect();
        Dims.overviewBarGraph.GraphWidth = Math.max(Dims.overviewBarGraph.minGraphWidth, graphContainerDims.width - Dims.overviewBarGraph.GraphLeft - Dims.overviewBarGraph.GraphRight); 

        // Compute the height from the number of stacks and compute the width based off the screen.
        const prevWidth = this.width;
        this.height = series[0].length * Dims.overviewBarGraph.BarHeight + Dims.overviewBarGraph.GraphTop + Dims.overviewBarGraph.GraphBottom;
        this.width = Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth + Dims.overviewBarGraph.GraphRight;

        if (!this.isDrawn) {
            this.setup();
            this.isDrawn = true;
            this.noDataDrawn = false;
        }

        this.svg.attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height]);

        this.background.attr("width", this.width)
            .attr("height", this.height);

        // # of samples in x-axis
        let changeXAxis = true;
        const newXAxisDomain = numberView == NumberView.Percentage ? [0, 100] : [0, d3.max(series, d => d3.max(d, d => d[1]))];
        if (prevWidth == this.width && newXAxisDomain[0] == this.xAxisDomain[0] && newXAxisDomain[1] == this.xAxisDomain[1]) {
            changeXAxis = false;
        }

        this.xAxisDomain = newXAxisDomain;
        this.xAxisScale
            .range([Dims.overviewBarGraph.GraphLeft, Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth])
            .domain(this.xAxisDomain)
            .nice()

        this.xAxisFunc = d3.axisTop(this.xAxisScale);

        if (changeXAxis) {
            this.xAxisLine
            .transition()
            .ease(d3.easeLinear)
            .call(this.xAxisFunc)
            .attr("font-size", Dims.overviewBarGraph.TickFontSize);
        }

        // food names in the y-axis
        // sort by "risk" defined by the sorting order below:
        // 1. Sort by % detected (descending)
        // 2. Sort by # samples (descending)
        // 3. Sort by Name (alphabetical order)
        this.yAxisScale
        .range([Dims.overviewBarGraph.GraphTop, this.height - Dims.overviewBarGraph.GraphBottom])
        .domain(d3.groupSort(data, (group1, group2) => {
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

            const name1 = group1[0][this.summaryAtt];
            const name2 = group2[0][this.summaryAtt];
            if (name1 > name2) {
                return 1;
            } else if (name1 < name2) {
                return -1;
            }

            return 0;
        }, d => d[this.summaryAtt]));

        this.yAxisLine
            .call(d3.axisLeft(this.yAxisScale).tickSizeOuter(0))
            .attr("font-size", Dims.overviewBarGraph.TickFontSize);

        // draw the wrapped text for the food names
        this.yAxisLine.selectAll(".tick text").each((data, ind, textElements) => {
            const textGroup = d3.select(textElements[ind]);
            const textWidth = Dims.overviewBarGraph.YAxisTickNameWidth;
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
        this.title = Translation.translate(`overviewBarGraph.${this.summaryAtt}.graphTitle`);
        this.heading.text(this.title)
            .transition()
            .attr("x", Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth / 2);

        this.xAxisLabel.text(Translation.translate(`overviewBarGraph.${this.summaryAtt}.xAxis.${numberView}`))
            .transition()
            .attr("x", Dims.overviewBarGraph.GraphLeft + Dims.overviewBarGraph.GraphWidth / 2);

        this.yAxisLabel.text(Translation.translate(`overviewBarGraph.${this.summaryAtt}.yAxis`))
            .transition()
            .attr("x", -(this.height / 2));

        // source text
        this.sourceTextContainer
            .transition()
            .attr("transform", `translate(${Dims.overviewBarGraph.GraphLeft}, ${this.height - Dims.overviewBarGraph.GraphBottom})`);

        Visuals.drawText({textGroup: this.sourceText, text: Translation.translate("graphSourceText"), width: this.width, fontSize: Dims.overviewBarGraph.FooterFontSize});

        // draw all the tooltips
        for (const group of series) {
            const state = group.key;
            for (const barData of group) {
                this.hoverTooltip({data: barData.data, state, numberView: numberView, hide: true})
            }
        }

        // Append a group for each series, and a rect for each element in the series.
        this.bars.selectAll("*").remove();
        this.bars.append("g")
            .selectAll()
            .data(series)
            .enter()
            .append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(D => D.map(d => (d.key = D.key, d)))
            .enter()
            .append("rect")
            .attr("x", d => this.xAxisScale(d[0]))
            .attr("y", d => this.yAxisScale(d.data[0]))
            .attr("height", this.yAxisScale.bandwidth())
            .attr("width", d => this.xAxisScale(d[1]) - this.xAxisScale(d[0]))
            //.append("title")
            //.text(d => `${d.data[0]} ${d.key}\n${d.data[1].get(d.key)[SummaryAtts.StateVal]}`)
            .on("mouseover", (event, d) => this.onBarHover(event, d))
            .on("mousemove", (event, d) => this.onBarHover(event, d))
            .on("mouseenter", (event, d) => this.onBarHover(event, d))
            .on("mouseleave", (event, d) => this.onBarUnHover(event, d));

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
        this.drawLegend("graphLegend", legendColours, legendX);

        // Return the chart with the color scale as a property (for the legend).
        return Object.assign(this.svg.node(), {scales: {color}});
    }

    saveAsImage() {
        const preProcessor = async () => { this.sourceText.attr("visibility", "visible"); };
        const postProcessor = async () => { this.sourceText.attr("visibility", "hidden"); };
        Visuals.saveAsImage({svg: this.svg.node(), title: this.title, preProcessor, postProcessor});
    }
}