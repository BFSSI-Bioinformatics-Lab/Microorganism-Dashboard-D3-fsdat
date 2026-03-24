import { BaseGraph } from "./baseGraph.js";
import {
    DataSnapshotFoodCategoryColourPairs,
    DataSnapshotAgentColourPairs,
} from "../constants.js";

export class DataSnapshotGraph extends BaseGraph {
    constructor(model) {
        super(model);
        this.labelMeasureContext = document.createElement("canvas").getContext("2d");
        this.labelMeasureContext.font = "12px sans-serif";
    }

    setup() {
        this.graph = d3.select(".visualGraph")
            .attr("position", "inherit")
            .html("");

        this.breadcrumbLabel = this.graph.append("div")
            .classed("dataSnapshotBreadcrumb", true)
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("margin", "0 0 8px 0")
            .style("min-height", "22px");

        this.contentRow = this.graph.append("div")
            .classed("dataSnapshotContentRow", true)
            .style("display", "flex")
            .style("align-items", "flex-start")
            .style("gap", "14px")
            .style("width", "100%");

        this.chartContainer = this.contentRow.append("div")
            .classed("dataSnapshotChartContainer", true)
            .style("flex", "1 1 auto")
            .style("min-width", "0");

        this.legendContainer = this.contentRow.append("div")
            .classed("dataSnapshotLegend", true)
            .style("margin", "0")
            .style("flex", "0 0 220px");

        this.legendContainer.append("div")
            .classed("dataSnapshotLegendTitle", true)
            .style("font-size", "14px")
            .style("font-weight", "600")
            .style("margin", "0 0 6px 0")
            .text("Food Groups");

        this.legendItems = this.legendContainer.append("div")
            .classed("dataSnapshotLegendItems", true)
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("gap", "6px");
    }

    update() {
        super.update();
        // Specify the chart’s dimensions.
        let data = this.model.getGraphData();
        const dataEmpty =
            data === undefined ||
            data === null ||
            data.children === undefined ||
            data.children.length == 0;

        // Display the "No Data" text when no data is available
        if (dataEmpty && !this.noDataDrawn) {
            this.drawNoData();
        }

        if (dataEmpty) return;

        if (!this.isDrawn) {
            this.setup();
            this.isDrawn = true;
            this.noDataDrawn = false;
        }

        const width = 900;
        const height = width;


        /* BUBBLE COLOURING */
        // Food category and Agent (i.e. Bacteria, Virus, etc) are hard coded in constants.js
        // Child bubbles (e.g. individual foods items, genus) are computed deterministically by hashing the name,
        //  and shifting slightly from the parent colour, to keep consistent colouring
        const hashString = (text) => {
            let hash = 0;
            for (let i = 0; i < text.length; ++i) {
                hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
            }
            return hash;
        };

        const clamp = (value, minVal, maxVal) =>
            Math.min(maxVal, Math.max(minVal, value));

        const getFallbackBaseColour = (label) => {
            const hue = hashString(label) % 360;
            return d3.hsl(hue, 0.55, 0.5).formatHex();
        };

        const getFallbackPair = (label) => ({
            color: getFallbackBaseColour(label),
            opacity: 0.2,
        });

        const getFoodCategoryPair = (foodCategory) => {
            const constantPair = DataSnapshotFoodCategoryColourPairs[foodCategory];
            return constantPair === undefined
                ? getFallbackPair(foodCategory)
                : constantPair;
        };

        const getAgentPair = (agent) => {
            const constantPair = DataSnapshotAgentColourPairs[agent];
            return constantPair === undefined
                ? getFallbackPair(agent)
                : constantPair;
        };

        const getAdjustedChildOpacity = (parentOpacity) => {
            const numericOpacity = Number.isFinite(parentOpacity) ? parentOpacity : 0.2;

            if (numericOpacity <= 0.65) {
                return clamp(numericOpacity + 0.25, 0.05, 1);
            }

            return clamp(numericOpacity - 0.2, 0.05, 1);
        };

        const getBubbleStyle = (nodeData) => {
            const label = nodeData.data.name;

            if (nodeData.depth === 1) {
                return getFoodCategoryPair(label);
            }

            if (nodeData.depth === 2) {
                const parentLabel = nodeData.parent?.data?.name || "";
                const parentPair = getFoodCategoryPair(parentLabel);
                return {
                    color: parentPair.color,
                    opacity: getAdjustedChildOpacity(parentPair.opacity),
                };
            }

            if (nodeData.depth === 3) {
                return getAgentPair(label);
            }

            if (nodeData.depth >= 4) {
                const parentLabel = nodeData.parent?.data?.name || "";
                const parentPair = getAgentPair(parentLabel);
                return {
                    color: parentPair.color,
                    opacity: getAdjustedChildOpacity(parentPair.opacity),
                };
            }

            return { color: "#ffffff", opacity: 1 };
        };

        const getCssColour = (nodeStyle) => {
            const color = d3.color(nodeStyle.color);

            if (!color) {
                return nodeStyle.color;
            }

            color.opacity = Number.isFinite(nodeStyle.opacity) ? nodeStyle.opacity : 1;
            return color.formatRgb();
        };

        // Compute the layout.
        // Stage 1: size root -> foodGroup -> foodName -> agent using agent testedCount.
        // Stage 2: size descendants within each fixed-size agent bubble.
        const root = d3.hierarchy(data);

        const getNodeWeight = (nodeData) => {
            const testedCount = nodeData.data?.testedCount;
            if (typeof testedCount === "number" && !Number.isNaN(testedCount)) {
                return Math.max(0, testedCount);
            }

            const value = nodeData.data?.value;
            if (typeof value === "number" && !Number.isNaN(value)) {
                return Math.max(0, value);
            }

            if (nodeData.children && nodeData.children.length > 0) {
                return d3.sum(nodeData.children, (childNode) => getNodeWeight(childNode));
            }

            return 0;
        };

        const topLevelData = {
            name: data.name,
            children: (data.children || []).map((foodGroup) => ({
                name: foodGroup.name,
                children: (foodGroup.children || []).map((foodName) => ({
                    name: foodName.name,
                    children: (foodName.children || []).map((agent) => ({
                        name: agent.name,
                        value: Math.max(0, agent.testedCount ?? agent.value ?? 0),
                    })),
                })),
            })),
        };

        const topLevelRoot = d3.hierarchy(topLevelData)
            .sum((nodeData) => nodeData.value || 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0));

