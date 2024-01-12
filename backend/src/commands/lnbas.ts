import { readFileSync, writeFileSync } from "../node";
import { dreamPath } from "../env";

const lnbas = (projectFolder: string, args: string) => {
  let message = "";
  const argArray = args.split(" ");
  const iPath =
    argArray.length > 0 ? `${dreamPath}/${projectFolder}/${argArray[0]}` : null;
  const oPath =
    argArray.length > 1 ? `${dreamPath}/${projectFolder}/${argArray[1]}` : null;

  if (!iPath || !oPath) {
    message = "Usage: lnbas <input file> <output file>";
    return { message: message, status: "error" };
  }

  message = iPath;

  const code = readFileSync(iPath, "utf8").split("\n");
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

  writeFileSync(oPath, result.join("\n"));

  message = "Line conversion successful!";

  return { message: `\n${message}`, status: "success" };
};

export default lnbas;
