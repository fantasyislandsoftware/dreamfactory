import { process } from "../node";
import fs from "fs";

const iPath = process.argv.length > 2 ? process.argv[2] : null;
const oPath = process.argv.length > 3 ? process.argv[3] : null;

if (!iPath || !oPath) {
  console.log("Usage: lnbas <input file> <output file>");
  process.exit();
}

const code = fs.readFileSync(iPath, "utf8").split("\n");
let numberedCode: string[] = [];
let lineNumber = 1;
code.forEach((line) => {
  if (line !== "") {
    numberedCode.push(`${lineNumber} ${line}`);
    lineNumber++;
  }
});

let labels: { lineNumber: string; label: string }[] = [];
numberedCode.forEach((line) => {
  const lineArray = line.split(" ");
  if (lineArray[1] === "LABEL") {
    labels.push({ lineNumber: lineArray[0], label: lineArray[2] });
  }
});

let result: any = [];
numberedCode.forEach((line, index) => {
  const lineArray = line.split(" ");
  if (lineArray[1] === "LABEL") {
    lineArray[1] = "REM";
  } else {
    lineArray.forEach((word, index) => {
      labels.forEach((label) => {
        if (word === label.label) {
          lineArray[index] = label.lineNumber;
        }
      });
    });
  }
  result.push(lineArray.join(" "));
});

fs.writeFileSync(oPath, result.join("\n"));
console.log(`\nSuccessfully compiled ${iPath} to ${oPath}`);