        d3.pack()
            .size([width, height])
            .padding(3)
            (topLevelRoot);

        const positionByPath = new Map();
        topLevelRoot.descendants().forEach((nodeData) => {
            const pathKey = nodeData.ancestors()
                .reverse()
                .map((ancestor) => ancestor.data.name)
                .join("||");
            positionByPath.set(pathKey, { x: nodeData.x, y: nodeData.y, r: nodeData.r });
        });

        root.descendants().forEach((nodeData) => {
            const pathKey = nodeData.ancestors()
                .reverse()
                .map((ancestor) => ancestor.data.name)
                .join("||");
            const positionedNode = positionByPath.get(pathKey);

            if (positionedNode) {
                nodeData.x = positionedNode.x;
                nodeData.y = positionedNode.y;
                nodeData.r = positionedNode.r;
            }
        });

        const layoutChildrenInsideParent = (parentNode) => {
            if (!parentNode.children || parentNode.children.length === 0) {
                return;
            }

            const availableRadius = Math.max(0, parentNode.r - 3);
            if (availableRadius <= 0) {
                parentNode.children.forEach((childNode) => {
                    childNode.x = parentNode.x;
                    childNode.y = parentNode.y;
                    childNode.r = 0;
                    layoutChildrenInsideParent(childNode);
                });
                return;
            }

            const circles = parentNode.children.map((childNode) => {
                const weight = getNodeWeight(childNode);
                return {
                    node: childNode,
                    r: Math.sqrt(weight > 0 ? weight : 1),
                };
            });

            d3.packSiblings(circles);
            const enclosingCircle = d3.packEnclose(circles);
            const enclosingRadius = Math.max(1, enclosingCircle.r);
            const scale = availableRadius / enclosingRadius;

            circles.forEach((circle) => {
                const childNode = circle.node;
                childNode.x = parentNode.x + (circle.x * scale);
                childNode.y = parentNode.y + (circle.y * scale);
                childNode.r = circle.r * scale;

                layoutChildrenInsideParent(childNode);
            });
        };

        root.descendants().forEach((nodeData) => {
            if (nodeData.depth === 3) {
                layoutChildrenInsideParent(nodeData);
            }
        });

