#!/usr/bin/env node
// This program gathers statistics about the results of the Cook 2013 study
// of 12,000 climate science abstracts
import fs from 'fs';
import * as csv from './csv';

var subjects = {
    2:"Impacts",3:"Mitigation",4:"Methods",5:"Paleoclimate",
    8:"Not climate related", 9:"Not Peer-Reviewed", 10: "No Abstract"
};
// endorsement levels 1..7
var counts = { 1:{},2:{},3:{},4:{},5:{},6:{},7:{} };

console.log("Looking for 'ratings.csv' file...");
fs.readdirSync('.').forEach(fileName => {
    if (fileName.endsWith('ratings.csv')) {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                var table = /** @type {string[][]} */ (csv.parse(data));
                for (var row of table) {
                    if (row.length >= 6 && subjects.hasOwnProperty(row[4])) {
                        var level = row[5], subject = subjects[row[4]];
                        counts[level][subject] = (counts[level][subject] || 0) + 1;
                    }
                }
                console.log(counts);
                console.log("Results as JSON:");
                console.log(JSON.stringify(counts));
            }
        });
    }
});
