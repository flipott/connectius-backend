function handleString(string) {
    const stringArr = string.split("");
    const newStrArr = [];
    newStrArr.push(stringArr[0].toUpperCase());
    for (let i = 1; i < stringArr.length; i++) {
        if (stringArr[i-1] === "-") {
            newStrArr.push(stringArr[i].toUpperCase())
        } else {
            newStrArr.push(stringArr[i].toLowerCase())
        }
    }
    return newStrArr.join("");
}

module.exports = handleString;