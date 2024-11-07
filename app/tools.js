/////////////////////////////////////////////////////////////////////
//                                                                 //
// Purpose: Defines the helper functions used in the app           //
//                                                                 //
// What it contains:                                               //
//      - Language Translation functions                           //
//                                                                 //
/////////////////////////////////////////////////////////////////////

import { DefaultDims, TextWrap } from "./constants.js";


// Translation: Helper class for doing translations
export class Translation {
    static register(resources){
        i18next.use(i18nextBrowserLanguageDetector).init({
            fallbackLng: "en",
            detection: {
                order: ['querystring', 'htmlTag', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
            },
            resources: resources
        })
        i18next.changeLanguage();
    }
    
    // Note:
    // For some food groups with special characters like "Fruits & Vegetables", we want the title to be displayed as "Fruits & Vegetables" instead of "Fruits &amp; Vegatables"
    //  After passing in the food group into the i18next library, the library encoded the food group to be "Fruits &amp; Vegatables"
    // So all the special characters got encoded to their corresponding HTML Entities (eg. &lt; , &gt; , &quot;)
    //
    // So we need to decode back the encoded string with HTML entities to turn back "Fruits &amp; Vegetables" to "Fruits & Vegetables"
    static translate(key, args){
        const result = i18next.t(key, args);

        if (typeof result !== 'string') return result;
        return he.decode(result);
    }

    // translateNum(numStr, decimalPlaces): Translate a number to its correct
    //  numeric represented string for different languages
    // eg. '1.2' -> '1,2' in French
    //
    // Note:
    //  See https://www.i18next.com/translation-function/formatting for more formatting
    static translateNum(numStr, decimalPlaces = 1) {
        let num = Number(numStr);
        if (Number.isNaN(num)) return numStr;

        let translateArgs = {num}
        if (decimalPlaces) {
            translateArgs["minimumFractionDigits"] = decimalPlaces;
            translateArgs["maximumFractionDigits"] = decimalPlaces;
        }

        return this.translate("Number", translateArgs);
    }
}


// SetTools: Class for handling with Sets
//     This class is mostly used to deal with compatibility issues with older browsers
//     since some of Javascript's Set functions are only recently implemented in 2023-2024
export class SetTools {

    // difference(sets, newCopy): Computes the set difference of set1 - set2
    // Note:
    //  If 'newCopy' is set to false, the result for the set difference is stored
    //      at the first set of 'sets'
    static difference(sets, newCopy = false) {
        if (sets.length < 1) return new Set();
        const result = newCopy ? new Set(sets[0]) : sets[0];

        for (let i = 1; i < sets.length; ++i) {
            const currentSet = sets[i];
            for (const element of currentSet) {
                result.delete(element);
            }
        }

        return result;
    }

    // intersection(set1, set2): Computes the set intersection of set1 ∩ set2
    static intersection(set1, set2) { 
        const result = new Set(); 
        for (let element of set2) { 
            if (set1.has(element)) { 
                result.add(element); 
            } 
        } 

        return result; 
    }

    // union(set1, set2, neweCopy): Computes the 
    static union(set1, set2, newCopy = false) {
        const result = newCopy ? new Set(set1) : set1;
        for (const element of set2) {
            result.add(element);
        }

        return result;
    }
}


// MapTools: Class for handling with Maps
export class MapTools {

    // toDict(map1): Converts a map to a dictionary
    static toDict(map1) {
        return Object.fromEntries(map1.entries());
    }
}


// TableTools: Class for handling any table-like data ex. list of lists/matrices, list of dictionaries
//    dictionaries of dictionaries, dictionaries of lists, etc...
export class TableTools {

    // _groupAggregates(ind, aggregates, getAggregateDataFunc, keyFuncs): Interal function for grouping
    //  aggregates into different sets
    static _groupAggregates(ind, aggregates, getAggregateDataFunc, keyFuncs) {
        const result = {};
        const foundKeys = new Set();

        for (const aggregateKey in aggregates) {
            const aggregate = aggregates[aggregateKey];
            const aggregateData = getAggregateDataFunc(aggregate);

            for (const row of aggregateData) {
                const key = keyFuncs[ind](row);
                if (result[key] === undefined) {
                    result[key] = {};
                    foundKeys.add(key);
                }

                result[key][aggregateKey] = aggregate;
            }
        }

        if (ind >= keyFuncs.length - 1) return result;
 
        for (const key of foundKeys) {
            result[key] = TableTools._groupAggregates(ind + 1, result[key], getAggregateDataFunc, keyFuncs);
        }

        return result;
    }

    // groupAggregates(aggregates, getAggregateDataFunc, keyFuncs): Groups out the aggregates
    //  into different sets (that may have intersections / that may be non-disjoint)
    static groupAggregates(aggregates, getAggregateDataFunc, keyFuncs) {
        return TableTools._groupAggregates(0, aggregates, getAggregateDataFunc, keyFuncs)
    }

