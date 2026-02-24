import { BaseGraph } from "./baseGraph.js";

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
    }

    update() {
        super.update();
        // Specify the chart’s dimensions.
        let data = this.model.getGraphData();
        console.log(data);
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

        // Create the color scale.
        const color = d3.scaleLinear()
            .domain([0, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        // Compute the layout.
        const pack = data => d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value));
        const root = pack(data);

        // Create the SVG container.
        this.graph.selectAll("svg").remove();
        this.breadcrumbLabel.text("");
        const svg = this.graph.append("svg")
            .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto; display: block; margin: 0 -14px; background: #ffffff; cursor: pointer;");

        // Append the nodes.
        const node = svg.append("g")
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => d.children ? color(d.depth) : "white")
            .attr("stroke", "#000")
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
        const fullLabelForNode = (nodeData) => nodeData.children ? nodeData.data.name : `${nodeData.data.name} (${nodeData.value} samples)`;

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