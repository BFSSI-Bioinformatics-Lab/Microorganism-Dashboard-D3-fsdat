/////////////////////////////////////////////////////////////////////
//                                                                 //
// Purpose: Defines the helper functions used in the app           //
//                                                                 //
// What it contains:                                               //
//      - Language Translation functions                           //
//                                                                 //
/////////////////////////////////////////////////////////////////////

import { DefaultDims, TextWrap, ModelTimeZone } from "./constants.js";


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

        if (Object.prototype.toString.call(result) === '[object Array]') return result.map((line) => he.decode(line));
        else if (typeof result !== 'string') return result;
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

// Range: Class for a range of values
export class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    // has(target, compareFunc): Checks if 'target' is in between the range
    has(target, compareFunc = undefined) {
        if (compareFunc === undefined) {
            return target <= this.max && target >= this.min;
        } else {
            return !(compareFunc(target, this.min) < 0 || compareFunc(target, this.max) > 0);
        }
    }

    // within(range, compareFunc): Checks if this class is within 'range'
    within(range, compareFunc = undefined) {
        if (compareFunc === undefined) {
            return this.max >= range.min && this.min <= range.max;
        } else {
            return !(compareFunc(this.max, range.min) < 0 || compareFunc(this.min, range.max) > 0);
        }
    }
}


export class NumberTools {
    // toPercent(count, total): Retrieves the percentage from 'count'
    static toPercent(count, total, decimalPlaces = undefined) {
        let result = count / total * 100;
        if (decimalPlaces !== undefined) {
            result = NumberTools.round(result, decimalPlaces);
        }

        return result;
    }

    // round(num, decimalPlaces): Rounds a number to a certain number of decimal places
    static round(num, decimalPlaces = 2) {
        const factor = Math.pow(10, decimalPlaces);
        return Math.round(num * factor) / factor;
    }

    // randomInt(min, max): Generates a random integer from 'start' to 'end' (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}


// DateTimeTools: Class for handling with datetime
export class DateTimeTools {
    // getYearStart(year, timezone): Retrieves the datetime for the start of the year
    static getYearStart(year, timezone = ModelTimeZone) {
        return moment.tz(`${year}-01-01 00:00`, timezone);
    }

    // getYearEnd(year, timezone): Retrieves the datetime for the end of the year
    static getYearEnd(year, timezone = ModelTimeZone) {
        return moment.tz(`${year}-12-31 23:59`, timezone);
    }

    // getMonthStart(year, month, timezone): Retrieves the datetime for the start of a month
    static getMonthStart(year, month, timezone = ModelTimeZone) {
        if (month < 10) month = `0${month}`;
        return moment.tz(`${year}-${month}-01 00:00`, timezone);
    }

    // getToday(timezone): Retrieves the current datetime
    static getToday(timezone = ModelTimeZone) {
        return moment.tz(moment(), timezone);
    }

    // datetimeStrCmpFunc(datetimeStr1, datetimeStr2): Compare function for 2 datetimes that
    //   are represented using a string
    static datetimeStrCmpFunc(datetimeStr1, datetimeStr2) {
        const datetime1 = moment(datetimeStr1);
        const datetime2 = moment(datetimeStr2);
        return datetime1.diff(datetime2);
    }

    // rangeToStr(datetimeRange, newCopy): Converts a range of datetimes to a range of datetime strings
    static rangeToStr(datetimeRange, newCopy = false) {
        const result = newCopy ? new Range(datetimeRange.min, datetimeRange.max) : datetimeRange;
        if (result.min !== undefined) result.min = result.min.format();
        if (result.max !== undefined) result.max = result.max.format();
        return result;
    }

