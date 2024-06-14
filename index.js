import _ from "lodash";
import { parse } from 'node-html-parser';
import { readFile, readFileSync, writeFileSync } from "fs";
import path, { join } from "path";
const statusSense = process.argv[2];
if (!statusSense) {
    throw new Error("Please pass status sense data as parameter like this: node index.js 7f2002200181000000000000010000200064")
}

if (!statusSense.toLowerCase().startsWith("7f20")) {
    throw new Error("Invalid status sense data");
}
const txt = statusSense.substring(4, statusSense.length -2);
const chunks = _.chunk(txt.split(""), 2);

function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

const binData = chunks.map(element => {
    return hex2bin(element.join(""));
});

const html = parse(readFileSync(join(process.cwd(), "Sheet1.html"), { encoding: "utf-8"}));
const elements = html.querySelectorAll("table tbody tr").slice(2);
binData.forEach((d, index) => {
    if (!elements[index]) {
        return;
    }
    d.split("").forEach((bin, idx) => {
        if (bin === "1") {
            elements[index].querySelectorAll("td").slice(1)[idx].setAttribute("style", "background-color: yellow")
        }
    })
});
const writepath = join(process.cwd(), "Sheet2.html");
writeFileSync(writepath, html.toString(), { encoding: "utf-8"})
console.log(writepath)