        const renderLegend = () => {
            const foodGroupNodes = (root.children || [])
                .slice()
                .sort((a, b) => a.data.name.localeCompare(b.data.name));

            const entries = this.legendItems
                .selectAll("button")
                .data(foodGroupNodes, (nodeData) => nodeData.data.name)
                .join(
                    (enter) => {
                        const button = enter.append("button")
                            .attr("type", "button")
                            .style("display", "inline-flex")
                            .style("align-items", "center")
                            .style("gap", "6px")
                            .style("padding", "2px 4px")
                            .style("border", "none")
                            .style("background", "transparent")
                            .style("cursor", "pointer")
                            .style("font", "12px sans-serif")
                            .style("color", "#191923");

                        button.append("span")
                            .classed("dataSnapshotLegendSwatch", true)
                            .style("width", "15px")
                            .style("height", "15px")
                            .style("border", "1px solid #191923")
                            .style("display", "inline-block")
                            .style("flex", "0 0 auto");

                        button.append("span")
                            .classed("dataSnapshotLegendLabel", true)
                            .style("text-align", "left");

                        return button;
                    },
                    (update) => update,
                    (exit) => exit.remove(),
                );

            entries
                .on("click", (event, nodeData) => {
                    event.preventDefault();
                    if (focus !== nodeData) {
                        zoom({ altKey: false }, nodeData);
                    }
                });

            entries.select(".dataSnapshotLegendSwatch")
                .style("background-color", (nodeData) => getCssColour(getBubbleStyle(nodeData)));

            entries.select(".dataSnapshotLegendLabel")
                .text((nodeData) => nodeData.data.name);
        };

        // Create the SVG container.
        this.chartContainer.selectAll("svg").remove();
        this.breadcrumbLabel.text("");
        const svg = this.chartContainer.append("svg")
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto; display: block; margin: 0 -14px; background: #ffffff; cursor: pointer;");

        // Append the nodes.
        const node = svg.append("g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", (d) => getBubbleStyle(d).color)
            .attr("fill-opacity", (d) => getBubbleStyle(d).opacity)
            .attr("stroke", "#191923")
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", 1)
            .attr("pointer-events", "all")
            .on("mouseover", (event, d) => {
                hoveredNodes = new Set(d.ancestors());
                refreshLabels();
            })
            .on("mouseout", (event) => {
                if (!isCircleElement(event.relatedTarget)) {
                    clearHoveredNodes();
                }
            })
            .on("click", (event, d) => {
                const oneStepTarget = resolveOneStepTarget(d);

                if (oneStepTarget && oneStepTarget.children && focus !== oneStepTarget) {
                    zoom(event, oneStepTarget);
                    event.stopPropagation();
                }
            });

        // Append boxed labels.
        const labelLayer = svg.append("g")
            .style("font", "12px sans-serif")
            .attr("pointer-events", "none");

        const labelGroup = labelLayer
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("text-anchor", "middle")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .attr("transform", "translate(0,0)");

