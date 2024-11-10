import csv from "csv-parser"
import fs from 'fs'//


let results = []

fs.createReadStream('questions.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
});