    // _forGroup(grouping, groupingOrder, func): Internal function to iterates over a nested dictionary grouping
    static _forGroup(ind, grouping, groupingOrder, func, keys, values) {
        if (ind >= groupingOrder.length) {
            func(keys, values);
            return;
        }

        const groupName = groupingOrder[ind];
        for (const groupKey in grouping) {
            const groupVal = grouping[groupKey];
            keys[groupName] = groupKey;
            values[groupName] = groupVal;
            this._forGroup(ind + 1, groupVal, groupingOrder, func, keys, values);
        }
    }

    // forGroup(grouping, groupingOrder, func): Iterates over a nested dictionary grouping
    //  (saves you time from writing up many nested for loops)
    static forGroup(grouping, groupingOrder, func) {
        const keys = {};
        const values = {};
        this._forGroup(0, grouping, groupingOrder, func, keys, values);
    }
}


// Visuals: Class for handling
export class Visuals {
    // drawSingleLineText(text, TextY): Draws the text on a single line in the textbox
    static drawSingleLineText({textGroup = null, text = "", textX = DefaultDims.pos, textY = DefaultDims.pos, clear = true} = {}) {
        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }

            const textNode = textGroup.append("tspan")
                .attr("x", textX).attr("y", textY)
                .text(text);

        return textNode;
    }

    // getNextTextY(textY, numOfTextLines): Retrives the next y-position for the texts
    //  in a text box
    static getNextTextY(textY, numOfTextLines, fontSize, lineSpacing) {
        return textY +  (numOfTextLines + 1) * fontSize + numOfTextLines * lineSpacing
    }

    // drawWrappedText(text, numLines):
    //   Draws the text to be wrapped around the textbox by creating
    //      tspan elements to fit text into a given width
    static drawWrappedText({textGroup = null, text = "", width = DefaultDims.length, textX = DefaultDims.pos, textY = DefaultDims.pos, 
                            numLines = [0], fontSize = DefaultDims.fontSize, lineSpacing = DefaultDims.lineSpacing, clear = true} = {}) {
        const words = text.split(" ");
        const tspanXPos = textX;
        let currentTextY = textY;
        
        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }
        
        // draws the remainder of the text on a new line if the text exceeds the specified width
        words.reduce((arr, word) => {
            let textNode = arr[arr.length - 1];
            let line = textNode.text().split(" ");
            line.push(word);
            textNode.text(line.join(" "));
            if (textNode.node().getComputedTextLength() > width) {
                line.pop();
                console.log("ARR_L: ", arr.length);
                currentTextY = Visuals.getNextTextY(textY, arr.length, fontSize, lineSpacing);

                textNode.text(line.join(" "));
                textNode = textGroup.append("tspan")
                    .attr("x", tspanXPos)
                    .attr("y", currentTextY)
                    .text(word);
                arr.push(textNode);
                numLines[0]++;
                numLines.push(textNode.text().length)
            } else {
                textNode.text(line.join(" "));
                arr[arr.length - 1] = textNode;
            }
            return arr;
        }, [textGroup.append("tspan").attr("x", tspanXPos).attr("y", textY + fontSize)]);
        numLines[0]++; 
        numLines.push(words.pop().length);
    }

    // drawText(): Draws text on 'textGroup'
    // Note: 'text' is either a string or a list of strings
    static drawText({textGroup = null, text = "", textX = DefaultDims.pos, textY = DefaultDims.pos, width = DefaultDims.length, 
              fontSize = DefaultDims.fontSize, lineSpacing = DefaultDims.lineSpacing, textWrap = TextWrap.Wrap, paddingLeft = 0, paddingRight = 0} = {}) {

        const origTextY = textY;
        let textLines = text;
        let linesWritten = 0;
        let clear = true;
        let line = "";
        let numLines = 0;

        if (typeof textLines === 'string') {
            textLines = [textLines];
        }

        const textLinesLen = textLines.length;

        // draws many lines of wrapped text that are each seperated by a newline
        if (textWrap == TextWrap.Wrap) {
            numLines = [];

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];
                numLines = [];

                if (i > 0) {
                    clear = false;
                }

                Visuals.drawWrappedText({textGroup, text: line, width, textX, textY, numLines, fontSize, lineSpacing, clear});
                linesWritten += numLines.length;
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing);
            }

            textY -= fontSize;
            numLines = linesWritten - 1;

        // draws many lines of text on a single line with each text seperated by a newline
        } else if (textWrap == TextWrap.NoWrap) {
            textY += fontSize;
            numLines = 1;

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];

                if (i > 0) {
                    clear = false;
                }

                let textNode = Visuals.drawSingleLineText({textGroup, text: line, textX, textY, clear});
                width = Math.max(paddingLeft + textNode.node().getComputedTextLength() + paddingRight, width);

                linesWritten += 1;
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing);
            }
        }

        return {width, textBottomYPos: textY - lineSpacing - fontSize, numLines};
    }
}