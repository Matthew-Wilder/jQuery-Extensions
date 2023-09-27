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
    return undefined;
}

function findLastPropertyValuePair(arrayOfObjects, propertyName, desiredValue, strictEquality=true) {
    const size = arrayOfObjects.length;
    for (let i = size - 1; i >= 0; --i) {
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
    return undefined;
}

function __get_value_or_default__(valueToTest, defaultValue) {
    if (valueToTest === undefined) {
        return defaultValue;
    } else {
        return valueToTest;
    }
}

/**
 *
 * @param repeatedDataTuples an array of tuple objects. Each should contain the following properties.
 * <br>start- String: [name] of the form input to start grouping from
 * <br>end - String: [name] of the form input where grouping should stop. If not provided, goes till the end of the form.
 * <br>resultingListName: what to name the resulting property (which holds an array of grouped inputs)
 * <br>list order matters.
 * @returns {{}}
 */
$.fn.repeatedFormAsObject = function(repeatedDataTuples) {
    // First find the names that are duplicated
    let formData = [];
    // Iterate through the form elements
    this.find('[name]').each(function () {
        const inputName = this.name;
        const inputValue = $(this).val();
        formData.push({name: inputName, value: inputValue});
    });

    let size = formData.length;
    let groups = {} // keys are repeated input, value is array of groups
    let repeatedInputSet = new Set();
    for (const tupleIndex in repeatedDataTuples) {
        const tuple = repeatedDataTuples[tupleIndex];
        const repeatedInput = tuple.start;
        const endingInput = tuple.end;
        const arrayName = tuple.resultingListName;
        groups[arrayName] = [];
        
        const startSearchIndex = __get_value_or_default__(findFirstPropertyValuePair(formData, "name", repeatedInput), (size+1));
        const endSearchIndex = __get_value_or_default__(findLastPropertyValuePair(formData, "name", endingInput), size);

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
