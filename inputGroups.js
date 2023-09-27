function findFirstPropertyValuePair(arrayOfObjects, propertyName, desiredValue, strictEquality=true) {
    for (let i in arrayOfObjects) {
        const obj = arrayOfObjects[i];
        if (strictEquality) {
            if (obj[propertyName] === desiredValue) {
                return parseInt(i);
            }
        }
        else {
            if (obj[propertyName] == desiredValue) {
                return parseInt(i);
            }
        }

    }
    return false;
}

/**
 *
 * @param repeatedDataTuples an array of tuple objects. Each should contain the following properties.
 * <br>startInput: name of the form input to start grouping from
 * <br>endInput: (optional) name of the form input where grouping should stop. If not provided, goes till the end of the form.
 * <br>groupName: what to name the resulting property (which holds an array of grouped inputs)
 * <br>list order matters.
 * @returns {{}}
 */
$.fn.repeatedFormAsObject = function(repeatedDataTuples) {
    // First find the names that are duplicated
    let formData = this.serializeArray();
    let size = formData.length;
    let groups = {} // keys are repeated input, value is array of groups
    let repeatedInputSet = new Set();
    for (const tupleIndex in repeatedDataTuples) {
        const tuple = repeatedDataTuples[tupleIndex];
        const repeatedInput = tuple.startInput;
        const endingInput = tuple.endInput;
        const arrayName = tuple.groupName;
        groups[arrayName] = [];
        const startSearchIndex = findFirstPropertyValuePair(formData, "name", repeatedInput) || size+1;
        const endSearchIndex = (endingInput === undefined) ? size : findFirstPropertyValuePair(formData, "name", endingInput);
        for (let i = startSearchIndex; i < endSearchIndex; ++i) {
            const inputName = formData[i].name;
            const inputValue = formData[i].value;
            if (repeatedInput === inputName) {
                groups[arrayName].push({}); // start new input group
            }
            // Append to the last input group
            groups[arrayName].at(-1)[inputName] = inputValue;
            repeatedInputSet.add(inputName);
        }
    }

    let singletons = {};
    formData.forEach((formObject,i,a) => {
        const inputName = formObject["name"];
        if (!(repeatedInputSet.has(inputName))) {
            singletons[inputName] = formObject["value"];
        }
    });
    return {...singletons, ...groups};
};
