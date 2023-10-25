//@ts-nocheck

export function maskify(node, mask) {
    let currentMask = mask;
    let lastInputValue = node.value;
    const update = (updatedMask) => {
        currentMask = updatedMask;
        node.value = cleanAndFormat(node.value, mask);
    };
    const destroy = () => node.removeEventListener('input', inputHandler);
    function inputHandler() {
        const pressedBackspace = lastInputValue.length - node.value.length === 1;
        if (!pressedBackspace) {
            const input = node.value;
            node.value = cleanAndFormat(input, currentMask);
        }
        lastInputValue = node.value;
    }
    node.addEventListener('input', inputHandler);
    return { update, destroy };
}
function cleanAndFormat(input, mask) {
    const cleanInput = clean(input, mask);
    return format(cleanInput, mask);
}
/*
    Both the clean and format functions were taken from the alpinejs source code: https://github.com/alpinejs/alpine/blob/main/packages/mask/src/index.js\
    clean -> stripDown
    format -> buildUp
*/
function format(input, mask) {
    const clean = Array.from(input);
    let output = '';
    for (let i = 0; i < mask.length; i++) {
        if (!['9', 'a', '*'].includes(mask[i])) {
            output += mask[i];
            continue;
        }
        if (clean.length === 0)
            break;
        output += clean.shift();
    }
    return output;
}
const regexes = {
    '9': /[0-9]/,
    a: /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/
};
function clean(input, mask) {
    let inputToBeStripped = input;
    let output = '';
    let wildcardmask = '';
    // Strip away non wildcard mask characters.
    for (let i = 0; i < mask.length; i++) {
        if (['9', 'a', '*'].includes(mask[i])) {
            wildcardmask += mask[i];
            continue;
        }
        for (let j = 0; j < inputToBeStripped.length; j++) {
            if (inputToBeStripped[j] === mask[i]) {
                inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);
                break;
            }
        }
    }
    for (let i = 0; i < wildcardmask.length; i++) {
        let found = false;
        for (let j = 0; j < inputToBeStripped.length; j++) {
            const currentWildcardmask = wildcardmask[i];
            if (regexes[currentWildcardmask].test(inputToBeStripped[j])) {
                output += inputToBeStripped[j];
                inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);
                found = true;
                break;
            }
        }
        if (!found)
            break;
    }
    return output;
}
