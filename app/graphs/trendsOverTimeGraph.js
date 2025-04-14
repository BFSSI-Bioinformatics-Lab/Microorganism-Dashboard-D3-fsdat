import { SummaryAtts, Themes, Dims, Inputs, TimeGroup, NumberView, TextWrap } from "../constants.js";
import { BaseGraph } from "./baseGraph.js";
import { Visuals, Translation } from "../tools.js";
import { Model } from "../backend.js";


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

        this.origWidth = Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.OrigGraphWidth + Dims.trendsOverTimeGraph.GraphRight;

        // rectangular mask so the graph will not go outside the SVG
        this.svgGraphMaskId = "graphMask";
        this.svgGraphMask =  this.svg.append("mask")
            .attr("id", this.svgGraphMaskId)
            .append("rect")
            .attr("fill", "#fff")
            .attr("x", 0)
            .attr("y", 0);

        this.svgGraphContainer = this.svg.append("g")
            .attr("mask", `url(#${this.svgGraphMaskId})`);

        // add the heading
        this.heading = this.svgGraphContainer.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.trendsOverTimeGraph.HeadingFontSize)
            .attr("y", Dims.trendsOverTimeGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");

        // subgraphs
        this.subgraphs = this.svgGraphContainer.append("g")
            .attr("transform", `translate(0, ${Dims.trendsOverTimeGraph.GraphTop})`);

        this.prevTransform = {};
        this.zoomFuncs = {};

        this.barContainerClsName = "trendsOverTimeBarContainer";
        this.barGroupClsName = "trendsOverTimeBarGroup";
        this.barClsName = "trendsOverTimeBar";

        this.lineContainerClsName = "trendsOverTimeLineContainer";
        this.lineClsName = "trendsOverTimeSampleLine";
        this.linePointsClsName = "trendsOverTimeSamplePoints";
        
        this.legendId = "trendsOverTimeLegend";

        // tooltips
        this.barTooltips = {};
        this.tooltipGroup = this.svg.append("g");
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

    // getMaxAtt(data, attName): Retrieves the maximum value of some attribute
    getMaxAtt(data, attName) {
        let result = null;
        for (const mainKey in data) {
            const mainKeyData = data[mainKey];
            for (const dataPoint of mainKeyData) {
                const currentAtt = dataPoint[attName];
                if (result === null || currentAtt > result) {
                    result = currentAtt;
                }
            }
        }

        return result;
    }

    // getMaxDetected(data): Retrieves the highest detected count out of all the data points
    getMaxDetected(data) {
        return this.getMaxAtt(data, SummaryAtts.Detected);
    }

    // getMax(data): Retrieves the highest detected count out of all the data points
    getMaxSamples(data) {
        return this.getMaxAtt(data, SummaryAtts.Samples);
    }

    // drawLegend(titleToColours, legendXPos): Draws the legend
    drawLegend(id, titleToColours, legendXPos){

        // ----------------- draws the legend ---------------------
        
        // attributes for the legend
        const legendItemPaddingHor = 0;
        const legendItemPaddingVert = 2;
        const legendItemTextPaddingHor = 5;
        const legendItemTextPaddingVert = 0;
        const legendItemFontSize = Dims.trendsOverTimeGraph.LegendFontSize;
        const legendData = Object.entries(titleToColours);
        const colourBoxWidth = Dims.trendsOverTimeGraph.LegendSquareSize;
        const colourBoxHeight = Dims.trendsOverTimeGraph.LegendSquareSize;
        const legendItems = [];
        let currentLegendItemYPos = 0;
        
        // draw the container to hold the legend
        d3.select(`#${id}`).remove();
        const legendGroup = this.svg
            .append("g")
            .attr("id", id)
            .attr("transform", `translate(${legendXPos}, ${Dims.trendsOverTimeGraph.GraphTop})`);

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
    
            Visuals.drawText({textGroup, fontSize: legendItemFontSize, text: legendKeyText, textX, textY, width: Dims.trendsOverTimeGraph.LegendTextMaxWidth});

            const legendItem = {group: legendItemGroup, colourBox, textGroup, name: legendKeyText, colour: legendKeyColour};

            // *****************************************************************

            currentLegendItemYPos += legendItemPaddingVert + legendItemGroup.node().getBBox()["height"];
            currentLegendItemYPos += legendItemPaddingVert;


            legendItems.push(legendItem);
        }

        // --------------------------------------------------------

        return currentLegendItemYPos;
    }

    // hoverTooltip(title, descriptionLines, colour, hide): Draws the hover tooltip
    hoverTooltip({title, descriptionLines, colour, hide = false} = {}){
        // ------- draw the tooltip ------------

        // attributes for the tool tip
        const toolTip = {};
        let toolTipWidth = Dims.trendsOverTimeGraph.TooltipMinWidth;
        let toolTipHeight = Dims.trendsOverTimeGraph.TooltipHeight;
        const textGroupPosX = Dims.trendsOverTimeGraph.TooltipBorderWidth + Dims.trendsOverTimeGraph.TooltipPaddingHor +  Dims.trendsOverTimeGraph.TooltipTextPaddingHor;
        let currentTextGroupPosY = Dims.trendsOverTimeGraph.TooltipPaddingVert + Dims.trendsOverTimeGraph.TooltipTextPaddingVert;

        const toolTipHighlightXPos = Dims.trendsOverTimeGraph.TooltipPaddingHor + Dims.trendsOverTimeGraph.TooltipBorderWidth / 2;

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
            .attr("y1", Dims.trendsOverTimeGraph.TooltipPaddingVert)
            .attr("y2", toolTipHeight - Dims.trendsOverTimeGraph.TooltipPaddingVert)
            .attr("stroke", colour) 
            .attr("stroke-width", Dims.trendsOverTimeGraph.TooltipBorderWidth)
            .attr("stroke-linecap", "round");

        // draw the title
        toolTip.titleGroup = toolTip.group.append("text")
            .attr("font-size", Dims.trendsOverTimeGraph.TooltipFontSize)
            .attr("font-weight", "bold")
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const titleDims = Visuals.drawText({textGroup: toolTip.titleGroup, text: title, fontSize: Dims.trendsOverTimeGraph.TooltipFontSize, 
                                            textWrap: TextWrap.NoWrap, padding: Dims.trendsOverTimeGraph.TooltipPaddingVert});

        currentTextGroupPosY += titleDims.textBottomYPos + Dims.trendsOverTimeGraph.TooltipTitleMarginBtm;

        // draw the text
        toolTip.textGroup = toolTip.group.append("text")
            .attr("font-size", Dims.trendsOverTimeGraph.TooltipFontSize)
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const textDims = Visuals.drawText({textGroup: toolTip.textGroup, text: descriptionLines, fontSize: Dims.trendsOverTimeGraph.TooltipFontSize, 
                                           textWrap: TextWrap.NoWrap, padding: Dims.trendsOverTimeGraph.TooltipPaddingVert});

        currentTextGroupPosY += textDims.textBottomYPos;

        // update the height of the tooltip to be larger than the height of all the text
        toolTipHeight = Math.max(toolTipHeight, currentTextGroupPosY + Dims.trendsOverTimeGraph.TooltipPaddingVert + Dims.trendsOverTimeGraph.TooltipTextPaddingVert);
        toolTip.background.attr("height", toolTipHeight);
        toolTip.highlight.attr("y2", toolTipHeight - Dims.trendsOverTimeGraph.TooltipPaddingVert);

        // update the width of the tooltip to be larger than the width of all the text
        toolTipWidth = Math.max(toolTipWidth, 2 * Dims.trendsOverTimeGraph.TooltipPaddingHor + Dims.trendsOverTimeGraph.TooltipBorderWidth + 2 * Dims.trendsOverTimeGraph.TooltipTextPaddingHor + Math.max(titleDims.width, textDims.width));
        toolTip.background.attr("width", toolTipWidth);

        // -------------------------------------

        return toolTip;
    }

    // getTimeGroupName(timeGroup, dateTime): Retrieves the name of a particular time grouping
    getTimeGroupName(timeGroup, dateTime) {
        if (timeGroup == TimeGroup.Months) dateTime = this.formatMonth(moment(dateTime));
        else if (timeGroup == TimeGroup.Years) dateTime = this.formatYear(moment(dateTime));
        else if (timeGroup == TimeGroup.Overall) dateTime = TimeGroup.Overall;
        return dateTime;
    }

    // getSamplePoints(date, timeGroup): Retrieves the unique sample point used to make
    //  the line graph for the samples
    getSamplePoints(data, timeGroup) {
        let samplePoints = {};

        for (const row of data) {
            const dateTime = this.getTimeGroupName(timeGroup, row[SummaryAtts.DateTime]);
            if (samplePoints[dateTime] === undefined) {
                samplePoints[dateTime] = row[SummaryAtts.Samples];
            } else {
                samplePoints[dateTime] += row[SummaryAtts.Samples];
            }
        }

        const result = [];
        for (const dateTime in samplePoints) {
            result.push({dateTime, y: samplePoints[dateTime]});
        }

        return result;
    }

    // buildSubGraph(mainKey, mainKeyInd, data, timeRange, timeGroup, subAttColours
    //               numberView, maxDetected, maxSamples, subGraphYPos, displayMainKey)
    // Constructs the subgraph for a particular main key
    buildSubGraph({mainKey, mainKeyInd, data, timeRange, timeGroup, subAttColours, 
                   numberView, maxDetected = 1, maxSamples = 1, subGraphYPos = 0, displayMainKey = null} = {}) {
        let subAtts = Object.keys(subAttColours);

        const graphTop = subGraphYPos + Dims.trendsOverTimeGraph.SubGraphMarginTop;
        const graphBottom = Dims.trendsOverTimeGraph.SubGraphHeight - Dims.trendsOverTimeGraph.SubGraphMarginBottom + subGraphYPos;
        const graphLeft = Dims.trendsOverTimeGraph.GraphLeft;
        const graphRight = this.width - Dims.trendsOverTimeGraph.GraphRight;
        const graphWidth = graphRight - graphLeft;
        const graphHeight = graphBottom - graphTop;
        
        const subGraphName = displayMainKey === null ? mainKey : displayMainKey(mainKey);
        const subGraph = this.subgraphs.append("g")
            .attr("y", subGraphYPos);

        const subGraphMaskId = `subGraphMask${mainKeyInd}`;
        subGraph.append("mask")
            .attr("id", subGraphMaskId)
            .append("rect")
            .attr("fill", "#fff")
            .attr("x", graphLeft)
            .attr("y", subGraphYPos)
            .attr("width", graphWidth + 3)
            .attr("height", subGraphYPos + Dims.trendsOverTimeGraph.SubGraphHeight);

        const subGraphContent = subGraph.append("g")
            .attr("mask", `url(#${subGraphMaskId})`);

        // x-scale for the group of each main key
        const fxRange = [Dims.trendsOverTimeGraph.GraphLeft, this.fullWidth];
        const fx = d3.scaleBand()
            .domain(timeRange)
            .rangeRound(fxRange);

        const keyWidth = fx.bandwidth();
        const x = d3.scaleBand()
            .domain(subAtts)
            .rangeRound([0, keyWidth])
            .padding(0.05);

        // x-scale for each sub-key in each main key
        const xAxis = d3.axisBottom(fx);
        var xAxisContainer = subGraphContent.append("g")
            .attr("transform", `translate(0,${graphBottom})`);

        xAxisContainer.call(xAxis);

        // left y-axis
        const leftY = d3.scaleLinear()
            .domain([0, maxDetected])
            .range([graphBottom, graphTop])
            .nice();

        subGraph.append("g")
            .attr("transform", `translate(${graphLeft},0)`)
            .call(d3.axisLeft(leftY));

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = subGraph.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", this.width )
            .attr("height", graphBottom - subGraphYPos )
            .attr("x", 0)
            .attr("y", 0);

        const color = d3.scaleOrdinal()
            .domain(subAtts)
            .range(Object.values(subAttColours))
            .unknown("#ccc");

        const groupedData = d3.group(data, d => this.getTimeGroupName(timeGroup, d[SummaryAtts.DateTime]));

        // draw the hover tooltip for the bars
        if (this.barTooltips[mainKey] === undefined) this.barTooltips[mainKey] = {};
        groupedData.forEach((dataByTime, time) => {
            if (this.barTooltips[mainKey][time] === undefined) this.barTooltips[mainKey][time] = {};

            for (const row of dataByTime) {
                const subKey = row[this.subSummaryAtt];
                const descriptionLines = Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.barTooltip`, {
                    returnObjects: true, 
                    subKey,
                    dateTime: time,
                    number: row[SummaryAtts.Detected]
                });

                this.barTooltips[mainKey][time][subKey] = this.hoverTooltip({title: subGraphName, descriptionLines, colour: subAttColours[subKey], hide: true});
            }
        });

        // Append a group for each key and a rectangle for each sub-key.
        subGraphContent.append("g")
            .classed(this.barContainerClsName, true)
            .selectAll()
            .data(groupedData)
            .join("g")
            .classed(this.barGroupClsName, true)
            .attr("transform", ([dateTimeGroup]) => {
                return `translate(${fx(dateTimeGroup)},0)`
            })
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .classed(this.barClsName, true)
            .attr("x", d => x(d[this.subSummaryAtt]))
            .attr("y", d => leftY(d[SummaryAtts.Detected]))
            .attr("width", x.bandwidth())
            .attr("height", d => leftY(0) - leftY(d[SummaryAtts.Detected]))
            .attr("fill", d => color(d[this.subSummaryAtt]));
        
        // get the sample points needed for the line graph
        const samplePoints = this.getSamplePoints(data, timeGroup);
        const newMaxSamples = samplePoints.reduce((acc, point) => Math.max(acc, point.y), 0);
        samplePoints.sort((pointA, pointB) => {
            return fx(pointA.dateTime) - fx(pointB.dateTime);
        });

        // right y-axis
        const rightY = d3.scaleLinear()
            .domain([0, Math.max(maxSamples, newMaxSamples)])
            .range([graphBottom, graphTop])
            .nice();

        const rightYAxis = subGraph.append("g")
            .attr("transform", `translate(${graphRight},0)`)
            .call(d3.axisRight(rightY));

        // Add the line and points for the samples
        const sampleLineContainer = subGraphContent.append("g")
            .classed(this.lineContainerClsName, true);

        sampleLineContainer
            .append("path")
            .classed(this.lineClsName, true)
            .datum(samplePoints)
            .attr("fill", "none")
            .attr("stroke", "var(--trendsOverTimeLine)")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x((d) => fx(d.dateTime) + keyWidth / 2)
                .y((d) => rightY(d.y)))

        sampleLineContainer
            .selectAll("myCircles")
            .data(samplePoints)
            .enter()
            .append("circle")
            .classed(this.linePointsClsName, true)
            .attr("fill", "var(--trendsOverTimePoint)")
            .attr("stroke", "none")
            .attr("cx", (d) => fx(d.dateTime) + keyWidth / 2)
            .attr("cy", (d) => rightY(d.y))
            .attr("r", 2.5);

        // label for the name of the subgraph
        const keyText = subGraph.append("text")
            .attr("transform", `translate(0 , ${Dims.trendsOverTimeGraph.SubGraphHeight / 2 + subGraphYPos})`)
            .attr("fill", "var(--fontColour)");

        Visuals.drawText({textGroup: keyText, text: subGraphName, fontSize: Dims.trendsOverTimeGraph.SubGraphKeyFontSize, width: Dims.trendsOverTimeGraph.SubGraphKeyWidth});

        // label for the axes
        const xAxisLabel = subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            .attr("fill", "var(--fontColour)");

        Visuals.drawText({textGroup: xAxisLabel, text: Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.xAxis.${timeGroup}`), 
                          fontSize: Dims.trendsOverTimeGraph.AxesFontSize, width: Math.max(graphWidth, Dims.trendsOverTimeGraph.SubGraphXAxisLabelSmallestMaxWidth)});
            
        xAxisLabel.attr("transform", `translate(${(this.width) / 2}, ${ graphBottom + Dims.trendsOverTimeGraph.AxesFontSize * 2})`)

        const leftYAxisLabel = subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            .attr("transform", `rotate(-90) translate(${-(subGraphYPos + Dims.trendsOverTimeGraph.SubGraphHeight / 2)}, ${Dims.trendsOverTimeGraph.SubGraphLeftYAxisLabelLeft})`)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--fontColour)");

        Visuals.drawText({textGroup: leftYAxisLabel, text: Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.yAxis.${numberView}`), 
            fontSize: Dims.trendsOverTimeGraph.AxesFontSize, width: Dims.trendsOverTimeGraph.SubGraphYAxisLabelMaxWidth});

        const rightYAxisLabel = subGraph.append("text").attr("font-size", Dims.trendsOverTimeGraph.AxesFontSize)
            .attr("transform", `rotate(90) translate(${subGraphYPos + Dims.trendsOverTimeGraph.SubGraphHeight / 2}, ${-(graphRight + Dims.trendsOverTimeGraph.SubGraphRightYAxisLabelLeft)})`)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--fontColour)");

        Visuals.drawText({textGroup: rightYAxisLabel, text: Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.yAxisRight`), 
            fontSize: Dims.trendsOverTimeGraph.AxesFontSize, width: Dims.trendsOverTimeGraph.SubGraphYAxisLabelMaxWidth});

        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zooms
        // API Reference: https://d3js.org/d3-zoom
        this.zoomFuncs[mainKey] = (transform) => {
            // zooming capability for discrete domains
            // reference: https://stackoverflow.com/questions/49334856/scaleband-with-zoom
            const scaleFactor = transform.k; 
            const isLarger = scaleFactor >= 1;
            const isZoomIn = scaleFactor > this.prevTransform[mainKey].k;

            const xAxisStrokeWidthZoom = Math.max(1/transform.k, 0.3);
            const xAxisTickZoom = isLarger ? d3.zoomIdentity.scale(1/transform.k) : null;

            const xAxisZoomOutLeft = Dims.trendsOverTimeGraph.GraphLeft * (1 - scaleFactor);
            const xAxisLineZoomXPos = isLarger ? transform.x : Math.min(transform.x, xAxisZoomOutLeft);
            const xAxisLineZoom = new d3.ZoomTransform(transform.k, xAxisLineZoomXPos, graphBottom);

            const barContainerZoom = new d3.ZoomTransform(transform.k, xAxisLineZoomXPos, 0);
            const barContainerZoomInv = new d3.ZoomTransform(1 / transform.k, 0, 0);
            const barZoom = new d3.ZoomTransform(transform.k, 0, 0);
            
            const xAxisRightPos = xAxisLineZoom.applyX(this.fullWidth);
            const xAxisLeftPos = xAxisLineZoom.applyX(Dims.trendsOverTimeGraph.GraphLeft);
            const xAxisWidth = xAxisRightPos - xAxisLeftPos;
            let graphWidthHasShrank = false;

            // anchor x-axis to the right
            if (xAxisRightPos < graphRight && (isLarger || (xAxisLeftPos < graphLeft && xAxisWidth > graphWidth))) {
                xAxisLineZoom.x += (graphRight - xAxisRightPos);
                barContainerZoom.x += (graphRight - xAxisRightPos);
                transform.x += (graphRight - xAxisRightPos);

            // anchor x-axis to the left when zooming out
            } else if (!isLarger && xAxisWidth <= graphWidth) {
                xAxisLineZoom.x = xAxisZoomOutLeft;
                barContainerZoom.x = xAxisZoomOutLeft;
                transform.x = xAxisZoomOutLeft;
                graphWidthHasShrank = true;

            // anchor x-axis to the left
            } else if (xAxisLeftPos > graphLeft) {
                xAxisLineZoom.x += (graphLeft - xAxisLeftPos);
                barContainerZoom.x += (graphLeft - xAxisLeftPos);
                transform.x += (graphLeft - xAxisLeftPos);
            }

            // update the x-axis
            xAxisContainer.attr("transform", xAxisLineZoom);
            xAxisContainer.selectAll("text").attr("transform", xAxisTickZoom);
            xAxisContainer.selectAll("line").attr("transform", xAxisTickZoom);
            xAxisContainer.selectAll("path").attr("stroke-width", xAxisStrokeWidthZoom);

            // update the position of the right y-axis
            const rightYAxisXPos = graphWidthHasShrank ? xAxisLineZoom.applyX(this.fullWidth) : graphRight;
            rightYAxis.attr("transform", `translate(${rightYAxisXPos},0)`);
            rightYAxisLabel.attr("transform", `rotate(90) translate(${subGraphYPos + Dims.trendsOverTimeGraph.SubGraphHeight / 2}, ${-(rightYAxisXPos + Dims.trendsOverTimeGraph.SubGraphRightYAxisLabelLeft)})`)

            const xAxisLabelXPos = graphWidthHasShrank ? xAxisLineZoom.applyX(this.fullWidth / 2) : this.width / 2;
            xAxisLabel.attr("transform", `translate(${xAxisLabelXPos}, ${ graphBottom + Dims.trendsOverTimeGraph.AxesFontSize * 2})`);

            // update the bars
            subGraphContent.selectAll(`.${this.barContainerClsName}`).attr("transform", `translate(${barContainerZoom.x}, ${barContainerZoom.invertY(0)}) scale(${barContainerZoom.k})`);

            x.range([0, keyWidth].map(d => barZoom.applyX(d)));
            fx.range(fxRange.map(d => barZoom.applyX(d)));
            const newKeyWidth = fx.bandwidth();

            subGraphContent.selectAll(`.${this.barClsName}`)
                .attr("transform", barContainerZoomInv)
                .attr("x", d => x(d[this.subSummaryAtt]))
                .attr("width", x.bandwidth());

            // update the line chart
            subGraphContent.selectAll(`.${this.lineContainerClsName}`).attr("transform", `translate(${barContainerZoom.x}, ${barContainerZoom.invertY(0)}) scale(${barContainerZoom.k})`);

            subGraphContent.selectAll(`.${this.lineClsName}`)
                .attr("transform", barContainerZoomInv)
                .attr("d", d3.line()
                    .x((d) => fx(d.dateTime) + newKeyWidth / 2)
                    .y((d) => rightY(d.y)))

            subGraphContent.selectAll(`.${this.linePointsClsName}`)
                .attr("transform", barContainerZoomInv)
                .attr("cx", (d) => fx(d.dateTime) + newKeyWidth / 2);
        }
    }

    update() {
        super.update();

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

        this.svg.attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height]);

        this.svgGraphMask
            .attr("width", this.width)
            .attr("height", this.height);

        this.svgGraphContainer
             .attr("width", this.width)
             .attr("height", this.height);

        const timeRange = this.getTimeRange(timeGroup, data);
        let subKeys = this.getSubKeys(data);
        subKeys = Array.from(subKeys).sort();
        const maxDetected = Math.max(1, numberView == NumberView.Number ? this.getMaxDetected(data) : 100);
        const maxSamples = Math.max(1, this.getMaxSamples(data));
            
        let subGraphKeyWidth = Math.max(Dims.trendsOverTimeGraph.SubGraphMinKeyWidth, subKeys.length * Dims.trendsOverTimeGraph.SubGraphBarWidth);
        subGraphKeyWidth = Math.min(Dims.trendsOverTimeGraph.SubGraphMaxKeyWidth, subGraphKeyWidth);

        this.fullWidth = Math.max(this.width, (subGraphKeyWidth +  2 * Dims.trendsOverTimeGraph.SubGraphBarGroupMargin) * timeRange.length);

        // text for the heading
        this.title = Translation.translate(`trendsOverTimeGraph.${this.mainSummaryAtt}.graphTitle`);
        this.heading.text(this.title)
            .transition()
            .attr("x",  Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth / 2);

        // get the different colours for each bar
        const legendColours = {};
        const themeGraphColours = Themes[this.app.theme].graphColours;
        const themeMaxGraphColours = themeGraphColours.length;

        for (let i = 0; i < subKeys.length; ++i) {
            const colourInd = i % themeMaxGraphColours; 
            const subKey = subKeys[i];
            legendColours[subKey] = `var(--graphColours${colourInd})`;
        }

        // legend of the graph
        const legendX = Dims.trendsOverTimeGraph.GraphLeft + Dims.trendsOverTimeGraph.GraphWidth + Dims.trendsOverTimeGraph.LegendLeftMargin;
        const legendHeight = this.drawLegend(this.legendId, legendColours, legendX);

        // update the height in case the legend is larger than the entire graph
        let newHeight = Math.max(this.height, Dims.trendsOverTimeGraph.GraphTop + legendHeight + Dims.trendsOverTimeGraph.GraphBottom);
        if (newHeight != this.height) {
            this.height = newHeight;

            this.svg.attr("height", this.height)
                .attr("viewBox", [0, 0, this.width, this.height]);

            this.svgGraphMask.attr("height", this.height);
            this.svgGraphContainer.attr("height", this.height);
        }

        this.subgraphs.selectAll("*").remove();
        this.zoomFuncs = {};
        this.prevTransform = {};
        this.barTooltips = {};

        // Controls the zooming and panning of the graph
        const minZoom = 0.1;
        this.svgZoom = d3.zoom()
            .scaleExtent([minZoom, 3])
            .translateExtent([[Dims.trendsOverTimeGraph.GraphLeft, -Infinity], [this.fullWidth + 1 / minZoom * Dims.trendsOverTimeGraph.GraphLeft, Infinity]])
            .extent([[Dims.trendsOverTimeGraph.GraphLeft, Dims.trendsOverTimeGraph.GraphTop], [this.width, this.height]])
            .on("zoom", (event) => {
                for (const key in this.zoomFuncs) {
                    this.zoomFuncs[key](event.transform);
                }
            });

        let currentSubGraphYPos = 0;
        let mainKeyInd = 0;
        const displayMainKey = this.mainSummaryAtt == SummaryAtts.Microorganism ? Model.getDisplayMicroorganism : null;

        for (const mainKey in data) {
            this.prevTransform[mainKey] = new d3.ZoomTransform(1, 0, 0);
            this.buildSubGraph({mainKey, mainKeyInd, data: data[mainKey], timeRange, timeGroup, subAttColours: legendColours, 
                                numberView, maxDetected, maxSamples, subGraphYPos: currentSubGraphYPos, displayMainKey});

            currentSubGraphYPos += Dims.trendsOverTimeGraph.SubGraphHeight;
            mainKeyInd += 1;
        }

        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        this.svgGraphContainer.append("rect")
            .attr("x", Dims.trendsOverTimeGraph.GraphLeft)
            .attr("y", Dims.trendsOverTimeGraph.GraphTop)
            .attr("width", this.width - Dims.trendsOverTimeGraph.GraphRight - Dims.trendsOverTimeGraph.GraphLeft)
            .attr("height", this.height - Dims.trendsOverTimeGraph.GraphBottom)
            .style("fill", "none")
            .style("pointer-events", "all")
            .call(this.svgZoom);
    }
}