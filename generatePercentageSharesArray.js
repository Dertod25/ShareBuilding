'use strict';
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const existsFile = util.promisify(fs.exists);
const file = 'sharesArray.json';

const message = {
    0: "Congratulations, the file was generated successfully.",
    1: "There is no incoming array, generate it using the 'npm run generate' command.",
    2: "The incoming array is large, the generation time exceeds 6s"

};

const time = {
    startGenerate: '',
    endGenerate: '',
    startWrite: '',
    endWrite: ''


};


const getInputArray = async () => JSON.parse(await readFile(file, 'utf8'));

const generatePercentageSharesArray = async () => {
    const isExist = await existsFile(file);
    let resultArray = [];
    if (isExist) {
        time.startGenerate = new Date().getTime();
        const incomingArray = await getInputArray();
        console.log(incomingArray.length);
        if (incomingArray.length > 5000000)return {key: 2};
        const totalSum = incomingArray.reduce((a, b, c) => +a + (+b));
        resultArray = incomingArray.map((a) => (a / totalSum * 100).toFixed(3));
        time.endGenerate = new Date().getTime();
    } else {
        return {key: 1}
    }


    return {key: 0, resultArray};
};

generatePercentageSharesArray().then(async ({key, resultArray}) => {
    console.log(message[key]);
    if (key === 0) {
        console.log(`Generation time => ${time.endGenerate - time.startGenerate}ms
        Writing file...
        `);
        time.startWrite = new Date().getTime();
        await writeFile(`percentageSharesArray.json`, JSON.stringify(resultArray), 'utf8');
        time.endWrite = new Date().getTime();
        console.log(`Successfully recorded.
    Recording time => ${time.endWrite - time.startWrite}ms
    Total time => ${time.endWrite - time.startGenerate}ms
`)

    }

}).then(() => {

});