    // rangeToDate(datetimeStrRange, timesonze, newCopy): Converts a range of datetime strings to a range of datetimes
    static rangeToDate(datetimeStrRange, timezone = ModelTimeZone, newCopy = false) {
        const result = newCopy ? new Range(datetimeStrRange.min, datetimeStrRange.max) : datetimeStrRange;
        if (result.min !== undefined) result.min = moment.tz(result.min, timezone);
        if (result.max !== undefined) result.max = moment.tz(result.max, timezone);
        return result;
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

    // union(set1, set2, neweCopy): Computes the union of set1 U set2
    static union(set1, set2, newCopy = false) {
        const result = newCopy ? new Set(set1) : set1;
        for (const element of set2) {
            result.add(element);
        }

        return result;
    }

    // filter(set, predicate, newCopy): filters a set
    static filter(set, predicate, newCopy = false) {
        const result = newCopy ? new Set() : set;
        for (const element of set) {
            const inFilter = predicate(element);
            if (newCopy && inFilter) {
                result.add(element);
            } else if (!newCopy && !inFilter) {
                result.delete(element);
            }
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

    // createCSVContent(matrix): Creates the string needed for exporting to CSV
    static createCSVContent(matrix) {
        let result = "";
        for (const row of matrix) {
            const colLen = row.length;
            const csvRow = [];

            // clean up the text for each cell
            for (let i = 0; i < colLen; ++i) {
                let cleanedText = `${row[i]}`.replace(/"/g, "'").replace('"', "'");
                cleanedText = `"${cleanedText}"`;
                csvRow.push(cleanedText);
            }

            result += csvRow.join(",") + "\r\n";
        }

        return result;
    }


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

    // _forGroup(ind, grouping, groupingOrder, func, keys, values): Internal function that iterates over a nested dictionary grouping
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

    // _forFilteredGroup(ind, grouping, groupingOrder, inputs, func, keys, values): Internal function that iterates over a
    //  a filtered nested dictionary grouping
    static _forFilteredGroup(ind, grouping, groupingOrder, inputs, func, keys, values) {
        if (ind >= groupingOrder.length) {
            func(keys, values);
            return;
        }

        const groupName = groupingOrder[ind];
        const currentInputs = inputs[groupName];
        if (currentInputs === undefined) return;

        for (const input of currentInputs) {
            const groupVal = grouping[input];
            if (groupVal === undefined) continue;

            keys[groupName] = input;
            values[groupName] = groupVal;
            this._forFilteredGroup(ind + 1, groupVal, groupingOrder, inputs, func, keys, values);
        }
    }

    // forFilteredGroup(grouping, groupiongOrder, inputs, func): Iterates over a filtered subtree
    //  from a nested dictionary grouping based off 'inputs'
    //  (saves you time from writing up many nested for loops)
    static forFilteredGroup(grouping, groupingOrder, inputs, func) {
        const keys = {};
        const values = {};
        this._forFilteredGroup(0, grouping, groupingOrder, inputs, func, keys, values);
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

    // saveAsImage(): Saves some graph as an image
    static async saveAsImage({svg, title="", backgroundColor = "white", preProcessor = undefined, postProcessor = undefined} = {}) {
        // use await so that the below operations can happen in the order they are listed
        //  to simulate a mutex.
        // 
        // We do not want the operations to run at the same time or have the compiler reorder the lines for optimization.
        //  (or else you may have a picture of a graph without the source text)
        // https://blog.mayflower.de/6369-javascript-mutex-synchronizing-async-operations.html

        if (preProcessor !== undefined) {
            await preProcessor();
        }

        await saveSvgAsPng(svg, `${title}.png`, {backgroundColor});

        if (postProcessor !== undefined) {
            await postProcessor();
        }
    }

    // downloadCSV(csvConvent): Exports some table as a CSV file
    // Note: For large CSV files, their string content are so big, that they take up
    //  all of the browser's memory and end up not downloading the file.
    //  We want to slowly stream the data download using 'URL.CreateObjectURL'.
    //  https://stackoverflow.com/questions/30167326/unable-to-download-large-data-using-javascript
    //
    // WARNING: Remember to FREE UP the memory of the newly created URL object by calling 'URL.revokeObjectURL'
    //  https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static
    static downloadCSV({csvContent, fileName = ""} = {}) {
        const universalBOM = "\uFEFF";

        // creates a temporary link for exporting the table
        const link = document.createElement('a');
        var urlObjId = URL.createObjectURL( new Blob( [universalBOM + csvContent], {type:'text/csv;charset=utf-8'} ) );
        link.setAttribute('href', urlObjId);
        link.setAttribute('download', `${fileName}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return urlObjId;
    }
}