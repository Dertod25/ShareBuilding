const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const defaultParams = {
    min: 0,
    max: 100,
    arrayLength: 10000
};

const question = (text, param) => {
    return new Promise((resolve, reject) => {
        readline.question(text, (answer) => {
            let num = +answer;
            let isNumber = !isNaN(num) && num >= 0;
            if (isNumber) {
                if ((param === 'max' && num > defaultParams.min) || (param === 'arrayLength' && num > 10) || param === 'min') {
                    defaultParams[param] = num;
                }
            }
            resolve()
        })
    })
};
const generateRandomSharesArray = async () => {

    await question('Enter the minimum value in array ', 'min');
    await question('Enter the maximum value in array ', 'max');
    await question('Set array length ', 'arrayLength');
    readline.close();
    const start = new Date().getTime();
    const arr = new Array(defaultParams.arrayLength);
    arr.fill(1);
    const isInteger = () => Math.floor(Math.random() * 2);
    const getIntegerRandom = (min, max, inclusive = true) => Math.floor(Math.random() * (max - min + (inclusive ? 1 : 0))) + min;
    const getFraction = (float) => getIntegerRandom(1, Math.pow(10, (float)), false) / Math.pow(10, (float));

    const getRandomInRange = () => {
        let integerRandom = getIntegerRandom(defaultParams.min, defaultParams.max);
        let float = isInteger();
        if (integerRandom === 0 || isInteger()) {
            return +(integerRandom + getFraction(float + 1)).toFixed(float+1)
        } else {
            return integerRandom
        }
    };
    writeFile(`sharesArray.json`, JSON.stringify(arr.map((a) => getRandomInRange())), 'utf8');
    const end = new Date().getTime();
    return (end - start)
};

generateRandomSharesArray().then((time) => console.log(`
Congratulations, the array was successfully generated with the following parameters:
minimum value => ${defaultParams.min},
maximum value => ${defaultParams.max},
array length => ${defaultParams.arrayLength},
Generation time => ${time}ms`));