/////////////////////////////////////////////////////////////////////
//                                                                 //
// Purpose: Defines the helper functions used in the app           //
//                                                                 //
// What it contains:                                               //
//      - Language Translation functions                           //
//                                                                 //
/////////////////////////////////////////////////////////////////////


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