        labelGroup.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 0)
            .attr("height", 0)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("fill", "#000");

        labelGroup.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dominant-baseline", "middle")
            .attr("fill", "#fff")
            .text("");

        // Create the zoom behavior and zoom immediately in to the initial focus node.
        svg.on("click", (event) => zoom(event, root));
        let focus = root;
        let view;
        let currentScale = 1;
        let hoveredNodes = new Set();
        const horizontalPadding = 6;
        const verticalPadding = 3;
        const fontSize = 12;

        const clearHoveredNodes = () => {
            if (hoveredNodes.size === 0) {
                return;
            }

            hoveredNodes = new Set();
            refreshLabels();
        };

        const isCircleElement = (element) => element
            && element.tagName
            && element.tagName.toLowerCase() === "circle";

        svg.on("mouseleave", () => {
            clearHoveredNodes();
        });

        const truncateLabel = (labelText, maxWidth) => this.getTruncatedLabel(labelText, maxWidth);
        const fullLabelForNode = (nodeData) => {
            const testedCount =
                nodeData.data.testedCount === undefined
                    ? (nodeData.value === undefined ? 0 : nodeData.value)
                    : nodeData.data.testedCount;
            const detectedCount =
                nodeData.data.detectedCount === undefined
                    ? 0
                    : nodeData.data.detectedCount;

            if (nodeData.depth === 1 || nodeData.depth === 2) {
                return `${nodeData.data.name} (${testedCount} samples, ${detectedCount} detected)`;
            }

            if (nodeData.depth === 3) {
                return `${nodeData.data.name} (${testedCount} samples, ${detectedCount} detected)`;
            }

            if (nodeData.depth === 4) {
                return `${nodeData.data.name} (${testedCount} samples, ${detectedCount} detected)`;
            }

            return nodeData.children
                ? nodeData.data.name
                : `${nodeData.data.name} (${testedCount} samples, ${detectedCount} detected)`;
        };

        const updateSingleLabel = (groupSelection, nodeData, isExpanded = false) => {
            const radius = nodeData.r * currentScale;
            const bubbleMaxWidth = Math.max(0, radius * 2 - 8);
            const fullLabel = fullLabelForNode(nodeData);
            const textWidthLimit = Math.max(0, bubbleMaxWidth - (horizontalPadding * 2));
            const displayedText = isExpanded ? fullLabel : truncateLabel(fullLabel, textWidthLimit);
            const displayedTextWidth = this.getTextWidth(displayedText);
            const naturalBoxWidth = displayedTextWidth + (horizontalPadding * 2);
            const boxWidth = isExpanded ? naturalBoxWidth : Math.min(naturalBoxWidth, bubbleMaxWidth);
            const boxHeight = fontSize + (verticalPadding * 2);

            const hasVisibleContent = displayedText.length > 0 && boxWidth > 0 && boxHeight > 0;
            const rect = groupSelection.select("rect");
            const text = groupSelection.select("text");

            if (!hasVisibleContent) {
                rect.style("display", "none");
                text.style("display", "none");
                return;
            }

            rect
                .style("display", "inline")
                .attr("x", -boxWidth / 2)
                .attr("y", -boxHeight / 2)
                .attr("width", boxWidth)
                .attr("height", boxHeight);

            text
                .style("display", "inline")
                .attr("x", 0)
                .attr("y", 1)
                .text(displayedText);
        };

        const refreshLabels = () => {
            labelGroup.each((nodeData, index, groups) => {
                const groupSelection = d3.select(groups[index]);
                const isExpanded = hoveredNodes.has(nodeData);
                updateSingleLabel(groupSelection, nodeData, isExpanded);
            });
        };

        const resolveOneStepTarget = (clickedNode) => {
            if (!clickedNode || clickedNode === focus) {
                return null;
            }

            const focusAncestors = new Set(focus.ancestors());
            const clickedAncestors = clickedNode.ancestors();
            const clickedContainsFocus = focusAncestors.has(clickedNode);
            const focusContainsClicked = clickedAncestors.includes(focus);

            if (focusContainsClicked) {
                return clickedAncestors.find((ancestor) => ancestor.parent === focus) || null;
            }

            if (clickedContainsFocus) {
                return focus.parent || null;
            }

            const commonAncestor = clickedAncestors.find((ancestor) => focusAncestors.has(ancestor));

            if (!commonAncestor) {
                return null;
            }

            if (commonAncestor === focus) {
                return clickedAncestors.find((ancestor) => ancestor.parent === focus) || null;
            }

            return focus.parent || null;
        };

        const updateBreadcrumb = (node) => {
            const path = node.ancestors()
                .reverse()
                .map((ancestor) => ancestor.data.name)
                .slice(1);

            this.breadcrumbLabel.text(path.join(" -> "));
        };

        updateBreadcrumb(focus);
        zoomTo([focus.x, focus.y, focus.r * 2]);
        renderLegend();

        function zoomTo(v) {
            const k = width / v[2];

            view = v;
            currentScale = k;

            labelGroup.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            refreshLabels();
            node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
            node.attr("r", d => d.r * k);
        }

        function zoom(event, d) {
            const focus0 = focus;

            focus = d;
            updateBreadcrumb(focus);

            const transition = svg.transition()
                .duration(event.altKey ? 7500 : 750)
                .tween("zoom", d => {
                    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                    return t => zoomTo(i(t));
                });

            labelGroup
                .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
                .transition(transition)
                .style("fill-opacity", d => d.parent === focus ? 1 : 0)
                .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
                .on("end", function (d) {
                    if (d.parent !== focus) {
                        this.style.display = "none";
                    }
                    refreshLabels();
                });
        }

        return undefined;
    }

    getTextWidth(labelText) {
        if (!labelText) {
            return 0;
        }

        return this.labelMeasureContext.measureText(labelText).width;
    }

    getTruncatedLabel(labelText, maxWidth) {
        if (!labelText || maxWidth <= 0) {
            return "";
        }

        const ellipsis = "...";
        const fullLabelWidth = this.getTextWidth(labelText);

        if (fullLabelWidth <= maxWidth) {
            return labelText;
        }

        const ellipsisWidth = this.getTextWidth(ellipsis);
        if (ellipsisWidth > maxWidth) {
            return "";
        }

        let low = 0;
        let high = labelText.length;

        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            const candidate = `${labelText.slice(0, mid)}${ellipsis}`;
            const candidateWidth = this.getTextWidth(candidate);

            if (candidateWidth <= maxWidth) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }

        return `${labelText.slice(0, low)}${ellipsis}`;
    }
}